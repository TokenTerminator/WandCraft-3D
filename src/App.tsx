/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Sparkles, 
  Download, 
  RotateCcw, 
  HelpCircle, 
  Wand2, 
  Compass, 
  Printer, 
  Sliders, 
  Layers, 
  Flame, 
  Info,
  Dice5,
  Volume2,
  VolumeX,
  Palette,
  Heart,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { 
  WandConfig, 
  CHARACTERS_PRESETS, 
  buildPommelGeometry, 
  buildGripGeometry, 
  buildShaftGeometry, 
  buildTipGeometry, 
  buildVineMesh,
  exportToBinarySTL 
} from './wandGeometry';

// List of magical cores for kids to choose from
const MAGICAL_CORES = [
  { id: 'phoenix', name: 'Phoenix Feather', description: 'Rare, highly active, and capable of the greatest range of magic.', icon: '🔥' },
  { id: 'unicorn', name: 'Unicorn Hair', description: 'Consistent, faithful, and produces the most stable, gentle magic.', icon: '🦄' },
  { id: 'dragon', name: 'Dragon Heartstring', description: 'Powerful, daring, fast-learning, and capable of spectacular spells.', icon: '🐉' },
  { id: 'basilisk', name: 'Basilisk Horn', description: 'Sleek, highly selective, and excels in powerful protective charms.', icon: '🐍' },
  { id: 'veela', name: 'Veela Hair', description: 'Elegant, temperamental, and brings a passionate, artistic touch.', icon: '✨' }
];

// List of wood types
const WOOD_TYPES = [
  { name: 'Holly', color: '#5c4033', texture: 'Fine, protective, and holds deep magical warmth' },
  { name: 'Elder', color: '#1a1105', texture: 'Rare, ancient, deeply wise, and hard to master' },
  { name: 'Yew', color: '#f5f5dc', texture: 'Immensely long-lived, dark-themed, and holds power over life and death' },
  { name: 'Vine', color: '#c19a6b', texture: 'Slender, flexible, and seeks out a wizard of high purpose' },
  { name: 'Willow', color: '#8b5a2b', texture: 'Rustic, healing, and loves wizards with great potential' },
  { name: 'Ebony', color: '#0d0d0d', texture: 'Jet black, proud, and excels in transfiguration' },
  { name: 'Cherry', color: '#4a1515', texture: 'Warm red, rare, and requires a wizard of exceptional self-control' },
  { name: 'Maple', color: '#d2b48c', texture: 'Light golden, adventurous, and loves travel and exploration' },
  { name: 'Ancient Oak', color: '#3d2314', texture: 'Sturdy, loyal, and bonded to guardians of nature' }
];

// PLA Filament presets with actual descriptions for 3D printing
const FILAMENT_COLORS = [
  { name: 'Wizard Charcoal', hex: '#1e1b18', label: 'Dark Charcoal Matte' },
  { name: 'Ancient Oak', hex: '#5c4033', label: 'Wood Fill / Soft Brown' },
  { name: 'Elder Mahogany', hex: '#3d1c02', label: 'Deep Redwood Brown' },
  { name: 'Ivory Bone', hex: '#fdfaf2', label: 'Bone / Cream White' },
  { name: 'Gryffindor Gold', hex: '#d4af37', label: 'Silk Gold PLA' },
  { name: 'Slytherin Silver', hex: '#c0c0c0', label: 'Silk Silver PLA' },
  { name: 'Ravenclaw Bronze', hex: '#cd7f32', label: 'Silk Bronze PLA' },
  { name: 'Magic Amethyst', hex: '#663399', label: 'Translucent Purple' },
  { name: 'Dragon Ruby', hex: '#b22222', label: 'Semi-Transparent Red' },
  { name: 'Forest Emerald', hex: '#006400', label: 'Glittery Emerald Green' },
  { name: 'Cosmic Blue', hex: '#191970', label: 'Starlight Midnight Blue' }
];

// List of funny spells for kids to cast
const SPELLS = [
  { name: 'Giggle-ify!', desc: 'Makes your target break out in unstoppable giggles!', effectColor: '#ffd700' },
  { name: 'Cookie-morfus!', desc: 'Turns any small stone into a warm chocolate-chip cookie!', effectColor: '#8b4513' },
  { name: 'Floaty-Toes!', desc: 'Hover exactly 3 inches off the ground on a tiny cloud!', effectColor: '#87ceeb' },
  { name: 'Squeak-o-Phonia!', desc: 'Makes everyone in the room talk like a tiny chipmunk!', effectColor: '#ff69b4' },
  { name: 'Bubble-trouble!', desc: 'Fills the air with strawberry-scented bouncing bubbles!', effectColor: '#ff1493' },
  { name: 'Feather-Tickle!', desc: 'Summons invisible tickling feathers around your target!', effectColor: '#ffffff' },
  { name: 'Lumos Maxima!', desc: 'Fills the room with a brilliant, beautiful warm wizard glow!', effectColor: '#fffac8' },
  { name: 'Bouncy-Bounce!', desc: 'Turns the floor into a giant soft trampoline!', effectColor: '#00ff7f' },
  { name: 'Choco-Rain!', desc: 'Causes brief clouds that drizzle harmless chocolate droplets!', effectColor: '#5c4033' },
  { name: 'Critter-Call!', desc: 'Summons 3 harmless, sparkly butterflies to dance on your nose!', effectColor: '#da70d6' }
];

export default function App() {
  // --- STATE ---
  const [wandName, setWandName] = useState<string>('My First Wand');
  const [selectedCore, setSelectedCore] = useState<string>('phoenix');
  const [selectedWood, setSelectedWood] = useState<string>('Holly');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Customizer levels
  const [config, setConfig] = useState<WandConfig>(CHARACTERS_PRESETS.harry.config);
  
  const [activeTab, setActiveTab] = useState<'presets' | 'pommel' | 'grip' | 'shaft' | 'tip' | 'wood-core'>('presets');
  
  // Fun interactive states
  const [activeSpell, setActiveSpell] = useState<{ name: string; desc: string; color: string } | null>(null);
  const [spellTimer, setSpellTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLumosActive, setIsLumosActive] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  // Track dynamic animation loop states via refs to bypass stale react hooks closures
  const isLumosActiveRef = useRef<boolean>(false);
  const activeSpellRef = useRef<{ name: string; desc: string; color: string } | null>(null);

  useEffect(() => {
    isLumosActiveRef.current = isLumosActive;
  }, [isLumosActive]);

  useEffect(() => {
    activeSpellRef.current = activeSpell;
  }, [activeSpell]);

  // --- THREE.JS REFS ---
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const wandGroupRef = useRef<THREE.Group | null>(null);
  const tipLightRef = useRef<THREE.PointLight | null>(null);
  
  // Particle systems for sparkles
  const particlesRef = useRef<{ mesh: THREE.Mesh; velocity: THREE.Vector3; life: number; maxLife: number }[]>([]);

  // Calculate overall wand stats
  const totalLengthMm = config.pommelHeight + config.gripHeight + config.shaftHeight + config.tipHeight;
  const lengthInches = (totalLengthMm / 25.4).toFixed(1);

  // Determine flexibility description dynamically
  const getFlexibility = () => {
    const len = parseFloat(lengthInches);
    if (config.shaftShape === 'organic') return 'Quite supple and organic';
    if (config.shaftShape === 'segmented') return 'Rigid and unyielding';
    if (len < 11) return 'Short, swishy, and quick to react';
    if (len > 13.5) return 'Sturdy, springy, and powerful';
    return 'Reasonably springy and well-balanced';
  };

  // --- SOUND SYNTHESIZER (WEB AUDIO) ---
  const playMagicSound = (spellType: string) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      if (spellType === 'lumos') {
        // Soft glowing synthesizer pitch raise
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(784, now + 1.0); // G5 note
        
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.2);
      } else if (spellType === 'presets' || spellType === 'click') {
        // Quick gentle bell sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now); // A5 note
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        // Arpeggiated sparkle chime cascade
        const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760]; // Major chord A
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + index * 0.05);
          
          gain.gain.setValueAtTime(0.12, now + index * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.05 + 0.3);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + index * 0.05);
          osc.stop(now + index * 0.05 + 0.3);
        });
      }
    } catch (e) {
      console.warn("Audio Context blocked or unsupported:", e);
    }
  };

  // Load preset helper
  const loadPreset = (presetKey: string) => {
    const preset = CHARACTERS_PRESETS[presetKey];
    if (preset) {
      setConfig({ ...preset.config });
      setWandName(preset.name);
      setSelectedWood(preset.wandInfo.wood);
      // Map core key
      if (preset.wandInfo.core.includes('Phoenix')) setSelectedCore('phoenix');
      else if (preset.wandInfo.core.includes('Dragon')) setSelectedCore('dragon');
      else if (preset.wandInfo.core.includes('Unicorn')) setSelectedCore('unicorn');
      else if (preset.wandInfo.core.includes('Thestral')) setSelectedCore('unicorn'); // default
      
      playMagicSound('presets');
      triggerBurstParticles('#00ffcc', 20);
    }
  };

  // Randomize wand attributes for kids!
  const handleRandomize = () => {
    const shapes: WandConfig['pommelShape'][] = ['sphere', 'crystal', 'crown', 'egg', 'flat', 'claw'];
    const gripShapes: WandConfig['gripShape'][] = ['smooth', 'ribbed', 'spiral', 'elder', 'ergonomic'];
    const shaftShapes: WandConfig['shaftShape'][] = ['smooth', 'segmented', 'spiral_vine', 'organic', 'fluted'];
    const tipShapes: WandConfig['tipShape'][] = ['rounded', 'pointed', 'crystal', 'orb_claw', 'flame'];
    const matTypes: WandConfig['pommelMaterialType'][] = ['wood', 'metal', 'crystal', 'bone'];

    function randomChoice<T>(arr: T[]): T {
      return arr[Math.floor(Math.random() * arr.length)];
    }
    const randomRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    const randomWood = randomChoice(WOOD_TYPES);
    const randomCore = randomChoice(MAGICAL_CORES);
    const randomColor = randomChoice(FILAMENT_COLORS).hex;

    const newConfig: WandConfig = {
      pommelShape: randomChoice(shapes),
      pommelHeight: randomRange(10, 25),
      pommelWidth: randomRange(12, 22),
      
      gripShape: randomChoice(gripShapes),
      gripHeight: randomRange(70, 110),
      gripWidth: randomRange(13, 20),
      gripDetailsCount: randomRange(3, 8),
      
      shaftShape: randomChoice(shaftShapes),
      shaftHeight: randomRange(140, 230),
      shaftBaseWidth: randomRange(10, 15),
      shaftTipWidth: randomRange(4, 8),
      shaftDetailsCount: randomRange(3, 7),
      
      tipShape: randomChoice(tipShapes),
      tipHeight: randomRange(12, 35),
      tipWidth: randomRange(4, 9),

      pommelColor: randomChoice(FILAMENT_COLORS).hex,
      gripColor: randomChoice(FILAMENT_COLORS).hex,
      shaftColor: randomChoice(FILAMENT_COLORS).hex,
      tipColor: randomChoice(FILAMENT_COLORS).hex,

      pommelMaterialType: randomChoice(matTypes),
      gripMaterialType: randomChoice(matTypes),
      shaftMaterialType: randomChoice(matTypes),
      tipMaterialType: randomChoice(matTypes),
    };

    setConfig(newConfig);
    setSelectedWood(randomWood.name);
    setSelectedCore(randomCore.id);
    
    // Auto-generate a fun magical name
    const prefixes = ['Star', 'Shadow', 'Soul', 'Gryphon', 'Solar', 'Luna', 'Elder', 'Storm', 'Prism', 'Whisper'];
    const suffixes = ['Weaver', 'Keeper', 'Bender', 'Shaper', 'Breaker', 'Singer', 'Spindle', 'Branch', 'Heart'];
    setWandName(`${randomChoice(prefixes)}-${randomChoice(suffixes)}`);

    playMagicSound('preset');
    triggerBurstParticles(randomColor, 35);
  };

  // --- CAST SPELL ACTION ---
  const handleCastSpell = () => {
    if (activeSpell && spellTimer) {
      clearTimeout(spellTimer);
    }

    const randomSpell = SPELLS[Math.floor(Math.random() * SPELLS.length)];
    setActiveSpell(randomSpell);
    
    if (randomSpell.name === 'Lumos Maxima!') {
      setIsLumosActive(true);
      playMagicSound('lumos');
    } else {
      setIsLumosActive(false);
      playMagicSound('spell');
    }

    // Burst particles at wand tip!
    triggerBurstParticles(randomSpell.effectColor, 50);

    // Fade out spell notification in 4 seconds
    const timer = setTimeout(() => {
      setActiveSpell(null);
      setIsLumosActive(false);
    }, 4500);
    setSpellTimer(timer);
  };

  // --- PARTICLE BURST GENERATOR ---
  const triggerBurstParticles = (colorHex: string, count: number) => {
    if (!sceneRef.current) return;
    
    // Spooky magical shapes: spheres, octahedrons, tetrahedrons
    const geometries = [
      new THREE.IcosahedronGeometry(1.2, 0),
      new THREE.BoxGeometry(1.5, 1.5, 1.5),
      new THREE.ConeGeometry(1, 2, 4)
    ];

    const particleColor = new THREE.Color(colorHex);

    // Sparkles start at the absolute wand tip
    const tipY = totalLengthMm; // Stack height is along the Y axis
    
    for (let i = 0; i < count; i++) {
      const geo = geometries[Math.floor(Math.random() * geometries.length)];
      const mat = new THREE.MeshBasicMaterial({
        color: particleColor,
        transparent: true,
        opacity: 1.0,
      });

      const pMesh = new THREE.Mesh(geo, mat);
      
      // Position at tip of wand (with tiny offset)
      pMesh.position.set(
        (Math.random() - 0.5) * 4,
        tipY + (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      );

      // Add to scene
      sceneRef.current.add(pMesh);

      // Random high-speed explosive velocity
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 3.5,
        (Math.random() * 3) + 1.5, // pointing upwards
        (Math.random() - 0.5) * 3.5
      );

      particlesRef.current.push({
        mesh: pMesh,
        velocity,
        life: 1.0,
        maxLife: 1.0 + Math.random() * 1.5 // 1 to 2.5 seconds
      });
    }
  };

  // --- DOWNLOAD STL FILE ---
  const handleDownloadSTL = () => {
    if (!wandGroupRef.current) return;
    setExporting(true);
    
    // Collect all meshes inside the wand group
    const meshes: THREE.Mesh[] = [];
    wandGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshes.push(child);
      }
    });

    try {
      const stlBuffer = exportToBinarySTL(meshes);
      const blob = new Blob([stlBuffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${wandName.toLowerCase().replace(/\s+/g, '_')}_wand.stl`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export STL", err);
    } finally {
      setTimeout(() => setExporting(false), 500);
    }
  };

  // --- REBUILD WAND GEOMETRIES ---
  const rebuildWand = useCallback((targetConfig: WandConfig) => {
    if (!wandGroupRef.current) return;
    const wandGroup = wandGroupRef.current;
    
    // Clear previous meshes
    while (wandGroup.children.length > 0) {
      const obj = wandGroup.children[0];
      wandGroup.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }

    // --- REBUILD & POSITION PARTS ---
    // Stacking offset along Y axis
    let currentY = 0;

    // Helper to generate materials
    const makeMaterial = (colorHex: string, type: WandConfig['pommelMaterialType']) => {
      const matParams: THREE.MeshStandardMaterialParameters = {
        color: new THREE.Color(colorHex),
        roughness: 0.8,
        metalness: 0.1
      };

      switch (type) {
        case 'metal':
          matParams.metalness = 0.85;
          matParams.roughness = 0.25;
          break;
        case 'crystal':
          matParams.roughness = 0.05;
          matParams.metalness = 0.1;
          matParams.transparent = true;
          matParams.opacity = 0.85;
          break;
        case 'bone':
          matParams.roughness = 0.75;
          matParams.metalness = 0.0;
          break;
        case 'wood':
        default:
          matParams.roughness = 0.85;
          matParams.metalness = 0.1;
          break;
      }
      return new THREE.MeshStandardMaterial(matParams);
    };

    // 1. Pommel
    const pommelGeo = buildPommelGeometry(targetConfig.pommelShape, targetConfig.pommelHeight, targetConfig.pommelWidth);
    const pommelMat = makeMaterial(targetConfig.pommelColor, targetConfig.pommelMaterialType);
    const pommelMesh = new THREE.Mesh(pommelGeo, pommelMat);
    pommelMesh.position.y = currentY;
    pommelMesh.castShadow = true;
    pommelMesh.receiveShadow = true;
    wandGroup.add(pommelMesh);
    
    currentY += targetConfig.pommelHeight - 0.5; // slight overlap to make watertight

    // 2. Grip
    const gripGeo = buildGripGeometry(targetConfig.gripShape, targetConfig.gripHeight, targetConfig.gripWidth, targetConfig.gripDetailsCount);
    const gripMat = makeMaterial(targetConfig.gripColor, targetConfig.gripMaterialType);
    const gripMesh = new THREE.Mesh(gripGeo, gripMat);
    gripMesh.position.y = currentY;
    gripMesh.castShadow = true;
    gripMesh.receiveShadow = true;
    wandGroup.add(gripMesh);
    
    currentY += targetConfig.gripHeight - 1.0; // slight overlap

    // 3. Shaft
    const shaftGeo = buildShaftGeometry(targetConfig.shaftShape, targetConfig.shaftHeight, targetConfig.shaftBaseWidth, targetConfig.shaftTipWidth, targetConfig.shaftDetailsCount);
    const shaftMat = makeMaterial(targetConfig.shaftColor, targetConfig.shaftMaterialType);
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    shaftMesh.position.y = currentY;
    shaftMesh.castShadow = true;
    shaftMesh.receiveShadow = true;
    wandGroup.add(shaftMesh);

    // 3b. Spiral Vine Layer (if active)
    if (targetConfig.shaftShape === 'spiral_vine') {
      const vineMesh = buildVineMesh(
        targetConfig.shaftHeight, 
        targetConfig.shaftBaseWidth / 2, 
        targetConfig.shaftTipWidth / 2, 
        targetConfig.shaftDetailsCount || 3,
        targetConfig.tipColor // Vine wraps using the tip color to contrast beautifully!
      );
      vineMesh.position.y = currentY;
      vineMesh.castShadow = true;
      wandGroup.add(vineMesh);
    }

    currentY += targetConfig.shaftHeight - 1.5; // slight overlap

    // 4. Tip
    const tipGeo = buildTipGeometry(targetConfig.tipShape, targetConfig.tipHeight, targetConfig.tipWidth);
    const tipMat = makeMaterial(targetConfig.tipColor, targetConfig.tipMaterialType);
    const tipMesh = new THREE.Mesh(tipGeo, tipMat);
    tipMesh.position.y = currentY;
    tipMesh.castShadow = true;
    tipMesh.receiveShadow = true;
    wandGroup.add(tipMesh);

    // Position tip glow light at the exact tip end
    if (tipLightRef.current) {
      const totalWandTipY = currentY + targetConfig.tipHeight;
      tipLightRef.current.position.set(0, totalWandTipY + 2, 0);
      tipLightRef.current.color.set(targetConfig.tipColor);
    }

    // Auto-recenter the OrbitControls camera target slightly higher or lower based on length
    const overallLengthMm = targetConfig.pommelHeight + targetConfig.gripHeight + targetConfig.shaftHeight + targetConfig.tipHeight;
    if (controlsRef.current) {
      controlsRef.current.target.set(0, overallLengthMm / 2, 0);
    }
  }, []);

  // --- SETUP THREE.JS STUDIO ---
  useEffect(() => {
    if (!mountRef.current) return;

    // Clear any existing children to prevent duplicate canvases
    mountRef.current.innerHTML = '';

    // Dimensions
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 450;

    // Create Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Deep starry workspace backdrop color
    scene.background = null; // transparent background so we can use dynamic CSS gradients!

    // Create Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 150, 450); // Look at the wand from a cozy distance
    cameraRef.current = camera;

    // Create Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 100;
    controls.maxDistance = 600;
    controls.target.set(0, 140, 0); // Focus around the middle of the wand
    controlsRef.current = controls;

    // Add Lights
    const ambientLight = new THREE.AmbientLight(0x403b66, 2.5); // Rich soft purple ambient fill
    scene.add(ambientLight);

    // Bright golden spot focus
    const keyLight = new THREE.DirectionalLight(0xfff3cc, 3.5);
    keyLight.position.set(100, 200, 150);
    scene.add(keyLight);

    // Magical blue rim light from opposite side
    const fillLight = new THREE.DirectionalLight(0x8bc3eb, 3.0);
    fillLight.position.set(-100, 100, -150);
    scene.add(fillLight);

    // Glowing tip point light (simulates a shining magic focus core)
    const tipLight = new THREE.PointLight(0xff69b4, 0, 100);
    scene.add(tipLight);
    tipLightRef.current = tipLight;

    // Wand Group
    const wandGroup = new THREE.Group();
    scene.add(wandGroup);
    wandGroupRef.current = wandGroup;

    // Ground Grid to place the wand in a workshop
    const gridHelper = new THREE.GridHelper(200, 20, 0x5a5394, 0x25223e);
    gridHelper.position.y = -5;
    scene.add(gridHelper);

    // Ambient stars in the 3D scene
    const starCount = 150;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 1000;
      starPos[i + 1] = Math.random() * 500 - 50;
      starPos[i + 2] = (Math.random() - 0.5) * 1000;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xda70d6,
      size: 1.5,
      transparent: true,
      opacity: 0.6
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Slow elegant spin of the wand group (if not user dragging)
      if (wandGroup) {
        wandGroup.rotation.y += 0.004;
      }

      // Pulse tip light if active, reading from refs to bypass closure stale state
      if (tipLightRef.current) {
        if (isLumosActiveRef.current) {
          tipLightRef.current.intensity = 15 + Math.sin(clock.getElapsedTime() * 12) * 4;
        } else if (activeSpellRef.current) {
          // Spell active, fade out light over time
          tipLightRef.current.intensity = Math.max(0, tipLightRef.current.intensity - delta * 20);
        } else {
          tipLightRef.current.intensity = 0.5 + Math.sin(clock.getElapsedTime() * 2) * 0.3; // tiny idling spark
        }
      }

      // Update active particles
      const activeParticles = particlesRef.current;
      for (let i = activeParticles.length - 1; i >= 0; i--) {
        const p = activeParticles[i];
        p.mesh.position.add(p.velocity);
        // apply slight gravity
        p.velocity.y -= delta * 0.5;
        // shrink size and fade
        p.life -= delta;

        if (p.life <= 0) {
          scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          if (Array.isArray(p.mesh.material)) {
            p.mesh.material.forEach(m => m.dispose());
          } else {
            p.mesh.material.dispose();
          }
          activeParticles.splice(i, 1);
        } else {
          // update scaling based on remaining life ratio
          const scale = p.life / p.maxLife;
          p.mesh.scale.set(scale, scale, scale);
          if (p.mesh.material instanceof THREE.Material) {
            p.mesh.material.opacity = scale;
          }
        }
      }

      // Slowly float stars
      starPoints.rotation.y += 0.0005;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // --- RESIZE OBSERVER ---
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      window.requestAnimationFrame(() => {
        if (!entries || entries.length === 0 || !mountRef.current) return;
        const entry = entries[0];
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height || 450;
        
        if (rendererRef.current && cameraRef.current) {
          cameraRef.current.aspect = newWidth / newHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newWidth, newHeight);
        }
      });
    });
    resizeObserver.observe(mountRef.current);

    // Immediately trigger initial wand building!
    rebuildWand(config);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [rebuildWand]);

  // --- REBUILD WAND GEOMETRIES live on config change ---
  useEffect(() => {
    rebuildWand(config);
  }, [config, totalLengthMm, rebuildWand]);

  // Handler to update specific config properties safely
  const updateConfig = (key: keyof WandConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div id="wizard-studio" className="min-h-screen bg-gradient-to-br from-[#09070f] via-[#120f24] to-[#07050d] text-gray-200 font-sans flex flex-col antialiased selection:bg-purple-600 selection:text-white pb-6 relative overflow-hidden">
      
      {/* Decorative stars / magical ambient background glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40 z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-700/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-purple-900/15 rounded-full blur-[150px]"></div>
      </div>

      {/* HEADER */}
      <header id="app-header" className="relative z-10 border-b border-purple-950/40 bg-purple-950/10 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-400 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-purple-950/50 animate-pulse">
            <Wand2 className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-amber-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent tracking-wide">
              WandCraft 3D Studio
            </h1>
            <p className="text-xs text-purple-300/80 font-medium">Magic Wand Creation for 3D Printing & Kids</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            id="sound-toggle"
            onClick={() => { setSoundEnabled(!soundEnabled); playMagicSound('click'); }}
            className={`p-2 rounded-lg border transition-all ${soundEnabled ? 'bg-purple-950/40 border-purple-500/30 text-amber-300' : 'bg-slate-900/40 border-slate-800 text-gray-500'}`}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Randomize button */}
          <button
            id="btn-randomize"
            onClick={handleRandomize}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 active:scale-95 text-xs font-bold px-4 py-2 rounded-lg border border-purple-500/30 shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
          >
            <Dice5 className="w-4 h-4 text-purple-200 animate-spin-slow" />
            Randomize Wand!
          </button>
        </div>
      </header>

      {/* MAIN CONTENT WORKSPACE */}
      <main id="app-workspace" className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 relative z-10">
        
        {/* LEFT COLUMN: CUSTOMIZATION SIDEBAR */}
        <section id="customizer-panel" className="lg:col-span-5 bg-[#120f21]/85 border border-purple-900/30 rounded-2xl p-5 shadow-2xl backdrop-blur-xl flex flex-col max-h-[calc(100vh-140px)] overflow-y-auto">
          
          {/* Wand Name field */}
          <div className="mb-5 bg-purple-950/20 border border-purple-900/40 rounded-xl p-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-300/80 mb-1.5 flex items-center gap-1.5">
              <span>🪄 Wand Certificate Name:</span>
            </label>
            <input
              id="input-wand-name"
              type="text"
              value={wandName}
              onChange={(e) => setWandName(e.target.value.slice(0, 32))}
              className="w-full bg-black/40 border border-purple-900/50 rounded-lg px-3 py-2 text-sm text-gray-100 font-bold tracking-wide focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              placeholder="E.g. Star-Weaver"
            />
          </div>

          {/* SIDEBAR TABS */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 mb-5 bg-black/30 p-1 rounded-xl border border-purple-950/60 text-center">
            {[
              { id: 'presets', label: 'Presets', icon: Sparkles },
              { id: 'pommel', label: 'Pommel', icon: Layers },
              { id: 'grip', label: 'Grip', icon: Sliders },
              { id: 'shaft', label: 'Shaft', icon: Wand2 },
              { id: 'tip', label: 'Tip', icon: Flame },
              { id: 'wood-core', label: 'Magics', icon: Heart }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  id={`tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); playMagicSound('click'); }}
                  className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-all ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-b from-purple-700 to-indigo-900 text-amber-300 shadow-md shadow-black/50 border border-purple-400/20' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-purple-950/20'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mb-1" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT */}
          <div className="flex-1">
            
            {/* 1. CHARACTER PRESETS */}
            {activeTab === 'presets' && (
              <div id="tab-content-presets" className="space-y-4 animate-fade-in">
                <div className="bg-purple-950/20 rounded-xl p-3 border border-purple-900/30 mb-2">
                  <h3 className="text-xs font-extrabold text-amber-300 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> Character Wands
                  </h3>
                  <p className="text-xs text-gray-300">Choose a preset from your favorite wizard or witch as a base, then feel free to customize it!</p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {Object.entries(CHARACTERS_PRESETS).map(([key, item]) => (
                    <button
                      id={`preset-${key}`}
                      key={key}
                      onClick={() => loadPreset(key)}
                      className="text-left w-full bg-gradient-to-r from-purple-950/15 to-purple-900/5 hover:from-purple-900/35 hover:to-indigo-900/20 border border-purple-900/30 hover:border-purple-500/40 rounded-xl p-3 flex items-center justify-between transition-all group"
                    >
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-amber-200 group-hover:text-amber-300 transition-colors">
                            {item.name}
                          </span>
                          <span className="text-[10px] bg-purple-950 px-2 py-0.5 rounded-full text-purple-300 font-bold uppercase tracking-wider">
                            {item.wandInfo.wood}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400/90 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="text-[10px] text-amber-300/70 mt-1.5 italic">
                          🪄 {item.wandInfo.length}”, {item.wandInfo.core} Core, {item.wandInfo.flexibility}
                        </div>
                      </div>
                      <div className="bg-purple-950/80 p-2.5 rounded-xl border border-purple-800/50 text-amber-300 text-lg group-hover:scale-110 transition-all">
                        {key === 'harry' && '⚡'}
                        {key === 'hermione' && '📚'}
                        {key === 'dumbledore' && '👑'}
                        {key === 'voldemort' && '💀'}
                        {key === 'ron' && '🍗'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. POMMEL (BOTTOM CAP) */}
            {activeTab === 'pommel' && (
              <div id="tab-content-pommel" className="space-y-5 animate-fade-in">
                {/* Shape select */}
                <div>
                  <label className="block text-xs font-extrabold text-amber-300 uppercase tracking-widest mb-3">Pommel Design Shape</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'sphere', name: 'Sphere', desc: 'Rounded ball bottom', icon: '🔴' },
                      { id: 'flat', name: 'Flat Cap', desc: 'Sleek cylindrical base', icon: '🪙' },
                      { id: 'crystal', name: 'Crystal', desc: 'Faceted hexagonal gemstone', icon: '💎' },
                      { id: 'crown', name: 'Royal Crown', desc: 'Spired gold crown bottom', icon: '👑' },
                      { id: 'egg', name: 'Dragon Egg', desc: 'Oval magical egg shape', icon: '🥚' },
                      { id: 'claw', name: 'Beak Claw', desc: 'Hook yew claw bottom', icon: '🦅' }
                    ].map((shape) => (
                      <button
                        id={`pommel-shape-${shape.id}`}
                        key={shape.id}
                        onClick={() => { updateConfig('pommelShape', shape.id); playMagicSound('click'); }}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                          config.pommelShape === shape.id
                            ? 'bg-purple-800/40 border-amber-400 text-amber-300 shadow-md shadow-purple-950'
                            : 'bg-black/20 border-purple-950 hover:border-purple-800 hover:bg-black/35 text-gray-300'
                        }`}
                      >
                        <span className="text-xl mb-1.5">{shape.icon}</span>
                        <span className="text-xs font-bold leading-tight">{shape.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SLIDERS */}
                <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-purple-950/50">
                  <h4 className="text-xs font-extrabold uppercase text-purple-300 tracking-wider">Size Customizer</h4>
                  
                  {/* Pommel Height */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-gray-300">Pommel Length (Height):</span>
                      <span className="text-amber-300 font-black">{config.pommelHeight} mm</span>
                    </div>
                    <input
                      id="pommel-height-slider"
                      type="range"
                      min="10"
                      max="35"
                      value={config.pommelHeight}
                      onChange={(e) => updateConfig('pommelHeight', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Pommel Width */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-gray-300">Pommel Thickness (Width):</span>
                      <span className="text-amber-300 font-black">{config.pommelWidth} mm</span>
                    </div>
                    <input
                      id="pommel-width-slider"
                      type="range"
                      min="10"
                      max="26"
                      value={config.pommelWidth}
                      onChange={(e) => updateConfig('pommelWidth', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                </div>

                {/* Pommel Filament Colors & Material Type */}
                <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-purple-950/50">
                  <h4 className="text-xs font-extrabold uppercase text-purple-300 tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-300" /> Color / Filament Style
                  </h4>

                  {/* Filament palette list */}
                  <div className="grid grid-cols-6 gap-2">
                    {FILAMENT_COLORS.map((col) => (
                      <button
                        id={`pommel-color-${col.name.replace(/\s+/g, '-')}`}
                        key={col.name}
                        onClick={() => { updateConfig('pommelColor', col.hex); playMagicSound('click'); }}
                        className={`w-8 h-8 rounded-full border-2 relative group flex items-center justify-center ${
                          config.pommelColor === col.hex ? 'border-amber-400 scale-110 shadow-lg' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      >
                        {config.pommelColor === col.hex && (
                          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
                        )}
                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-[9px] bg-black text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                          {col.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Material type select */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-2">Material Polish Finish:</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {['wood', 'metal', 'crystal', 'bone'].map((type) => (
                        <button
                          id={`pommel-material-${type}`}
                          key={type}
                          onClick={() => { updateConfig('pommelMaterialType', type); playMagicSound('click'); }}
                          className={`text-[10px] font-extrabold py-1 rounded-md border text-center uppercase tracking-wide transition-all ${
                            config.pommelMaterialType === type
                              ? 'bg-purple-900 border-purple-400 text-purple-200'
                              : 'bg-black/40 border-purple-950/80 text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. GRIP (HANDLE) */}
            {activeTab === 'grip' && (
              <div id="tab-content-grip" className="space-y-5 animate-fade-in">
                {/* Shape select */}
                <div>
                  <label className="block text-xs font-extrabold text-amber-300 uppercase tracking-widest mb-3">Grip Handle Shape</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'smooth', name: 'Smooth', desc: 'Classic wooden cylinder', icon: '🪵' },
                      { id: 'ribbed', name: 'Ribbed', desc: 'Segmented horizontal rings', icon: '🌀' },
                      { id: 'spiral', name: 'Helix Twist', desc: 'Spiraled textured grooves', icon: '🌪️' },
                      { id: 'elder', name: 'Elder Berries', desc: 'Bulbous beads connected by bands', icon: '📿' },
                      { id: 'ergonomic', name: 'Hourglass', desc: 'Waved ergonomic grip', icon: '⌛' }
                    ].map((shape) => (
                      <button
                        id={`grip-shape-${shape.id}`}
                        key={shape.id}
                        onClick={() => { updateConfig('gripShape', shape.id); playMagicSound('click'); }}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                          config.gripShape === shape.id
                            ? 'bg-purple-800/40 border-amber-400 text-amber-300 shadow-md shadow-purple-950'
                            : 'bg-black/20 border-purple-950 hover:border-purple-800 hover:bg-black/35 text-gray-300'
                        }`}
                      >
                        <span className="text-xl mb-1.5">{shape.icon}</span>
                        <span className="text-xs font-bold leading-tight">{shape.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SLIDERS */}
                <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-purple-950/50">
                  <h4 className="text-xs font-extrabold uppercase text-purple-300 tracking-wider">Grip Sizing Sliders</h4>
                  
                  {/* Grip Height */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-gray-300">Grip Length:</span>
                      <span className="text-amber-300 font-black">{config.gripHeight} mm</span>
                    </div>
                    <input
                      id="grip-height-slider"
                      type="range"
                      min="60"
                      max="120"
                      value={config.gripHeight}
                      onChange={(e) => updateConfig('gripHeight', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Grip Width */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-gray-300">Grip Thickness (Width):</span>
                      <span className="text-amber-300 font-black">{config.gripWidth} mm</span>
                    </div>
                    <input
                      id="grip-width-slider"
                      type="range"
                      min="10"
                      max="22"
                      value={config.gripWidth}
                      onChange={(e) => updateConfig('gripWidth', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Grip Details Count (e.g. spiral threads or rib count) */}
                  {config.gripShape !== 'smooth' && config.gripShape !== 'ergonomic' && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold text-gray-300">
                          {config.gripShape === 'ribbed' && 'Number of Ribs (Undulations):'}
                          {config.gripShape === 'spiral' && 'Twist Grooves Speed:'}
                          {config.gripShape === 'elder' && 'Elder Berry Bulb Count:'}
                        </span>
                        <span className="text-amber-300 font-black">{config.gripDetailsCount}</span>
                      </div>
                      <input
                        id="grip-details-slider"
                        type="range"
                        min={config.gripShape === 'elder' ? '2' : '3'}
                        max={config.gripShape === 'elder' ? '5' : '10'}
                        value={config.gripDetailsCount}
                        onChange={(e) => updateConfig('gripDetailsCount', parseInt(e.target.value))}
                        className="w-full h-1.5 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                    </div>
                  )}
                </div>

                {/* Grip Colors */}
                <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-purple-950/50">
                  <h4 className="text-xs font-extrabold uppercase text-purple-300 tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-300" /> Grip PLA Filament Color
                  </h4>

                  <div className="grid grid-cols-6 gap-2">
                    {FILAMENT_COLORS.map((col) => (
                      <button
                        id={`grip-color-${col.name.replace(/\s+/g, '-')}`}
                        key={col.name}
                        onClick={() => { updateConfig('gripColor', col.hex); playMagicSound('click'); }}
                        className={`w-8 h-8 rounded-full border-2 relative group flex items-center justify-center ${
                          config.gripColor === col.hex ? 'border-amber-400 scale-110 shadow-lg' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      >
                        {config.gripColor === col.hex && (
                          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
                        )}
                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-[9px] bg-black text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                          {col.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Material type select */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-2">Material Finish Polish:</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {['wood', 'metal', 'crystal', 'bone'].map((type) => (
                        <button
                          id={`grip-material-${type}`}
                          key={type}
                          onClick={() => { updateConfig('gripMaterialType', type); playMagicSound('click'); }}
                          className={`text-[10px] font-extrabold py-1 rounded-md border text-center uppercase tracking-wide transition-all ${
                            config.gripMaterialType === type
                              ? 'bg-purple-900 border-purple-400 text-purple-200'
                              : 'bg-black/40 border-purple-950/80 text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. SHAFT (WAND CORE) */}
            {activeTab === 'shaft' && (
              <div id="tab-content-shaft" className="space-y-5 animate-fade-in">
                {/* Shape select */}
                <div>
                  <label className="block text-xs font-extrabold text-amber-300 uppercase tracking-widest mb-3">Wand Shaft Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'smooth', name: 'Smooth Taper', desc: 'Simple sleek tapered wand', icon: '🪄' },
                      { id: 'segmented', name: 'Segmented', desc: 'Beaded telescoping joints', icon: '🎋' },
                      { id: 'spiral_vine', name: 'Ivy Spiral', desc: 'Beautiful spiral wrapped vine', icon: '🌿' },
                      { id: 'organic', name: 'Rough Bark', desc: 'Gnarled tree-branch nodes', icon: '🪵' },
                      { id: 'fluted', name: 'Fluted Column', desc: 'Classic structural vertical slots', icon: '🏛️' }
                    ].map((shape) => (
                      <button
                        id={`shaft-shape-${shape.id}`}
                        key={shape.id}
                        onClick={() => { updateConfig('shaftShape', shape.id); playMagicSound('click'); }}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                          config.shaftShape === shape.id
                            ? 'bg-purple-800/40 border-amber-400 text-amber-300 shadow-md shadow-purple-950'
                            : 'bg-black/20 border-purple-950 hover:border-purple-800 hover:bg-black/35 text-gray-300'
                        }`}
                      >
                        <span className="text-xl mb-1.5">{shape.icon}</span>
                        <span className="text-xs font-bold leading-tight">{shape.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SLIDERS */}
                <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-purple-950/50">
                  <h4 className="text-xs font-extrabold uppercase text-purple-300 tracking-wider">Shaft Dimensioning</h4>
                  
                  {/* Shaft Height */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-gray-300">Shaft Length:</span>
                      <span className="text-amber-300 font-black">{config.shaftHeight} mm</span>
                    </div>
                    <input
                      id="shaft-height-slider"
                      type="range"
                      min="120"
                      max="250"
                      value={config.shaftHeight}
                      onChange={(e) => updateConfig('shaftHeight', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Shaft Base Width */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-gray-300">Shaft Base Thickness:</span>
                      <span className="text-amber-300 font-black">{config.shaftBaseWidth} mm</span>
                    </div>
                    <input
                      id="shaft-base-slider"
                      type="range"
                      min="9"
                      max="16"
                      value={config.shaftBaseWidth}
                      onChange={(e) => updateConfig('shaftBaseWidth', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Shaft Tip Width */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-gray-300">Shaft Tip Thickness:</span>
                      <span className="text-amber-300 font-black">{config.shaftTipWidth} mm</span>
                    </div>
                    <input
                      id="shaft-tip-slider"
                      type="range"
                      min="4"
                      max="9"
                      value={config.shaftTipWidth}
                      onChange={(e) => updateConfig('shaftTipWidth', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Details (Twists or Ridges) */}
                  {(config.shaftShape === 'segmented' || config.shaftShape === 'spiral_vine' || config.shaftShape === 'fluted') && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold text-gray-300">
                          {config.shaftShape === 'segmented' && 'Joint Segment Count:'}
                          {config.shaftShape === 'spiral_vine' && 'Ivy Vine Wrapping Twists:'}
                          {config.shaftShape === 'fluted' && 'Vertical Column Ridges:'}
                        </span>
                        <span className="text-amber-300 font-black">{config.shaftDetailsCount}</span>
                      </div>
                      <input
                        id="shaft-details-slider"
                        type="range"
                        min="2"
                        max="8"
                        value={config.shaftDetailsCount}
                        onChange={(e) => updateConfig('shaftDetailsCount', parseInt(e.target.value))}
                        className="w-full h-1.5 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                    </div>
                  )}
                </div>

                {/* Shaft Colors */}
                <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-purple-950/50">
                  <h4 className="text-xs font-extrabold uppercase text-purple-300 tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-300" /> Shaft PLA Filament Color
                  </h4>

                  <div className="grid grid-cols-6 gap-2">
                    {FILAMENT_COLORS.map((col) => (
                      <button
                        id={`shaft-color-${col.name.replace(/\s+/g, '-')}`}
                        key={col.name}
                        onClick={() => { updateConfig('shaftColor', col.hex); playMagicSound('click'); }}
                        className={`w-8 h-8 rounded-full border-2 relative group flex items-center justify-center ${
                          config.shaftColor === col.hex ? 'border-amber-400 scale-110 shadow-lg' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      >
                        {config.shaftColor === col.hex && (
                          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
                        )}
                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-[9px] bg-black text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                          {col.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Material */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-2">Material Finish Polish:</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {['wood', 'metal', 'crystal', 'bone'].map((type) => (
                        <button
                          id={`shaft-material-${type}`}
                          key={type}
                          onClick={() => { updateConfig('shaftMaterialType', type); playMagicSound('click'); }}
                          className={`text-[10px] font-extrabold py-1 rounded-md border text-center uppercase tracking-wide transition-all ${
                            config.shaftMaterialType === type
                              ? 'bg-purple-900 border-purple-400 text-purple-200'
                              : 'bg-black/40 border-purple-950/80 text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. TIP (FOCUS POINT) */}
            {activeTab === 'tip' && (
              <div id="tab-content-tip" className="space-y-5 animate-fade-in">
                {/* Shape select */}
                <div>
                  <label className="block text-xs font-extrabold text-amber-300 uppercase tracking-widest mb-3">Wand Core Tip Shape</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'rounded', name: 'Rounded Cap', desc: 'Standard smooth round end', icon: '🟢' },
                      { id: 'pointed', name: 'Wizard Point', desc: 'Elegant tapered needle point', icon: '📐' },
                      { id: 'crystal', name: 'Prism Gem', desc: 'Prismatic crystal tip', icon: '🔮' },
                      { id: 'orb_claw', name: 'Magic Orb', desc: 'Magic floating crystal sphere', icon: '🪐' },
                      { id: 'flame', name: 'Wavy Flame', desc: 'Spiraled swirling fire tip', icon: '🔥' }
                    ].map((shape) => (
                      <button
                        id={`tip-shape-${shape.id}`}
                        key={shape.id}
                        onClick={() => { updateConfig('tipShape', shape.id); playMagicSound('click'); }}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                          config.tipShape === shape.id
                            ? 'bg-purple-800/40 border-amber-400 text-amber-300 shadow-md shadow-purple-950'
                            : 'bg-black/20 border-purple-950 hover:border-purple-800 hover:bg-black/35 text-gray-300'
                        }`}
                      >
                        <span className="text-xl mb-1.5">{shape.icon}</span>
                        <span className="text-xs font-bold leading-tight">{shape.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SLIDERS */}
                <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-purple-950/50">
                  <h4 className="text-xs font-extrabold uppercase text-purple-300 tracking-wider">Tip Sizing</h4>
                  
                  {/* Tip Height */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-gray-300">Tip Length (Height):</span>
                      <span className="text-amber-300 font-black">{config.tipHeight} mm</span>
                    </div>
                    <input
                      id="tip-height-slider"
                      type="range"
                      min="10"
                      max="45"
                      value={config.tipHeight}
                      onChange={(e) => updateConfig('tipHeight', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Tip Width */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-gray-300">Tip Thickness (Width):</span>
                      <span className="text-amber-300 font-black">{config.tipWidth} mm</span>
                    </div>
                    <input
                      id="tip-width-slider"
                      type="range"
                      min="3"
                      max="12"
                      value={config.tipWidth}
                      onChange={(e) => updateConfig('tipWidth', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                </div>

                {/* Tip Colors */}
                <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-purple-950/50">
                  <h4 className="text-xs font-extrabold uppercase text-purple-300 tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-300" /> Focus Tip Filament Color
                  </h4>

                  <div className="grid grid-cols-6 gap-2">
                    {FILAMENT_COLORS.map((col) => (
                      <button
                        id={`tip-color-${col.name.replace(/\s+/g, '-')}`}
                        key={col.name}
                        onClick={() => { updateConfig('tipColor', col.hex); playMagicSound('click'); }}
                        className={`w-8 h-8 rounded-full border-2 relative group flex items-center justify-center ${
                          config.tipColor === col.hex ? 'border-amber-400 scale-110 shadow-lg' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      >
                        {config.tipColor === col.hex && (
                          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
                        )}
                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-[9px] bg-black text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                          {col.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Material */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-2">Material Finish Polish:</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {['wood', 'metal', 'crystal', 'bone'].map((type) => (
                        <button
                          id={`tip-material-${type}`}
                          key={type}
                          onClick={() => { updateConfig('tipMaterialType', type); playMagicSound('click'); }}
                          className={`text-[10px] font-extrabold py-1 rounded-md border text-center uppercase tracking-wide transition-all ${
                            config.tipMaterialType === type
                              ? 'bg-purple-900 border-purple-400 text-purple-200'
                              : 'bg-black/40 border-purple-950/80 text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. MAGICS & CORES */}
            {activeTab === 'wood-core' && (
              <div id="tab-content-magics" className="space-y-4 animate-fade-in">
                {/* Wood selection */}
                <div className="bg-black/20 p-4 rounded-xl border border-purple-950/50">
                  <label className="block text-xs font-extrabold text-amber-300 uppercase tracking-widest mb-3">Ancient Wood Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {WOOD_TYPES.map((wood) => (
                      <button
                        id={`wood-type-${wood.name.replace(/\s+/g, '-')}`}
                        key={wood.name}
                        onClick={() => { setSelectedWood(wood.name); playMagicSound('click'); }}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                          selectedWood === wood.name
                            ? 'bg-purple-850 border-amber-400 text-amber-300'
                            : 'bg-black/15 border-purple-950 hover:border-purple-900 text-gray-300'
                        }`}
                      >
                        <span className="text-xs font-extrabold">{wood.name}</span>
                        <span className="text-[9px] text-gray-400 leading-tight mt-1 line-clamp-1">{wood.name === 'Elder' ? 'Ancient' : 'Premium'}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-purple-300/80 mt-2.5 italic">
                    💡 Wood Texture: {WOOD_TYPES.find(w => w.name === selectedWood)?.texture}
                  </p>
                </div>

                {/* Magical cores selection */}
                <div className="bg-black/20 p-4 rounded-xl border border-purple-950/50">
                  <label className="block text-xs font-extrabold text-amber-300 uppercase tracking-widest mb-3">Magical Wand Core</label>
                  <div className="grid grid-cols-1 gap-2">
                    {MAGICAL_CORES.map((core) => (
                      <button
                        id={`core-type-${core.id}`}
                        key={core.id}
                        onClick={() => { setSelectedCore(core.id); playMagicSound('click'); }}
                        className={`p-2.5 rounded-xl border flex items-center gap-3 transition-all text-left ${
                          selectedCore === core.id
                            ? 'bg-purple-850 border-amber-400 text-amber-300'
                            : 'bg-black/15 border-purple-950 hover:border-purple-900 text-gray-300'
                        }`}
                      >
                        <span className="text-2xl bg-purple-950/50 p-1.5 rounded-lg border border-purple-900/30">{core.icon}</span>
                        <div>
                          <div className="text-xs font-extrabold tracking-wide">{core.name} Core</div>
                          <div className="text-[10px] text-gray-400 leading-tight mt-0.5">{core.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

        </section>

        {/* RIGHT COLUMN: INTERACTIVE WORKSHOP PREVIEW */}
        <section id="workshop-panel" className="lg:col-span-7 flex flex-col gap-5 h-full">
          
          {/* TOP WAND SPEC / STATS BAR */}
          <div id="wand-spec-bar" className="bg-[#120f21]/80 border border-purple-900/30 rounded-2xl p-4 shadow-xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪄</span>
              <div>
                <h2 className="text-sm font-black text-amber-300 tracking-wide flex items-center gap-1.5">
                  {wandName || 'Unnamed Wand'}
                </h2>
                <div className="text-[10.5px] text-gray-400 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="font-bold text-purple-300">{selectedWood} wood</span>
                  <span className="text-gray-600">•</span>
                  <span className="font-bold text-amber-200">{MAGICAL_CORES.find(c => c.id === selectedCore)?.name}</span>
                  <span className="text-gray-600">•</span>
                  <span className="font-bold text-indigo-300">{lengthInches} inches</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-black text-indigo-400 tracking-wider">Flexibility bond</div>
              <div className="text-xs font-black text-gray-200">{getFlexibility()}</div>
            </div>
          </div>

          {/* 3D WORKSHOP STAGE */}
          <div id="threejs-container-card" className="relative bg-gradient-to-b from-[#130d29] to-[#0a0618] border border-purple-900/40 rounded-3xl overflow-hidden shadow-2xl flex-1 flex flex-col min-h-[400px]">
            
            {/* Interactive spell notification overlay */}
            {activeSpell && (
              <div id="spell-notification" className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-sm bg-purple-950/90 border-2 border-purple-400/40 rounded-2xl p-3 shadow-2xl shadow-purple-950/80 backdrop-blur-md flex items-start gap-3 animate-bounce">
                <span className="text-3xl mt-0.5 animate-pulse">✨</span>
                <div>
                  <h3 className="text-sm font-black text-amber-300 tracking-wide">
                    Casting <span style={{ color: activeSpell.color }} className="underline decoration-2">{activeSpell.name}</span>
                  </h3>
                  <p className="text-xs text-gray-300/95 mt-1 leading-relaxed">
                    {activeSpell.desc}
                  </p>
                </div>
              </div>
            )}

            {/* 3D Canvas Mount Point */}
            <div 
              id="threejs-canvas-mount"
              ref={mountRef} 
              className="w-full flex-1 cursor-grab active:cursor-grabbing relative"
            >
              {/* Starry Ambient Sparkles Overlay */}
              <div className="absolute inset-0 bg-transparent pointer-events-none">
                <div className="absolute top-4 left-4 bg-purple-950/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-purple-900/30 text-[10px] text-purple-300 font-bold flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                  Drag with mouse to rotate wand in 3D!
                </div>
              </div>
            </div>

            {/* CONTROL PANEL BUTTONS */}
            <div id="interactive-button-bar" className="p-4 bg-purple-950/25 border-t border-purple-900/40 flex flex-wrap gap-2.5 items-center justify-between">
              
              <button
                id="btn-cast-spell"
                onClick={handleCastSpell}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:from-amber-300 hover:via-pink-400 hover:to-purple-500 active:scale-95 text-slate-900 text-xs font-black px-5 py-3 rounded-xl shadow-lg shadow-pink-950/40 transition-all uppercase tracking-wider cursor-pointer"
              >
                <Sparkles className="w-4 h-4 animate-bounce" />
                🪄 Cast Magic Spell!
              </button>

              <div className="flex gap-2">
                {/* Print Wand Certificate */}
                <button
                  id="btn-show-certificate"
                  onClick={() => { setShowCertificate(true); playMagicSound('presets'); }}
                  className="flex items-center gap-2 bg-purple-950/50 hover:bg-purple-900/50 border border-purple-800/40 text-xs font-bold px-4 py-3 rounded-xl hover:text-amber-300 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-purple-300" />
                  Print Certificate
                </button>

                {/* STL Export Button */}
                <button
                  id="btn-download-stl"
                  onClick={handleDownloadSTL}
                  disabled={exporting}
                  className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#eac551] active:scale-95 text-slate-900 text-xs font-black px-5 py-3 rounded-xl shadow-lg shadow-amber-950/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {exporting ? 'Creating STL...' : 'Download 3D STL Print'}
                </button>
              </div>

            </div>
          </div>

          {/* 3D PRINTING WORKSHOP GUIDE */}
          <div id="printing-guide-card" className="bg-[#120f21]/80 border border-purple-900/30 rounded-2xl p-4 shadow-xl backdrop-blur-xl">
            <h3 className="text-xs font-extrabold text-amber-300 uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-400 animate-pulse" /> Kid-Friendly 3D Printing Guide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-gray-300 leading-relaxed">
              <div className="bg-black/20 p-2.5 rounded-lg border border-purple-950/40">
                <span className="font-extrabold text-indigo-300 block mb-1">1. Choose Cool Filament 🌈</span>
                Use <strong className="text-amber-200">Silk PLA</strong> for a shiny metallic look, or <strong className="text-amber-200">Wood PLA</strong> for a realistic hand-carved finish!
              </div>
              <div className="bg-black/20 p-2.5 rounded-lg border border-purple-950/40">
                <span className="font-extrabold text-indigo-300 block mb-1">2. Print Upright with a Brim 🚀</span>
                Wands print best standing straight up. Make sure to enable a <strong className="text-amber-200">Brim</strong> in your slicer so it doesn't fall over!
              </div>
              <div className="bg-black/20 p-2.5 rounded-lg border border-purple-950/40">
                <span className="font-extrabold text-indigo-300 block mb-1">3. Infill & Durability 🛡️</span>
                We recommend <strong className="text-amber-200">100% infill</strong> or 4 wall loops so your wand is extra strong and ready to duel!
              </div>
            </div>
          </div>

        </section>
      </main>

      {/* FOOTER */}
      <footer id="app-footer" className="mt-8 text-center text-xs text-purple-300/40 font-bold border-t border-purple-950/30 pt-6 relative z-10">
        <p>🪄 WandCraft Studio • Designed for wizards, witches, and makers everywhere • Built using 3D WebGL</p>
      </footer>

      {/* --- PRINTABLE CERTIFICATE MODAL --- */}
      {showCertificate && (
        <div id="certificate-modal-overlay" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div id="certificate-card" className="bg-[#f7f2e5] text-[#2b2210] border-[12px] border-[#8b5a2b] rounded-2xl p-6 md:p-10 max-w-2xl w-full shadow-2xl relative select-none font-serif md:my-6 print:m-0 print:border-none print:shadow-none print:p-0">
            
            {/* Ancient parchment corner decorative lines */}
            <div className="absolute top-2 left-2 right-2 bottom-2 border border-dashed border-[#8b5a2b]/30 pointer-events-none rounded-lg"></div>

            {/* Close Button (Hidden in Print) */}
            <button
              id="btn-close-certificate"
              onClick={() => { setShowCertificate(false); playMagicSound('click'); }}
              className="absolute top-4 right-4 bg-amber-950/10 hover:bg-amber-950/25 p-2 rounded-full border border-amber-950/20 text-[#5c4033] font-sans font-bold text-xs transition-all cursor-pointer print:hidden"
            >
              ✕ Close
            </button>

            {/* Certificate Header */}
            <div className="text-center mb-8">
              <span className="text-5xl block mb-2 font-sans">🪄</span>
              <h2 className="text-3xl font-black tracking-wider uppercase text-[#3e2713] font-serif border-b-2 border-double border-[#8b5a2b]/50 pb-2">
                Ollivanders Wand Registry
              </h2>
              <p className="text-xs uppercase font-extrabold font-sans tracking-widest text-[#8b5a2b]/80 mt-2">
                Makers of Fine Wands since 382 B.C.
              </p>
            </div>

            {/* Certificate Body */}
            <div className="space-y-6 text-center">
              <p className="text-sm italic font-sans text-gray-600">
                This is to certify and officially register the creation of the magical focus rod:
              </p>

              <h3 className="text-4xl font-extrabold tracking-wide text-[#5c4033] underline decoration-double decoration-[#8b5a2b]/30 py-1.5 my-4">
                {wandName || 'The Unnamed Wand'}
              </h3>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto py-4 bg-amber-950/5 border border-[#8b5a2b]/20 rounded-xl px-4 text-left font-sans text-xs">
                <div>
                  <span className="font-extrabold uppercase text-[#8b5a2b] block">Wood Selection:</span>
                  <strong className="text-sm text-[#4a3319]">{selectedWood} Wood</strong>
                  <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">
                    {WOOD_TYPES.find(w => w.name === selectedWood)?.texture}
                  </span>
                </div>
                <div>
                  <span className="font-extrabold uppercase text-[#8b5a2b] block">Magical Core:</span>
                  <strong className="text-sm text-[#4a3319]">
                    {MAGICAL_CORES.find(c => c.id === selectedCore)?.name}
                  </strong>
                  <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">
                    {MAGICAL_CORES.find(c => c.id === selectedCore)?.description}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#8b5a2b]/10">
                  <span className="font-extrabold uppercase text-[#8b5a2b] block">Physical Length:</span>
                  <strong className="text-sm text-[#4a3319]">{lengthInches} Inches ({totalLengthMm} mm)</strong>
                </div>
                <div className="pt-2 border-t border-[#8b5a2b]/10">
                  <span className="font-extrabold uppercase text-[#8b5a2b] block">Wand Flexibility:</span>
                  <strong className="text-sm text-[#4a3319]">{getFlexibility()}</strong>
                </div>
              </div>

              <p className="text-xs leading-relaxed max-w-lg mx-auto text-gray-600 italic font-sans py-2">
                "The wand chooses the wizard, and your wand represents your unique spark. May this rod channel your bravery, wisdom, and curiosity as you explore the boundaries of the magical universe."
              </p>
            </div>

            {/* Certificate Footer / Signatures */}
            <div className="mt-10 pt-6 border-t border-[#8b5a2b]/20 flex justify-between items-end">
              <div className="text-left">
                <span className="font-sans text-[10px] uppercase text-gray-500 block">Registered Wizard / Witch</span>
                <span className="font-serif text-sm font-extrabold text-[#4a3319] italic underline decoration-1">Your Name Here</span>
              </div>
              
              {/* Fun seal graphic in parchment color */}
              <div className="relative flex items-center justify-center">
                <div className="w-14 h-14 bg-red-800 rounded-full flex items-center justify-center text-amber-200 text-xl font-bold font-sans shadow-lg transform rotate-12 border-2 border-red-950/30">
                  🪄
                </div>
                <span className="absolute text-[8px] font-sans font-black uppercase text-red-900 -bottom-3.5 whitespace-nowrap">Official Wax Seal</span>
              </div>

              <div className="text-right">
                <span className="font-sans text-[10px] uppercase text-gray-500 block">Wandmaker Signature</span>
                <span className="font-serif text-sm font-black text-[#5c4033] italic">Garrick Ollivander</span>
              </div>
            </div>

            {/* PRINT BUTTON BAR */}
            <div className="mt-8 flex gap-3 justify-center print:hidden">
              <button
                id="btn-print-certificate"
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 active:scale-95 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-lg shadow-amber-950/40 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print Certificate Paper!
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
