import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { MathUtils } from "three";

gsap.registerPlugin(ScrollTrigger);
const glbModel = new URL("../phone.glb", import.meta.url);
const hdrTextureUrl = new URL("../studio.hdr", import.meta.url);

const screenTextureUrl = new URL("../plantify.png", import.meta.url);
const screenTextureUrl2 = new URL("../plantify2.png", import.meta.url);

class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    // this.stats = new Stats();
    // document.body.appendChild(this.stats.dom);

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    this.camera.position.set(0, 0, -0.8);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);

    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  async resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    // image cover
    this.imageAspect = 853 / 1280;
    let a1;
    let a2;
    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = this.height / this.width / this.imageAspect;
    }

    this.camera.updateProjectionMatrix();
    if (this.width < 1281) {
      this.camera.position.set(0, 0, -0.8 * (1280 / this.width));
    } else {
      this.camera.position.set(0, 0, -0.8);
    }
  }

  addObjects() {
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const loader = new RGBELoader();
    loader.load(hdrTextureUrl, function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      sceneHelp.environment = texture;
    });

    let model;
    let sceneHelp = this.scene;
    let assetLoader = new GLTFLoader();
    assetLoader.load(
      glbModel.href,
      function (gltf) {
        model = gltf.scene;
        model.rotation.x = MathUtils.degToRad(20);
        model.rotation.y = MathUtils.degToRad(-40);
        model.rotation.z = MathUtils.degToRad(10);
        model.position.set(-0.2, 0.05, 0);
        sceneHelp.add(model);

        gltf.scene.traverse(function (child) {
          if (child.isMesh) {
            // child.material = material;
            child.position.set(0, 0, 0);
          }
          if (child.name == "Screen") {
            screen = child;
          }
        });

        let tl = gsap.timeline();
        tl.to(model.rotation, {
          y: MathUtils.degToRad(390),
          z: MathUtils.degToRad(-10),
          duration: 1,
          scrollTrigger: {
            trigger: "#container2",
            scrub: 1,
            start: "top top",
            endTrigger: "#container2helper",
            end: "center center",
            // toggleActions: "play pause resume reset",
            pin: true,
          },
        });
        tl.to(model.position, {
          x: 0.14,
          scrollTrigger: {
            trigger: "#container2",
            endTrigger: "#container2helper",
            scrub: 1,
            start: "top top",
            end: "center center",
            // toggleActions: "play pause resume reset",
            onUpdate: (self) => {
              const loader = new THREE.TextureLoader();
              // console.log(self.progress);
              if (self.progress < 0.35) {
                // TEXTURE SWAP
                loader.load(
                  screenTextureUrl,
                  function (texture) {
                    texture.encoding = THREE.sRGBEncoding;
                    texture.needsUpdate = true;
                    screen.children[0].material.map = texture;
                  },
                  undefined,
                  function (error) {
                    console.error(error);
                  }
                );
              } else {
                loader.load(
                  screenTextureUrl2,
                  function (texture) {
                    texture.encoding = THREE.sRGBEncoding;
                    texture.needsUpdate = true;
                    screen.children[0].material.map = texture;
                  },
                  undefined,
                  function (error) {
                    console.error(error);
                  }
                );
              }
            },
          },
        });
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
  }

  render() {
    // this.stats.update();
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.getElementById("container2"),
});
