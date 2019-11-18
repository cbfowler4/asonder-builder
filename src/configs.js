export const DEFAULT_URLID = 'fd82a3d61802402fb50684bf1199348f';
export const DEFAULT_PREFIX = 'initial-launch-rev2';


//  opt-<majorAttr>-<minorAttr>-<v#> 

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
    color: 'black',
    channels: [
      {
        propertyName: 'AlbedoPBR',
        properties: [
          { name: 'color', value: [0.0356, 0.0356, 0.0356] },
        ],
      },
    ]
  },
  bronze: {
    text: 'Bronze-Silver',
    color: 'yellow',
    channels: [
      {
        propertyName: 'AlbedoPBR',
        properties: [
          { name: 'color', value: [0.10461648409110419, 0.08650046203654974, 0.04970656598412723] },
        ],
      },
    ],
  }
}

export const ATTR_ORDER = [
  'major',
  'stem',
  'mouth',
  'bowl',
  'stand',
];
