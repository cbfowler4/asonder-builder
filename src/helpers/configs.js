const { THREE } = window;

export const DEFAULT_PRODUCT = 'brooklyn-pipe';
export const PRODUCT_QS_NAME = 'product';
export const COLLECTION_QS_NAME = 'collection';

export const CONFIGURATOR_MIN_WIDTH = 750;
export const BG_COLOR = 0x898c8a;
export const BG_ALPHA = .3;
export const MIN_CAMERA_DISTANCE = 0.14;
export const MODEL_SCALE = 1;
export const Y_ROT_INITIAL = .75 * Math.PI;
export const MOBILE_DISTANCE_OFFSET = .1;
export const MAX_TEXT_LENGTH = 22;

export const STEM_LENGTH_CNTR_M = .028575;
export const STEM_OR_M = .004445;

// PATHS
export const FONT_FILE_PATH = 'https://cbfowler4.s3.amazonaws.com/fonts/My+Font_Regular+(6).json';
export const S3_PATH = 'https://cbfowler4.s3.amazonaws.com/uncut_assets/';


export const ATTRIBUTE_CONFIG = {
  mouth: {
    label: 'Mouthpiece',
    versions: [
      { id: 'v0', text: 'Tapered', img: 'tapered' },
      { id: 'v1', text: 'Open Tube', img: 'open' },
      { id: 'v2', text: 'Conduit', img: 'conduit' },
    ],
  },
  bowl: {
    label: 'Bowl',
    versions: [
      { id: 'v1', text: 'Spiral', img: 'spiral' },
      { id: 'v3', text: 'Rose', img: 'rose' },
      { id: 'v4', text: 'Geode', img: 'geode' },
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
    maxDistance: .12,
    minDistance: .08,
  },
  mouth: {
    maxDistance: .18,
    minDistance: .08,
    minAzimuthAngle: - .99 * Math.PI,
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
    maxDistance: .15,
    minDistance: .08,
  },
  default: {
    maxDistance: .2,
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


