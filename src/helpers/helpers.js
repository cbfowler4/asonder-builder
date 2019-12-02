import Configurator from './configurator';

import {
  DEFAULT_URLID,
  DEFAULT_PREFIX,
  ATTR_DISPLAY_CONFIG,
} from './configs';


const { React } = window;
const { useState } = React;


export const getConfig = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlid = urlParams.get('id') || DEFAULT_URLID;
  const prefix = urlParams.get('prefix') || DEFAULT_PREFIX;
  return { urlid, prefix };
}

export const debounce = (func, wait, immediate) => {
  var timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;
	    
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
	
    clearTimeout(timeout);

    timeout = setTimeout(later, wait);
	
    if (callNow) func.apply(context, args);
  };
};


export const useModelOpts = (initModelOptions) => {
  const [modelOptions, setModelOpts] = useState(initModelOptions || {});

  const actions = {
    setModelOpts: (newModelOptions) => {
      setModelOpts(newModelOptions);
    },
    selectMaterial: () => {
      
    },
    selectVersion: (attr, versionId) => {
      if (!attr || !versionId) return;

      const majorAttr = Configurator.majorAttr;
      const newModelOpts = { ...modelOptions };

      if (!newModelOpts[majorAttr][attr]) {
        console.log(`WARNING: Minor attribute ${attr} does not exist`);
        return;
      }

      if (!newModelOpts[majorAttr][attr][versionId]) {
        console.log(`WARNING: versionId ${versionId} does not exist on minor attributue ${attr} from major attribute version ${majorAttr}
        Selecting default version`)
        const defaultVersion = ATTR_DISPLAY_CONFIG[attr].versions[0];
        if (!defaultVersion) throw new Error('No default version to select');
        Object.keys(newModelOpts[majorAttr][attr]).forEach((v) => {
          newModelOpts[majorAttr][attr][v] = v === defaultVersion.id;
        })
      } else {
        Object.keys(newModelOpts[majorAttr][attr]).forEach((v) => {
          newModelOpts[majorAttr][attr][v].selected = v === versionId;
        })
      }

      setModelOpts(newModelOpts);
    },
    getAvailableVersions: (attr) => {
      let availableVersions = {};
      if (attr === 'major') {
        availableVersions = Object.keys(modelOptions)
          .reduce((acc, key) => ({ ...acc, [key]: true }), {});
      } else {
        availableVersions = (modelOptions[Configurator.majorAttr] || {})[attr] || [];
      }
      if (!ATTR_DISPLAY_CONFIG[attr]) return [];
      return ATTR_DISPLAY_CONFIG[attr].versions
        .filter(version => (availableVersions[version.id]));
    },
    getSelectedVersion: (attr) => {
      if (!attr) return null;
      if (attr === 'major') return Configurator.majorAttr;
  
      const versions = modelOptions[Configurator.majorAttr][attr];
      const selectedVersionId = Object.keys(versions).find((versionId) => versions[versionId].selected);
      return ATTR_DISPLAY_CONFIG[attr].versions.find((version) => version.id === selectedVersionId);
    }
  }

  return [
    modelOptions,
    actions
  ]
}
