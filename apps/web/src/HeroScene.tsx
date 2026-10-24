import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = host.current;
    if (!root) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 2.8, 9.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(root.clientWidth, root.clientHeight);
    root.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x9acfff, 2));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3);
    keyLight.position.set(4, 7, 6);
    scene.add(keyLight);

    const blueLight = new THREE.PointLight(0x168bff, 35, 15);
    blueLight.position.set(-4, 2, 2);
    scene.add(blueLight);

    const truck = new THREE.Group();
    scene.add(truck);

    const containerMat = new THREE.MeshStandardMaterial({
      color: 0x123e65,
      metalness: 0.72,
      roughness: 0.3
    });

    const ribMat = new THREE.MeshStandardMaterial({
      color: 0x287db5,
      metalness: 0.65,
      roughness: 0.35
    });

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x071321,
      metalness: 0.5,
      roughness: 0.55
    });

    const lightMat = new THREE.MeshStandardMaterial({
      color: 0x75dcff,
      emissive: 0x159ce8,
      emissiveIntensity: 3
    });

    const container = new THREE.Mesh(
      new THREE.BoxGeometry(3.65, 1.55, 1.55),
      containerMat
    );
    container.position.set(-0.7, 1.25, 0);
    truck.add(container);

    for (let i = 0; i < 17; i++) {
      const rib = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 1.48, 1.58),
        ribMat
      );
      rib.position.set(-2.48 + i * 0.22, 1.25, 0);
      truck.add(rib);
    }

    const cab = new THREE.Mesh(
      new THREE.BoxGeometry(1.05, 1.18, 1.48),
      ribMat
    );
    cab.position.set(1.68, 1.08, 0);
    truck.add(cab);

    const windshield = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.65, 1.18),
      darkMat
    );
    windshield.position.set(2.22, 1.28, 0);
    truck.add(windshield);

    const chassis = new THREE.Mesh(
      new THREE.BoxGeometry(5.15, 0.22, 1.35),
      darkMat
    );
    chassis.position.set(-0.1, 0.45, 0);
    truck.add(chassis);

    const wheels: THREE.Mesh[] = [];

    for (const x of [-1.95, 1.45]) {
      for (const z of [-0.79, 0.79]) {
        const wheel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.43, 0.43, 0.22, 32),
          darkMat
        );
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(x, 0.48, z);
        truck.add(wheel);
        wheels.push(wheel);

        const hub = new THREE.Mesh(
          new THREE.CylinderGeometry(0.19, 0.19, 0.235, 24),
          ribMat
        );
        hub.rotation.x = Math.PI / 2;
        hub.position.copy(wheel.position);
        truck.add(hub);
      }
    }

    for (const z of [-0.52, 0.52]) {
      const lamp = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.18, 0.2),
        lightMat
      );
      lamp.position.set(2.23, 0.82, z);
      truck.add(lamp);
    }

    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 12),
      new THREE.MeshStandardMaterial({
        color: 0x071523,
        metalness: 0.2,
        roughness: 0.9
      })
    );
    road.rotation.x = -Math.PI / 2;
    road.position.y = -0.03;
    scene.add(road);

    const laneMat = new THREE.MeshBasicMaterial({
      color: 0x29baff,
      transparent: true,
      opacity: 0.65
    });

    const laneLines: THREE.Mesh[] = [];

    for (let i = 0; i < 9; i++) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(1.15, 0.018, 0.035),
        laneMat
      );
      line.position.set(-7 + i * 2, 0, -1.1);
      scene.add(line);
      laneLines.push(line);
    }

    const points = new Float32Array(180 * 3);

    for (let i = 0; i < 180; i++) {
      points[i * 3] = (Math.random() - 0.5) * 14;
      points[i * 3 + 1] = Math.random() * 5.5;
      points[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(points, 3)
    );

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0x69d6ff,
        size: 0.035,
        transparent: true,
        opacity: 0.8
      })
    );
    scene.add(particles);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let frame = 0;
    let raf = 0;

    const resize = () => {
      const width = root.clientWidth;
      const height = root.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(root);
    resize();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!reducedMotion) frame += 0.012;

      truck.position.y = Math.sin(frame * 1.7) * 0.045;
      truck.rotation.y = Math.sin(frame * 0.45) * 0.045;

      if (!reducedMotion) {
        wheels.forEach((wheel) => {
          wheel.rotation.z += 0.045;
        });

        laneLines.forEach((line) => {
          line.position.x -= 0.035;
          if (line.position.x < -8) line.position.x = 8;
        });

        particles.rotation.y = frame * 0.035;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();

      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Points
        ) {
          object.geometry.dispose();

          const material = object.material;
          if (Array.isArray(material)) {
            material.forEach((item) => item.dispose());
          } else {
            material.dispose();
          }
        }
      });

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      className="hero-scene"
      ref={host}
      aria-label="Animated 3D freight truck"
      role="img"
    />
  );
    }
