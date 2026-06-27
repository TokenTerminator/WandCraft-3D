import * as THREE from 'three';

export interface WandConfig {
  // Pommel
  pommelShape: 'sphere' | 'crystal' | 'crown' | 'egg' | 'flat' | 'claw';
  pommelHeight: number; // mm
  pommelWidth: number; // mm
  
  // Grip
  gripShape: 'smooth' | 'ribbed' | 'spiral' | 'elder' | 'ergonomic';
  gripHeight: number; // mm
  gripWidth: number; // mm
  gripDetailsCount: number; // e.g. number of ribs or Elder beads
  
  // Shaft
  shaftShape: 'smooth' | 'segmented' | 'spiral_vine' | 'organic' | 'fluted';
  shaftHeight: number; // mm
  shaftBaseWidth: number; // mm
  shaftTipWidth: number; // mm
  shaftDetailsCount: number; // e.g. vine twists or fluting ridges
  
  // Tip
  tipShape: 'rounded' | 'pointed' | 'crystal' | 'orb_claw' | 'flame';
  tipHeight: number; // mm
  tipWidth: number; // mm

  // Aesthetics & Filament Colors
  pommelColor: string;
  gripColor: string;
  shaftColor: string;
  tipColor: string;

  pommelMaterialType: 'wood' | 'metal' | 'crystal' | 'bone';
  gripMaterialType: 'wood' | 'metal' | 'crystal' | 'bone';
  shaftMaterialType: 'wood' | 'metal' | 'crystal' | 'bone';
  tipMaterialType: 'wood' | 'metal' | 'crystal' | 'bone';
}

// Preset configurations for characters
export const CHARACTERS_PRESETS: Record<string, { name: string; description: string; config: WandConfig; wandInfo: { core: string; wood: string; length: number; flexibility: string } }> = {
  harry: {
    name: "Harry's Holly Wand",
    description: "An elegant, organic wand resembling a natural holly branch with knobby grip and a phoenix feather core.",
    wandInfo: {
      core: "Phoenix Feather",
      wood: "Holly",
      length: 11,
      flexibility: "Nice and supple"
    },
    config: {
      pommelShape: 'sphere',
      pommelHeight: 12,
      pommelWidth: 16,
      gripShape: 'ergonomic',
      gripHeight: 85,
      gripWidth: 16,
      gripDetailsCount: 4,
      shaftShape: 'organic',
      shaftHeight: 170,
      shaftBaseWidth: 12,
      shaftTipWidth: 6,
      shaftDetailsCount: 5,
      tipShape: 'rounded',
      tipHeight: 15,
      tipWidth: 6,
      pommelColor: '#5c4033', // Deep rich brown
      gripColor: '#4a3319', // Natural wood bark
      shaftColor: '#5c4033', // Holly brown
      tipColor: '#5c4033',
      pommelMaterialType: 'wood',
      gripMaterialType: 'wood',
      shaftMaterialType: 'wood',
      tipMaterialType: 'wood'
    }
  },
  hermione: {
    name: "Hermione's Vine Wand",
    description: "An incredibly elegant wand featuring beautifully carved, sweeping spiral vines wrapped around the slender shaft.",
    wandInfo: {
      core: "Dragon Heartstring",
      wood: "Vine Wood",
      length: 10.75,
      flexibility: "Slightly springy"
    },
    config: {
      pommelShape: 'flat',
      pommelHeight: 10,
      pommelWidth: 13,
      gripShape: 'smooth',
      gripHeight: 70,
      gripWidth: 12,
      gripDetailsCount: 3,
      shaftShape: 'spiral_vine',
      shaftHeight: 190,
      shaftBaseWidth: 10,
      shaftTipWidth: 5,
      shaftDetailsCount: 3, // 3 vine spirals
      tipShape: 'pointed',
      tipHeight: 15,
      tipWidth: 5,
      pommelColor: '#c19a6b', // Camel / Oak color
      gripColor: '#c19a6b',
      shaftColor: '#a8c3bc', // Sage vine color
      tipColor: '#c19a6b',
      pommelMaterialType: 'wood',
      gripMaterialType: 'wood',
      shaftMaterialType: 'wood',
      tipMaterialType: 'wood'
    }
  },
  dumbledore: {
    name: "The Elder Wand (Dumbledore)",
    description: "The most powerful wand in existence, featuring five bulbous segmented elderberry beads and runic carvings.",
    wandInfo: {
      core: "Thestral Tail Hair",
      wood: "Elder",
      length: 15,
      flexibility: "Unyielding"
    },
    config: {
      pommelShape: 'crystal', // Faceted cone bottom
      pommelHeight: 18,
      pommelWidth: 15,
      gripShape: 'elder', // Bead structure
      gripHeight: 110,
      gripWidth: 18,
      gripDetailsCount: 3, // 3 elder beads on grip
      shaftShape: 'segmented', // Bead structure on shaft too!
      shaftHeight: 230,
      shaftBaseWidth: 12,
      shaftTipWidth: 6,
      shaftDetailsCount: 3, // 3 elder beads on shaft
      tipShape: 'rounded',
      tipHeight: 12,
      tipWidth: 6,
      pommelColor: '#1a1105', // Elder black-brown
      gripColor: '#2b1e0a',
      shaftColor: '#1a1105',
      tipColor: '#1a1105',
      pommelMaterialType: 'wood',
      gripMaterialType: 'wood',
      shaftMaterialType: 'wood',
      tipMaterialType: 'wood'
    }
  },
  voldemort: {
    name: "Voldemort's Yew Wand",
    description: "A dark and sinister bone-white wand shaped like an ancient yew branch ending in a sharp bone-claw hook.",
    wandInfo: {
      core: "Phoenix Feather (Brother to Harry's)",
      wood: "Yew",
      length: 13.5,
      flexibility: "Rigid"
    },
    config: {
      pommelShape: 'claw', // Hook claw
      pommelHeight: 28,
      pommelWidth: 20,
      gripShape: 'smooth',
      gripHeight: 90,
      gripWidth: 16,
      gripDetailsCount: 1,
      shaftShape: 'organic', // Slightly bumpy bone look
      shaftHeight: 200,
      shaftBaseWidth: 12,
      shaftTipWidth: 5,
      shaftDetailsCount: 4,
      tipShape: 'pointed',
      tipHeight: 25,
      tipWidth: 5,
      pommelColor: '#f5f5dc', // Ivory / Bone
      gripColor: '#fcfcf0',
      shaftColor: '#f5f5dc',
      tipColor: '#f5f5dc',
      pommelMaterialType: 'bone',
      gripMaterialType: 'bone',
      shaftMaterialType: 'bone',
      tipMaterialType: 'bone'
    }
  },
  ron: {
    name: "Ron's Rustic Willow Wand",
    description: "A thick, sturdy, and loyal wand made from willow wood with a prominent ribbed grip for excellent handling.",
    wandInfo: {
      core: "Unicorn Hair",
      wood: "Willow",
      length: 14,
      flexibility: "Slightly springy"
    },
    config: {
      pommelShape: 'flat',
      pommelHeight: 12,
      pommelWidth: 18,
      gripShape: 'ribbed',
      gripHeight: 95,
      gripWidth: 18,
      gripDetailsCount: 6, // 6 strong ribs
      shaftShape: 'smooth',
      shaftHeight: 220,
      shaftBaseWidth: 13,
      shaftTipWidth: 7,
      shaftDetailsCount: 0,
      tipShape: 'rounded',
      tipHeight: 18,
      tipWidth: 7,
      pommelColor: '#8b5a2b', // Warm chestnut brown
      gripColor: '#704214',
      shaftColor: '#8b5a2b',
      tipColor: '#8b5a2b',
      pommelMaterialType: 'wood',
      gripMaterialType: 'wood',
      shaftMaterialType: 'wood',
      tipMaterialType: 'wood'
    }
  }
};

// --- PROCEDURAL GEOMETRY BUILDERS ---

// Helper to deform/displace vertices for organic and fluted styles
function deformCylinder(
  geometry: THREE.CylinderGeometry,
  type: 'organic' | 'fluted',
  baseRadius: number,
  tipRadius: number,
  height: number,
  frequency: number = 5
) {
  const positionAttr = geometry.getAttribute('position');
  const vertex = new THREE.Vector3();

  for (let i = 0; i < positionAttr.count; i++) {
    vertex.fromBufferAttribute(positionAttr, i);
    
    // Normalize Y height to 0 -> 1 range
    // Cylinders are centered at Y = 0, so height goes from -H/2 to +H/2
    const normY = (vertex.y + height / 2) / height;

    if (normY > 0.05 && normY < 0.95) { // Keep joints mostly undeformed for solid connections
      const angle = Math.atan2(vertex.z, vertex.x);
      const currentRadius = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);

      if (type === 'organic') {
        // Organic bumpy deformation using sine waves
        const noise = (Math.sin(vertex.y * 0.15) * 0.6 + Math.cos(angle * 3) * 0.3) * (1 - Math.abs(normY - 0.5) * 0.5);
        const newRadius = Math.max(1.5, currentRadius + noise);
        const scale = newRadius / currentRadius;
        vertex.x *= scale;
        vertex.z *= scale;
      } else if (type === 'fluted') {
        // Vertical fluted ridges (frequency = ridge count)
        const depth = (baseRadius * 0.12) * (1 - normY * 0.5); // Taper flute depth as shaft thins
        const flute = Math.sin(angle * frequency) * depth;
        const newRadius = Math.max(1.0, currentRadius - Math.abs(flute));
        const scale = newRadius / currentRadius;
        vertex.x *= scale;
        vertex.z *= scale;
      }
    }
    positionAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
  geometry.computeVertexNormals();
}

export function buildPommelGeometry(shape: string, height: number, width: number): THREE.BufferGeometry {
  let geo: THREE.BufferGeometry;
  
  switch (shape) {
    case 'sphere': {
      const radius = width / 2;
      geo = new THREE.SphereGeometry(radius, 16, 16);
      geo.scale(1, height / (radius * 2), 1);
      // Move so bottom of pommel is at Y = 0
      geo.translate(0, height / 2, 0);
      break;
    }
    case 'crystal': {
      // 6-sided faceted crystal dome
      geo = new THREE.CylinderGeometry(width / 2, width / 3, height, 6);
      // Let's bevel the bottom to a tip
      const posAttr = geo.getAttribute('position');
      const vertex = new THREE.Vector3();
      for (let i = 0; i < posAttr.count; i++) {
        vertex.fromBufferAttribute(posAttr, i);
        if (vertex.y < 0) { // Bottom cap vertices
          vertex.x *= 0.1;
          vertex.z *= 0.1;
        }
        posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      geo.computeVertexNormals();
      geo.translate(0, height / 2, 0);
      break;
    }
    case 'crown': {
      // Cylindrical base with crown spires on top
      geo = new THREE.CylinderGeometry(width / 2, width / 2.2, height, 16, 6);
      const posAttr = geo.getAttribute('position');
      const vertex = new THREE.Vector3();
      for (let i = 0; i < posAttr.count; i++) {
        vertex.fromBufferAttribute(posAttr, i);
        if (vertex.y > height / 4) { // Top section
          const angle = Math.atan2(vertex.z, vertex.x);
          const spireHeight = Math.max(0, Math.sin(angle * 5) * (height * 0.2)); // 5 points, positive peaks only
          vertex.y += spireHeight;
        }
        posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      geo.computeVertexNormals();
      geo.translate(0, height / 2, 0);
      break;
    }
    case 'egg': {
      const radius = width / 2;
      geo = new THREE.SphereGeometry(radius, 16, 16);
      // Egg scale: stretch positive Y more than negative Y
      const posAttr = geo.getAttribute('position');
      const vertex = new THREE.Vector3();
      for (let i = 0; i < posAttr.count; i++) {
        vertex.fromBufferAttribute(posAttr, i);
        if (vertex.y > 0) {
          vertex.y *= 1.35;
        }
        posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      geo.computeVertexNormals();
      geo.scale(1, height / (radius * 2.35), 1);
      geo.translate(0, height / 2.35, 0); // Correct translate so bottom of egg is at Y = 0
      break;
    }
    case 'claw': {
      // Voldemort beak/claw using TubeGeometry along a curve
      const p1 = new THREE.Vector3(0, 0, 0);
      const p2 = new THREE.Vector3(0, height * 0.4, 0); // Perfectly vertical tangent at base to avoid wedge gaps
      const p3 = new THREE.Vector3(-width * 0.4, height, 0);
      const curve = new THREE.QuadraticBezierCurve3(p1, p2, p3);
      
      // Let's create a custom tube radial profile that tapers to claw tip
      const tubeSegments = 24;
      const radialSegments = 8;
      geo = new THREE.TubeGeometry(curve, tubeSegments, width / 2, radialSegments, false);
      
      // Now taper the tube vertices
      const posAttr = geo.getAttribute('position');
      const vertex = new THREE.Vector3();
      for (let i = 0; i < posAttr.count; i++) {
        vertex.fromBufferAttribute(posAttr, i);
        // Find which tube slice this vertex belongs to based on index
        const sliceIdx = Math.floor(i / (radialSegments + 1));
        const taperRatio = 1 - (sliceIdx / tubeSegments) * 0.85; // Tapers down to 15% size at top
        
        // Find center point along curve
        const t = sliceIdx / tubeSegments;
        const center = curve.getPointAt(t);
        
        // Vector from center to vertex
        const dir = new THREE.Vector3().subVectors(vertex, center);
        dir.multiplyScalar(taperRatio);
        vertex.copy(center).add(dir);
        
        posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      geo.computeVertexNormals();
      // Rotate 180 degrees so claw points downward
      geo.rotateZ(Math.PI);
      geo.translate(0, height, 0);
      break;
    }
    case 'flat':
    default: {
      // Clean chamfered disc bottom
      geo = new THREE.CylinderGeometry(width / 2, width / 2, height, 16, 2);
      // Let's round the bottom edge
      const posAttr = geo.getAttribute('position');
      const vertex = new THREE.Vector3();
      for (let i = 0; i < posAttr.count; i++) {
        vertex.fromBufferAttribute(posAttr, i);
        if (vertex.y < -height / 4) { // Bottom ring
          vertex.x *= 0.85;
          vertex.z *= 0.85;
        }
        posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      geo.computeVertexNormals();
      geo.translate(0, height / 2, 0);
      break;
    }
  }

  return geo;
}

export function buildGripGeometry(shape: string, height: number, width: number, detailCount: number): THREE.BufferGeometry {
  let geo: THREE.BufferGeometry;
  const radius = width / 2;

  switch (shape) {
    case 'ribbed': {
      // Circular undulating ridges (ribs)
      const points: THREE.Vector2[] = [];
      const steps = 40;
      for (let i = 0; i <= steps; i++) {
        const y = (i / steps) * height;
        // Waving rib profile
        const waves = Math.sin((y / height) * Math.PI * 2 * detailCount);
        const r = radius * (0.9 + 0.12 * waves);
        points.push(new THREE.Vector2(r, y));
      }
      geo = new THREE.LatheGeometry(points, 24);
      break;
    }
    case 'spiral': {
      // Spiral twist grip
      // Create a cylinder, then twist its vertices helically!
      geo = new THREE.CylinderGeometry(radius * 0.95, radius, height, 24, 40);
      const posAttr = geo.getAttribute('position');
      const vertex = new THREE.Vector3();
      for (let i = 0; i < posAttr.count; i++) {
        vertex.fromBufferAttribute(posAttr, i);
        // Normalize height -H/2 to +H/2
        const normY = (vertex.y + height / 2) / height;
        
        // Add spiral grooves by shifting vertices radially
        const angle = Math.atan2(vertex.z, vertex.x);
        // Helical phase
        const helixPhase = normY * Math.PI * 2 * (detailCount || 3);
        const spiralWave = Math.sin(angle * 2 - helixPhase); // 2-start thread
        
        const currentRadius = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);
        const rFactor = 1 + 0.08 * spiralWave;
        
        vertex.x *= rFactor;
        vertex.z *= rFactor;
        
        posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      geo.computeVertexNormals();
      geo.translate(0, height / 2, 0);
      break;
    }
    case 'elder': {
      // Stacks of sphere beads (Elder wand handle style)
      // Standard elder wand has beads connected by slender bands
      const points: THREE.Vector2[] = [];
      const steps = 60;
      const beadCount = detailCount || 3;
      for (let i = 0; i <= steps; i++) {
        const y = (i / steps) * height;
        
        // Periodic bulbous berries
        // Elder berry bulb contour
        const segmentProgress = (y / height) * beadCount;
        const beadIndex = Math.floor(segmentProgress);
        const t = segmentProgress - beadIndex; // 0 to 1 inside bead
        
        // Sinusoidal bulb
        const baseOffset = 0.55; // Core sleeve width
        const bulbWidth = 0.45 * Math.sin(t * Math.PI);
        const r = radius * (baseOffset + bulbWidth);
        
        points.push(new THREE.Vector2(r, y));
      }
      geo = new THREE.LatheGeometry(points, 24);
      break;
    }
    case 'ergonomic': {
      // Hourglass shape with flare at bottom and top
      const points: THREE.Vector2[] = [];
      const steps = 30;
      for (let i = 0; i <= steps; i++) {
        const y = (i / steps) * height;
        const normY = y / height;
        // Cosine neck profile
        const r = radius * (0.82 + 0.18 * Math.cos(normY * Math.PI * 2));
        points.push(new THREE.Vector2(r, y));
      }
      geo = new THREE.LatheGeometry(points, 24);
      break;
    }
    case 'smooth':
    default: {
      // Tapered smooth cylinder (grip is slightly wider at bottom)
      geo = new THREE.CylinderGeometry(radius * 0.9, radius, height, 24);
      geo.translate(0, height / 2, 0);
      break;
    }
  }

  return geo;
}

export function buildShaftGeometry(shape: string, height: number, baseWidth: number, tipWidth: number, detailCount: number): THREE.BufferGeometry {
  let geo: THREE.BufferGeometry;
  const rBase = baseWidth / 2;
  const rTip = tipWidth / 2;

  switch (shape) {
    case 'segmented': {
      // Stack of tapered telescoping segments
      const points: THREE.Vector2[] = [];
      const segments = Math.max(3, detailCount || 4);
      const segmentHeight = height / segments;
      
      for (let s = 0; s < segments; s++) {
        const startY = s * segmentHeight;
        const endY = (s + 1) * segmentHeight;
        
        const sNormStart = s / segments;
        const sNormEnd = (s + 1) / segments;
        
        // Base and tip radius of this segment
        const startR = rBase - (rBase - rTip) * sNormStart;
        const endR = rBase - (rBase - rTip) * sNormEnd;
        
        // Lathe points for this segment (with a slight step inward at joint)
        points.push(new THREE.Vector2(startR, startY));
        points.push(new THREE.Vector2(endR * 1.05, endY)); // Outer rim taper
        // Step-in vertex (except at the very tip)
        if (s < segments - 1) {
          const nextR = rBase - (rBase - rTip) * ((s + 1) / segments);
          points.push(new THREE.Vector2(nextR * 0.95, endY));
        }
      }
      
      geo = new THREE.LatheGeometry(points, 24);
      break;
    }
    case 'spiral_vine': {
      // Main central tapered shaft
      geo = new THREE.CylinderGeometry(rTip, rBase, height, 24, 10);
      geo.translate(0, height / 2, 0);
      break;
    }
    case 'organic': {
      // Gnarled organic tree-branch shaft
      geo = new THREE.CylinderGeometry(rTip, rBase, height, 16, 50);
      deformCylinder(geo as THREE.CylinderGeometry, 'organic', rBase, rTip, height);
      geo.translate(0, height / 2, 0);
      break;
    }
    case 'fluted': {
      // Vertical ridges
      const ridges = Math.max(4, detailCount || 8);
      geo = new THREE.CylinderGeometry(rTip, rBase, height, ridges * 3, 20);
      deformCylinder(geo as THREE.CylinderGeometry, 'fluted', rBase, rTip, height, ridges);
      geo.translate(0, height / 2, 0);
      break;
    }
    case 'smooth':
    default: {
      // Simple tapered wooden rod
      geo = new THREE.CylinderGeometry(rTip, rBase, height, 24);
      geo.translate(0, height / 2, 0);
      break;
    }
  }

  return geo;
}

export function buildTipGeometry(shape: string, height: number, width: number): THREE.BufferGeometry {
  let geo: THREE.BufferGeometry;
  const radius = width / 2;

  switch (shape) {
    case 'pointed': {
      // Sharp, elegant wizard point
      geo = new THREE.CylinderGeometry(0, radius, height, 16);
      geo.translate(0, height / 2, 0);
      break;
    }
    case 'crystal': {
      // Hexagonal magic quartz prism
      geo = new THREE.CylinderGeometry(0, radius, height * 0.4, 6);
      geo.translate(0, height * 0.8, 0);
      const baseGeo = new THREE.CylinderGeometry(radius, radius, height * 0.6, 6);
      baseGeo.translate(0, height * 0.3, 0);
      
      const merged = new THREE.Group();
      const mesh1 = new THREE.Mesh(geo);
      const mesh2 = new THREE.Mesh(baseGeo);
      merged.add(mesh1, mesh2);
      
      // Let's just create a combined single geometry using Lathe or cylinder points for simplicity and printing safety
      const points: THREE.Vector2[] = [
        new THREE.Vector2(radius, 0),
        new THREE.Vector2(radius, height * 0.6),
        new THREE.Vector2(0, height)
      ];
      geo = new THREE.LatheGeometry(points, 6); // Hexagonal lathe!
      break;
    }
    case 'orb_claw': {
      // Wand shaft ends with a round orb nested in claws
      const neckHeight = height * 0.3;
      const orbRadius = height * 0.35;
      
      // We will make a neck, then a sphere at the top
      const points: THREE.Vector2[] = [
        new THREE.Vector2(radius, 0),
        new THREE.Vector2(radius * 1.2, neckHeight),
        new THREE.Vector2(radius * 0.8, neckHeight * 1.2),
        new THREE.Vector2(0, neckHeight * 1.2)
      ];
      const neckGeo = new THREE.LatheGeometry(points, 16);
      
      const orbGeo = new THREE.SphereGeometry(orbRadius, 16, 16);
      orbGeo.translate(0, height - orbRadius, 0);
      
      // In Three.js, we can return groups or merge. For STL, we export a group of meshes. 
      // To make buildTipGeometry return a single geometry, we can merge or use a smart contour.
      // A smart contour is awesome!
      const contourPoints: THREE.Vector2[] = [];
      // Shaft collar
      contourPoints.push(new THREE.Vector2(radius, 0));
      contourPoints.push(new THREE.Vector2(radius * 1.3, neckHeight * 0.8));
      contourPoints.push(new THREE.Vector2(radius * 0.7, neckHeight));
      
      // Spheroid tip
      const orbCenterY = height - orbRadius;
      const sphereSteps = 15;
      for (let i = 0; i <= sphereSteps; i++) {
        // angle from -90 deg (bottom of sphere) to +90 deg (top)
        const angle = -Math.PI/2 + (i / sphereSteps) * Math.PI;
        const x = orbRadius * Math.cos(angle);
        const y = orbCenterY + orbRadius * Math.sin(angle);
        if (y >= neckHeight) {
          contourPoints.push(new THREE.Vector2(Math.max(0.1, x), y));
        }
      }
      geo = new THREE.LatheGeometry(contourPoints, 20);
      break;
    }
    case 'flame': {
      // Swirling flame tip! Let's approximate using an organic taper lathe
      const points: THREE.Vector2[] = [];
      const steps = 30;
      for (let i = 0; i <= steps; i++) {
        const y = (i / steps) * height;
        const normY = y / height;
        // Flaring flame profile that shrinks to 0
        const wave = 1 + 0.25 * Math.sin(normY * Math.PI * 4);
        const r = radius * (1 - normY) * wave;
        points.push(new THREE.Vector2(r, y));
      }
      geo = new THREE.LatheGeometry(points, 16);
      break;
    }
    case 'rounded':
    default: {
      // Standard rounded wand tip
      const points: THREE.Vector2[] = [];
      // Cylinder shaft
      const cylinderHeight = height - radius;
      points.push(new THREE.Vector2(radius, 0));
      points.push(new THREE.Vector2(radius, cylinderHeight));
      
      // Cap hemisphere
      for (let i = 0; i <= 8; i++) {
        const angle = (i / 8) * (Math.PI / 2); // 0 to 90 degrees
        const x = radius * Math.cos(angle);
        const y = cylinderHeight + radius * Math.sin(angle);
        points.push(new THREE.Vector2(x, y));
      }
      geo = new THREE.LatheGeometry(points, 24);
      break;
    }
  }

  return geo;
}

// Generate the vine spiral mesh for Hermione's wand shape
export function buildVineMesh(shaftHeight: number, baseRadius: number, tipRadius: number, twists: number, color: string): THREE.Mesh {
  const points: THREE.Vector3[] = [];
  const segments = 120;
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = t * shaftHeight;
    const theta = t * Math.PI * 2 * twists;
    
    // Radius of the shaft at this height
    const rShaft = baseRadius - (baseRadius - tipRadius) * t;
    
    // Vine lies slightly on the surface of the shaft
    const rVine = rShaft + 1.2; 
    
    const x = rVine * Math.cos(theta);
    const z = rVine * Math.sin(theta);
    
    points.push(new THREE.Vector3(x, y, z));
  }
  
  const curve = new THREE.CatmullRomCurve3(points);
  // Vine tube radius is thicker at bottom, thinner at top
  const vineGeo = new THREE.TubeGeometry(curve, segments, 1.8, 8, false);
  
  // Taper the vine mesh
  const posAttr = vineGeo.getAttribute('position');
  const vertex = new THREE.Vector3();
  for (let i = 0; i < posAttr.count; i++) {
    vertex.fromBufferAttribute(posAttr, i);
    // Find segment slice
    const segmentIdx = Math.floor(i / 9); // radial segments = 8, so 9 vertices per slice
    const t = segmentIdx / segments;
    
    const center = curve.getPointAt(t);
    const dir = new THREE.Vector3().subVectors(vertex, center);
    
    // Scale tube radius based on height (thicker at base)
    const vineTaper = 1 - t * 0.55; // Taper to 45% thickness
    dir.multiplyScalar(vineTaper);
    
    vertex.copy(center).add(dir);
    posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
  
  vineGeo.computeVertexNormals();
  
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.8,
    metalness: 0.1
  });
  
  return new THREE.Mesh(vineGeo, mat);
}

// --- STL BINARY EXPORTER ---
// Generates a 3D printable STL binary ArrayBuffer from a list of Three.js Meshes
export function exportToBinarySTL(meshes: THREE.Mesh[]): ArrayBuffer {
  let totalTriangles = 0;
  const meshData: {
    geometry: THREE.BufferGeometry;
    matrix: THREE.Matrix4;
  }[] = [];

  meshes.forEach(mesh => {
    // Ensure world matrix is updated
    mesh.updateMatrixWorld(true);
    const geometry = mesh.geometry;
    
    const positionAttr = geometry.getAttribute('position');
    if (positionAttr) {
      const index = geometry.getIndex();
      const triangleCount = index ? index.count / 3 : positionAttr.count / 3;
      totalTriangles += triangleCount;
      meshData.push({
        geometry,
        matrix: mesh.matrixWorld
      });
    }
  });

  // STL Binary Structure:
  // - 80 byte header
  // - 4 byte unsigned integer (number of triangles)
  // - For each triangle (50 bytes):
  //   - 12 bytes float vector (Normal)
  //   - 12 bytes float vector (Vertex 1)
  //   - 12 bytes float vector (Vertex 2)
  //   - 12 bytes float vector (Vertex 3)
  //   - 2 bytes unsigned short (attribute byte count, usually 0)
  
  const bufferSize = 80 + 4 + totalTriangles * 50;
  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  // Write header
  const header = "Magic Wand Creator - 3D Printable STL Model";
  for (let i = 0; i < header.length && i < 80; i++) {
    view.setUint8(i, header.charCodeAt(i));
  }

  // Write triangle count
  view.setUint32(80, totalTriangles, true); // true = Little Endian

  let offset = 84;
  const tempNormal = new THREE.Vector3();
  const tempV1 = new THREE.Vector3();
  const tempV2 = new THREE.Vector3();
  const tempV3 = new THREE.Vector3();

  meshData.forEach(({ geometry, matrix }) => {
    const positionAttr = geometry.getAttribute('position');
    const index = geometry.getIndex();
    const normalAttr = geometry.getAttribute('normal');

    const vertexCount = index ? index.count : positionAttr.count;

    for (let i = 0; i < vertexCount; i += 3) {
      let idx1 = i, idx2 = i + 1, idx3 = i + 2;
      if (index) {
        idx1 = index.getX(i);
        idx2 = index.getX(i + 1);
        idx3 = index.getX(i + 2);
      }

      // Read vertices & transform to world space
      tempV1.fromBufferAttribute(positionAttr, idx1).applyMatrix4(matrix);
      tempV2.fromBufferAttribute(positionAttr, idx2).applyMatrix4(matrix);
      tempV3.fromBufferAttribute(positionAttr, idx3).applyMatrix4(matrix);

      // Compute normal
      if (normalAttr) {
        const normalMatrix = new THREE.Matrix3().getNormalMatrix(matrix);
        tempNormal.fromBufferAttribute(normalAttr, idx1).applyMatrix3(normalMatrix).normalize();
      } else {
        // Calculate face normal
        const cb = new THREE.Vector3().subVectors(tempV3, tempV2);
        const ab = new THREE.Vector3().subVectors(tempV1, tempV2);
        cb.cross(ab).normalize();
        tempNormal.copy(cb);
      }

      // Write Normal Vector
      view.setFloat32(offset, tempNormal.x, true);
      view.setFloat32(offset + 4, tempNormal.y, true);
      view.setFloat32(offset + 8, tempNormal.z, true);
      offset += 12;

      // Write Vertex 1
      view.setFloat32(offset, tempV1.x, true);
      view.setFloat32(offset + 4, tempV1.y, true);
      view.setFloat32(offset + 8, tempV1.z, true);
      offset += 12;

      // Write Vertex 2
      view.setFloat32(offset, tempV2.x, true);
      view.setFloat32(offset + 4, tempV2.y, true);
      view.setFloat32(offset + 8, tempV2.z, true);
      offset += 12;

      // Write Vertex 3
      view.setFloat32(offset, tempV3.x, true);
      view.setFloat32(offset + 4, tempV3.y, true);
      view.setFloat32(offset + 8, tempV3.z, true);
      offset += 12;

      // Write Attribute Byte Count (0)
      view.setUint16(offset, 0, true);
      offset += 2;
    }
  });

  return buffer;
}
