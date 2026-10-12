'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  COUNTRIES,
  Country,
  DEMO_SCENARIOS,
  DemoScenario,
  ScenarioConnection,
} from '@/lib/earth/earthData';
import {
  generateContinentParticles,
  createGlowDotTexture,
  latLonToVector3,
} from '@/lib/earth/continentData';

interface Earth3DProps {
  scenarioId: string;
  selectedCountryId: string | null;
  onSelectCountry: (country: Country) => void;
  onHoverCountry?: (country: Country | null) => void;
}

interface ArcData {
  curve: THREE.CatmullRomCurve3;
  lineMesh: THREE.Line;
  glowLineMesh: THREE.Line;
  pulses: { mesh: THREE.Mesh; progress: number; speed: number }[];
  fromId: string;
  toId: string;
}

const GLOBE_RADIUS = 2.2;

export default function Earth3D({
  scenarioId,
  selectedCountryId,
  onSelectCountry,
  onHoverCountry,
}: Earth3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredCountryName, setHoveredCountryName] = useState<string | null>(null);

  // References across lifecycle
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const starsGroupRef = useRef<THREE.Group | null>(null);
  const plexusGroupRef = useRef<THREE.Group | null>(null);
  const markerMeshesRef = useRef<Map<string, {
    core: THREE.Mesh;
    ring: THREE.Mesh;
    hitSphere: THREE.Mesh;
    pulseRing: THREE.Mesh;
    country: Country;
  }>>(new Map());
  const arcsRef = useRef<ArcData[]>([]);
  const arcsGroupRef = useRef<THREE.Group | null>(null);

  // Parallax physics & rotational damping
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const autoRotateAngleRef = useRef(0);
  const targetRotationYRef = useRef<number | null>(null);
  const targetRotationXRef = useRef<number | null>(null);

  // Focus globe towards selected country
  const focusOnCountry = useCallback((countryId: string) => {
    const country = COUNTRIES.find((c) => c.id === countryId);
    if (!country) return;

    // Lat Lon to target rotation angles:
    const targetY = -(country.lon * Math.PI) / 180 - Math.PI / 2 + 0.35; // slightly offset to left to accommodate floating info card
    const targetX = (country.lat * Math.PI) / 180 * 0.45;

    targetRotationYRef.current = targetY;
    targetRotationXRef.current = targetX;
  }, []);

  // Update focus when selectedCountryId changes
  useEffect(() => {
    if (selectedCountryId) {
      focusOnCountry(selectedCountryId);
    }
  }, [selectedCountryId, focusOnCountry]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0.15, 6.5);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0x382866, 2.0);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.4);
    dirLight1.position.set(5, 5, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7b61ff, 2.0);
    dirLight2.position.set(-6, -3, -4);
    scene.add(dirLight2);

    // 4. Subtle Celestial Starfield & Micro-Space Dust for Depth
    const starsGroup = new THREE.Group();
    const starCount = 1500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const c1 = new THREE.Color('#7B61FF');
    const c2 = new THREE.Color('#38BDF8');
    const c3 = new THREE.Color('#FFFFFF');

    for (let i = 0; i < starCount; i++) {
      const radius = 55 + Math.random() * 55;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = Math.random() > 0.6 ? c1 : Math.random() > 0.35 ? c2 : c3;
      starColors[i * 3] = chosenColor.r;
      starColors[i * 3 + 1] = chosenColor.g;
      starColors[i * 3 + 2] = chosenColor.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.9,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const starPoints = new THREE.Points(starGeo, starMat);
    starsGroup.add(starPoints);
    scene.add(starsGroup);
    starsGroupRef.current = starsGroup;

    // 5. Main Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // 5A. Inner Occlusion Sphere (Deep Violet-Black)
    // Ensures back-side particles are darkened so front-side continents are ultra-crisp and 3D
    const innerCoreGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 0.985, 48, 48);
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: 0x080918,
      roughness: 0.85,
      metalness: 0.1,
      transparent: true,
      opacity: 0.96,
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    globeGroup.add(innerCoreMesh);

    // 5B. High-Density Particle Cloud Continents (Luminous White & Silver Dots)
    const dotTexture = createGlowDotTexture();
    const { positions, colors, count } = generateContinentParticles(GLOBE_RADIUS, 38000);

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.048,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    globeGroup.add(particlesMesh);

    // 5C. Outer Holographic Plexus Network (Floating Nodes & Constellation Lines)
    const plexusGroup = new THREE.Group();
    globeGroup.add(plexusGroup);
    plexusGroupRef.current = plexusGroup;

    // Generate plexus nodes: major country locations + random surface & satellite nodes
    const plexusNodes: THREE.Vector3[] = [];

    // Add financial hub anchors
    COUNTRIES.forEach((c) => {
      plexusNodes.push(latLonToVector3(c.lat, c.lon, GLOBE_RADIUS * 1.02));
    });

    // Add surface nodes across continents
    const extraSurfaceNodesCount = 60;
    for (let i = 0; i < extraSurfaceNodesCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = GLOBE_RADIUS * (1.01 + Math.random() * 0.04);
      plexusNodes.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        )
      );
    }

    // Add elevated satellite nodes floating above the globe (like in reference image!)
    const satelliteNodesCount = 55;
    for (let i = 0; i < satelliteNodesCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = GLOBE_RADIUS * (1.08 + Math.random() * 0.22); // extends up to 1.3x radius
      plexusNodes.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        )
      );
    }

    // Connect pairs of plexus nodes with glowing lines if distance < maxDistance
    const maxLineDist = 0.95;
    const linePositions: number[] = [];
    const lineColors: number[] = [];

    const lineColNear = new THREE.Color('#7B61FF');
    const lineColFar = new THREE.Color('#38BDF8');

    for (let i = 0; i < plexusNodes.length; i++) {
      for (let j = i + 1; j < plexusNodes.length; j++) {
        const d = plexusNodes[i].distanceTo(plexusNodes[j]);
        if (d < maxLineDist) {
          linePositions.push(
            plexusNodes[i].x, plexusNodes[i].y, plexusNodes[i].z,
            plexusNodes[j].x, plexusNodes[j].y, plexusNodes[j].z
          );

          const alpha = 1.0 - d / maxLineDist;
          const c = d < 0.6 ? lineColNear : lineColFar;
          lineColors.push(c.r * alpha, c.g * alpha, c.b * alpha);
          lineColors.push(c.r * alpha, c.g * alpha, c.b * alpha);
        }
      }
    }

    const plexusLinesGeo = new THREE.BufferGeometry();
    plexusLinesGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
    plexusLinesGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(lineColors), 3));

    const plexusLinesMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });

    const plexusLinesMesh = new THREE.LineSegments(plexusLinesGeo, plexusLinesMat);
    plexusGroup.add(plexusLinesMesh);

    // Glowing vertex points at each plexus node
    const plexusPointsPositions = new Float32Array(plexusNodes.length * 3);
    for (let i = 0; i < plexusNodes.length; i++) {
      plexusPointsPositions[i * 3] = plexusNodes[i].x;
      plexusPointsPositions[i * 3 + 1] = plexusNodes[i].y;
      plexusPointsPositions[i * 3 + 2] = plexusNodes[i].z;
    }
    const plexusPointsGeo = new THREE.BufferGeometry();
    plexusPointsGeo.setAttribute('position', new THREE.BufferAttribute(plexusPointsPositions, 3));

    const plexusPointsMat = new THREE.PointsMaterial({
      size: 0.065,
      map: dotTexture,
      color: new THREE.Color('#FFFFFF'),
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const plexusPointsMesh = new THREE.Points(plexusPointsGeo, plexusPointsMat);
    plexusGroup.add(plexusPointsMesh);

    // 5D. Atmospheric Electric Violet Rim Halo Shader
    const atmosphereVertexShader = `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const atmosphereFragmentShader = `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        float intensity = pow(0.66 - dot(vNormal, vViewDir), 2.5);
        vec3 glowColor = mix(vec3(0.482, 0.380, 1.0), vec3(0.220, 0.741, 0.972), 0.4);
        gl_FragColor = vec4(glowColor, intensity * 0.9);
      }
    `;

    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });

    const atmosphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(GLOBE_RADIUS * 1.12, 48, 48),
      atmosphereMat
    );
    globeGroup.add(atmosphereMesh);

    // 6. Interactive Country Markers & Glowing Rings
    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);

    COUNTRIES.forEach((country) => {
      const pos = latLonToVector3(country.lat, country.lon, GLOBE_RADIUS + 0.025);
      const normal = pos.clone().normalize();

      // Glowing white core
      const coreGeo = new THREE.SphereGeometry(0.042, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.copy(pos);
      markerGroup.add(coreMesh);

      // Inner glowing electric violet ring
      const ringGeo = new THREE.RingGeometry(0.07, 0.12, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x7b61ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(pos.clone().add(normal));
      markerGroup.add(ringMesh);

      // Outer pulse beacon ring
      const pulseGeo = new THREE.RingGeometry(0.13, 0.17, 32);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      });
      const pulseRing = new THREE.Mesh(pulseGeo, pulseMat);
      pulseRing.position.copy(pos);
      pulseRing.lookAt(pos.clone().add(normal));
      markerGroup.add(pulseRing);

      // Invisible hit sphere for raycaster
      const hitGeo = new THREE.SphereGeometry(0.26, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitSphere = new THREE.Mesh(hitGeo, hitMat);
      hitSphere.position.copy(pos);
      hitSphere.userData = { countryId: country.id };
      markerGroup.add(hitSphere);

      markerMeshesRef.current.set(country.id, {
        core: coreMesh,
        ring: ringMesh,
        hitSphere,
        pulseRing,
        country,
      });
    });

    // 7. Group for Macro Shockwave Arcs
    const arcsGroup = new THREE.Group();
    globeGroup.add(arcsGroup);
    arcsGroupRef.current = arcsGroup;

    // 8. Event Listeners for Parallax & Raycasting
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      mousePosRef.current.targetX = x * 0.35;
      mousePosRef.current.targetY = y * 0.22;

      if (!cameraRef.current || !globeGroupRef.current) return;
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

      const hitMeshes = Array.from(markerMeshesRef.current.values()).map((m) => m.hitSphere);
      const intersects = raycaster.intersectObjects(hitMeshes);

      if (intersects.length > 0) {
        const hitCountryId = intersects[0].object.userData.countryId;
        const cData = COUNTRIES.find((c) => c.id === hitCountryId);
        if (cData) {
          setHoveredCountryName(`${cData.flag} ${cData.name}`);
          container.style.cursor = 'pointer';
          if (onHoverCountry) onHoverCountry(cData);
        }
      } else {
        setHoveredCountryName(null);
        container.style.cursor = 'default';
        if (onHoverCountry) onHoverCountry(null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (!cameraRef.current) return;
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

      const hitMeshes = Array.from(markerMeshesRef.current.values()).map((m) => m.hitSphere);
      const intersects = raycaster.intersectObjects(hitMeshes);

      if (intersects.length > 0) {
        const hitCountryId = intersects[0].object.userData.countryId;
        const cData = COUNTRIES.find((c) => c.id === hitCountryId);
        if (cData) {
          onSelectCountry(cData);
          focusOnCountry(cData.id);
        }
      }
    };

    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    // 9. Animation Loop with Parallax & Pulsing Rings
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Mouse parallax smooth interpolation
      mousePosRef.current.x += (mousePosRef.current.targetX - mousePosRef.current.x) * 0.06;
      mousePosRef.current.y += (mousePosRef.current.targetY - mousePosRef.current.y) * 0.06;

      // Slow elegant rotation
      if (targetRotationYRef.current === null) {
        autoRotateAngleRef.current += 0.0018;
      }

      if (globeGroupRef.current) {
        if (targetRotationYRef.current !== null) {
          const diffY = targetRotationYRef.current - globeGroupRef.current.rotation.y;
          globeGroupRef.current.rotation.y += diffY * 0.06;
          if (Math.abs(diffY) < 0.002) {
            autoRotateAngleRef.current = globeGroupRef.current.rotation.y;
            targetRotationYRef.current = null;
          }
        } else {
          globeGroupRef.current.rotation.y = autoRotateAngleRef.current + mousePosRef.current.x;
        }

        if (targetRotationXRef.current !== null) {
          const diffX = targetRotationXRef.current - globeGroupRef.current.rotation.x;
          globeGroupRef.current.rotation.x += diffX * 0.06;
          if (Math.abs(diffX) < 0.002) {
            targetRotationXRef.current = null;
          }
        } else {
          globeGroupRef.current.rotation.x = mousePosRef.current.y;
        }
      }

      // Reverse parallax on stars for 3D depth
      if (starsGroupRef.current) {
        starsGroupRef.current.rotation.y = -mousePosRef.current.x * 0.15;
        starsGroupRef.current.rotation.x = -mousePosRef.current.y * 0.15;
      }

      // Animate country marker glow rings
      markerMeshesRef.current.forEach((marker, countryId) => {
        const isSelected = selectedCountryId === countryId;
        const pulseScale = isSelected
          ? 1.0 + Math.sin(time * 5) * 0.35
          : 1.0 + Math.sin(time * 2.5 + countryId.length) * 0.15;

        marker.ring.scale.set(pulseScale, pulseScale, pulseScale);

        if (isSelected) {
          (marker.ring.material as THREE.MeshBasicMaterial).color.setHex(0x38bdf8);
          (marker.ring.material as THREE.MeshBasicMaterial).opacity = 0.95;
          marker.pulseRing.scale.set(pulseScale * 1.5, pulseScale * 1.5, pulseScale * 1.5);
          (marker.pulseRing.material as THREE.MeshBasicMaterial).opacity = 0.6;
        } else {
          (marker.ring.material as THREE.MeshBasicMaterial).color.setHex(0x7b61ff);
          (marker.ring.material as THREE.MeshBasicMaterial).opacity = 0.65;
          marker.pulseRing.scale.set(1.0, 1.0, 1.0);
          (marker.pulseRing.material as THREE.MeshBasicMaterial).opacity = 0.25;
        }
      });

      // Animate neon line pulses
      arcsRef.current.forEach((arc) => {
        arc.pulses.forEach((pulse) => {
          pulse.progress = (pulse.progress + pulse.speed * delta) % 1;
          const pos = arc.curve.getPointAt(pulse.progress);
          pulse.mesh.position.copy(pos);
        });
      });

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [onSelectCountry, onHoverCountry, focusOnCountry, selectedCountryId]);

  // Re-build neon connection lines whenever scenario changes
  useEffect(() => {
    const arcsGroup = arcsGroupRef.current;
    if (!arcsGroup) return;

    while (arcsGroup.children.length > 0) {
      const obj = arcsGroup.children[0];
      arcsGroup.remove(obj);
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
        obj.geometry.dispose();
      }
    }
    arcsRef.current = [];

    const scenario = DEMO_SCENARIOS[scenarioId] || DEMO_SCENARIOS.oil_shock;
    const connections: ScenarioConnection[] = scenario.connections;

    connections.forEach((conn) => {
      const fromCountry = COUNTRIES.find((c) => c.id === conn.from);
      const toCountry = COUNTRIES.find((c) => c.id === conn.to);
      if (!fromCountry || !toCountry) return;

      const p1 = latLonToVector3(fromCountry.lat, fromCountry.lon, GLOBE_RADIUS + 0.03);
      const p2 = latLonToVector3(toCountry.lat, toCountry.lon, GLOBE_RADIUS + 0.03);

      const distance = p1.distanceTo(p2);
      const pointsCount = 48;
      const points: THREE.Vector3[] = [];

      for (let i = 0; i <= pointsCount; i++) {
        const t = i / pointsCount;
        const p = new THREE.Vector3().lerpVectors(p1, p2, t).normalize();
        const altitude = GLOBE_RADIUS + 0.03 + Math.sin(t * Math.PI) * (distance * 0.32 + 0.15);
        points.push(p.multiplyScalar(altitude));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const curvePoints = curve.getPoints(70);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);

      // Primary electric violet line
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x7b61ff,
        transparent: true,
        opacity: 0.85,
        linewidth: 2,
      });
      const lineMesh = new THREE.Line(lineGeo, lineMat);
      arcsGroup.add(lineMesh);

      // Outer cyan glow line for neon effect
      const glowMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45,
      });
      const glowLineMesh = new THREE.Line(lineGeo, glowMat);
      arcsGroup.add(glowLineMesh);

      // Traveling pulse particles
      const pulses: { mesh: THREE.Mesh; progress: number; speed: number }[] = [];
      const pulseCount = 2;

      for (let j = 0; j < pulseCount; j++) {
        const pulseGeo = new THREE.SphereGeometry(0.042, 12, 12);
        const pulseMat = new THREE.MeshBasicMaterial({
          color: j % 2 === 0 ? 0x38bdf8 : 0xffffff,
          transparent: true,
          opacity: 0.95,
        });
        const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
        arcsGroup.add(pulseMesh);
        pulses.push({
          mesh: pulseMesh,
          progress: j / pulseCount,
          speed: 0.32 + Math.random() * 0.15,
        });
      }

      arcsRef.current.push({
        curve,
        lineMesh,
        glowLineMesh,
        pulses,
        fromId: conn.from,
        toId: conn.to,
      });
    });
  }, [scenarioId]);

  return (
    <div className="relative h-full w-full select-none overflow-hidden">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="h-full w-full" />

      {/* Hover Country Tooltip HUD */}
      {hoveredCountryName && (
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-[#7B61FF]/40 bg-[#0B0C1E]/85 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(123,97,255,0.4)] backdrop-blur-md">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 animate-ping rounded-full bg-[#7B61FF]" />
            {hoveredCountryName}
          </span>
        </div>
      )}
    </div>
  );
}
