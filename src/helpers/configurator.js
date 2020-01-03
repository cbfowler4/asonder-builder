
import {
  ATTR_DISPLAY_CONFIG,
  SELECTOR_WIDTH,
  MATERIALS_CONFIG,
  CONFIGURATOR_MIN_WIDTH,
} from '../helpers/configs';
import '../helpers/bendModifier';
import { FBXLoader } from '../helpers/FBXLoader';
const { THREE } = window;

const {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  OrbitControls,
} = THREE;

class Configurator {
  init(canvas) {
    this.canvas = canvas;
    this.createRenderer();

    this.scene = new Scene();
    this.createCamera();
    this.createControls();
    this.createParent();
    this.createLighting();
    this.initMaterial();
    this.render();

    window.addEventListener('resize', () => { this.onResizeWindow() })
  }



  // ***************************************************** //
  // ******************** SCENE SETUP ******************** //
  // ***************************************************** //

  createRenderer() {
    this.renderer = new WebGLRenderer({ canvas: this.canvas });

    this.renderer.toneMappingExposure = 1.5;
    this.width = window.innerWidth <= CONFIGURATOR_MIN_WIDTH ? window.innerWidth : window.innerWidth - SELECTOR_WIDTH;
    this.height = window.innerHeight > 750 ? 600 : window.innerHeight - 175;

    this.renderer.setSize(this.width, this.height);

    this.renderer.setClearColor(0x7e827f, 1); 
    this.renderer.gammaOutput = true;
  }

  createCamera() {
    this.camera = new PerspectiveCamera(45, this.width/this.height, .1, 100);
    this.camera.position.z = 1; 
    this.camera.position.y = 1;
    this.camera.position.x = -4;
  }

  createLighting() {
    var textLight = new DirectionalLight('#f7ebc0', .5);
    var textLight2 = new DirectionalLight('#f7ebc0', .3);
    var textLight3 = new DirectionalLight('#f7ebc0', .5);
    var light2 = new DirectionalLight('#f7ebc0', .5);
    var light3 = new DirectionalLight('#f7ebc0', .49);

    textLight.position.set(-1.5, -2, 1);
    textLight2.position.set(-1.5, 2, 1);
    textLight3.position.set(1.5, -2, 1);
    light2.position.set(1, -.5, .25);
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
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  initMaterial() {
    if (this.material) return;
    this.material = new THREE.MeshPhongMaterial();
  }

  render() {
    requestAnimationFrame(() => { this.render(); }); 
    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
  }

  onResizeWindow() {
    this.width = window.innerWidth <= CONFIGURATOR_MIN_WIDTH ? window.innerWidth : window.innerWidth - SELECTOR_WIDTH;
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

    loader.load('https://cbfowler4.s3.amazonaws.com/Roboto-Regular.ttf',
     (font) => this.font = fontLoader.parse(font))
  }

  centerModel() {
    const { x, z } = new THREE.Box3().setFromObject(this.model).getCenter();
    this.model.position.set(-1 * x, 0, -1 * z);
  }

  rotateOnYAxis(angle) {
    this.parent.rotateY(angle);
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
          this.majorAttr = ATTR_DISPLAY_CONFIG.major.versions[0].id;

          this.initFont();
          this.centerModel();
          this.addPostProcessing();
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
    this.textModel.castShadow = true;
  }

  addPostProcessing() {
    this.composer = new THREE.EffectComposer(this.renderer);

    const renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
  
    const ssaoPass = new THREE.SSAOPass(this.scene, this.camera, this.width, this.height);
    ssaoPass.kernelRadius = .5;
    ssaoPass.maxDistance = .1;
    ssaoPass.minDistance = .003;
    this.composer.addPass(ssaoPass);

    
    const fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );
    var pixelRatio = this.renderer.getPixelRatio();
    fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / (this.canvas.offsetWidth * pixelRatio);
    fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / (this.canvas.offsetHeight * pixelRatio);
    this.composer.addPass(fxaaPass); 
    
    const bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = .8;
    bloomPass.strength = .2;
    bloomPass.radius = 1;
    this.composer.addPass(bloomPass);

    const vigPass = new THREE.ShaderPass(THREE.VignetteShader);
    this.composer.addPass(vigPass);
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
      
      const dispAttributes = ATTR_DISPLAY_CONFIG[name];

      if (!ATTR_DISPLAY_CONFIG[name]) return;
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
      // END OF TEMP TRANSLATION
      
      // OLD WAY TO GET NEW OPTION
      // const selected = defaultVersion.id === version && majorAttr === size;
      // const newOption = {
      //   id: node.ID,
      //   name: node.name,
      //   selected,
      // }
      // END OF OLD WAY TO GET NEW OPTION

      if (!size || !name || !version) return;
      if (!modelOptions[size]) modelOptions[size] = {};
      if (!modelOptions[size][name]) modelOptions[size][name] = {};

      // modelOptions[size][name][version] = newOption; // OLD WAY TO SET OPTION
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
  }

  updateMaterial(materialKey) {
    if (!this.model || !materialKey) return;
    const material = MATERIALS_CONFIG[materialKey] && MATERIALS_CONFIG[materialKey].material;
    
    if (!material) {
      console.log(`MATERIAL FOR KEY '${materialKey}' COULD NOT BE FOUND`);
      return;
    }

    const iterateOverMaterialPropertiesAndUpdate = (materialToUpdate) => {
      Object.keys(material).forEach((key) => {
        materialToUpdate[key] = material[key];
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