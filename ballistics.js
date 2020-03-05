import conversions from 'pg-conversions';
import drag from 'pg-drag';

const ballistics = {
    getRangeData: (weather, target, firearm, round) => {
        const rangeData = [];
        if(weather && target && firearm && round) {
            // Loop through from Range = 0 to the maximum range and display the ballistics table at each chart stepping range.
            const currentBallisticCoefficient = drag.modifiedBallisticCoefficient(round.bulletBC, weather.altitudeFeet, weather.temperatureDegreesFahrenheit, weather.barometricPressureInchesHg, weather.relativeHumidityPercent);
            const zeroRangeYards = firearm.zeroRangeUnits==='Yards' ? firearm.zeroRange: conversions.metersToYards(firearm.zeroRange);
            const muzzleAngleDegrees = drag.muzzleAngleDegreesForZeroRange(round.muzzleVelocityFPS, zeroRangeYards, firearm.sightHeightInches, currentBallisticCoefficient);
            let currentCrossWindDriftInches, currentDropInches, currentEnergyFtLbs, currentLeadInches,  currentRangeMeters, currentRangeYards, currentTimeSeconds, currentVelocityFPS, currentVerticalPositionInches;
            // Skip the first row
            let currentRange = target.chartStepping;
            while (currentRange <= target.distance) {
                currentRangeMeters = target.distanceUnits==='Yards' ? conversions.yardsToMeters(currentRange) : currentRange;
                currentRangeYards = target.distanceUnits==='Yards' ? currentRange : conversions.metersToYards(currentRange);
                currentVelocityFPS = drag.velocityFromRange(currentBallisticCoefficient, round.muzzleVelocityFPS, currentRangeYards);
                currentEnergyFtLbs = drag.energy(round.bulletWeightGrains, currentVelocityFPS);
                currentTimeSeconds = drag.time(currentBallisticCoefficient, round.muzzleVelocityFPS, currentVelocityFPS);
                currentDropInches = drag.drop(round.muzzleVelocityFPS, currentVelocityFPS, currentTimeSeconds);
                currentVerticalPositionInches = drag.verticalPosition(firearm.sightHeightInches, muzzleAngleDegrees, currentRangeYards, currentDropInches);
                // Cross Winds take on full range value regardless of Slant To Target
                currentCrossWindDriftInches = drag.crossWindDrift(currentRangeYards, currentTimeSeconds, weather.windAngleDegrees, weather.windVelocityMPH, muzzleAngleDegrees, round.muzzleVelocityFPS);
                currentLeadInches = drag.lead(target.speedMPH, currentTimeSeconds);
                const slantDropInches = currentDropInches * (1-Math.cos(conversions.degreesToRadians(target.slantDegrees)));
                const range = {
                    rangeMeters: currentRangeMeters,
                    rangeYards: currentRangeYards,
                    velocityFPS: currentVelocityFPS,
                    energyFtLbs: currentEnergyFtLbs,
                    timeSeconds: currentTimeSeconds,
                    dropInches: currentDropInches,
                    verticalPositionInches: -currentVerticalPositionInches,  // Go negative to reflect how much scope dial up is needed
                    crossWindDriftInches: currentCrossWindDriftInches,
                    leadInches: currentLeadInches,
                    slantDegrees: target.slantDegrees,
                    // //Al the remaining properties are computed
                    verticalPositionMil: conversions.inchesToMil(-currentVerticalPositionInches, currentRangeYards),
                    verticalPositionMoA: conversions.inchesToMinutesOfAngle(-currentVerticalPositionInches, currentRangeYards),
                    verticalPositionIPHY: conversions.inchesToIPHY(-currentVerticalPositionInches, currentRangeYards),
                    crossWindDriftMil: conversions.inchesToMil(currentCrossWindDriftInches, currentRangeYards),
                    crossWindDriftMoA: conversions.inchesToMinutesOfAngle(currentCrossWindDriftInches, currentRangeYards),
                    crossWindDriftIPHY: conversions.inchesToIPHY(currentCrossWindDriftInches, currentRangeYards),
                    leadMil: conversions.inchesToMil(currentLeadInches, currentRangeYards),
                    leadMoA: conversions.inchesToMinutesOfAngle(currentLeadInches, currentRangeYards),
                    leadIPHY: conversions.inchesToIPHY(currentLeadInches, currentRangeYards),
                    slantDropInches: slantDropInches,
                    slantMil: conversions.inchesToMil(slantDropInches, currentRangeYards),
                    slantMoA: conversions.inchesToMinutesOfAngle(slantDropInches, currentRangeYards),
                    slantIPHY: conversions.inchesToIPHY(slantDropInches, currentRangeYards)
                };
                rangeData.push(range);
                currentRange += target.chartStepping;
            }
        }
        return rangeData;
    }
}

export default ballistics;
