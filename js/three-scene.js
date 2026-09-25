/**
 * Three.js 3D Kinetic Gyroscopic Energy Core
 * Features: Multi-layered nested gold & titanium kinetic rings, pulsing energy core,
 * mouse-driven rotation velocity, full 360° drag controls, and click-triggered 3D shockwaves!
 */

class KineticGyroEnergyCore {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container || typeof THREE === 'undefined') {
            console.warn('Three.js container or library not found');
            return;
        }

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.masterGroup = null;
        this.coreSphere = null;
        this.coreWireframe = null;
        this.gyroRings = [];
        this.shockwaves = [];
        this.sparkParticles = null;

        // Interaction state
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseSpeed = 0;
        this.prevMouse = { x: 0, y: 0 };
        this.targetRotationX = 0.2;
        this.targetRotationY = 0.4;
        this.currentRotationX = 0.2;
        this.currentRotationY = 0.4;
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || (window.innerHeight * 0.7);

        // 1. Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x060709, 0.03);

        // 2. Camera setup
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(0, 0, 9.2);

        // 3. Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.4;

        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);

        // 4. Lighting
        this.setupLighting();

        // 5. Build Kinetic Gyroscope
        this.buildGyroscope();

        // 6. Build Shockwave and Spark System
        this.setupSparkParticles();

        // 7. Event Listeners (Parallax, Drag, Click Shockwave)
        this.setupEvents();

        // 8. Animation Loop
        this.animate();
    }

    setupLighting() {
        const ambient = new THREE.AmbientLight(0x1a1510, 1.8);
        this.scene.add(ambient);

        // Studio Key Light (Champagne Soft White)
        const keyLight = new THREE.DirectionalLight(0xfff7e6, 3.5);
        keyLight.position.set(6, 8, 6);
        this.scene.add(keyLight);

        // Royal Gold Rim Light (Bottom Back)
        const goldRim = new THREE.DirectionalLight(0xd4af37, 4.8);
        goldRim.position.set(-6, -5, -4);
        this.scene.add(goldRim);

        // Cyan / Electric Accent (Left Front)
        const cyanAccent = new THREE.PointLight(0x00f0ff, 2.5, 15);
        cyanAccent.position.set(-4, 3, 4);
        this.scene.add(cyanAccent);

        // Center Pulsing Core Light
        this.coreLight = new THREE.PointLight(0xffd700, 4.0, 8);
        this.coreLight.position.set(0, 0, 0);
        this.scene.add(this.coreLight);
    }

    buildGyroscope() {
        this.masterGroup = new THREE.Group();

        // ----------------------------------------------------
        // A. CENTRAL PULSING ENERGY CORE
        // ----------------------------------------------------
        const coreGeo = new THREE.IcosahedronGeometry(0.85, 4);
        const coreMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            emissive: 0xf59e0b,
            emissiveIntensity: 0.8,
            metalness: 0.85,
            roughness: 0.2
        });
        this.coreSphere = new THREE.Mesh(coreGeo, coreMat);
        this.masterGroup.add(this.coreSphere);

        // Core Wireframe Cage
        const wireGeo = new THREE.IcosahedronGeometry(1.05, 2);
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            wireframe: true,
            transparent: true,
            opacity: 0.45
        });
        this.coreWireframe = new THREE.Mesh(wireGeo, wireMat);
        this.masterGroup.add(this.coreWireframe);

        // ----------------------------------------------------
        // B. NESTED MULTI-TIERED KINETIC RINGS
        // ----------------------------------------------------
        const goldMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.98,
            roughness: 0.15
        });

        const darkTitaniumMat = new THREE.MeshStandardMaterial({
            color: 0x181c24,
            metalness: 0.9,
            roughness: 0.3
        });

        const cyanNeonMat = new THREE.MeshStandardMaterial({
            color: 0x00f0ff,
            emissive: 0x00f0ff,
            emissiveIntensity: 0.75,
            metalness: 0.8,
            roughness: 0.2
        });

        // 1. Ring 1: Outer Titan Master Ring (Radius ~3.6)
        const r1Group = new THREE.Group();
        const r1Geo = new THREE.TorusGeometry(3.6, 0.08, 24, 80);
        const r1Mesh = new THREE.Mesh(r1Geo, darkTitaniumMat);
        r1Group.add(r1Mesh);

        // Gold Inlay on Outer Ring
        const r1InlayGeo = new THREE.TorusGeometry(3.6, 0.03, 16, 80);
        const r1Inlay = new THREE.Mesh(r1InlayGeo, goldMat);
        r1Inlay.position.z = 0.02;
        r1Group.add(r1Inlay);

        // 4 Golden Nodes on Outer Ring
        [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(angle => {
            const nodeGeo = new THREE.SphereGeometry(0.16, 16, 16);
            const node = new THREE.Mesh(nodeGeo, goldMat);
            node.position.set(Math.cos(angle) * 3.6, Math.sin(angle) * 3.6, 0);
            r1Group.add(node);
        });

        this.masterGroup.add(r1Group);
        this.gyroRings.push({ group: r1Group, speedX: 0.005, speedY: 0.008, speedZ: 0.002, axis: 'xyz' });

        // 2. Ring 2: Middle Gyro Gold Ring (Radius ~2.8)
        const r2Group = new THREE.Group();
        const r2Geo = new THREE.TorusGeometry(2.8, 0.07, 20, 64);
        const r2Mesh = new THREE.Mesh(r2Geo, goldMat);
        r2Group.add(r2Mesh);

        // Cyan Glowing Thin Orbit on Ring 2
        const r2CyanGeo = new THREE.TorusGeometry(2.78, 0.025, 16, 64);
        const r2Cyan = new THREE.Mesh(r2CyanGeo, cyanNeonMat);
        r2Group.add(r2Cyan);

        r2Group.rotation.x = Math.PI / 3;
        this.masterGroup.add(r2Group);
        this.gyroRings.push({ group: r2Group, speedX: -0.008, speedY: 0.012, speedZ: -0.005, axis: 'yx' });

        // 3. Ring 3: Fast Inner Titanium Ring (Radius ~2.0)
        const r3Group = new THREE.Group();
        const r3Geo = new THREE.TorusGeometry(2.0, 0.06, 16, 64);
        const r3Mesh = new THREE.Mesh(r3Geo, darkTitaniumMat);
        r3Group.add(r3Mesh);

        // Gold Trim on Ring 3
        const r3TrimGeo = new THREE.TorusGeometry(2.0, 0.02, 16, 64);
        const r3Trim = new THREE.Mesh(r3TrimGeo, goldMat);
        r3Group.add(r3Trim);

        r3Group.rotation.y = Math.PI / 4;
        this.masterGroup.add(r3Group);
        this.gyroRings.push({ group: r3Group, speedX: 0.015, speedY: -0.007, speedZ: 0.012, axis: 'zx' });

        // 4. Ring 4: Ultra-Fast Core Orbit Track (Radius ~1.4)
        const r4Group = new THREE.Group();
        const r4Geo = new THREE.TorusGeometry(1.4, 0.035, 16, 48);
        const r4Mesh = new THREE.Mesh(r4Geo, cyanNeonMat);
        r4Group.add(r4Mesh);

        r4Group.rotation.z = Math.PI / 6;
        this.masterGroup.add(r4Group);
        this.gyroRings.push({ group: r4Group, speedX: -0.02, speedY: 0.025, speedZ: -0.018, axis: 'zy' });

        // Outer Floating Holographic Gyro Halo
        const haloGeo = new THREE.RingGeometry(4.3, 4.35, 64);
        const haloMat = new THREE.MeshBasicMaterial({
            color: 0xd4af37,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        this.masterGroup.add(halo);
        this.gyroRings.push({ group: halo, speedX: 0.002, speedY: -0.003, speedZ: 0.004, axis: 'z' });

        this.masterGroup.rotation.x = 0.25;
        this.masterGroup.rotation.y = 0.45;
        this.scene.add(this.masterGroup);
    }

    setupSparkParticles() {
        const count = 120;
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const goldColor = new THREE.Color(0xffd700);
        const cyanColor = new THREE.Color(0x00f0ff);

        for (let i = 0; i < count; i++) {
            const radius = Math.random() * 4.5 + 0.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            const c = Math.random() > 0.4 ? goldColor : cyanColor;
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });

        this.sparkParticles = new THREE.Points(geo, mat);
        this.masterGroup.add(this.sparkParticles);
    }

    // Trigger Expanding 3D Shockwave Pulse on Click!
    triggerShockwave() {
        const shockGeo = new THREE.RingGeometry(0.8, 0.95, 48);
        const shockMat = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0xffd700 : 0x00f0ff,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });
        const shockMesh = new THREE.Mesh(shockGeo, shockMat);
        shockMesh.rotation.x = Math.random() * Math.PI;
        shockMesh.rotation.y = Math.random() * Math.PI;
        this.masterGroup.add(shockMesh);

        this.shockwaves.push({
            mesh: shockMesh,
            scale: 1,
            maxScale: 6.5,
            opacity: 0.9
        });

        // Boost core pulse flash
        if (this.coreLight) {
            this.coreLight.intensity = 9.0;
        }
    }

    setupEvents() {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;

            // Calculate mouse velocity for kinetic rotation speed
            const dx = e.clientX - this.prevMouse.x;
            const dy = e.clientY - this.prevMouse.y;
            this.mouseSpeed = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.002, 0.08);
            this.prevMouse = { x: e.clientX, y: e.clientY };

            this.mouseX = x;
            this.mouseY = y;

            if (!this.isDragging) {
                this.targetRotationY = 0.45 + x * 0.6;
                this.targetRotationX = 0.25 - y * 0.4;
            }
        });

        const dom = this.renderer.domElement;

        // Click on 3D Canvas -> Shockwave Pulse!
        dom.addEventListener('click', () => {
            this.triggerShockwave();
        });

        // Drag to freely rotate entire Gyroscope
        const onDown = (clientX, clientY) => {
            this.isDragging = true;
            this.previousMousePosition = { x: clientX, y: clientY };
        };

        const onMove = (clientX, clientY) => {
            if (!this.isDragging || !this.masterGroup) return;
            const deltaX = clientX - this.previousMousePosition.x;
            const deltaY = clientY - this.previousMousePosition.y;

            this.masterGroup.rotation.y += deltaX * 0.008;
            this.masterGroup.rotation.x += deltaY * 0.008;

            this.targetRotationY = this.masterGroup.rotation.y;
            this.targetRotationX = this.masterGroup.rotation.x;

            this.previousMousePosition = { x: clientX, y: clientY };
        };

        const onUp = () => {
            this.isDragging = false;
        };

        dom.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => {
            if (this.isDragging) onMove(e.clientX, e.clientY);
        });
        window.addEventListener('mouseup', onUp);

        dom.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                onDown(e.touches[0].clientX, e.touches[0].clientY);
                this.triggerShockwave();
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (this.isDragging && e.touches.length === 1) {
                onMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        window.addEventListener('touchend', onUp);

        window.addEventListener('resize', () => this.onResize());
    }

    onResize() {
        if (!this.container || !this.renderer || !this.camera) return;
        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || (window.innerHeight * 0.7);

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const elapsedTime = this.clock.getElapsedTime();
        const speedBoost = 1.0 + this.mouseSpeed * 8.0;

        // Smooth master orientation
        if (!this.isDragging && this.masterGroup) {
            this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.05;
            this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.05;

            this.masterGroup.rotation.x = this.currentRotationX + Math.sin(elapsedTime * 1.2) * 0.04;
            this.masterGroup.rotation.y = this.currentRotationY + Math.cos(elapsedTime * 1.0) * 0.04;
            this.masterGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.15; // Floating levitation
        }

        // Pulse Center Core Sphere
        if (this.coreSphere && this.coreWireframe) {
            const scale = 1.0 + Math.sin(elapsedTime * 3.5) * 0.08;
            this.coreSphere.scale.set(scale, scale, scale);
            this.coreWireframe.rotation.x += 0.01;
            this.coreWireframe.rotation.y -= 0.015;
        }

        // Decay core light back to normal
        if (this.coreLight) {
            this.coreLight.intensity = THREE.MathUtils.lerp(
                this.coreLight.intensity,
                3.5 + Math.sin(elapsedTime * 4.0) * 1.2,
                0.05
            );
        }

        // Rotate each Kinetic Ring with its individual axis & momentum
        this.gyroRings.forEach(ring => {
            if (ring.axis.includes('x')) ring.group.rotation.x += ring.speedX * speedBoost;
            if (ring.axis.includes('y')) ring.group.rotation.y += ring.speedY * speedBoost;
            if (ring.axis.includes('z')) ring.group.rotation.z += ring.speedZ * speedBoost;
        });

        // Rotate Orbiting Spark Cloud
        if (this.sparkParticles) {
            this.sparkParticles.rotation.y += 0.003;
            this.sparkParticles.rotation.x -= 0.002;
        }

        // Expand and animate active shockwaves
        for (let i = this.shockwaves.length - 1; i >= 0; i--) {
            const sw = this.shockwaves[i];
            sw.scale += 0.18;
            sw.opacity -= 0.025;
            sw.mesh.scale.set(sw.scale, sw.scale, sw.scale);
            sw.mesh.material.opacity = Math.max(0, sw.opacity);

            if (sw.opacity <= 0 || sw.scale >= sw.maxScale) {
                this.masterGroup.remove(sw.mesh);
                sw.mesh.geometry.dispose();
                sw.mesh.material.dispose();
                this.shockwaves.splice(i, 1);
            }
        }

        // Decay mouse speed
        this.mouseSpeed *= 0.92;

        this.renderer.render(this.scene, this.camera);
    }
}

window.initDumbbellScene = function() {
    if (document.getElementById('dumbbell-3d-container')) {
        window.dumbbellScene = new KineticGyroEnergyCore('dumbbell-3d-container');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.initDumbbellScene();
});
