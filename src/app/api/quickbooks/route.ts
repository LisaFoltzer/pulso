import { NextRequest, NextResponse } from "next/server";
import { calculateLoadedHourlyCost, type AccountingSnapshot, type EmployeeCost, type InvoiceData } from "@/lib/accounting-connector";

// Fetch accounting data from QuickBooks Online API

export async function GET(request: NextRequest) {
  const token = request.cookies.get("quickbooks_access_token")?.value;
  const realmId = request.cookies.get("quickbooks_realm_id")?.value;

  if (!token || !realmId) {
    return NextResponse.json({ error: "Not authenticated with QuickBooks" }, { status: 401 });
  }

  try {
    const baseUrl = `https://quickbooks.api.intuit.com/v3/company/${realmId}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };

    // 1. Fetch employees
    const empRes = await fetch(`${baseUrl}/query?query=SELECT * FROM Employee WHERE Active = true&minorversion=65`, { headers });
    const empData = await empRes.json();

    const employees: EmployeeCost[] = (empData.QueryResponse?.Employee || []).map((emp: Record<string, unknown>) => {
      const name = emp.DisplayName || `${emp.GivenName || ""} ${emp.FamilyName || ""}`;
      // QuickBooks doesn't directly expose salary — use BillRate if available
      const hourlyRate = Number(emp.BillRate || 0);
      const estimatedAnnual = hourlyRate > 0 ? hourlyRate * 1607 : 42000; // fallback to French median

      return {
        role: String(name),
        department: String((emp.Department as Record<string, string>)?.Name || "General"),
        annualSalary: estimatedAnnual,
        loadedHourlyCost: hourlyRate > 0 ? hourlyRate * 1.6 : calculateLoadedHourlyCost(estimatedAnnual),
        source: "quickbooks" as const,
      };
    });

    // 2. Fetch recent bills/invoices
    const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const billsRes = await fetch(
      `${baseUrl}/query?query=SELECT * FROM Bill WHERE TxnDate >= '${threeMonthsAgo}' ORDERBY TxnDate DESC MAXRESULTS 100&minorversion=65`,
      { headers }
    );
    const billsData = await billsRes.json();

    const recentInvoices: InvoiceData[] = (billsData.QueryResponse?.Bill || []).map((bill: Record<string, unknown>) => ({
      id: String(bill.Id),
      vendor: String((bill.VendorRef as Record<string, string>)?.name || "Unknown"),
      amount: Number(bill.TotalAmt || 0),
      date: String(bill.TxnDate || ""),
      category: String((bill.Line as Record<string, unknown>[])?.[0]?.Description || "Uncategorized"),
    }));

    // 3. Get P&L for current month
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString().split("T")[0];
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString().split("T")[0];

    let monthlyRevenue = 0;
    let monthlyExpenses = 0;

    try {
      const plRes = await fetch(
        `${baseUrl}/reports/ProfitAndLoss?start_date=${startOfMonth}&end_date=${endOfMonth}&minorversion=65`,
        { headers }
      );
      const plData = await plRes.json();
      const rows = plData.Rows?.Row || [];
      for (const row of rows) {
        if (row.Summary?.ColData?.[0]?.value === "Total Income") {
          monthlyRevenue = Number(row.Summary.ColData[1]?.value || 0);
        }
        if (row.Summary?.ColData?.[0]?.value === "Total Expenses") {
          monthlyExpenses = Number(row.Summary.ColData[1]?.value || 0);
        }
      }
    } catch {
      // P&L might fail on some QBO plans
    }

    const payrollTotal = employees.reduce((s, e) => s + e.annualSalary, 0) / 12;

    const snapshot: AccountingSnapshot = {
      provider: "quickbooks",
      fetchedAt: new Date().toISOString(),
      employees,
      monthlyRevenue,
      monthlyExpenses,
      recentInvoices,
      payrollTotal,
    };

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("QuickBooks API error:", error);
    return NextResponse.json({ error: "Failed to fetch QuickBooks data" }, { status: 500 });
  }
}
