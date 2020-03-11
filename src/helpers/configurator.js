import {
  ATTRIBUTE_CONFIG,
  SPECIAL_ATTRIBUTE_CONFIG,
  CONFIGURATOR_MIN_WIDTH,
  FONT_FILE_PATH,
  BG_COLOR,
  BG_ALPHA,
  CONTROL_SETTINGS,
  MODEL_SCALE,
} from '../helpers/configs';
import '../helpers/bendModifier';

import { isMobile } from '../helpers/helpers';
const { THREE } = window;


class Configurator {
  init(canvas, container) {
    this.container = container;
    this.canvas = canvas;
    this.createRenderer();

    this.scene = new THREE.Scene();
  
    const axesHelper = new THREE.AxesHelper(2);
    this.scene.add( axesHelper );

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
      alpha: true,
    });

    this.renderer.toneMappingExposure = 1.5;
    this.renderer.gammaFactor = 2.2;
    this.renderer.gammaOutput = true;
    this.renderer.setClearColor(BG_COLOR, BG_ALPHA);
    this.setSize();

    this.renderer.setSize(this.width, this.height);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(35, this.width/this.height, 0.5, 15);
    this.camera.position.z = 1; 
    this.camera.position.y = 0;
    this.camera.position.x = isMobile() ? -10 : -6;
  }

  createLighting() {
    var textLight = new THREE.DirectionalLight('#edece4', .35);
    var textLight2 = new THREE.DirectionalLight('#edece4', .5);
    var light2 = new THREE.DirectionalLight('#edece4', .5);
    var light3 = new THREE.DirectionalLight('#edece4', .5);

    textLight.position.set(-1, -.4, 0);
    textLight2.position.set(1, .5, 0);
    light2.position.set(-1, 1, -1);
    light3.position.set(0, 1.5, 2.5);
  
    this.scene.add(textLight);
    this.scene.add(textLight2);
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
    this.controls.addEventListener('change', () => { this.render(); });

    this.resetControls();
  }

  resetControls() {
    this.updateControls(CONTROL_SETTINGS.default);
    this.controls.reset();
    this.render();
  }

  updateControls(properties) {
    Object.keys(properties).forEach(prop => {
      this.controls[prop] = properties[prop];
    });

    this.controls.reset();
  }

  createStats() {
    this.stats = new Stats();
    this.stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
    this.container.appendChild(this.stats.domElement);
    this.stats.domElement.style.position = 'absolute';
  }

  initMaterial() {
    if (this.material) return;
    this.material = new THREE.MeshPhongMaterial({ wireframe: false });
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
    this.height = this.width <= CONFIGURATOR_MIN_WIDTH ?
      .85 * window.innerHeight :
      this.canvas.offsetHeight;
  }
  
  onResizeWindow() {
    this.setSize();
    this.renderer.domElement.width = this.width;
    this.camera.aspect = this.width / this.height;
    this.renderer.setSize(this.width, this.height);
    this.composer.setSize(this.width, this.height);

    this.camera.updateProjectionMatrix();
    this.render();
  }

  // ***************************************************** //
  // ***************** SCENE MANIPULATION **************** //
  // ***************************************************** //

  initFont() {
    this.fontLoader = new THREE.FontLoader();

    this.bendModifier = new THREE.BendModifier();
    
    const direction = new THREE.Vector3(0, 0, -1);
    const axis =  new THREE.Vector3(1, 0, 0);
    const angle = .18 * Math.PI;
    this.bendModifier.set(direction, axis, angle);

    const fontLoader = new THREE.FontLoader();

    fontLoader.load(FONT_FILE_PATH, (font) => this.font = font);
  }

  centerModel() {
    const { x, z } = this.getCenter();
    const position = this.model.position;
    this.setPosition( position.x - x, 0, position.z - z );
    this.resetControls();
  }

  getCenter(object) {
    return new THREE.Box3().setFromObject(object || this.model).getCenter();
  }

  setPosition(x, y, z) {
    this.model.position.set(x, y, z);
    this.render();
  }

  setMaterial() {
    this.model.traverse((node) => {
      if (node.type === 'Mesh') node.material = this.material;
    });
  }

  rotateOnYAxis(angle) {
    this.parent.rotateY(angle);
    this.render();
  }

  async loadModel(url, progressCB) {
    if (!this.loader) {
      this.loader = new THREE.GLTFLoader();
      const dracoLoader = new THREE.DRACOLoader();
      dracoLoader.setDecoderPath('https://uncut-pipes.s3.amazonaws.com/js/draco/');
      dracoLoader.preload();
      this.loader.setDRACOLoader(dracoLoader);
    }


    return new Promise((resolve, reject) => {
      this.loader.load(url,
        (gltf) => {
          const model = gltf.scene.children[0];
          this.parent.add(model);
          this.model = model;
          this.model.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
          this.model.rotateX( Math.PI / 2 );
          this.model.rotateY( Math.PI );

          this.initFont();
          this.centerModel();
          this.setMaterial();
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

    const geometry = new THREE.TextGeometry(text, {
      font: this.font,
      size: .07,
      height: .05,
      curveSegments: 3,
    } );
  
    this.bendModifier.modify(geometry);

    if (this.textModel) this.scene.remove(this.textModel);

    const stem = this.model.getObjectById(this.stemId);
    const scale = stem.getWorldScale();
    this.textModel = new THREE.Mesh(geometry, this.material);
    
    this.textModel.scale.set(1/scale.x, 1/scale.y, 1/scale.z);

    stem.add(this.textModel);

    this.setTextPosition();

    this.render();
  }

  setTextPosition() {
    if (!this.textModel) return;
    // Rotate first to ensure coordinate similarity
    this.textModel.rotateX(Math.PI / 2);
    this.textModel.rotateY(Math.PI / 2);
  
    const stem = this.model.getObjectById(this.stemId);
    const stemBox = new THREE.Box3().setFromObject(stem);
    const stemCenter = stemBox.getCenter();
    const textSize = new THREE.Box3().setFromObject(this.textModel).getSize();

    const x = stemBox.min.x;
    const y = stemCenter.y - textSize.y / 2;
    const z = stemCenter.z - textSize.z / 2;

    this.textModel.position.set(0, 0, 0);
  }

  addPostProcessing() {
    this.composer = new THREE.EffectComposer(this.renderer);

    const copyPass = new THREE.ShaderPass(THREE.CopyShader);

    const renderPass = new THREE.RenderPass(this.scene, this.camera);
    renderPass.enabled = false;
    
    const taaRenderPass = new THREE.TAARenderPass(this.scene, this.camera );
    taaRenderPass.unbiased = true;
    taaRenderPass.sampleLevel = 3;
    taaRenderPass.renderToScreen = true;
    taaRenderPass.clearColor = BG_COLOR;
    taaRenderPass.clearAlpha = BG_ALPHA;
    
    const saoPass = new THREE.SAOPass(this.scene, this.camera, true, false);
      saoPass.params = {
        output: 0,
        saoBias: 3,
        saoIntensity: .8,
        saoScale: 4,
        saoKernelRadius: 10,
        saoMinResolution: 0,
      };

      const vigPass = new THREE.ShaderPass(THREE.VignetteShader);
      vigPass.uniforms.darkness.value = .8;
      vigPass.uniforms.offset.value = 1;
      vigPass.uniforms.tDiffuse.value = 10;

      const fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);
      var pixelRatio = this.renderer.getPixelRatio();
      fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / (this.canvas.offsetWidth * pixelRatio);
      fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / (this.canvas.offsetHeight * pixelRatio);

      this.composer.addPass(taaRenderPass);
      this.composer.addPass(renderPass);
      this.composer.addPass(copyPass);
      this.composer.addPass(fxaaPass); 
      this.composer.addPass(vigPass);
      this.composer.addPass(saoPass);
    }
    
    
  // ***************************************************** //
  // ***************** MODEL MANIPULATION **************** //
  // ***************************************************** //

  generateModelOptions() {
    const modelOptions = {};
    this.model.traverse((node) => {
      const [opt, name, versionFull] = node.name.split('-');
      if (!versionFull || opt !== 'opt') return;
      const version = versionFull.split('_')[0];

      const dispAttributes = ATTRIBUTE_CONFIG[name];

      if (name === 'stem') this.stemId = node.id;

      if (!ATTRIBUTE_CONFIG[name]) return;
      const defaultVersion = dispAttributes.versions[0];
      
      // TEMP TRANSLATION TO GET PARENT GROUP //
      const translatedVersion = version.length === 3 ? version.slice(0, 2) : '';
      if (!translatedVersion) return;

      const selected = defaultVersion.id === translatedVersion;
      const newOption = {
        id: node.ID,
        name: node.name,
        selected,
      }

      if (!name || !version) return;
      if (!modelOptions[name]) modelOptions[name] = {};

      modelOptions[name][translatedVersion] = newOption; // TEMP TRANSLATION VERSION TO SET OPTION
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
    Object.values(modelOptions).forEach((versions) => {
      Object.values(versions).forEach((version) => {
        if (version.selected) {
          this.show(version.name);
        } else {
          this.hide(version.name);
        }
      })
    })

    this.render();
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
  
    this.render();
  }
}

export default new Configurator();