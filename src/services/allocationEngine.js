/**
 * Personnel Allocation & Redeployment Engine - PRD Section 7
 * Greedy Nearest-Highest-Risk Matching Algorithm
 */

// Calculate Haversine distance in KM
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

export function runAIAllocation(junctionsWithRisk, officers, manualOverrides = {}) {
  // Sort junctions by risk score descending
  const sortedJunctions = [...junctionsWithRisk].sort((a, b) => b.risk.score - a.risk.score);
  const availableOfficers = [...officers];
  
  const assignments = [];
  const assignedOfficerIds = new Set();
  const assignedJunctionIds = new Set();

  // 1. Handle manual overrides first
  Object.keys(manualOverrides).forEach((jId) => {
    const override = manualOverrides[jId];
    const junction = sortedJunctions.find((j) => j.id === jId);
    const officer = availableOfficers.find((o) => o.id === override.officerId);
    if (junction && officer && !assignedOfficerIds.has(officer.id)) {
      const distance = calculateDistanceKm(officer.lat, officer.lng, junction.lat, junction.lng);
      assignments.push({
        junctionId: junction.id,
        junctionName: junction.name,
        riskScore: junction.risk.score,
        riskLevel: junction.risk.level,
        officerId: officer.id,
        officerName: officer.name,
        officerBadge: officer.badgeNumber,
        distanceKm: distance,
        isOverride: true,
        overrideReason: override.reason
      });
      assignedOfficerIds.add(officer.id);
      assignedJunctionIds.add(junction.id);
    }
  });

  // 2. Greedy matching for remaining junctions in priority order
  sortedJunctions.forEach((junction) => {
    if (assignedJunctionIds.has(junction.id)) return;

    // Find nearest unassigned officer
    let nearestOfficer = null;
    let minDistance = Infinity;

    availableOfficers.forEach((officer) => {
      if (assignedOfficerIds.has(officer.id)) return;
      const dist = calculateDistanceKm(officer.lat, officer.lng, junction.lat, junction.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearestOfficer = officer;
      }
    });

    if (nearestOfficer) {
      assignments.push({
        junctionId: junction.id,
        junctionName: junction.name,
        riskScore: junction.risk.score,
        riskLevel: junction.risk.level,
        officerId: nearestOfficer.id,
        officerName: nearestOfficer.name,
        officerBadge: nearestOfficer.badgeNumber,
        distanceKm: minDistance,
        isOverride: false
      });
      assignedOfficerIds.add(nearestOfficer.id);
      assignedJunctionIds.add(junction.id);
    }
  });

  // Identify unmanned high risk hotspots
  const unmannedHighRiskHotspots = sortedJunctions.filter(
    (j) => j.risk.level === "HIGH" && !assignedJunctionIds.has(j.id)
  );

  return {
    assignments,
    assignedOfficerIds: Array.from(assignedOfficerIds),
    assignedJunctionIds: Array.from(assignedJunctionIds),
    unmannedHighRiskHotspots
  };
}

/**
 * Baseline comparison metric engine (PRD Section 9)
 */
export function calculateBaselineVsAIMetrics(junctionsWithRisk, aiAssignments, officers) {
  const highRiskJunctions = junctionsWithRisk.filter((j) => j.risk.level === "HIGH");
  const totalHighRisk = Math.max(1, highRiskJunctions.length);

  // Baseline allocation stats (fixed baseline assignment from seed data)
  let baselineCoveredCount = 0;
  let baselineTotalDist = 0;
  let baselineAssignedCount = 0;

  junctionsWithRisk.forEach((j) => {
    if (j.baselineOfficerAssigned && j.baselineOfficerId) {
      const officer = officers.find((o) => o.id === j.baselineOfficerId);
      if (officer) {
        const dist = calculateDistanceKm(officer.lat, officer.lng, j.lat, j.lng);
        baselineTotalDist += dist;
        baselineAssignedCount++;
        if (j.risk.level === "HIGH") {
          baselineCoveredCount++;
        }
      }
    }
  });

  const baselineCoveragePct = Math.round((baselineCoveredCount / totalHighRisk) * 100);
  const baselineAvgDist = baselineAssignedCount > 0 ? parseFloat((baselineTotalDist / baselineAssignedCount).toFixed(1)) : 4.2;

  // AI allocation stats
  let aiCoveredCount = 0;
  let aiTotalDist = 0;

  aiAssignments.assignments.forEach((assignment) => {
    aiTotalDist += assignment.distanceKm;
    if (assignment.riskLevel === "HIGH") {
      aiCoveredCount++;
    }
  });

  const aiCoveragePct = Math.round((aiCoveredCount / totalHighRisk) * 100);
  const aiAvgDist = aiAssignments.assignments.length > 0 
    ? parseFloat((aiTotalDist / aiAssignments.assignments.length).toFixed(1)) 
    : 1.2;

  const baselineUnmannedHighRisk = totalHighRisk - baselineCoveredCount;
  const aiUnmannedHighRisk = totalHighRisk - aiCoveredCount;
  const hotspotsPrevented = Math.max(0, baselineUnmannedHighRisk - aiUnmannedHighRisk);

  return {
    totalHighRisk,
    baseline: {
      coveragePct: Math.min(100, baselineCoveragePct),
      avgDistanceKm: baselineAvgDist,
      unmannedHotspots: baselineUnmannedHighRisk
    },
    ai: {
      coveragePct: Math.min(100, aiCoveragePct),
      avgDistanceKm: aiAvgDist,
      unmannedHotspots: aiUnmannedHighRisk
    },
    improvement: {
      coverageBoost: Math.min(100, aiCoveragePct) - Math.min(100, baselineCoveragePct),
      distanceSavedKm: parseFloat((baselineAvgDist - aiAvgDist).toFixed(1)),
      hotspotsPrevented
    }
  };
}
