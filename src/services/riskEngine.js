/**
 * Risk Scoring Model - PRD Section 6
 * Formula: Risk Score (0–100) =
 *   (0.35 × Complaint Density Score) +
 *   (0.30 × Historical Accident Score) +
 *   (0.20 × Time-of-Day Risk Multiplier) +
 *   (0.15 × Road Attribute Score)
 */

export function calculateRiskScore(junction, activeComplaints = [], simulatedIncidentId = null) {
  // 1. Complaint Density (0-100)
  const junctionComplaints = activeComplaints.filter(
    (c) => c.junctionId === junction.id && c.status !== "RESOLVED"
  );
  // Base complaint score plus count multiplier
  const baseComplaintScore = junction.complaintDensityScore || 50;
  const complaintCountBonus = Math.min(junctionComplaints.length * 12, 40);
  const complaintDensity = Math.min(100, baseComplaintScore + complaintCountBonus);

  // 2. Historical Accidents (0-100)
  const historicalAccidents = junction.historicalAccidentsScore || 50;

  // 3. Time of Day Risk Multiplier (0-100)
  // Peak rush hours: 08:30-10:30 (Morning peak) & 17:30-21:00 (Evening peak)
  const currentHour = new Date().getHours();
  let timeOfDayFactor = junction.timeOfDayScore || 60;
  if ((currentHour >= 8 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 21)) {
    timeOfDayFactor = Math.min(100, timeOfDayFactor * 1.15);
  }

  // 4. Road Attribute Score (0-100)
  const roadAttributes = junction.roadAttributeScore || 50;

  // Weighted sum
  let rawScore = (
    0.35 * complaintDensity +
    0.30 * historicalAccidents +
    0.20 * timeOfDayFactor +
    0.15 * roadAttributes
  );

  // Boost if simulated incident at this location
  let isSimulatedIncident = false;
  if (simulatedIncidentId === junction.id) {
    rawScore = Math.max(96, rawScore + 35);
    isSimulatedIncident = true;
  }

  const finalScore = Math.min(100, Math.round(rawScore));

  // Determine risk level category
  let level = "LOW";
  let color = "#10B981"; // Emerald green
  if (finalScore >= 70) {
    level = "HIGH";
    color = "#EF4444"; // Red
  } else if (finalScore >= 45) {
    level = "MEDIUM";
    color = "#F59E0B"; // Amber
  }

  // Explainability breakdown (percentages / contribution points)
  const breakdown = [
    {
      factor: "Citizen Complaint Density",
      weightPercent: 35,
      score: Math.round(complaintDensity),
      contribution: (0.35 * complaintDensity).toFixed(1),
      description: `${junctionComplaints.length} active reported complaints in this area.`
    },
    {
      factor: "Historical Accident History",
      weightPercent: 30,
      score: Math.round(historicalAccidents),
      contribution: (0.30 * historicalAccidents).toFixed(1),
      description: `Official police accident record rating (${historicalAccidents}/100).`
    },
    {
      factor: "Time-of-Day Traffic Surge",
      weightPercent: 20,
      score: Math.round(timeOfDayFactor),
      contribution: (0.20 * timeOfDayFactor).toFixed(1),
      description: `Current hour peak traffic flow multiplier.`
    },
    {
      factor: "Road Geometry & Vulnerability",
      weightPercent: 15,
      score: Math.round(roadAttributes),
      contribution: (0.15 * roadAttributes).toFixed(1),
      description: junction.roadAttributesText || "Intersection design and pedestrian vulnerability factor."
    }
  ];

  // Plain-language summary for explainability modal (C5 requirement)
  let summary = "";
  if (isSimulatedIncident) {
    summary = `CRITICAL ALERT: Emergency high-severity incident reported live at ${junction.name}. Risk score elevated to ${finalScore}/100. Immediate officer deployment required.`;
  } else if (finalScore >= 70) {
    summary = `High Risk (${finalScore}/100) primarily driven by heavy complaint density (${Math.round(complaintDensity)}/100) and historical accident frequency (${Math.round(historicalAccidents)}/100) at ${junction.name}.`;
  } else if (finalScore >= 45) {
    summary = `Moderate Risk (${finalScore}/100) monitored due to steady evening traffic flow and commercial activity near ${junction.name}.`;
  } else {
    summary = `Normal Risk (${finalScore}/100) with smooth traffic flow and no critical bottlenecks detected at ${junction.name}.`;
  }

  return {
    score: finalScore,
    level,
    color,
    isSimulatedIncident,
    breakdown,
    summary,
    activeComplaintCount: junctionComplaints.length
  };
}
