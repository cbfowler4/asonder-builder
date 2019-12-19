
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
    this.createGrid();
    this.createLighting();
    this.initMaterial();
    this.render();

    window.addEventListener('resize', () => { this.onResizeWindow() })
  }
  
  createRenderer() {
    this.renderer = new WebGLRenderer({
      precision: "highp",
      canvas: this.canvas,
    });

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.width = window.innerWidth <= CONFIGURATOR_MIN_WIDTH ? window.innerWidth : window.innerWidth - SELECTOR_WIDTH;
    this.height = window.innerHeight > 750 ? 600 : window.innerHeight - 175;

    this.renderer.setSize(this.width, this.height);

    this.renderer.setClearColor(0x7e827f, 1); 
    this.renderer.gammaOutput = true;
  }

  createCamera() {
    this.camera = new PerspectiveCamera(45, this.width/this.height, 0.1, 1000 );
    this.camera.position.z = 1; 
    this.camera.position.y = 1;
    this.camera.position.x = -4;
  }

  createLighting() {
    var textLight = new DirectionalLight('#f7ebc0', .6);
    var light2 = new DirectionalLight('#f7ebc0', .5);
    var light3 = new DirectionalLight('#aedef5', .49);

    textLight.position.set(-1.5, -2, 1);
    light2.position.set(1, -.5, .25);
    light3.position.set(0, 1.5, 2.5);
    
    textLight.castShadow = true;
    light2.castShadow = true;
    light3.castShadow = true;

    debugger
    light2.shadow.camera.far = 3;
    var helper = new THREE.CameraHelper( light2.shadow.camera );
    this.scene.add( helper );

    this.scene.add(textLight);
    this.scene.add(light2);
    this.scene.add(light3);    
  }
  
  addPostProcessing() {
    this.composer = new THREE.EffectComposer( this.renderer );

    const renderPass = new THREE.RenderPass( this.scene, this.camera );
    this.composer.addPass( renderPass );
  
    const ssaoPass = new THREE.SSAOPass( this.scene, this.camera, 10, 10 );
    ssaoPass.kernelRadius = .05;
    this.composer.addPass(ssaoPass);
    
    
    const fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );
    var pixelRatio = this.renderer.getPixelRatio();
    fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( this.canvas.offsetWidth * pixelRatio );
    fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( this.canvas.offsetHeight * pixelRatio );
    this.composer.addPass(fxaaPass);
    
    const bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = .8;
    bloomPass.strength = .5;
    bloomPass.radius = .2;
    this.composer.addPass( bloomPass );
    console.log(ssaoPass, bloomPass);

    const vigPass = new THREE.ShaderPass(THREE.VignetteShader);
    this.composer.addPass( vigPass );
    
    // // depth
    
    // var depthShader = THREE.ShaderLib.depth;
    // var depthUniforms = THREE.UniformsUtils.clone( depthShader.uniforms );
    
    // let depthMaterial = new THREE.ShaderMaterial( { fragmentShader: depthShader.fragmentShader, vertexShader: depthShader.vertexShader, uniforms: depthUniforms } );
    // depthMaterial.blending = THREE.NoBlending;
    
    // // postprocessing
    // console.log(this.renderer.extensions.get('WEBGL_depth_texture'));
    
    // this.composer = new THREE.EffectComposer( this.renderer );
    // this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );
    
    // this.depthTarget = new THREE.WebGLRenderTarget( this.width, this.height, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat } );
    
    // var effect = new THREE.ShaderPass( THREE.SSAOShader );
    // console.log(effect);
    // effect.uniforms[ 'tDepth' ].value = this.depthTarget;
    // effect.uniforms[ 'cameraNear' ].value = this.camera.near;
    // effect.uniforms[ 'cameraFar' ].value = this.camera.far;
    // effect.renderToScreen = true;
    // this.composer.addPass( effect );
    // this.composer.addPass( ssaoPass );

  
    // console.log(this.scene, this.composer);

  }

  onResizeWindow() {
    this.width = window.innerWidth <= CONFIGURATOR_MIN_WIDTH ? window.innerWidth : window.innerWidth - SELECTOR_WIDTH;
    this.renderer.domElement.width = this.width;
    this.camera.aspect = this.width / this.height;
    this.renderer.setSize(this.width, this.height);
    this.camera.updateProjectionMatrix();
  }

  createGrid() {
    // x red, y green, z blue
    var axesHelper = new THREE.AxesHelper(5);
    this.scene.add( axesHelper );
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  centerModel() {
    const { x, z } = new THREE.Box3().setFromObject(this.model).getCenter();
    this.model.position.set(-1 * x, 0, -1 * z);
  }

  rotate({ x, y, z }) {
    if (x) this.model.rotateX(x);
    if (y) this.model.rotateY(y);
    if (z) this.model.rotateZ(z);
  }

  async loadModel(url, progressCB) {
    if (!this.loader) this.loader = new FBXLoader();
  
    return new Promise((resolve, reject) => {
      this.loader.load(url,
        (model) => {
          this.scene.add(model);
          this.model = model;
          this.model.rotateX( Math.PI / 2 );
          this.model.rotateY( Math.PI );
          this.majorAttr = ATTR_DISPLAY_CONFIG.major.versions[0].id;

          this.model.castShadow = true; 
          this.model.receiveShadow = true;

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

  initMaterial() {
    if (this.material) return;
    this.material = new THREE.MeshPhongMaterial();
  }

  initFont() {
    this.fontLoader = new THREE.FontLoader();

    this.bendModifier = new THREE.BendModifier();
    
    const direction = new THREE.Vector3( 0, 0, -1 );
    const axis =  new THREE.Vector3( 1, 0, 0 );
    const angle = .19 * Math.PI;
    this.bendModifier.set( direction, axis, angle );

    const loader = new THREE.TTFLoader();
    const fontLoader = new THREE.FontLoader();

    loader.load('https://cbfowler4.s3.amazonaws.com/Roboto-Regular.ttf',
     (font) => this.font = fontLoader.parse(font))
  }

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

  render() {
    requestAnimationFrame(() => { this.render(); }); 
    if (this.composer) this.composer.render();
    // else this.renderer.render(this.scene, this.camera);
    // this.renderer.render(this.scene, this.camera);
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
        // node.material.color = material.color;
        iterateOverMaterialPropertiesAndUpdate(node.material);
      }
    });
  }
}

export default new Configurator();