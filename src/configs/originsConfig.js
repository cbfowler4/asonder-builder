import * as THREE from 'three';

const MIN_CAMERA_DISTANCE = .14;

export default {
  model: {
    minCameraDistance: MIN_CAMERA_DISTANCE,
    modelScale: 1,
    yRotation: .75 * Math.PI,
    maxTextLength: 22,
    stemCenterMeters: .04,
    stemORMeters: .004445,
  },
  mobile: {
    heightOffset: -.12,
    distanceOffset: .12,
    minDistanceOffset: .05,
  },
  attributes: {
    mouth: {
      label: 'Mouthpiece',
      versions: [
        { id: 'v0', text: 'Tapered', img: 'tapered' },
        { id: 'v1', text: 'Open Tube', img: 'open' },
        { id: 'v2', text: 'Conduit', img: 'conduit', height: '44px' },
      ],
    },
    stem: {
      label: 'Stem',
      versions: [
        { id: 'v0', text: 'Standard', img: 'standard' },
        { id: 'v1', text: 'Spiral', img: 'spiral' },
      ],
    },
  },
  specialAttributes: {
    material: {
      label: 'Material',
      versions: [
        {
          id: 'Matte Black',
          text: 'Matte Black',
          color: 'rgb(0, 0, 0)',
          materialProperties: {
            color: new THREE.Color('rgb(40, 40, 40)'),
            specular: new THREE.Color('rgb(35, 35, 35)'),
            shininess: 22,
            texture: 'black',
          }
        },
        {
          id: 'Bronze-Silver',
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
  },
  controls: {
    mouth: {
      maxDistance: .18,
      minDistance: .08,
      minAzimuthAngle: - .99 * Math.PI,
      maxAzimuthAngle: -.25 * Math.PI,
      minPolarAngle: Math.PI / 3,
      maxPolarAngle: 2 * Math.PI / 3,
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
      rotateSpeed: .5,
      panSpeed: 0,
    }
  },
  attributeOrder: ['stem', 'mouth', 'material', 'text' ], 
}
