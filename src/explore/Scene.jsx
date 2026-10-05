// Cảnh 3D: trống đồng ở giữa (dân tộc), các bia xung quanh (vàng = nội dung, đỏ = lập luận CQ9), núi thủy mặc, hạc bay, bụi vàng.
import { useFrame, useThree } from '@react-three/fiber';
// Import thẳng module cần dùng thay vì cả gói drei: bundle drei đầy đủ (~7 MB) bị Avast xóa nhầm
// khỏi node_modules/.vite → lỗi 504 "Outdated Optimize Dep" → trang kẹt ở màn "Đang tải".
import { Sparkles } from '@react-three/drei/core/Sparkles.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { drumFaceTexture, drumSideTexture, tabletTexture, mountainTexture, glowTexture, skyTexture, labelTexture } from './textures.js';

const R_TABLET = 9;
export const tabletPos = (i, n) => {
  const a = (i / n) * Math.PI * 2;
  return { a, x: Math.sin(a) * R_TABLET, z: Math.cos(a) * R_TABLET };
};

/* ---------------- Camera đi theo thanh cuộn ----------------
   Mỗi điểm dừng có một "tư thế" camera (góc, bán kính, độ cao, điểm nhìn, độ lệch khung).
   Vị trí cuộn (số thực) → nội suy giữa hai điểm dừng → camera bay mượt quanh trống đồng. */
const smooth = (t) => t * t * (3 - 2 * t);

function poseFor(stop, n, narrow) {
  const k = narrow ? 1.35 : 1;
  const ringMid = n > 4 ? ((4 + (n - 1)) / 2 / n) * Math.PI * 2 : Math.PI; // giữa dãy bia đỏ
  const P = (ang, r, y, look, offX = -0.29) => ({
    ang, r: r * k, y, look: new THREE.Vector3(...look), offX: narrow ? 0 : offX, offY: narrow ? 0.2 : 0,
  });
  if (stop.node != null) {
    const { a, x, z } = tabletPos(stop.node, n);
    if (stop.sub === -1) return P(a + 0.32, 21, 6.5, [x * 0.55, 2, z * 0.55], 0); // mở chương: lùi xa
    const mid = ((stop.subs ?? 1) - 1) / 2;
    const swing = (stop.sub - mid) * 0.11; // mỗi mục lệch góc một chút → camera trôi dọc chương
    return P(a + swing, 9 + 6.4 + (stop.sub % 2) * 0.8, 2.6 + (stop.sub % 3) * 0.35, [x, 1.9, z], -0.4);
  }
  switch (stop.view) {
    case 'overview': return P(0.35, 25, 11, [0, 1.2, 0], -0.2);
    case 'ring': return P(ringMid + 0.4, 22, 14, [0, 0, 0], 0);
    case 'drum': return P(ringMid - 0.2, 13.5, 7.5, [0, 2.2, 0], -0.36);
    case 'all': return stop.type === 'conclusion' ? P(ringMid + 0.9, 18, 21, [0, 0, 0], 0) : P(ringMid + 0.5, 15, 18, [0, 0, 0], -0.26);
    default: return P(ringMid + 1.6, 30, 7, [0, 4, 0], 0);
  }
}

function JourneyRig({ stops, n, progress }) {
  const { camera, size } = useThree();
  const narrow = size.width < 800;
  const poses = useMemo(() => {
    const list = stops.map((s) => poseFor(s, n, narrow));
    // "mở" góc để camera luôn đi đường ngắn nhất quanh vòng
    for (let i = 1; i < list.length; i++) {
      let d = list[i].ang - list[i - 1].ang;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      list[i].ang = list[i - 1].ang + d;
    }
    return list;
  }, [stops, n, narrow]);
  const cur = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const on = (e) => { mouse.current.x = e.clientX / window.innerWidth - 0.5; mouse.current.y = e.clientY / window.innerHeight - 0.5; };
    window.addEventListener('pointermove', on);
    return () => window.removeEventListener('pointermove', on);
  }, []);

  useFrame((state, dt) => {
    const p = THREE.MathUtils.clamp(progress.current, 0, poses.length - 1);
    const i = Math.min(Math.floor(p), poses.length - 2);
    const t = smooth(THREE.MathUtils.clamp(p - i, 0, 1));
    const A = poses[i], B = poses[i + 1] ?? A;
    const L = THREE.MathUtils.lerp;
    const goal = {
      ang: L(A.ang, B.ang, t), r: L(A.r, B.r, t), y: L(A.y, B.y, t),
      look: A.look.clone().lerp(B.look, t), offX: L(A.offX, B.offX, t), offY: L(A.offY, B.offY, t),
    };
    if (!cur.current) cur.current = { ...goal, look: goal.look.clone() };
    const c = cur.current;
    const k = 1 - Math.pow(0.004, dt); // giảm chấn: camera đuổi theo mục tiêu thật mượt
    c.ang = L(c.ang, goal.ang, k); c.r = L(c.r, goal.r, k); c.y = L(c.y, goal.y, k);
    c.look.lerp(goal.look, k); c.offX = L(c.offX, goal.offX, k); c.offY = L(c.offY, goal.offY, k);

    const time = state.clock.elapsedTime;
    const ang = c.ang + mouse.current.x * 0.05 + Math.sin(time * 0.15) * 0.02;
    camera.position.set(Math.sin(ang) * c.r, c.y + Math.sin(time * 0.4) * 0.12 - mouse.current.y * 0.4, Math.cos(ang) * c.r);
    camera.lookAt(c.look);
    const w = size.width, h = size.height;
    camera.setViewOffset(w, h, c.offX * w, c.offY * h, w, h);
    camera.updateProjectionMatrix();
  });
  return null;
}

/* ---------------- Trống đồng ---------------- */
function Drum({ lit, labelOn = true }) {
  const labelRef = useRef();
  const face = useMemo(drumFaceTexture, []);
  const side = useMemo(drumSideTexture, []);
  const group = useRef();
  const glow = useMemo(() => glowTexture('rgba(255,214,120,1)', 'rgba(255,140,60,0)'), []);
  const halo = useRef();
  const label = useMemo(() => labelTexture('Dân tộc'), []);

  // biên dạng thân trống: mặt rộng, tang phình, lưng thắt, chân loe
  const profile = useMemo(() => {
    const pts = [
      [0.0, 0], [2.0, 0], [2.15, 0.08], [2.0, 0.25], [1.75, 0.6], [1.7, 1.0], [1.85, 1.35],
      [2.25, 1.75], [2.45, 2.15], [2.5, 2.45], [2.62, 2.55], [2.62, 2.62], [0, 2.62],
    ];
    return pts.map(([r, y]) => new THREE.Vector2(r, y));
  }, []);

  useFrame((state, dt) => {
    group.current.rotation.y += dt * (lit ? 0.35 : 0.08);
    const s = lit ? 1 + Math.sin(state.clock.elapsedTime * 2) * 0.06 : 0.0001;
    halo.current.scale.setScalar(THREE.MathUtils.lerp(halo.current.scale.x, lit ? 14 * s : 6, 0.05));
    halo.current.material.opacity = THREE.MathUtils.lerp(halo.current.material.opacity, lit ? 0.9 : 0.35, 0.05);
    // nhãn "Dân tộc" chỉ hiện khi nhìn toàn cảnh, ẩn khi đang đứng trước một bia
    const m = labelRef.current.material;
    m.opacity = THREE.MathUtils.lerp(m.opacity, labelOn ? 1 : 0, 0.08);
    labelRef.current.visible = m.opacity > 0.02;
  });

  return (
    <group position={[0, 0.3, 0]}>
      <sprite ref={halo} position={[0, 2.8, 0]} scale={6}>
        <spriteMaterial map={glow} transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <group ref={group}>
        <mesh castShadow receiveShadow>
          <latheGeometry args={[profile, 96]} />
          <meshStandardMaterial map={side} color="#c99a52" metalness={0.75} roughness={0.38} emissive="#3a1d05" emissiveIntensity={lit ? 0.7 : 0.15} />
        </mesh>
        <mesh position={[0, 2.625, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[2.62, 128]} />
          <meshStandardMaterial map={face} metalness={0.6} roughness={0.42} emissive="#ffcc66" emissiveMap={face} emissiveIntensity={lit ? 0.55 : 0.08} />
        </mesh>
        {/* tượng cóc trên mặt trống */}
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
          return (
            <mesh key={i} position={[Math.cos(a) * 2.25, 2.78, Math.sin(a) * 2.25]} rotation={[0, -a, 0]} castShadow>
              <sphereGeometry args={[0.16, 16, 12]} />
              <meshStandardMaterial color="#9b6c2c" metalness={0.8} roughness={0.35} />
            </mesh>
          );
        })}
      </group>
      <sprite ref={labelRef} position={[0, 4.1, 0]} scale={[2.6, 0.75, 1]}>
        <spriteMaterial map={label} transparent depthWrite={false} />
      </sprite>
    </group>
  );
}

/* ---------------- Bia lập luận ---------------- */
function Tablet({ i, n, arg, active, visited, onSelect, allLit }) {
  const tex = useMemo(() => tabletTexture(arg.num, arg.label, arg.variant), [arg.num, arg.label, arg.variant]);
  const { a, x, z } = tabletPos(i, n);
  const ref = useRef();
  const [hover, setHover] = useState(false);
  const glow = useMemo(() => glowTexture('rgba(255,210,110,1)', 'rgba(255,150,60,0)'), []);
  const lit = active || allLit;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.position.y = 1.7 + Math.sin(t * 1.1 + i) * 0.12 + (active ? 0.25 : 0);
    const s = THREE.MathUtils.lerp(ref.current.scale.x, hover || active ? 1.08 : 1, 0.1);
    ref.current.scale.setScalar(s);
  });

  return (
    <group position={[x, 0, z]} rotation={[0, a, 0]}>
      {/* bệ đá */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.1, 0.5, 32]} />
        <meshStandardMaterial color="#3b1512" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <torusGeometry args={[0.95, 0.04, 8, 48]} />
        <meshStandardMaterial color="#e2b552" metalness={0.9} roughness={0.25} emissive="#a06a10" emissiveIntensity={visited || lit ? 0.9 : 0.1} />
      </mesh>
      <group
        ref={ref}
        onClick={(e) => { e.stopPropagation(); onSelect(i); }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}
      >
        <sprite position={[0, 0, -0.3]} scale={lit ? 5 : hover ? 4 : 0.01}>
          <spriteMaterial map={glow} transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        <mesh castShadow>
          <boxGeometry args={[1.6, 2.56, 0.22]} />
          <meshStandardMaterial attach="material-0" color="#6d0f10" />
          <meshStandardMaterial attach="material-1" color="#6d0f10" />
          <meshStandardMaterial attach="material-2" color="#c9973a" metalness={0.8} roughness={0.3} />
          <meshStandardMaterial attach="material-3" color="#6d0f10" />
          <meshStandardMaterial attach="material-4" map={tex} roughness={0.5} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={lit ? 0.55 : hover ? 0.35 : 0.18} />
          <meshStandardMaterial attach="material-5" color="#5a0b0c" />
        </mesh>
        {/* mái nhỏ trên bia */}
        <mesh position={[0, 1.42, 0]}>
          <boxGeometry args={[1.95, 0.16, 0.5]} />
          <meshStandardMaterial color="#c9973a" metalness={0.85} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------------- Tia sáng nối bia với trống ---------------- */
function Beam({ i, n, on }) {
  const { x, z } = tabletPos(i, n);
  const ref = useRef();
  const geo = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(x, 1.2, z), new THREE.Vector3(x * 0.45, 4.2, z * 0.45), new THREE.Vector3(0, 3.1, 0));
    return new THREE.TubeGeometry(curve, 48, 0.035, 8, false);
  }, [x, z]);
  useFrame((state) => {
    const m = ref.current.material;
    m.opacity = THREE.MathUtils.lerp(m.opacity, on ? 0.6 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.3 : 0, 0.06);
  });
  return (
    <mesh ref={ref} geometry={geo}>
      <meshBasicMaterial color="#ffd77a" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

/* ---------------- Núi thủy mặc xung quanh ---------------- */
function Mountains() {
  const ring = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const far = i % 2 === 0;
        const r = far ? 46 : 38;
        return { a, r, tex: mountainTexture(i * 1.37 + 0.5, far ? [92, 30, 22] : [36, 9, 7]), h: far ? 15 : 11, y: far ? 5 : 3.2 };
      }),
    [],
  );
  return ring.map((m, i) => (
    <mesh key={i} position={[Math.sin(m.a) * m.r, m.y, Math.cos(m.a) * m.r]} rotation={[0, m.a + Math.PI, 0]}>
      <planeGeometry args={[34, m.h]} />
      <meshBasicMaterial map={m.tex} transparent depthWrite={false} fog />
    </mesh>
  ));
}

/* ---------------- Bầu trời hoàng hôn ---------------- */
function Sky() {
  const tex = useMemo(() => skyTexture(), []);
  return (
    <mesh>
      <sphereGeometry args={[90, 48, 24]} />
      <meshBasicMaterial map={tex} side={THREE.BackSide} fog={false} depthWrite={false} />
    </mesh>
  );
}

/* ---------------- Mặt trời ---------------- */
function Sun() {
  const tex = useMemo(() => glowTexture('rgba(255,170,90,1)', 'rgba(200,40,30,0)'), []);
  return (
    <sprite position={[-20, 9, -60]} scale={30}>
      <spriteMaterial map={tex} transparent depthWrite={false} fog={false} />
    </sprite>
  );
}

/* ---------------- Hạc bay vòng ---------------- */
function Cranes() {
  const birds = useRef([]);
  const data = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ r: 24 + (i % 3) * 3, y: 13 + (i % 4), off: i * 0.9, speed: 0.08 + (i % 3) * 0.02 })), []);
  const wing = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0); s.quadraticCurveTo(0.5, 0.25, 1.2, 0.05); s.quadraticCurveTo(0.6, -0.05, 0, -0.12);
    return new THREE.ShapeGeometry(s);
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    birds.current.forEach((b, i) => {
      if (!b) return;
      const d = data[i];
      const ang = t * d.speed + d.off;
      b.position.set(Math.cos(ang) * d.r, d.y + Math.sin(t + i) * 0.4, Math.sin(ang) * d.r);
      b.rotation.y = -ang;
      const flap = Math.sin(t * 5 + i) * 0.6;
      b.children[0].rotation.x = flap;
      b.children[1].rotation.x = -flap;
    });
  });
  return data.map((_, i) => (
    <group key={i} ref={(el) => (birds.current[i] = el)} scale={0.9}>
      <mesh geometry={wing} rotation={[0, Math.PI / 2, 0]}><meshBasicMaterial color="#f3e2c0" side={THREE.DoubleSide} /></mesh>
      <mesh geometry={wing} rotation={[0, -Math.PI / 2, 0]}><meshBasicMaterial color="#f3e2c0" side={THREE.DoubleSide} /></mesh>
    </group>
  ));
}

/* ---------------- Toàn cảnh ---------------- */
// args: các bia · active: bia đang đứng trước · lit: thắp sáng tất cả (kết luận) · progress: ref vị trí cuộn
export default function Scene({ args, stops, progress, active, lit, drumClose, visited, onSelect }) {
  const n = args.length;
  const allLit = !!lit;
  return (
    <>
      <color attach="background" args={['#2a0907']} />
      <fog attach="fog" args={['#5a1a10', 30, 95]} />
      <hemisphereLight args={['#ffd9a0', '#2a0606', 0.55]} />
      <directionalLight position={[8, 14, 6]} intensity={2.2} color="#ffd89a" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-14} />
      <pointLight position={[0, 5, 0]} intensity={allLit ? 60 : 18} color="#ffb85c" distance={20} />

      <Sky />
      <Sun />
      <Mountains />
      <Cranes />

      {/* nền sân đá + vòng vàng */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[12.2, 96]} />
        <meshStandardMaterial color="#4a1612" roughness={0.75} metalness={0.15} />
      </mesh>
      {[3.6, 12.1].map((r) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[r, r + 0.12, 128]} />
          <meshStandardMaterial color="#e2b552" metalness={0.9} roughness={0.3} emissive="#a06a10" emissiveIntensity={allLit ? 1 : 0.3} />
        </mesh>
      ))}
      {/* mặt nước */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[80, 64]} />
        <meshStandardMaterial color="#1d0605" metalness={0.85} roughness={0.25} />
      </mesh>

      <Drum lit={allLit} labelOn={active < 0 && !drumClose} />
      {args.map((arg, i) => (
        <Tablet key={arg.key ?? arg.id} i={i} n={n} arg={arg} active={active === i} visited={visited.has(i)} onSelect={onSelect} allLit={allLit} />
      ))}
      {args.map((arg, i) => <Beam key={arg.key ?? arg.id} i={i} n={n} on={allLit || visited.has(i)} />)}

      <Sparkles count={200} scale={[32, 10, 32]} position={[0, 5, 0]} size={3.2} speed={0.35} color="#ffd77a" opacity={0.8} />

      <JourneyRig stops={stops} n={n} progress={progress} />
    </>
  );
}
