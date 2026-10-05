import * as THREE from 'three';

const PURPLE = new THREE.Color('#531069');
const PURPLE_LIGHT = new THREE.Color('#b98ccc');
const SUN_BOTTOM = new THREE.Color('#c27bdc');
const WHITE = new THREE.Color('#ffffff');

const noiseGLSL = /* glsl */ `
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
`;

const terrainVertex = /* glsl */ `
  uniform float uTime;
  varying vec2 vGrid;
  varying float vHeight;
  varying float vDist;
  ${noiseGLSL}
  void main() {
    vec3 p = position;
    float z = p.z - uTime;
    float side = smoothstep(4.0, 15.0, abs(p.x));
    float h = noise(vec2(p.x * 0.28, z * 0.28)) * 1.0 + noise(vec2(p.x * 0.7, z * 0.7)) * 0.35;
    h *= side * side * 5.0;
    p.y += h;
    vHeight = h;
    vGrid = vec2(p.x, z);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const terrainFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uBg;
  uniform float uFogNear;
  uniform float uFogFar;
  varying vec2 vGrid;
  varying float vHeight;
  varying float vDist;
  void main() {
    vec2 g = abs(fract(vGrid - 0.5) - 0.5) / fwidth(vGrid);
    float line = 1.0 - min(min(g.x, g.y) / 1.3, 1.0);
    vec3 fill = mix(uBg, uColor, clamp(0.03 + vHeight * 0.035, 0.0, 0.25));
    vec3 col = mix(fill, uColor, line);
    col = mix(col, uBg, smoothstep(uFogNear, uFogFar, vDist));
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

const sunVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sunFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uTop;
  uniform vec3 uBottom;
  varying vec2 vUv;
  void main() {
    if (length(vUv - 0.5) > 0.5) discard;
    float y = vUv.y;
    float zone = smoothstep(0.62, 0.05, y);
    float s = fract(y * 13.0 + uTime * 0.25);
    if (y < 0.62 && s < zone * 0.8) discard;
    gl_FragColor = vec4(mix(uBottom, uTop, smoothstep(0.1, 0.95, y)), 1.0);
    #include <colorspace_fragment>
  }
`;

export function createHeroScene(canvas, { reduceMotion = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(WHITE, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(WHITE, 16, 52);

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
  camera.position.set(0, 2.2, 9);

  scene.add(new THREE.HemisphereLight(WHITE, PURPLE, 2.2));
  const dir = new THREE.DirectionalLight(WHITE, 1.6);
  dir.position.set(-4, 6, 5);
  scene.add(dir);

  const time = { value: 0 };

  const terrainGeo = new THREE.PlaneGeometry(64, 90, 128, 180);
  terrainGeo.rotateX(-Math.PI / 2);
  const terrain = new THREE.Mesh(
    terrainGeo,
    new THREE.ShaderMaterial({
      uniforms: {
        uTime: time,
        uColor: { value: PURPLE },
        uBg: { value: WHITE },
        uFogNear: { value: 12 },
        uFogFar: { value: 50 },
      },
      vertexShader: terrainVertex,
      fragmentShader: terrainFragment,
    }),
  );
  terrain.position.z = -30;
  scene.add(terrain);

  const sun = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 28),
    new THREE.ShaderMaterial({
      uniforms: { uTime: time, uTop: { value: PURPLE }, uBottom: { value: SUN_BOTTOM } },
      vertexShader: sunVertex,
      fragmentShader: sunFragment,
      transparent: true,
      depthWrite: false,
    }),
  );
  sun.position.set(0, 7, -72);
  sun.renderOrder = -1;
  scene.add(sun);

  const hero = new THREE.Group();
  scene.add(hero);

  const icoGeo = new THREE.IcosahedronGeometry(1.45, 1);
  const core = new THREE.Mesh(
    icoGeo,
    new THREE.MeshLambertMaterial({
      color: WHITE,
      flatShading: true,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    }),
  );
  core.add(new THREE.LineSegments(new THREE.EdgesGeometry(icoGeo), new THREE.LineBasicMaterial({ color: PURPLE })));
  hero.add(core);

  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.1, 1),
    new THREE.MeshBasicMaterial({ color: PURPLE, wireframe: true, transparent: true, opacity: 0.22 }),
  );
  hero.add(shell);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.75, 0.05, 6, 96),
    new THREE.MeshBasicMaterial({ color: PURPLE }),
  );
  ring.rotation.set(Math.PI / 2.4, 0.3, 0);
  hero.add(ring);

  const cubeGeo = new THREE.BoxGeometry(0.24, 0.24, 0.24);
  const cubeEdges = new THREE.EdgesGeometry(cubeGeo);
  const cubes = [0, 1, 2, 3].map((i) => {
    const cube = new THREE.Mesh(cubeGeo, new THREE.MeshBasicMaterial({ color: i % 2 ? WHITE : PURPLE }));
    cube.add(new THREE.LineSegments(cubeEdges, new THREE.LineBasicMaterial({ color: PURPLE })));
    cube.userData = { angle: (i / 4) * Math.PI * 2, speed: 0.6 + i * 0.12, radius: 2.75 };
    ring.add(cube);
    return cube;
  });

  const particleCount = 420;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 70;
    positions[i * 3 + 1] = 1 + Math.random() * 22;
    positions[i * 3 + 2] = -60 + Math.random() * 66;
  }
  const particlesGeo = new THREE.BufferGeometry();
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particlesGeo,
    new THREE.PointsMaterial({ color: PURPLE_LIGHT, size: 0.14, sizeAttenuation: true }),
  );
  scene.add(particles);

  const state = { intro: 0, scroll: 0 };
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const layout = { heroX: 3.6, heroY: 2.4, heroScale: 1, sunX: 9 };

  window.addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  });

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    const aspect = w / h;
    if (aspect < 0.85) {
      Object.assign(layout, { heroX: 0, heroY: 6, heroScale: 0.42, sunX: 0 });
    } else if (aspect < 1.3) {
      Object.assign(layout, { heroX: 2.6, heroY: 3.4, heroScale: 0.7, sunX: 4 });
    } else {
      Object.assign(layout, { heroX: 4.3 * Math.min(aspect / 1.6, 1.25), heroY: 2.5, heroScale: 0.85, sunX: 10 });
    }
    sun.position.x = layout.sunX;
  }
  resize();
  new ResizeObserver(resize).observe(canvas);

  let visible = true;
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }).observe(canvas);

  const clock = new THREE.Clock();
  const speed = reduceMotion ? 0.6 : 4;
  const lookTarget = new THREE.Vector3();

  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!visible || document.hidden) return;

    const t = clock.elapsedTime;
    time.value += dt * speed * (0.35 + state.intro * 0.65);

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    const intro = 1 - Math.pow(1 - state.intro, 3);
    const s = state.scroll;

    camera.position.x = mouse.x * 1.1;
    camera.position.y = THREE.MathUtils.lerp(9, 2.2, intro) + mouse.y * 0.5 + s * 2.5;
    camera.position.z = THREE.MathUtils.lerp(16, 9, intro) - s * 3;
    lookTarget.set(mouse.x * 0.4, THREE.MathUtils.lerp(0, 2.1, intro) - s * 1.5, -12);
    camera.lookAt(lookTarget);

    hero.position.set(layout.heroX, layout.heroY + Math.sin(t * 1.2) * 0.18, 0);
    hero.scale.setScalar(layout.heroScale * (0.4 + intro * 0.6));
    core.rotation.x = t * 0.25 + mouse.y * 0.4;
    core.rotation.y = t * 0.35 + mouse.x * 0.6;
    shell.rotation.x = -t * 0.12;
    shell.rotation.y = -t * 0.18;
    ring.rotation.z = t * 0.15;

    for (const cube of cubes) {
      const { angle, speed: sp, radius } = cube.userData;
      const a = angle + t * sp;
      cube.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
      cube.rotation.x = t * 1.5;
      cube.rotation.y = t;
    }

    particles.rotation.y = Math.sin(t * 0.05) * 0.08;
    particles.position.y = Math.sin(t * 0.3) * 0.3;

    renderer.render(scene, camera);
  }
  frame();

  return { state };
}
