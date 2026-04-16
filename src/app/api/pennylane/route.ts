import { NextRequest, NextResponse } from "next/server";
import { calculateLoadedHourlyCost, type AccountingSnapshot, type EmployeeCost, type InvoiceData } from "@/lib/accounting-connector";

// Fetch accounting data from Pennylane API
// Pennylane API docs: https://pennylane.readme.io/reference

export async function GET(request: NextRequest) {
  const token = request.cookies.get("pennylane_access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated with Pennylane" }, { status: 401 });
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };

    // 1. Fetch employees/payroll
    const employeesRes = await fetch("https://app.pennylane.com/api/external/v1/employees", { headers });
    const employeesData = await employeesRes.json();

    const employees: EmployeeCost[] = (employeesData.employees || []).map((emp: Record<string, unknown>) => {
      const salary = Number(emp.annual_gross_salary || emp.gross_salary || 0);
      return {
        role: String(emp.job_title || emp.position || "Unknown"),
        department: String(emp.department || "General"),
        annualSalary: salary,
        loadedHourlyCost: calculateLoadedHourlyCost(salary),
        source: "pennylane" as const,
      };
    });

    // 2. Fetch recent invoices (last 3 months)
    const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const invoicesRes = await fetch(
      `https://app.pennylane.com/api/external/v1/supplier_invoices?filter[date][gte]=${threeMonthsAgo}&per_page=100`,
      { headers }
    );
    const invoicesData = await invoicesRes.json();

    const recentInvoices: InvoiceData[] = (invoicesData.invoices || []).map((inv: Record<string, unknown>) => ({
      id: String(inv.id),
      vendor: String(inv.supplier_name || inv.third_party_name || "Unknown"),
      amount: Number(inv.total_amount || inv.amount || 0),
      date: String(inv.date || ""),
      category: String(inv.category || inv.accounting_plan_item || "Uncategorized"),
    }));

    // 3. Get monthly revenue and expenses summary
    const currentMonth = new Date().toISOString().slice(0, 7); // "2026-04"
    let monthlyRevenue = 0;
    let monthlyExpenses = 0;

    try {
      const summaryRes = await fetch(
        `https://app.pennylane.com/api/external/v1/accounting/profit_and_loss?period=${currentMonth}`,
        { headers }
      );
      const summaryData = await summaryRes.json();
      monthlyRevenue = Number(summaryData.revenue || summaryData.total_revenue || 0);
      monthlyExpenses = Number(summaryData.expenses || summaryData.total_expenses || 0);
    } catch {
      // P&L endpoint might not be available on all plans
    }

    // 4. Calculate payroll total
    const payrollTotal = employees.reduce((s, e) => s + e.annualSalary, 0) / 12;

    const snapshot: AccountingSnapshot = {
      provider: "pennylane",
      fetchedAt: new Date().toISOString(),
      employees,
      monthlyRevenue,
      monthlyExpenses,
      recentInvoices,
      payrollTotal,
    };

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("Pennylane API error:", error);
    return NextResponse.json({ error: "Failed to fetch Pennylane data" }, { status: 500 });
  }
}
