export const DEFAULT_URLID = 'fd82a3d61802402fb50684bf1199348f';
export const DEFAULT_PREFIX = 'initial-launch-rev2';

export const SELECTOR_WIDTH = 150;
export const CONFIGURATOR_MIN_WIDTH = 750;

export const ATTR_DISPLAY_CONFIG = {
  major: {
    label: 'Size',
    versions: [
      { id: 'solo', text: 'Solo', variant: '14621554311223', price: 75 },
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
      { id: 'v0', text: 'Tapered' },
      { id: 'v1', text: 'Open Tube' },
    ]
  },
  bowl: {
    label: 'Bowl',
    versions: [
      { id: 'v0', text: 'Standard' },
      { id: 'v1', text: 'Spiral' },
      { id: 'v2', text: 'Cauldron' },
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
  black: {
    text: 'Black Matte',
    material: {
      color: { r: .9, g: 0, b: 0 },
    },
  },
  bronze: {
    text: 'Bronze-Silver',
    material: {
      color: { r: 0, g: 0, b: .9 },
    },
  }
}

export const ATTR_ORDER = [
  'major',
  'stem',
  'mouth',
  'bowl',
  'stand',
];
