
import { ATTR_DISPLAY_CONFIG } from './configs.js';
import './bendModifier';
import { FBXLoader } from './FBXLoader';
const { THREE } = window;

const {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  AmbientLight,
  GridHelper,
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
    this.createGrid();
    this.render();
  }
  
  createRenderer() {
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(835, 600);
    this.element.appendChild( this.renderer.domElement );
    this.renderer.setClearColor(0x00ffff, 1); 
    this.renderer.gammaOutput = true;
  }

  createCamera() {
    this.camera = new PerspectiveCamera( 75, 835/600, 0.1, 1000 );
    this.camera.position.z = 25; 
    this.camera.position.y = 15;
  }

  createLighting() {
    var light = new DirectionalLight("#c1582d", 1);
    var ambient = new AmbientLight("#85b2cd");
    light.position.set( 0, -70, 100 ).normalize();
    this.scene.add(light);
    this.scene.add(ambient);
  }

  createGrid() {
    var grid = new GridHelper( 2000, 20, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    this.scene.add( grid );

    // x red, y green, z blue
    var axesHelper = new THREE.AxesHelper( 5 );
    this.scene.add( axesHelper );
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set( 0, 0, 0 );
    this.controls.update();
  }

  centerControls() {
    const { x, y, z } = new THREE.Box3().setFromObject(this.model).getCenter();

    this.controls.target.set(x, y, z);
    this.controls.update();
  }

  async loadModel(url) {
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

  initFont() {
    this.fontLoader = new THREE.FontLoader();

    this.bendModifier = new THREE.BendModifier();

    this.fontLoader.load( 'https://raw.githubusercontent.com/rollup/three-jsnext/master/examples/fonts/gentilis_bold.typeface.json', ( font ) => {
      this.font = font;
    })
  }

  updateText(text) {
    if (!this.font) {
      console.log('ERROR: NO FONT LOADED');
      return;
    }

    var geometry = new THREE.TextGeometry(text, {
      font: this.font,
      size: .15,
      height: .03,
      curveSegments: 50,
    } );

    const material = new THREE.MeshPhongMaterial({ color: 0xdddddd });

    // BEND TEXT
    const direction = new THREE.Vector3( 0, 0, -1 );
    const axis =  new THREE.Vector3( 1, 0, 0 );
    const angle = .19 * Math.PI;
    this.bendModifier.set( direction, axis, angle ).modify( geometry );


    // REMOVE OLD TEXT
    if (this.textModel) this.model.remove(this.textModel);

    // ADD NEW TEXT
    this.textModel = new THREE.Mesh(geometry, material);
    this.model.add(this.textModel)

    // POSITION TEXT
    this.textModel.position.set(.25, 1, -.05);
    this.textModel.rotateY(  Math.PI / 2 )
    this.textModel.rotateZ(  Math.PI / 2 )
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
    console.log('showing', name);
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
}

export default new Configurator();