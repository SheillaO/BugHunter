export function createSlackAlert(bug) {
  const severityStr = bug.severity ? bug.severity.toUpperCase() : "LOW";
  const locationStr = bug.location || "Unknown Environment";
  const titleStr = bug.title || "Untitled Report";

  console.log(`🚨 ALERT: ${severityStr} bug reported in ${locationStr}`);
  console.log(`📋 Title: ${titleStr}`);
  console.log(`👤 Assigned to: ${bug.assignedTo || "Unassigned"}`);
}
