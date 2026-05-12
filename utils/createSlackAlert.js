// Define a listener function
export function createSlackAlert(bug) {
  console.log(`🚨 ALERT: ${bug.severity.toUpperCase()} bug reported in ${bug.location}`)
  console.log(`📋 Title: ${bug.title}`)
  console.log(`👤 Assigned to: ${bug.assignedTo || 'Unassigned'}`)
  
}