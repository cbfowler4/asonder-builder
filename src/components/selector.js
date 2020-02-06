import Configurator from '../helpers/configurator';
import { ATTR_ORDER, ATTR_DISPLAY_CONFIG, MATERIALS_CONFIG, S3_PATH } from '../helpers/configs';
import { debounce, isMobile } from '../helpers/helpers';

const { React } = window;
const { useState, useEffect } = React;

const updateConfiguratorText = debounce((text) => { Configurator.updateText(text); }, 1000);

const HiddenSelect = () => {
  const majorAttrDisp = ATTR_DISPLAY_CONFIG.major;

  const options = majorAttrDisp.versions.reduce((acc, el) => {
    const selected = el.id === Configurator.majorAttr;
    const element = <option key={ el.id } selected={ selected ? true : false } value={ el.variant } />;
    return acc.concat(element);
  }, []);

  return (
    <select name='id' id='ProductSelect' className='product-single__variants no-js'>
      {options}
    </select>
  );
}

const BackArrow = () => (
  <svg style={ { height: 15 } } viewBox="0 0 477.175 477.175">
      <path fill='white' stroke-width='20' d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5
        c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z
        "/>
  </svg>
)

export const Selector = ({ modelOptActions, setMaterialKey, materialKey }) => {
  const [selectedAttr, setSelectedAttr] = useState('');
  const [text, setText] = useState('');
  
  useEffect(() => {
    // updateConfiguratorText(text);
  }, [text]);

  const OptionsList = () => {
    const optionsList = ATTR_ORDER.reduce((acc, attr) => {
      const attrDisplay = { ...ATTR_DISPLAY_CONFIG[attr] };
      attrDisplay.versions = modelOptActions.getAvailableVersions(attr);
      if (attrDisplay.versions.length < 2) return acc;

      const selectedVersion = modelOptActions.getSelectedVersion(attr) || {};

      acc.push(
        <div
          className={ `option-tile ${selectedAttr === attr ? 'active' : ''}` }
          key={ `${attrDisplay.label}-${selectedVersion.text}`}
          onClick={ () => { setSelectedAttr(attr); }}
        >
          { selectedVersion.img &&
            <img className='major-img' src={ `${S3_PATH}${selectedVersion.img}.png` } />
          }
          <h1 className='sel-attr-title'>{ attrDisplay.label }</h1>
          <input
            type='radio'
            name={ `properties[${attrDisplay.label}]` }
            value={ selectedVersion.text }
            checked
          />
        </div>
      );
      return acc;
    }, []);

    if (optionsList.length === 0) return null;

    const MaterialSelector = () => {
      const materialDisplay = MATERIALS_CONFIG[materialKey];
      const attr = 'material';
      if (!materialDisplay) return null;

      return (
        <div
          className={ `option-tile ${selectedAttr === 'material' ? 'active' : ''}` }
          key='material-selector'
          onClick={ () => {
            if (attr === selectedAttr) setSelectedAttr(''); 
            else setSelectedAttr(attr);
          } }
        >
          <input
            type='radio'
            name={ `properties[Material]` }
            value={ materialDisplay.text }
            checked
          />
          <div className='material-icon' style={ { background: materialDisplay.color } }/>
          <h1 className='sel-attr-title'>Material</h1>
        </div>
      );
    }

    const CustomTextSelector = () => {
      const attr = 'text';

      return (
        <div
          className={
            `option-tile
            ${selectedAttr === 'text' ? 'active' : ''}
            ${text && text.length > 18 ? 'small' : ''}
            `
          }
          onClick={ () => {
            if (attr === selectedAttr) setSelectedAttr(''); 
            else setSelectedAttr(attr);
          } }
        >
          { text &&
            <input
              id='hidden-text'
              type='text'
              name='properties[Custom Message]'
              onChange={ (e) => { } }
              value={ text }
              autoFocus
            />
          }
          <h1 className='sel-attr-title' style={ { textTransform: 'none' } }>Custom Text</h1>
        </div>
      )
    }

    return (
      <div className='option-list'>
        { optionsList }
        <MaterialSelector />
        <CustomTextSelector />
      </div>
    );
  }

  const VersionOptionsList = () => {
    let content = null;
    let header = '';

    switch (selectedAttr) {
      case 'material':
        header = 'Material';
        content = Object.keys(MATERIALS_CONFIG).reduce((acc, key) => {
          const material = MATERIALS_CONFIG[key];
          const optionTile = (
            <label
              className={ `version-tile ${key === materialKey ? 'active' : ''}` }
              key={ key }
              onClick={ () => { setMaterialKey(key); } }
            >
              <div className='material-icon' style={ { background: material.color } }/>
              <h1 className='sel-attr-title sel-material'>{ material.text }</h1>
            </label>
          );
          return acc.concat(optionTile);
        }, []);
        break;
      case 'text':
        header = 'Custom Text'
        content = (
          <div className='custom-message-container'>
            <input
              id='custom-message'
              type='text'
              name='properties[Custom Message]'
              maxLength='22'
              placeholder='22 character limit'
              onChange={ (e) => { setText(e.target.value); } }
              value={ text }
              autoFocus
            />
          </div>
        );
        break;
      default:
        const selectedVersion = modelOptActions.getSelectedVersion(selectedAttr);
        const versions = modelOptActions.getAvailableVersions(selectedAttr);
        if (versions.length === 0) break;

        header = ATTR_DISPLAY_CONFIG[selectedAttr].label;
        content = versions.reduce((acc, el) => {
          const optionTile = (
            <div
              className={ `version-tile ${el.id === selectedVersion.id ? 'active' : ''}` }
              key={ el.id }
              onClick={ () => {
                modelOptActions.selectVersion(selectedAttr, el.id);
              }}
            >
              { el.img && <img src={ `${S3_PATH}${el.img}.png` } /> }
              <h1 className='sel-attr-title'>{ el.text }</h1>
            </div>
          );
          return acc.concat(optionTile);
        }, []);
        break;
    }

    return (
      <div className='version-list'>
        <div className='top-container'>
          <h2 className='header'>{ header }</h2>
          { content }
        </div>
        <div
          className='version-back-btn'
          onClick={ () => { setSelectedAttr(''); } }
        >
          <span>BACK</span>
          <BackArrow />
        </div>
      </div>
    )
  }

  return (
    <div
      className={
        `selector
        ${selectedAttr ? 'show-versions' : ''}
        ${isMobile() ? '' : 'not-mobile'}`
      }
    >
      <OptionsList />
      <VersionOptionsList />
      <HiddenSelect />
    </div>
  );
}
