import {
  ATTRIBUTE_CONFIG,
  SPECIAL_ATTRIBUTE_CONFIG,
  Y_ROT_INITIAL,
  STEM_LENGTH_CNTR_M,
  STEM_OR_M,
  FONT_FILE_PATH,
  BG_COLOR,
  BG_ALPHA,
  CONTROL_SETTINGS,
  MOBILE_DISTANCE_OFFSET,
  MOBILE_MIN_DISTANCE_OFFSET,
  MOBILE_HEIGHT_OFFSET,
  MODEL_SCALE,
  TEXTURES_PATH,
} from '../helpers/configs';
import '../helpers/bendModifier';

import { isMobile } from '../helpers/helpers';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass.js';

class Configurator {
  init(canvas, container) {
    this.container = container;
    this.canvas = canvas;
    this._createRenderer();

    this.scene = new THREE.Scene();

    this._createCamera();
    this._createControls();
    this._createParent();
    this._createLighting();
    this._initMaterial();

    window.addEventListener('resize', () => this.onResizeWindow());


    // const axesHelper = new THREE.AxesHelper(2);
    // this.scene.add( axesHelper );

    // this._createStats();
  }

  // ***************************************************** //
  // ******************** SCENE SETUP ******************** //
  // ***************************************************** //

  _createRenderer() {
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
    this._setSize();

    this.renderer.setSize(this.width, this.height);
  }

  _createCamera() {
    this.camera = new THREE.PerspectiveCamera(35, this.width/this.height, 0.02, 5);
    this.camera.position.z = .1; 
    this.camera.position.y = .08;
    this.camera.position.x = -.3 + (isMobile() ? -MOBILE_DISTANCE_OFFSET : 0)
  }

  _createLighting() {
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

  _createParent() {
    this.parent = new THREE.Group();
    this.parent.position.set(0, 0, 0);
    this.scene.add(this.parent);
  }

  _createStats() {
    this.stats = new Stats();
    this.stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
    this.container.appendChild(this.stats.domElement);
    this.stats.domElement.style.position = 'absolute';
  }

  render() {
    if (!this.renderer) return;

    if (this.stats) this.stats.begin();

    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);

    if (this.stats) this.stats.end();
  }

  _setSize() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  }
  
  onResizeWindow() {
    this._setSize();
    this.renderer.domElement.width = this.width;
    this.camera.aspect = this.width / this.height;
    this.renderer.setSize(this.width, this.height);
    this.composer.setSize(this.width, this.height);

    this.camera.updateProjectionMatrix();
    this.render();
  }

  // ***************************************************** //
  // ***************** CONTROLS MANIPULATION **************** //
  // ***************************************************** //

  _createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener('change', () => { this.render(); });

    this.resetControls();
  }

  resetControls() {
    this.updateControls(CONTROL_SETTINGS.default);
    this.controls.reset();
    
    if (isMobile()) this.offsetControls();
    
    this.controls.update();
    this.render();
  }

  offsetControls() {
    this.controls.target.set(0, MOBILE_HEIGHT_OFFSET, 0);
  }

  updateControls(properties) {
    Object.keys(properties).forEach(prop => {
      if (isMobile() && prop.includes('maxDistance')) {
        this.controls[prop] = properties[prop] + MOBILE_DISTANCE_OFFSET;
      }
      else if (isMobile() && prop.includes('minDistance')) {
        this.controls[prop] = properties[prop] + MOBILE_MIN_DISTANCE_OFFSET;
      } else {
        this.controls[prop] = properties[prop];
      }
    });

    this.controls.reset();
    if (isMobile()) this.offsetControls();

    this.controls.update() 
    this.render();
  }

  // ***************************************************** //
  // ***************** TEXT MANIPULATION **************** //
  // ***************************************************** //

  _initFont() {
    return new Promise((resolve) => {
      this.fontLoader = new THREE.FontLoader();
      this.stemScale = 1;
  
      this.bendModifier = new THREE.BendModifier();
      
      const direction = new THREE.Vector3(0, 0, -1);
      const axis =  new THREE.Vector3(1, 0, 0);
      const angle = .18 * Math.PI;
      this.bendModifier.set(direction, axis, angle);
  
      const fontLoader = new THREE.FontLoader();
  
      fontLoader.load(FONT_FILE_PATH, (font) => {
        this.font = font;
        resolve();
      }, () => {}, (err) => {
        console.log('ERROR LOADING FONT');
      });
    })
  }

  updateText(text = '') {
    if (!this.fontLoader && !this.font) {
      this._initFont().then(() => this.updateText(text));
      return;
    } else if (!this.font || !this.model) return;


    if (!this.stem) {
      this.stem = this.model.getObjectById(this.stemId);
      this.stemScale = this.stem.getWorldScale();
    }

    if (this.textModel) this.stem.remove(this.textModel); 
  
    const fontParams = {
      font: this.font,
      size: .0034 / this.stemScale.x,
      height: .0010 / this.stemScale.x, 
      curveSegments: 3,
    };

    console.log(fontParams);

    const geometry = new THREE.TextGeometry(text, fontParams);
    this.bendModifier.modify(geometry);
    this.textModel = new THREE.Mesh(geometry, this.material);
    this.setTextPosition();

    this.stem.add(this.textModel);
  
    this.render();
  }

  setTextPosition() {
    if (!this.textModel) return;
    // Rotate first to ensure coordinate similarity
    this.textModel.rotateX(Math.PI / 2);
    this.textModel.rotateY(Math.PI / 2);
  
    const textSize = new THREE.Box3().setFromObject(this.textModel).getSize();
    const stemSize = new THREE.Box3().setFromObject(this.stem).getSize();
    
    console.log('Stem size: ', stemSize);
    console.log('text size;', textSize);
    

    const x = STEM_OR_M - .0002;
    // const y = STEM_LENGTH_CNTR_M - textSize.y; //y is length dimension in stem coordinate system
    const y = STEM_LENGTH_CNTR_M - textSize.y / 2;
    const z = STEM_OR_M / 2 - .0035;
    
  
    this.textModel.position.set(
      x / this.stemScale.x,
      y / this.stemScale.y,
      z / this.stemScale.z
    );

    console.log('text model position', this.textModel.position)
  }

  // ***************************************************** //
  // ***************** MATERIAL MANIPULATION ************* //
  // ***************************************************** //

  _initMaterial() {
    if (this.material) return;
    const loader = new THREE.TextureLoader();

    this.textures = {
      silver: loader.load(`${TEXTURES_PATH}metal-3-silver.jpg`),
      black: loader.load(`${TEXTURES_PATH}metal-3-black.jpg`),
    };

    Object.values(this.textures).forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    });

    this.material = new THREE.MeshPhongMaterial();
  }

  _setMaterial() {
    this.model.traverse((node) => {
      if (node.type === 'Mesh') node.material = this.material;
    });
  }

  updateMaterial(materialProperties) {
    // return;
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
    this.material.map = this.textures[materialProperties.texture];
  
    this.render();
  }

        
  // ***************************************************** //
  // *********** POST PROCESSING & OPTIMIZATION ********** //
  // ***************************************************** //

  addPostProcessing() {
    this.composer = new EffectComposer(this.renderer);

    const copyPass = new ShaderPass(CopyShader);

    const renderPass = new RenderPass(this.scene, this.camera);
    renderPass.enabled = false;
    
    const taaRenderPass = new TAARenderPass(this.scene, this.camera );
    taaRenderPass.unbiased = true;
    taaRenderPass.sampleLevel = 3;
    taaRenderPass.renderToScreen = true;
    taaRenderPass.clearColor = BG_COLOR;
    taaRenderPass.clearAlpha = BG_ALPHA;
  
    const vigPass = new ShaderPass(VignetteShader);
    vigPass.uniforms.darkness.value = .8;
    vigPass.uniforms.offset.value = 1;
    vigPass.uniforms.tDiffuse.value = 10;


    const fxaaPass = new ShaderPass(FXAAShader);
    var pixelRatio = this.renderer.getPixelRatio();
    fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / (this.width * pixelRatio);
    fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / (this.height * pixelRatio);

    this.composer.addPass(taaRenderPass);
    this.composer.addPass(renderPass);
    this.composer.addPass(copyPass);
    this.composer.addPass(fxaaPass); 
    this.composer.addPass(vigPass);
  }
    
  // ***************************************************** //
  // ***************** MODEL MANIPULATION **************** //
  // ***************************************************** //

  async loadModel(url, progressCB) {
    if (!this.loader) {
      // this.loader = new THREE.FBXLoader();
      this.loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
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

          this.centerModel();
          this._setMaterial();


          this.addPostProcessing();
          this.updateMaterial(SPECIAL_ATTRIBUTE_CONFIG.material.versions[0].materialProperties);

          //Set initial rotation if spinning on load
          const { x, z } = this.getRotation();
          this.setRotation(x, Y_ROT_INITIAL, z);


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

  generateModelOptions() {
    const modelOptions = {};
    this.model.traverse((node) => {
      const [opt, name, versionFull] = node.name.split('-');
      if (!versionFull || opt !== 'opt') return;
      const version = versionFull.split('_')[0];

      const dispAttributes = ATTRIBUTE_CONFIG[name];

      if (name === 'stem') this.stemId = node.id;

      if (!dispAttributes) return;
      const defaultVersion = dispAttributes.versions[0];
      
      const translatedVersion = version.length === 3 ? version.slice(0, 2) : '';
      if (!translatedVersion) return;
      const displayVersion = dispAttributes.versions.find((v) => v.id === translatedVersion) || {};
      
      const selected = defaultVersion.id === translatedVersion;

      const newOption = {
        text: displayVersion.text,
        name: node.name,
        selected,
      }

      if (!name || !version || !displayVersion) return;
      if (!modelOptions[name]) modelOptions[name] = {};

      modelOptions[name][translatedVersion] = newOption; // TEMP TRANSLATION VERSION TO SET OPTION
    });

    return modelOptions;
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

  rotateOnYAxis(angle) {
    this.parent.rotateY(angle);
    this.render();
  }

  setRotation(x, y, z) {
    this.parent.rotation.set(x, y, z);
    this.render();
  }

  getRotation() {
    return this.parent.rotation;
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

  
}

export default new Configurator();