const { THREE } = window;

export const DEFAULT_URLID = 'fd82a3d61802402fb50684bf1199348f';
export const DEFAULT_PREFIX = 'initial-launch-rev2';

export const CONFIGURATOR_MIN_WIDTH = 750;
export const S3_PATH = 'https://cbfowler4.s3.amazonaws.com/uncut_assets/'

export const ATTR_DISPLAY_CONFIG = {
  major: {
    label: 'Size',
    versions: [
      { id: 'solo', text: 'Solo', variant: '14621554311223', price: 85 },
      { id: 'comm', text: 'Communal', variant: '14621554442295', price: 95 },
    ]
  },
  stem: {
    label: 'Stem',
    versions: [
      { id: 'v0', text: 'N/A' },
    ],
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
      { id: 'v0', text: 'Standard', img: 'standard' },
      { id: 'v1', text: 'Spiral', img: 'spiral' },
      { id: 'v2', text: 'Cauldron', img: 'cauldron' },
    ]
  },
  stand: {
    label: 'Stand',
    versions: [
      { id: 'v0', text: 'Round' },
      { id: 'v1', text: 'Square' },
      { id: 'v2', text: 'Octagonal' },
    ]
  },
};

export const MATERIALS_CONFIG = {
  bronze: {
    text: 'Bronze-Silver',
    color: 'rgb(146, 137, 85)',
    material: {
      color: new THREE.Color('rgb(100, 98, 98)'),
      specular: new THREE.Color('rgb(100, 100, 100)'),
      shininess: 11,
    },
  },  
  black: {
    text: 'Black Matte',
    color: 'rgb(0, 0, 0)',
    material: {
      color: new THREE.Color('rgb(35, 35, 35)'),
      specular: new THREE.Color('rgb(80, 80, 80)'),
      shininess: 11,
    },
  },
}

export const ATTR_ORDER = [
  'major',
  'stem',
  'mouth',
  'bowl',
  'stand',
];
