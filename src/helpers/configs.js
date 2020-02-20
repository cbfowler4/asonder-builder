const { THREE } = window;

export const DEFAULT_URLID = 'fd82a3d61802402fb50684bf1199348f';
export const DEFAULT_PREFIX = 'initial-launch-rev2';

export const CONFIGURATOR_MIN_WIDTH = 750;
export const S3_PATH = 'https://cbfowler4.s3.amazonaws.com/uncut_assets/';
export const BG_COLOR = 0x898c8a;
export const BG_ALPHA = .2;

export const ATTRIBUTE_CONFIG = {
  major: {
    label: 'Size',
    versions: [
      { id: 'solo', text: 'Solo', variant: '14621554311223', price: 85 },
      { id: 'comm', text: 'Communal', variant: '14621554442295', price: 95 },
    ]
  },
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
    ]
  }
};

export const SPECIAL_ATTRIBUTE_CONFIG = {
  material: {
    label: 'Material',
    versions: [
      {
        id: 'bronze',
        text: 'Bronze-Silver',
        color: 'rgb(140, 137, 110)',
        materialProperties: {
          color: new THREE.Color('rgb(83, 79, 75)'),
          specular: new THREE.Color('rgb(70, 70, 70)'),
          shininess: 23,
        },
      },
      {
        id: 'black',
        text: 'Black Matte',
        color: 'rgb(0, 0, 0)',
        materialProperties: {
          color: new THREE.Color('rgb(16, 16, 16)'),
          specular: new THREE.Color('rgb(40, 40, 40)'),
          shininess: 23,
        }
      },
    ]
  },
  text: {
    label: 'Custom Text'
  }
}


export const ATTRIBUTE_ORDER = [
  'major',
  'bowl',
  'mouth',
  'material',
  'text',
];

export const FONT_FILE_PATH = 'https://cbfowler4.s3.amazonaws.com/Roboto-Regular-edited.otf';
// export const FONT_FILE_PATH = 'https://cbfowler4.s3.amazonaws.com/Roboto-Regular.ttf';
