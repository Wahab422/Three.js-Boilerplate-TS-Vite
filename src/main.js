import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';
import { GUI } from 'dat.gui';

export default class Sketch {
  constructor(options) {
    this.time = 0;
    this.container = options.dom;

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.camera.position.z = 8;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.container);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    this.textureLoader = new THREE.TextureLoader();


    this.textures = {
      PAK: 'https://cdn.prod.website-files.com/6688f693e1f09926e833b634/67a257e0711e765f4b6e2521_flag.jpg',
      USA: 'https://cdn.prod.website-files.com/6688f693e1f09926e833b634/67a266629f4a63dab441aeed_USA.png',
    };

    this.params = {
      width: 10,
      height: 7,
      widthSegments: 60,
      heightSegments: 60,
      selectedTexture: 'PAK',
      speed: 10,
    };
    this.updateTexture()
    this.resize();
    this.setupResize();
    this.addObject();
    this.addGUI()
    this.render();
  }

  addObject() {
    this.geometry = new THREE.PlaneGeometry(this.params.width, this.params.height, this.params.widthSegments, this.params.heightSegments)
    // this.material = new THREE.MeshNormalMaterial()
    // Fixed ShaderMaterial with corrected syntax
    this.material = new THREE.ShaderMaterial({
      map: this.texture,
      uniforms: {
        time: { value: 0 },
        uTexture: { value: this.params.texture },
        speed: { value: this.params.speed },
      },
      side: THREE.DoubleSide,
      wireframe: false,
      fragmentShader: fragment,
      vertexShader: vertex,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    console.log(this.material.uniforms)

  }

  addGUI() {
    this.gui = new GUI();

    this.gui.add(this.material, "wireframe").name("Wireframe");
    this.gui.add(this.params, "speed", -50, 50, 1).name('Speed').onChange(() => {
      this.material.uniforms.speed.value = this.params.speed
    })


    this.gui.add(this.params, "widthSegments", 1, 1000, 1).name("Width Segments").onChange(() => {
      this.updateGeometry();
    });

    this.gui.add(this.params, "heightSegments", 1, 100, 1).name("Height Segments").onChange(() => {
      this.updateGeometry();
    });

    this.gui.add(this.params, "selectedTexture", Object.keys(this.textures))
      .name("Texture")
      .onChange(() => {
        this.updateTexture();
      });
  }
  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  render() {
    this.time += 0.5;
    this.material.uniforms.time.value = this.time
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }

  updateGeometry() {
    this.mesh.geometry.dispose();
    this.mesh.geometry = new THREE.PlaneGeometry(this.params.width, this.params.height, this.params.widthSegments, this.params.heightSegments);
  }

  updateTexture() {
    console.log(`🔄 Loading texture: ${this.textures[this.params.selectedTexture]}`);

    const newTexture = this.textureLoader.load(
      this.textures[this.params.selectedTexture],
      (texture) => {
        this.material.uniforms.uTexture.value = texture;
      }
    );
  }

}

let sketch = new Sketch({
  dom: document.getElementById('canvas-wrapper'),
});