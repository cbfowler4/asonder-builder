const { THREE } = window;

export const DEFAULT_URLID = 'fd82a3d61802402fb50684bf1199348f';
export const DEFAULT_PREFIX = 'initial-launch-rev2';

export const CONFIGURATOR_MIN_WIDTH = 750;
export const S3_PATH = 'https://cbfowler4.s3.amazonaws.com/uncut_assets/';
export const BG_COLOR = 0x898c8a;
export const BG_ALPHA = .2;
export const MIN_CAMERA_DISTANCE = 1;

export const ATTRIBUTE_CONFIG = {
  mouth: {
    label: 'Mouthpiece',
    versions: [
      { id: 'v0', text: 'Tapered', img: 'tapered' },
      { id: 'v1', text: 'Open Tube', img: 'open' },
    ]
  },
  bowl: {
    label: 'Bowl',
    versions: [
      { id: 'v1', text: 'Spiral', img: 'spiral' },
      { id: 'v0', text: 'Standard', img: 'standard' },
      { id: 'v2', text: 'Cauldron', img: 'cauldron' },
      { id: 'v3', text: 'Rose', img: 'cauldron' },
    ]
  }
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
          color: new THREE.Color('rgb(30, 30, 30)'),
          specular: new THREE.Color('rgb(45, 45, 45)'),
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
    label: 'Custom Text'
  }
}


export const ATTRIBUTE_ORDER = [
  'bowl',
  'mouth',
  'material',
  'text',
];

// export const FONT_FILE_PATH = 'https://cbfowler4.s3.amazonaws.com/fonts/My+Font_Regular-edited.json';
export const FONT_FILE_PATH = 'https://cbfowler4.s3.amazonaws.com/fonts/My+Font_Regular+(9).json';

