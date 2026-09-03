import { FacilitySelect } from '@/db/schema';

export interface CareRouteRequest {
  patientUrgency: 'EMERGENCY_108' | 'URGENT_24H' | 'ROUTINE';
  requiredSpecialty?: string;
  requiredDiagnostics?: string[];
  requiredBlood?: string;
  requiresBed?: boolean;
}

export interface CareRouteRecommendation {
  facilityId: string;
  facilityName: string;
  distanceKm: number;
  score: number;
  reasons: string[];
  estimatedWaitMins: number;
  suitability: 'RECOMMENDED' | 'SECONDARY_OPTION' | 'NOT_SUITABLE';
}

// Mock Engine implementation for the prototype
export function evaluateCareRoute(
  request: CareRouteRequest,
  facilities: FacilitySelect[],
  facilityResources: any[], // Type would map to facilityResources
  facilityReadiness: any[] // Type would map to facilityReadiness
): CareRouteRecommendation[] {
  
  const recommendations: CareRouteRecommendation[] = facilities.map(facility => {
    let score = 100;
    const reasons: string[] = [];
    let suitability: 'RECOMMENDED' | 'SECONDARY_OPTION' | 'NOT_SUITABLE' = 'RECOMMENDED';
    let estimatedWaitMins = 0;

    const resource = facilityResources.find(r => r.facilityId === facility.id);
    const readiness = facilityReadiness.find(r => r.facilityId === facility.id);

    if (!resource || !readiness) {
      return {
        facilityId: facility.id,
        facilityName: facility.name,
        distanceKm: facility.distanceKm || 0,
        score: 0,
        reasons: ['No readiness data available.'],
        estimatedWaitMins: 0,
        suitability: 'NOT_SUITABLE'
      };
    }

    estimatedWaitMins = readiness.predictedWaitMins || 0;

    // Specialty check
    if (request.requiredSpecialty) {
      if (resource.specialists?.includes(request.requiredSpecialty)) {
        reasons.push(`✓ ${request.requiredSpecialty} available`);
        score += 20;
      } else {
        reasons.push(`✕ ${request.requiredSpecialty} unavailable`);
        suitability = 'NOT_SUITABLE';
        score -= 50;
      }
    }

    // Bed check
    if (request.requiresBed) {
      const bedsAvailable = (resource.totalBeds || 0) - (resource.occupiedBeds || 0);
      if (bedsAvailable > 0) {
        reasons.push(`✓ Bed available`);
        score += 10;
      } else {
        reasons.push(`✕ No beds available`);
        suitability = 'NOT_SUITABLE';
        score -= 50;
      }
    }

    // Diagnostics check
    if (request.requiredDiagnostics && request.requiredDiagnostics.length > 0) {
      for (const diag of request.requiredDiagnostics) {
        const diagStatus = resource.diagnostics?.[diag];
        if (diagStatus === 'AVAILABLE') {
          reasons.push(`✓ ${diag} operational`);
          score += 10;
        } else {
          reasons.push(`✕ ${diag} unavailable`);
          suitability = 'NOT_SUITABLE';
          score -= 40;
        }
      }
    }

    // Penalty for distance
    if (facility.distanceKm) {
      const travelMins = facility.distanceKm * 2; // Assuming ~30km/h average speed in rural area -> 2 mins per km
      reasons.push(`✓ ${travelMins} min travel (${facility.distanceKm} km)`);
      score -= (facility.distanceKm * 0.5); 
    }

    // Penalty for Wait time
    if (estimatedWaitMins > 60) {
      score -= 20;
    } else if (estimatedWaitMins > 0) {
      reasons.push(`✓ ${estimatedWaitMins} min expected wait`);
    }

    // Adjust suitability based on final score
    if (suitability !== 'NOT_SUITABLE') {
      if (score < 50) {
        suitability = 'SECONDARY_OPTION';
      } else {
        suitability = 'RECOMMENDED';
      }
    }

    return {
      facilityId: facility.id,
      facilityName: facility.name,
      distanceKm: facility.distanceKm || 0,
      score,
      reasons,
      estimatedWaitMins,
      suitability
    };
  });

  return recommendations.sort((a, b) => b.score - a.score);
}
