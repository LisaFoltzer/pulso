// Input sanitization — prevents XSS and injection

// Strip HTML tags
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

// Sanitize user input for display
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Validate email format
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Sanitize for database queries (prevent SQL injection via Supabase)
// Supabase uses parameterized queries so this is mostly defense-in-depth
export function sanitizeForDb(input: string): string {
  return input
    .replace(/[;\-\-]/g, "")
    .replace(/['"]/g, "")
    .slice(0, 1000); // max length
}

// Validate and sanitize connection ID
export function sanitizeConnectionId(id: string): string {
  return id.replace(/[^a-zA-Z0-9\-_]/g, "").slice(0, 100);
}
