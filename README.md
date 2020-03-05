# Ballistics Drag Functions NPM Library

## Usage

```js
import ballistics from 'pg-ballistics';
// Returns an array of 'Range' objects each of which represents a row on the ballistics table
const rangeData = ballistics.getRangeData(weather, target, firearm, round);
```

## Models

```js
export interface Firearm {
    id: string;
    name: string;
    // Gradients are clicks required to match 1 full turret unit.
    // MoA and IPHY are 1, 2 or 4 displayed in select as 1, 1/2, 1/4 per click
    // Mil scopes are always 10 clicks per Mil shown as 1/10
    elevationTurretGradients: number;
    reticleUnits: string; // 'Mil', 'MoA', or 'IPHY'
    rounds: Array<Round>;
    sightHeightInches: number;
    turretUnits: string; // 'Mil', 'MoA', or 'IPHY'
    windageTurretGradients: number;
    zeroRangeUnits: string; // 'Yards' or 'Meters'
    zeroRange: number;
}
export interface Range {
    rangeMeters: number;
    rangeYards: number;
    velocityFPS: number;
    energyFtLbs: number;
    timeSeconds: number;
    dropInches: number;
    verticalPositionInches: number;
    // Cross Winds take on full range value regardless of Slant To Target
    crossWindDriftInches: number;
    leadInches: number;
    slantDegrees: number;
    // All the remaining properties are computed
    verticalPositionMil: number;
    verticalPositionMoA: number;
    verticalPositionIPHY: number;
    crossWindDriftMil: number;
    crossWindDriftMoA: number;
    crossWindDriftIPHY: number;
    leadMil: number;
    leadMoA: number;
    leadIPHY: number;
    slantDropInches: number;
    slantMil: number;
    slantMoA: number;
    slantIPHY: number;
}
export interface Round {
    id: string;
    name: string;
    bulletBC: number;
    bulletDiameterInches: number;
    bulletWeightGrains: number;
    muzzleVelocityFPS: number;
}
export interface Target {
    distanceUnits: string; // 'Yards' or 'Meters'
    distance: number;
    chartStepping: number;
    sizeInches?: number;
    slantDegrees: number;
    speedMPH: number;
}
export interface Weather {
    altitudeFeet: number;
    temperatureDegreesFahrenheit: number;
    barometricPressureInchesHg: number;
    relativeHumidityPercent: number;
    windVelocityMPH: number;
    windAngleDegrees: number;
}
```

## Functions

`getRangeData(weather, target, firearm, round)` - Returns an array of 'Range' objects each of which represents a row on the ballistics table
