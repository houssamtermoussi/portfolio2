import * as THREE from 'three';

const PURPLE = '#531069';
const PURPLE_LIGHT = '#b98ccc';
const WHITE = '#ffffff';
const RADIUS = 2.7;
const LABEL_SCALE = 0.0062;

function makeLabelTexture(text, inverted) {
  const fontSize = 28;
  const pad = 22;
  const shadow = 8;
  const font = `${fontSize}px "Press Start 2P", monospace`;

  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(text).width) + pad * 2;
  const h = fontSize + pad * 2;
  c.width = w + shadow;
  c.height = h + shadow;

  ctx.fillStyle = inverted ? PURPLE_LIGHT : PURPLE;
  ctx.fillRect(shadow, shadow, w, h);
  ctx.fillStyle = inverted ? PURPLE : WHITE;
  ctx.fillRect(0, 0, w, h);
  ctx.lineWidth = 5;
  ctx.strokeStyle = PURPLE;
  ctx.strokeRect(2.5, 2.5, w - 5, h - 5);

  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = inverted ? WHITE : PURPLE;
  ctx.fillText(text, pad, h / 2 + 3);

  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return { texture, width: c.width, height: c.height };
}

export async function createSkillsSphere(canvas, skills) {
  await document.fonts.load('28px "Press Start 2P"');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 9.5);

  const group = new THREE.Group();
  scene.add(group);

  group.add(
    new THREE.Mesh(
      new THREE.IcosahedronGeometry(RADIUS * 0.72, 2),
      new THREE.MeshBasicMaterial({ color: PURPLE, wireframe: true, transparent: true, opacity: 0.16 }),
    ),
  );
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(RADIUS * 0.95, 0.012, 4, 120),
      new THREE.MeshBasicMaterial({ color: PURPLE, transparent: true, opacity: 0.35 }),
    );
    ring.rotation.set((i * Math.PI) / 3, (i * Math.PI) / 5, 0);
    group.add(ring);
  }

  const sprites = skills.map((name, i) => {
    const normal = makeLabelTexture(name.toUpperCase(), false);
    const hover = makeLabelTexture(name.toUpperCase(), true);
    const material = new THREE.SpriteMaterial({ map: normal.texture, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(material);
    const base = new THREE.Vector2(normal.width * LABEL_SCALE, normal.height * LABEL_SCALE);
    sprite.scale.set(base.x, base.y, 1);

    const n = skills.length;
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = i * Math.PI * (3 - Math.sqrt(5));
    sprite.position.set(Math.cos(theta) * r * RADIUS, y * RADIUS, Math.sin(theta) * r * RADIUS);
    sprite.userData = { normal: normal.texture, hover: hover.texture, base, hovered: false, pop: 0 };
    group.add(sprite);
    return sprite;
  });

  const rotation = { x: 0.3, y: 0, vx: 0, vy: 0.004 };
  const pointer = new THREE.Vector2(-10, -10);
  const raycaster = new THREE.Raycaster();
  let dragging = false;
  let last = { x: 0, y: 0 };

  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    last = { x: e.clientX, y: e.clientY };
    canvas.classList.add('is-dragging');
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    if (!dragging) return;
    const dx = e.clientX - last.x;
    const dy = e.clientY - last.y;
    rotation.vy = dx * 0.0045;
    rotation.vx = dy * 0.0045;
    last = { x: e.clientX, y: e.clientY };
  });
  const stopDrag = () => {
    dragging = false;
    canvas.classList.remove('is-dragging');
  };
  canvas.addEventListener('pointerup', stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);
  canvas.addEventListener('pointerleave', () => pointer.set(-10, -10));

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w / h < 1 ? 9.5 / Math.max(w / h, 0.7) : 9.5;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(canvas);

  let visible = false;
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }).observe(canvas);

  const world = new THREE.Vector3();

  function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;

    if (!dragging) {
      rotation.vy += (0.004 - rotation.vy) * 0.02;
      rotation.vx *= 0.94;
    }
    rotation.y += rotation.vy;
    rotation.x = THREE.MathUtils.clamp(rotation.x + rotation.vx, -1.2, 1.2);
    group.rotation.set(rotation.x, rotation.y, 0);
    group.updateMatrixWorld();

    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(sprites, false)[0]?.object;

    for (const sprite of sprites) {
      const data = sprite.userData;
      const hovered = sprite === hit;
      if (hovered !== data.hovered) {
        data.hovered = hovered;
        sprite.material.map = hovered ? data.hover : data.normal;
      }
      data.pop += ((hovered ? 1 : 0) - data.pop) * 0.2;

      sprite.getWorldPosition(world);
      const depth = (world.z + RADIUS) / (RADIUS * 2);
      sprite.material.opacity = 0.25 + depth * 0.75;
      const scale = (0.75 + depth * 0.35) * (1 + data.pop * 0.25);
      sprite.scale.set(data.base.x * scale, data.base.y * scale, 1);
    }
    canvas.style.cursor = hit && !dragging ? 'pointer' : '';

    renderer.render(scene, camera);
  }
  frame();
}
