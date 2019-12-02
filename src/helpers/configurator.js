
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
  AmbientLight,
  OrbitControls,
} = THREE;

class Configurator {
  init(element) {
    this.element = element;
    this.createRenderer();

    this.scene = new Scene();
    this.createCamera();
    this.createLighting();
    this.createControls();
    // this.createGrid();
    this.initMaterial();
    this.render();

    window.addEventListener('resize', () => { this.onResizeWindow() })
  }
  
  createRenderer() {
    this.renderer = new WebGLRenderer();
    this.width = window.innerWidth <= CONFIGURATOR_MIN_WIDTH ? window.innerWidth : window.innerWidth - SELECTOR_WIDTH;
    this.height = window.innerHeight > 750 ? 600 : window.innerHeight - 175;

    this.renderer.setSize(this.width, this.height);
    this.element.appendChild(this.renderer.domElement);
    this.renderer.setClearColor(0x7e827f, 1); 
    this.renderer.gammaOutput = true;
  }

  createCamera() {
    this.camera = new PerspectiveCamera(75, this.width/this.height, 0.1, 1000 );
    this.camera.position.z = 1; 
    this.camera.position.y = 1;
    this.camera.position.x = -4;
  }

  createLighting() {
    var light = new DirectionalLight("#c1582d", 1);
    var light2 = new DirectionalLight("#c1582d", 1);
    var ambient = new AmbientLight("#85b2cd");
    light.position.set(0, -70, 100).normalize();
    light2.position.set(0, 70, 10).normalize();
    this.scene.add(light);
    this.scene.add(light2);
    this.scene.add(ambient);
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

  centerControls() {
    const { x, y, z } = new THREE.Box3().setFromObject(this.model).getCenter();

    this.controls.target.set(x, y, z);
    this.controls.update();
  }

  async loadModel(url, materialKey) {
    if (!this.loader) this.loader = new FBXLoader();
  
    return new Promise((resolve, reject) => {
      this.loader.load(url,
        (model) => {
          this.scene.add(model);
          this.model = model;
          this.model.rotateX( Math.PI / 2 );
          this.model.rotateY( Math.PI );
          this.majorAttr = ATTR_DISPLAY_CONFIG.major.versions[0].id;

          this.initFont();
          this.centerControls();

          resolve(model);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded' );
        },
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
    this.renderer.render(this.scene, this.camera);
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

    this.material.color = material.color;
    
    this.model.traverse((node) => {
      if (node.type === 'Mesh') {
        node.material.color = material.color;
      }
    });
  }
}

export default new Configurator();