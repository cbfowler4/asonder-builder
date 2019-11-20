// import Zlib from 'zlibjs';
const { React, THREE } = window;
// window.Zlib = Zlib;
// console.log(Object.keys(window).length);
const { useEffect, useState } = React;
// url = 'https://cbfowler4.s3.amazonaws.com/model2.fbx'
const {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  AmbientLight,
  GridHelper,
  OrbitControls,
  FBXLoader,
} = THREE;


class Configurator {
  constructor(element) {
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
    this.renderer.setSize(500, 500);
    this.element.appendChild( this.renderer.domElement );
    this.renderer.setClearColor(0x00ffff, 1); 
    this.renderer.gammaOutput = true;
  }

  createCamera() {
    this.camera = new PerspectiveCamera( 75, 500/500, 0.1, 1000 );
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
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set( 0, 0, 0 );
    this.controls.update();
  }

  async loadModel(url) {
    if (!this.loader) {
      this.loader = new FBXLoader();
    }
    return new Promise((resolve, reject) => {
      this.loader.load(url,
        (object) => {
          console.log(object);
          this.scene.add(object);
          resolve(object);
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

  render() {
    requestAnimationFrame(() => { this.render(); }); 
    this.renderer.render(this.scene, this.camera);
  }
}


export const Configurator3 = () => {
  const [ref, setRef] = useState(null);
  const [configurator, setConfigurator] = useState(null);

  useEffect(() => {
    console.log(ref);
    if (!ref) return;
    const con = new Configurator(ref);
    setConfigurator(con);

    const temp = async () => {
      const model = await con.loadModel('https://cbfowler4.s3.amazonaws.com/model2.fbx');
      console.log('here', model)
      debugger
    }

    temp();
  }, [ref])

  return (
    <div
      ref={ node => setRef(node) }
      style={ { width: 500, height: 500 } }
    >
    </div>
  )
}

