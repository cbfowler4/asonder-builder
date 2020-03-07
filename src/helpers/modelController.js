import Configurator from './configurator';
import { debounce } from './helpers';

import { ATTRIBUTE_ORDER, ATTRIBUTE_CONFIG, S3_PATH, SPECIAL_ATTRIBUTE_CONFIG } from './configs';


const { React } = window;
const { useState, useEffect } = React;

const updateConfiguratorText = debounce((text) => { Configurator.updateText(text); }, 1000);

export const useModelController = (initModelOptions, initSpecialOptions) => {
  const [modelOptions, setModelOptions] = useState(initModelOptions || {});
  const [specialOptions, setSpecialOptions] = useState(initSpecialOptions || {});

  useEffect(() => { Configurator.updateModel(modelOptions); }, [modelOptions])

  useEffect(() => {
    const material = controllerActions.Special.getSelectedMaterial();
    Configurator.updateMaterial(material.materialProperties);
  }, [specialOptions.material]);

  useEffect(() => {
    // updateConfiguratorText(specialOptions.text);
  }, [specialOptions.text]);

  const controllerActions = {
    Special: {
      generateSpecialOptions: () => (
        ATTRIBUTE_ORDER.reduce((acc, name) => {
          if (ATTRIBUTE_CONFIG[name]) return acc;
          else if (name === 'material') {
            return { ...acc, [name]: SPECIAL_ATTRIBUTE_CONFIG.material.versions[0].id };
          }
          return { ...acc, [name]: '' };
        }, { text: 'KKK' })
      ),
      selectMaterial: (material) => {
        if (specialOptions.material) {
          setSpecialOptions({ ...specialOptions, material });
        }
      },
      getSelectedMaterial: () => {
        if (!specialOptions.material) return '';
        const material = SPECIAL_ATTRIBUTE_CONFIG.material.versions
          .find(version => version.id === specialOptions.material);
        
        return material;
      },
      getAvailableMaterials: () => (
        SPECIAL_ATTRIBUTE_CONFIG.material.versions
          .reduce((acc, version) => acc.concat(version), [])
      ),
      setCustomText: (text) => { setSpecialOptions({ ...specialOptions, text }); },
      getCustomText: () => (specialOptions.text || ''),
    },
    Info: {
      getAvailableAttributes: () => {
        if (!Configurator.model) return [];
        return (
          ATTRIBUTE_ORDER.reduce((acc, name) => {
            if (ATTRIBUTE_CONFIG[name]) {
              const { label } = ATTRIBUTE_CONFIG[name] || {};
              if (controllerActions.Info.getAvailableVersions(name).length < 2) return acc; // if less than 2 versions are provided it is no configurable
              return acc.concat({ name, label });  
            } else if (SPECIAL_ATTRIBUTE_CONFIG[name]) {
              const { label } = SPECIAL_ATTRIBUTE_CONFIG[name] || {}; 
              return acc.concat({ name, label });
            } else return acc;
          }, [])
        );
      },
      getAvailableVersions: (attr) => {
        const availableVersions = (modelOptions|| {})[attr] || [];
        if (!ATTRIBUTE_CONFIG[attr]) return [];
        return ATTRIBUTE_CONFIG[attr].versions
          .filter(version => (availableVersions[version.id]));
      },
      getSelectedAttribute: (attr) => (ATTRIBUTE_CONFIG[attr] || {}),
      getSelectedVersion: (attr) => {
        if (!attr) return null;
    
        const versions = modelOptions[attr];
        const selectedVersionId = Object.keys(versions).find((versionId) => versions[versionId].selected);
        const version = ATTRIBUTE_CONFIG[attr].versions.find((version) => version.id === selectedVersionId);
        if (version.img) version.imgPath = `${S3_PATH}${version.img}.png`;
  
        return version;
      },
    },
    Action: {
      reinitialize: (initModelOptions, initSpecialOptions) => {
        setModelOptions(initModelOptions);
        setSpecialOptions(initSpecialOptions);
      },
      selectVersion: (attr, versionId) => {
        if (!attr || !versionId) return;
  
        const newModelOpts = { ...modelOptions };
  
        if (!newModelOpts[attr]) {
          console.log(`WARNING: Minor attribute ${attr} does not exist`);
          return;
        }
  
        if (!newModelOpts[attr][versionId]) {
          console.log(`WARNING: versionId ${versionId} does not exist on minor attributue ${attr}. Selecting default version`)
          const defaultVersion = ATTRIBUTE_CONFIG[attr].versions[0];
          if (!defaultVersion) throw new Error('No default version to select');
          Object.keys(newModelOpts[attr]).forEach((v) => {
            newModelOpts[attr][v] = v === defaultVersion.id;
          })
        } else {
          Object.keys(newModelOpts[attr]).forEach((v) => {
            newModelOpts[attr][v].selected = v === versionId;
          })
        }
  
        setModelOptions(newModelOpts);
      },
    },
  }

  return {
    modelOptions,
    specialOptions,
    controllerActions,
  }
}