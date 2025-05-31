/**
 * Map Data Generation Script
 *
 * This script generates the precompiled map JSON data used by the Map component.
 * Run this script whenever you need to regenerate the map data:
 *
 * Usage: node src/pages/Map/generateMapData.js
 *
 * The generated mapData.json file contains the base map structure that gets
 * scaled dynamically based on container height in the Map component.
 */

import pkg from 'dotted-map';
import fs from 'fs';

const { getMapJSON } = pkg;

// Generate map with height 500 (we'll use this as base and scale dynamically)
const mapJson = getMapJSON({ height: 125, grid: 'diagonal' });
fs.writeFileSync('./src/pages/Map/mapData.json', mapJson);
console.log('Map data saved to mapData.json');
