import { ATTR_ORDER, ATTR_DISPLAY_CONFIG, MATERIALS_CONFIG, S3_PATH } from '../helpers/configs';
import Configurator from '../helpers/configurator';
const { React } = window;

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


export const OptionList = ({ modelOptActions, materialKey, text, setSelectedAttr }) => {
  const optionsList = ATTR_ORDER.reduce((acc, attr) => {
    const attrDisplay = { ...ATTR_DISPLAY_CONFIG[attr] };
    attrDisplay.versions = modelOptActions.getAvailableVersions(attr);
    if (attrDisplay.versions.length < 2) return acc;


    const selectedVersion = modelOptActions.getSelectedVersion(attr) || {};

    acc.push(
      <div
        className='option-tile'
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
        className='option-tile'
        key='material-selector'
        onClick={ () => { setSelectedAttr(attr); } }
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
          ${text && text.length > 18 ? 'small' : ''}
          `
        }
        onClick={ () => { setSelectedAttr(attr); } }
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
      <HiddenSelect />
    </div>
  );
}