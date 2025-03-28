import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const vertexShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
            uniform float uTime;
            uniform vec3 uPulseOrigin;
            varying vec3 vPosition;

            void main() {
                float dist = distance(vPosition, uPulseOrigin);
                float pulse = sin((dist - uTime) * 5.0) * exp(-dist * 2.0);
                pulse = max(pulse, 0.0);

                vec3 baseColor = vec3(0.1, 0.1, 0.1); // very dark gray
                vec3 pulseColor = vec3(0.0, 0.6, 1.0); // bluish pulse
                vec3 finalColor = baseColor + pulse * pulseColor;

                gl_FragColor = vec4(finalColor, 0.3); // Add transparency
            }     
        `;

@Component({
    selector: 'app-flipper-ball',
    templateUrl: './flipper-ball.component.html',
    styleUrl: './flipper-ball.component.scss',
    standalone: false
})
export class FlipperBallComponent implements AfterViewInit {
    @ViewChild('canvas')
    canvas!: ElementRef<HTMLCanvasElement>;

    private height = window.innerHeight;
    private width = window.innerWidth;

    private camera = this.initCamera();
    private renderer!: THREE.WebGLRenderer;
    private scene: THREE.Scene = new THREE.Scene();

    private light!: THREE.PointLight;
    private lightRadius: number = 8;
    private lightAngle: number = 0;

    private flipperBall!: THREE.Mesh
    private pulseStartTime: number = 0;

    private g: number = 9.81;
    public bounceVelocity: number = 1.2;
    private velocity: THREE.Vector3 = new THREE.Vector3(0.05, 0.05, 0.05);
    private containerBallRadius: number = 6;
    private lastTime: number = performance.now();
    private maxVelocity: number = 15;

    //Form controls
    public bounceVelocityControl = new FormControl(this.bounceVelocity);

    constructor(
        private cdr: ChangeDetectorRef
    ) {
    }

    public async ngAfterViewInit(): Promise<void> {
        // canvas should be available in ngAfterViewInit but not in ngOnInit
        const canvas = this.canvas.nativeElement;
        this.renderer = this.initRenderer(canvas, this.width, this.height);

        this.initAnimation();
        this.cdr.detectChanges();

        this.bounceVelocityControl.valueChanges.subscribe(value => {
            if (typeof value === 'number') {
                this.bounceVelocity = value;
            }
        });
    }

    private pulseUniforms = {
        uTime: { value: 0 },
        uPulseOrigin: { value: new THREE.Vector3(0, 0, 0) }
    };

    private pulseMaterial = new THREE.ShaderMaterial({
        uniforms: this.pulseUniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });


    private initCamera(): THREE.PerspectiveCamera {
        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);

        camera.position.set(0, 0, 20);
        camera.updateProjectionMatrix();

        return camera;
    }

    private initAnimation() {
        const canvas = this.canvas.nativeElement;

        if (!canvas) {
            return;
        }

        // Set up the controls
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.enableDamping = true; // For smooth controls
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;

        // ambient light
        this.scene.add(new THREE.AmbientLight(0xffffff));

        // point light
        this.light = new THREE.PointLight(0xffffff, 400);
        this.light.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 8), new THREE.MeshBasicMaterial({ color: 0xff0040 })));
        this.light.position.set(10, 0, 10);

        this.scene.add(this.light);

        let group = new THREE.Group()
        this.scene.add(group);


        // Create the ball
        const cageBallGeometry = new THREE.SphereGeometry(this.containerBallRadius);
        const cageBall = new THREE.Mesh(cageBallGeometry, this.pulseMaterial);


        // Create the ball
        const ballGeometry = new THREE.SphereGeometry(0.3); // Sphere with radius 1, 32 segments (detail)
        const ballMaterial = new THREE.MeshStandardMaterial({ color: "blue", roughness: 0 }); // Green color
        this.flipperBall = new THREE.Mesh(ballGeometry, ballMaterial); // Create the mesh

        // Add the bal
        group.add(cageBall);
        group.add(this.flipperBall);

        // Position the group (optional)
        group.position.set(0, 0, 0); // Set the position of the group in the scene

        this.flipperBall.position.set(-5, -2, -1.8);


        this.renderer.setAnimationLoop(this.animate.bind(this));
    }

    private animate() {
        this.lightAngle += 0.01;
        this.lightAngle = this.lightAngle % (2 * Math.PI);

        const x = this.lightRadius * Math.cos(this.lightAngle);
        const z = this.lightRadius * Math.sin(this.lightAngle);
        this.light.position.set(x, 0, z);

        this.updateFlipperBallPositions();

        const currentTime = performance.now() / 1000;
        this.pulseUniforms['uTime'].value = currentTime - this.pulseStartTime;

        this.renderer.render(this.scene, this.camera);
    }

    private updateFlipperBallPositions() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert ms to seconds
        this.lastTime = currentTime;

        // Gravity (applied in -Y direction)
        this.velocity.y -= this.g * deltaTime;

        // Update position
        if (this.velocity.length() > this.maxVelocity) {
            this.velocity.setLength(this.maxVelocity);
        }
        this.flipperBall.position.addScaledVector(this.velocity, deltaTime);

        // Check collision with the inner surface of the cageBall
        const distanceFromCenter = this.flipperBall.position.length();
        const maxDistance = this.containerBallRadius - 0.3; // Subtract flipperBall's radius

        if (distanceFromCenter >= maxDistance) {
            // Normalize position to get the collision normal
            const normal = this.flipperBall.position.clone().normalize();

            // Project velocity onto the normal to get component towards the surface
            const velocityAlongNormal = normal.clone().multiplyScalar(this.velocity.dot(normal));

            // Reflect velocity and apply bounce
            this.velocity.sub(velocityAlongNormal.multiplyScalar(1 + this.bounceVelocity));

            // Reposition ball just inside the boundary to prevent tunneling
            this.flipperBall.position.copy(normal.multiplyScalar(maxDistance));

            this.pulseUniforms['uPulseOrigin'].value.copy(this.flipperBall.position);
            this.pulseStartTime = performance.now() / 1000;
        }
    }

    @HostListener('window:resize')
    private onResize(): void {
        this.resizeCamera(this.camera, window.innerWidth, window.innerHeight);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private resizeCamera(
        camera: THREE.PerspectiveCamera,
        width: number,
        height: number,
    ): void {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    private initRenderer(
        canvas: HTMLCanvasElement,
        width: number,
        height: number,
    ): THREE.WebGLRenderer {
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
        });
        renderer.setClearColor(0x000000, 0.4);
        renderer.setSize(width, height);
        // sharp look on retina displays
        renderer.setPixelRatio(window.devicePixelRatio);

        return renderer;
    }
}
