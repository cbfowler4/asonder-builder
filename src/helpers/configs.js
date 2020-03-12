const { THREE } = window;

export const DEFAULT_URLID = 'fd82a3d61802402fb50684bf1199348f';
export const DEFAULT_PREFIX = 'initial-launch-rev2';

export const CONFIGURATOR_MIN_WIDTH = 750;
export const BG_COLOR = 0x898c8a;
export const BG_ALPHA = .2;
export const MIN_CAMERA_DISTANCE = 3.5;
export const MODEL_SCALE = 45;


// PATHS
// export const FONT_FILE_PATH = 'https://cbfowler4.s3.amazonaws.com/fonts/My+Font_Regular+(9).json';
export const FONT_FILE_PATH = 'https://cbfowler4.s3.amazonaws.com/fonts/My+Font_Regular+(6).json';
export const S3_PATH = 'https://cbfowler4.s3.amazonaws.com/uncut_assets/';


export const ATTRIBUTE_CONFIG = {
  mouth: {
    label: 'Mouthpiece',
    versions: [
      { id: 'v0', text: 'Tapered', img: 'tapered' },
      { id: 'v1', text: 'Open Tube', img: 'open' },
    ],
  },
  bowl: {
    label: 'Bowl',
    versions: [
      { id: 'v1', text: 'Spiral', img: 'spiral' },
      { id: 'v3', text: 'Rose', img: 'rose' },
      { id: 'v0', text: 'Standard', img: 'standard' },
      { id: 'v2', text: 'Cauldron', img: 'cauldron' },
    ],
  },
};

export const SPECIAL_ATTRIBUTE_CONFIG = {
  material: {
    label: 'Material',
    versions: [
      {
        id: 'black',
        text: 'Black Matte',
        color: 'rgb(0, 0, 0)',
        materialProperties: {
          color: new THREE.Color('rgb(20, 20, 20)'),
          specular: new THREE.Color('rgb(40, 40, 40)'),
          shininess: 30,
        }
      },
      {
        id: 'bronze',
        text: 'Bronze-Silver',
        color: 'rgb(140, 137, 110)',
        materialProperties: {
          color: new THREE.Color('rgb(160, 158, 151)'),
          specular: new THREE.Color('rgb(45, 45, 45)'),
          shininess: 40,
        },
      },
      
    ]
  },
  text: {
    label: 'Custom Text',
  }
}

export const CONTROL_SETTINGS = {
  bowl: {
    minPolarAngle: Math.PI / 4,
    maxPolarAngle: .45 * Math.PI,
    maxDistance: 5,
    minDistance: 4.5,
  },
  mouth: {
    maxDistance: 3,
    minDistance: 2,
    minAzimuthAngle: - .75 * Math.PI,
    maxAzimuthAngle: -.45 * Math.PI,
    minPolarAngle: Math.PI / 3,
    maxPolarAngle: 2 * Math.PI / 3,
    rotateSpeed: .2,
  },
  text: {
    minPolarAngle: .45 * Math.PI,
    maxPolarAngle: .55 * Math.PI,
    minAzimuthAngle: - .6 * Math.PI,
    maxAzimuthAngle: - .35 * Math.PI,
    maxDistance: 3,
    minDistance: 2,
  },
  default: {
    maxDistance: 13,
    minDistance: MIN_CAMERA_DISTANCE,
    minAzimuthAngle: - Math.PI,
    maxAzimuthAngle: Math.PI,
    maxPolarAngle: Math.PI,
    minPolarAngle: 0,
    rotateSpeed: .25,
    panSpeed: 0,
  },
}


export const ATTRIBUTE_ORDER = [
  'bowl',
  'mouth',
  'material',
  'text',
];


