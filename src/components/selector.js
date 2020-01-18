import Configurator from '../helpers/configurator';
import { ATTR_ORDER, ATTR_DISPLAY_CONFIG, MATERIALS_CONFIG, S3_PATH } from '../helpers/configs';
import { debounce } from '../helpers/helpers';

const { React } = window;
const { useState, useEffect } = React;

const updateConfiguratorText = debounce((text) => { Configurator.updateText(text); }, 1000);

export const Selector = ({ modelOptActions, setMaterialKey, materialKey }) => {
  const [attrMenu, setAttrMenu] = useState('');
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
          className={ `option-tile ${attrMenu === attr ? 'active' : ''}` }
          key={ `${attrDisplay.label}-${selectedVersion.text}`}
          onClick={ () => {
            if (attr === attrMenu) setAttrMenu(''); 
            else setAttrMenu(attr);
          }}
        >
          <h2 className='attr-label'>{ attrDisplay.label }</h2>
          { selectedVersion.img &&
            <img className='major-img' src={ `${S3_PATH}${selectedVersion.img}.png` } />
          }
          <h1 className='sel-attr-title'>{ selectedVersion.text }</h1>
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
          className={ `option-tile ${attrMenu === 'material' ? 'active' : ''}` }
          key='material-selector'
          onClick={ () => {
            if (attr === attrMenu) setAttrMenu(''); 
            else setAttrMenu(attr);
          } }
        >
          <h2 className='attr-label'>Material</h2>
          <input
            type='radio'
            name={ `properties[Material]` }
            value={ materialDisplay.text }
            checked
          />
          <div className='material-icon' style={ { background: materialDisplay.color } }/>
          <h1 className='sel-attr-title'>{ materialDisplay.text }</h1>
        </div>
      );
    }

    const CustomTextSelector = () => {
      const attr = 'text';

      return (
        <div
          className={
            `option-tile
            ${attrMenu === 'text' ? 'active' : ''}
            ${text && text.length > 18 ? 'small' : ''}
            `
          }
          onClick={ () => {
            if (attr === attrMenu) setAttrMenu(''); 
            else setAttrMenu(attr);
          } }
        >
          <h2 className='attr-label'>Custom Text</h2>
          { text &&
            <input
              id='hidden-text'
              type='text'
              name='properties[Custom Message]'
              onChange={ (e) => { } }
              value={ text }
              autoFocus
              disabled
            />
          }
          <h1 className='sel-attr-title' style={ { textTransform: 'none' } }>
            { text ? text : '(No Custom Text)' }
          </h1>
        </div>
      )
    }

    return optionsList.concat(<MaterialSelector />).concat(<CustomTextSelector />);
  }

  const VersionOptionsList = () => {
    let content = null;
    let header = '';

    switch (attrMenu) {
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
              <h1 className='sel-attr-title'>{ material.text }</h1>
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
        const selectedVersion = modelOptActions.getSelectedVersion(attrMenu);
        const versions = modelOptActions.getAvailableVersions(attrMenu);
        if (versions.length === 0) break;

        header = ATTR_DISPLAY_CONFIG[attrMenu].label;
        content = versions.reduce((acc, el) => {
          const optionTile = (
            <div
              className={ `version-tile ${el.id === selectedVersion.id ? 'active' : ''}` }
              key={ el.id }
              onClick={ () => {
                modelOptActions.selectVersion(attrMenu, el.id);
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
      <div className='versions-options-list'>
        <h2 className='header'>{ header }</h2>
        { content }
      </div>
    )
  }

  const HiddenSelect = () => {
    const majorAttrDisp = ATTR_DISPLAY_CONFIG.major;

    const options = majorAttrDisp.versions.reduce((acc, el) => {
      const selected = el.id === Configurator.majorAttr;
      const element = <option key={ el.id } selected={ selected ? true : false } value={ el.variant } />;
      return acc.concat(element);
    }, []);

    return (
      <select name='id' id='ProductSelect' className='product-single__variants no-js'>
        ${options}
      </select>
    );
  }

  return (
    <div className={ `selector ${attrMenu ? '' : 'closed'}` }>
      <OptionsList />
      <VersionOptionsList />
      <HiddenSelect />
    </div>
  );
}
