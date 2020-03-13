const { THREE } = window;

export const DEFAULT_URLID = 'fd82a3d61802402fb50684bf1199348f';
export const DEFAULT_PREFIX = 'initial-launch-rev2';

export const CONFIGURATOR_MIN_WIDTH = 750;
export const BG_COLOR = 0x898c8a;
export const BG_ALPHA = .3;
export const MIN_CAMERA_DISTANCE = 3.5;
export const MODEL_SCALE = 45;
export const Y_ROT_INITIAL = .75 * Math.PI;
export const MOBILE_DISTANCE_OFFSET = 3;

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
          color: new THREE.Color('rgb(35, 35, 35)'),
          specular: new THREE.Color('rgb(35, 35, 35)'),
          shininess: 20,
          texture: 'black',
        }
      },
      {
        id: 'silver',
        text: 'Bronze-Silver',
        color: 'rgb(140, 137, 120)',
        materialProperties: {
          color: new THREE.Color('rgb(195, 192, 189)'),
          specular: new THREE.Color('rgb(30, 30, 30)'),
          shininess: 35,
          texture: 'silver',
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
    minPolarAngle: 0,
    maxPolarAngle: .42 * Math.PI,
    minAzimuthAngle: -Infinity,
    maxAzimuthAngle: Infinity,
    maxDistance: 5.5,
    minDistance: 4.5,
  },
  mouth: {
    maxDistance: 6,
    minDistance: 3,
    minAzimuthAngle: - .95 * Math.PI,
    maxAzimuthAngle: -.25 * Math.PI,
    minPolarAngle: Math.PI / 3,
    maxPolarAngle: 2 * Math.PI / 3,
    rotateSpeed: .2,
  },
  text: {
    minPolarAngle: .4 * Math.PI,
    maxPolarAngle: .6 * Math.PI,
    minAzimuthAngle: - .65 * Math.PI,
    maxAzimuthAngle: - .25 * Math.PI,
    maxDistance: 7,
    minDistance: 3.5,
  },
  default: {
    maxDistance: 13,
    minDistance: MIN_CAMERA_DISTANCE,
    minAzimuthAngle: -Infinity,
    maxAzimuthAngle: Infinity,
    maxPolarAngle: Infinity,
    minPolarAngle: -Infinity,
    rotateSpeed: .3,
    panSpeed: 0,
  },
}


export const ATTRIBUTE_ORDER = [
  'bowl',
  'mouth',
  'material',
  'text',
];


