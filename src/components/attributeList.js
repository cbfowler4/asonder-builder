import { ATTRIBUTE_CONFIG } from '../helpers/configs';
import Configurator from '../helpers/configurator';
const { React } = window;

const HiddenSelect = () => {
  //select the element's id for Shopify. Shopify will select the variant that corresponds to the value.
  const options = ['14621554311223'].reduce((acc, el) => {
    const element = <option key={ el } selected value={ el } />;
    return acc.concat(element);
  }, []);

  return (
    <select name='id' id='ProductSelect' className='product-single__variants no-js'>
      {options}
    </select>
  );
}


export const AttributeList = ({ controllerActions, setSelectedAttr }) => {
  const optionsList = controllerActions.Info.getAvailableAttributes().reduce((acc, availableAttr) => {
    const { name, label } = availableAttr;

    switch (name) {
      case 'material':
        const material = controllerActions.Special.getSelectedMaterial() || {};
        return acc.concat(
          <div
            className='option-tile'
            key='material-selector'
            onClick={ () => { setSelectedAttr(name); } }
          >
            <input
              type='radio'
              name={ `properties[Material]` }
              value={ material.text }
              checked
            />
            <div className='material-icon' style={ { background: material.color } }/>
            <h1 className='sel-attr-title'>Material</h1>
          </div>
        );
      case 'text':
        const text = controllerActions.Special.getCustomText();
        return acc.concat(
          <div
            className={ `option-tile ${text && text.length > 18 ? 'small' : ''}` }
            onClick={ () => { setSelectedAttr(name); } }
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
      default:
        const selectedVersion = controllerActions.Info.getSelectedVersion(name);
        return acc.concat(
          <div
            className='option-tile'
            key={ label }
            onClick={ () => { setSelectedAttr(name); }}
          >
            { selectedVersion.imgPath &&
              <img className='major-img' src={ selectedVersion.imgPath } />
            }
            <h1 className='sel-attr-title'>{ label }</h1>
            <input
              type='radio'
              name={ `properties[${label}]` }
              value={ selectedVersion.text }
              checked
            />
          </div>
        );
    }
  }, []);

  if (optionsList.length === 0) return null;

  return (
    <div className='option-list'>
      { optionsList }
      <HiddenSelect />
    </div>
  );
}