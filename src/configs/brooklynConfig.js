//CONFIG FILE FOR BROOKLYN PIPE
import * as THREE from 'three';

const MIN_CAMERA_DISTANCE = 0.14;

export default {
  model: {
    name: 'brooklyn',
    minCameraDistance: MIN_CAMERA_DISTANCE,
    modelScale: 1,
    yRotation: .75 * Math.PI,
  },
  mobile: {
    heightOffset: -.015,
    distanceOffset: .18,
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
    bowl: {
      label: 'Bowl',
      versions: [
        { id: 'v1', text: 'Spiral', img: 'spiral' },
        { id: 'v2', text: 'Rose', img: 'rose', height: '44px' },
        { id: 'v3', text: 'Geode', img: 'geode', height: '49px' },
        { id: 'v0', text: 'Standard', img: 'standard' },
      ],
    },
  },
  specialAttributes: {
    material: {
      label: 'Material',
      versions: [
        {
          id: 'Black',
          text: 'Black',
          color: 'rgb(0, 0, 0)',
          materialProperties: {
            color: new THREE.Color('rgb(40, 40, 40)'),
            specular: new THREE.Color('rgb(60, 60, 60)'),
            shininess: 18,
            texture: 'black',
          }
        },
        {
          id: 'Bronze',
          text: 'Bronze',
          color: 'rgb(97, 81, 59)',
          materialProperties: {
            color: new THREE.Color('rgb(97, 81, 59)'),
            specular: new THREE.Color('rgb(97, 81, 59)'),
            shininess: 20,
            texture: 'silver',
          },
        },
        
        
      ]
    },
    text: {
      label: 'Custom Text',
      maxTextLength: 12,
      horizontalCenterMeters: .028575,
      verticalCenterMeters: .004445,
      bendText: true,
    }
  },
  controls: {
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
  attributeOrder: ['bowl', 'mouth', 'material', 'text' ], 
}
