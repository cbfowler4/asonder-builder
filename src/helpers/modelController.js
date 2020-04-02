import Configurator from './configurator';
import { debounce } from './helpers';

import {
  ATTRIBUTE_ORDER,
  ATTRIBUTE_CONFIG,
  S3_PATH,
  SPECIAL_ATTRIBUTE_CONFIG,
  CONTROL_SETTINGS,
  MAX_TEXT_LENGTH,
} from './configs';


import React from 'react';
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
    updateConfiguratorText(specialOptions.text);
  }, [specialOptions.text]);

  const controllerActions = {
    Special: {
      generateSpecialOptions: () => (
        ATTRIBUTE_ORDER.reduce((acc, name) => {
          if (ATTRIBUTE_CONFIG[name]) return acc;
          else if (name === 'material') {
            return { ...acc, [name]: SPECIAL_ATTRIBUTE_CONFIG.material.versions[0].id };
          } else if (name === 'text') {
            return { ...acc, text: 'uncutbk' }
          }
          return { ...acc, [name]: '' };
        }, {})
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
      getAttributeFromIndex: (idx) => {
        const availableAttributes = controllerActions.Info.getAvailableAttributes();
        return availableAttributes[idx] || {};
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
        version.name = versions[selectedVersionId].name;
        if (version.img) version.imgPath = `${S3_PATH}${version.img}.png`;
  
        return version;
      },
      getSearchAttrsForUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        Object.values(controllerActions.Info.getAvailableAttributes()).forEach(({ name, label }) => {
          let value;
          switch (name) {
            case 'text':
              value = controllerActions.Special.getCustomText();
              break;
            case 'material':
              value = controllerActions.Special.getSelectedMaterial().id;
              break;
            default:
              value = controllerActions.Info.getSelectedVersion(name).text;
              break
          }
          urlParams.set(label, value);
        });
        return urlParams.toString();
      }
    },
    Action: {
      reinitialize: (modelOptionsInput, specialOptionsInput) => {
        const { modelOptions, specialOptions } = controllerActions.Private
          ._mergeOptionsWithUrlValues(modelOptionsInput, specialOptionsInput)
    
        setModelOptions(modelOptions);
        setSpecialOptions(specialOptions);
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
      centerAttribute(attr) {
        if (!Configurator.model) return;

        if (!attr || attr === 'material' || attr === 'text') {
          Configurator.centerModel();
          controllerActions.Action.updateControls(attr);
          return;
        }


        const version = controllerActions.Info.getSelectedVersion(attr);
        const model = Configurator.model.getObjectByName(version.name);
        const modelCenter = Configurator.getCenter(model);
        const position = Configurator.model.position;
      
        Configurator.setPosition(
          position.x - modelCenter.x,
          position.y - modelCenter.y,
          position.z - modelCenter.z,
        );
        controllerActions.Action.updateControls(attr);
      },
      resetModelRotation() {
        Configurator.setRotation(0, 2 * Math.PI, 0);
      },
      updateControls(attr) {
        if (!Configurator.model) return;
        const properties = CONTROL_SETTINGS[attr] || CONTROL_SETTINGS.default;
        Configurator.updateControls(properties);
      },
    },
    Private: {
      _isTextValid: (text) => {
        const regEx = /[^ -~]/;
        return text && text.length <= MAX_TEXT_LENGTH && !regEx.test(text)
      },
      _isMaterialValid: (materialId) => {
        const materials = controllerActions.Special.getAvailableMaterials();
        return Object.values(materials).some((material) => material.id === materialId);
      },
      _isAttributeLabelValid(attr, label) {
        if (!ATTRIBUTE_CONFIG[attr] || !ATTRIBUTE_ORDER.includes(attr)) return;
        return ATTRIBUTE_CONFIG[attr].versions.some((version) => version.text === label);
      },
      _getLabelByAttribute(attr) {
        const attributeConfigs = { ...ATTRIBUTE_CONFIG, ...SPECIAL_ATTRIBUTE_CONFIG };
       if (attributeConfigs[attr]) return attributeConfigs[attr].label;
      },
      _mergeOptionsWithUrlValues(modelOptionsInput, specialOptionsInput) {
        const urlParams = new URLSearchParams(window.location.search);
        const modelOptions = { ...modelOptionsInput };
        const specialOptions = { ...specialOptionsInput };

        Object.keys({ ...modelOptions, ...specialOptions }).forEach((attr) => {
          const label = controllerActions.Private._getLabelByAttribute(attr);
          const urlValue = urlParams.get(label);
          if (!urlValue) return;
          switch (attr) {
            case 'text':
              if (controllerActions.Private._isTextValid(urlValue)) {
                specialOptions[attr] = urlValue;
              }
              break;
            case 'material':
              if (controllerActions.Private._isMaterialValid(urlValue)) {
                specialOptions[attr] = urlValue;
              }
              break;
            default:
              if (controllerActions.Private._isAttributeLabelValid(attr, urlValue)) {
                Object.values(modelOptions[attr]).forEach((version) => {
                  version.selected = version.text === urlValue;
                })
              }
          }
        });

        return { modelOptions, specialOptions }
      }
    
    }
  }

  return {
    modelOptions,
    specialOptions,
    controllerActions,
  }
}