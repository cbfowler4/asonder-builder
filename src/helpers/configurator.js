import {
  ATTRIBUTE_CONFIG,
  SPECIAL_ATTRIBUTE_CONFIG,
  CONFIGURATOR_MIN_WIDTH,
  FONT_FILE_PATH,
} from '../helpers/configs';
import '../helpers/bendModifier';

import { FBXLoader } from '../helpers/FBXLoader';
import { isMobile } from '../helpers/helpers';
const { THREE } = window;


class Configurator {
  init(canvas, container) {
    this.container = container;
    this.canvas = canvas;
    this.createRenderer();

    this.scene = new THREE.Scene();
  
    this.createCamera();
    this.createControls();
    this.createParent();
    this.createLighting();
    this.initMaterial();
    this.render();
    // this.createStats();

    window.addEventListener('resize', () => {
      if (isMobile()) return;
      this.onResizeWindow();
    })

    window.addEventListener("orientationchange", () => {
      this.onResizeWindow();
    });
  }

  // ***************************************************** //
  // ******************** SCENE SETUP ******************** //
  // ***************************************************** //

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      precision: 'highp',
    });

    this.renderer.toneMappingExposure = 1.5;
    this.setSize();

    this.renderer.setSize(this.width, this.height);

    this.renderer.setClearColor(0x7e827f, 1); 
    this.renderer.gammaFactor = 2.2;
    this.renderer.gammaOutput = true;
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(45, this.width/this.height, 1, 150);
    this.camera.position.z = 1; 
    this.camera.position.y = 1;
    this.camera.position.x = -4;
  }

  createLighting() {
    var textLight = new THREE.DirectionalLight('#f7ebc0', .3);
    var textLight2 = new THREE.DirectionalLight('#f7ebc0', .3);
    var textLight3 = new THREE.DirectionalLight('#f7ebc0', .4);
    var light2 = new THREE.DirectionalLight('#f7ebc0', .5);
    var light3 = new THREE.DirectionalLight('#f7ebc0', .49);

    textLight.position.set(-1, -1, 0);
    textLight2.position.set(1, -1, 0);
    textLight3.position.set(1, 1, -1);
    light2.position.set(-1, 1, -1);
    light3.position.set(0, 1.5, 2.5);
  
    this.scene.add(textLight);
    this.scene.add(textLight2);
    this.scene.add(textLight3);
    this.scene.add(light2);
    this.scene.add(light3);    
  }

  createParent() {
    this.parent = new THREE.Group();
    this.parent.position.set(0, 0, 0);
    this.scene.add(this.parent);
  }

  createControls() {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);

    
    this.controls.maxDistance = 6;
    this.controls.minDistance = 3;
    this.controls.rotateSpeed = .5;
    this.controls.panSpeed = 0;

    this.controls.update();
    this.controls.addEventListener('change', () => this.render());
  }

  createStats() {
    this.stats = new Stats();
    this.stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
    this.container.appendChild(this.stats.domElement);
  }

  initMaterial() {
    if (this.material) return;
    this.material = new THREE.MeshStandardMaterial();
  }

  render() {
    if (!this.renderer) return;

    if (this.stats) this.stats.begin();

    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);


    if (this.stats) this.stats.end();
  }

  setSize() {
    this.canvas.style.width ='100%';
    this.width  = this.canvas.offsetWidth;

    this.canvas.style.height = window.innerWidth <= CONFIGURATOR_MIN_WIDTH ?
      `${window.innerHeight - 200}px` :
      '600px';
    this.height = this.canvas.offsetHeight;
  }
  

  onResizeWindow() {
    this.setSize();
    this.renderer.domElement.width = this.width;
    this.camera.aspect = this.width / this.height;
    this.renderer.setSize(this.width, this.height);
    this.camera.updateProjectionMatrix();
  }

  // ***************************************************** //
  // ***************** SCENE MANIPULATION **************** //
  // ***************************************************** //

  initFont() {
    this.fontLoader = new THREE.FontLoader();

    this.bendModifier = new THREE.BendModifier();
    
    const direction = new THREE.Vector3(0, 0, -1);
    const axis =  new THREE.Vector3(1, 0, 0);
    const angle = .19 * Math.PI;
    this.bendModifier.set(direction, axis, angle);

    const loader = new THREE.TTFLoader();
    const fontLoader = new THREE.FontLoader();

    loader.load(FONT_FILE_PATH, (font) => this.font = fontLoader.parse(font));
  }

  centerModel() {
    const { x, z } = new THREE.Box3().setFromObject(this.model).getCenter();
    this.model.position.set(-1 * x, 0, -1 * z);
  }

  rotateOnYAxis(angle) {
    this.parent.rotateY(angle);
    this.render();
  }

  async loadModel(url, progressCB) {
    if (!this.loader) this.loader = new FBXLoader();

    return new Promise((resolve, reject) => {
      this.loader.load(url,
        (model) => {
          this.parent.add(model);
          this.model = model;
          this.model.rotateX( Math.PI / 2 );
          this.model.rotateY( Math.PI );
          this.majorAttr = ATTRIBUTE_CONFIG.major.versions[0].id;
          
          this.initFont();
          this.centerModel();
          this.addPostProcessing();
          this.updateMaterial(SPECIAL_ATTRIBUTE_CONFIG.material.versions[0].materialProperties);
          resolve(model);
        },
        progressCB,
        (error) => {
          console.log( 'An error happened', error );
          reject();
        }
      );
    })
  };

  updateText(text) {
    if (!this.font) { console.log('ERROR: NO FONT LOADED'); return; }

    var geometry = new THREE.TextGeometry(text, {
      font: this.font,
      size: .15,
      height: .03,
      curveSegments: 50,
    } );
    
    this.bendModifier.modify(geometry);

    if (this.textModel) this.model.remove(this.textModel);

    this.textModel = new THREE.Mesh(geometry, this.material);
    this.model.add(this.textModel)

    this.textModel.position.set(.25, 1, -.05);
    this.textModel.rotateY(Math.PI / 2)
    this.textModel.rotateZ(Math.PI / 2)
  }

  addPostProcessing() {
    this.composer = new THREE.EffectComposer(this.renderer);

    const renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    const saoPass = new THREE.SAOPass(
      this.scene,
      this.camera,
      true,
      false,
    );
    saoPass.params = {
      output: 0,
      saoBias: 6.5,
      saoIntensity: .3,
      saoScale: 12,
      saoKernelRadius: 8,
      saoMinResolution: 0,
      saoBlur: false,
      saoBlurRadius: 300,
      saoBlurStdDev: 0.05,
      saoBlurDepthCutoff: 0.01,
    };
    
    this.composer.addPass(saoPass);

    
    const bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2(this.container.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = .75;
    bloomPass.strength = .3;
    bloomPass.radius = .01;
    this.composer.addPass(bloomPass);
    
    const vigPass = new THREE.ShaderPass(THREE.VignetteShader);
    this.composer.addPass(vigPass);


    const fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);
    var pixelRatio = this.renderer.getPixelRatio();
    fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / (this.canvas.offsetWidth * pixelRatio);
    fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / (this.canvas.offsetHeight * pixelRatio);

    this.composer.addPass(fxaaPass); 
  }


  // ***************************************************** //
  // ***************** MODEL MANIPULATION **************** //
  // ***************************************************** //

  generateModelOptions() {
    const modelOptions = {};
    this.model.traverse((node) => {
      const [opt, size, name, versionFull] = node.name.split('-');
      if (!versionFull || opt !== 'opt') return;
      const version = versionFull.split('_')[0];
      
      const dispAttributes = ATTRIBUTE_CONFIG[name];

      if (!ATTRIBUTE_CONFIG[name]) return;
      const defaultVersion = dispAttributes.versions[0];
      
      // TEMP TRANSLATION TO GET PARENT GROUP //
      const translatedVersion = version.length === 3 ? version.slice(0, 2) : '';
      if (!translatedVersion) return;

      const selected = defaultVersion.id === translatedVersion && this.majorAttr === size;
      const newOption = {
        id: node.ID,
        name: node.name,
        selected,
      }

      if (!size || !name || !version) return;
      if (!modelOptions[size]) modelOptions[size] = {};
      if (!modelOptions[size][name]) modelOptions[size][name] = {};

      modelOptions[size][name][translatedVersion] = newOption; // TEMP TRANSLATION VERSION TO SET OPTION
    });

    return modelOptions;
  }

  show(name) {
    if (!this.model) return;
    const obj = this.model.getObjectByName(name);
    if (!obj) return;
    obj.visible = true;
  }
  
  hide(name) {
    if (!this.model) return;
    const obj = this.model.getObjectByName(name);
    if (!obj) return;
    obj.visible = false;
  }

  updateModel(modelOptions) {
    Object.values(modelOptions).forEach((minorAttrs) => {
      Object.values(minorAttrs).forEach((versions) => {
        Object.values(versions).forEach((version) => {
          if (version.selected) {
            this.show(version.name);
          } else {
            this.hide(version.name);
          }
        })
      })
    })

    this.render(); // call render on updating of model
  }

  updateMaterial(materialProperties) {
    if (!this.model || !materialProperties) {
      console.log(`NO MODEL OR MATERIAL PROPERTIES COULD NOT BE FOUND`);
      return;
    }

    const iterateOverMaterialPropertiesAndUpdate = (materialToUpdate) => {
      Object.keys(materialProperties).forEach((key) => {
        materialToUpdate[key] = materialProperties[key];
      })
    }

    iterateOverMaterialPropertiesAndUpdate(this.material);
    
    this.model.traverse((node) => {
      if (node.type === 'Mesh') {
        iterateOverMaterialPropertiesAndUpdate(node.material);
      }
    });
  }
}

export default new Configurator();