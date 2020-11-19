import React from 'react';
import { ASSET_PATH } from '../configs/environmentConfig';
import { isMobile, navigateToProductPage, getConfig } from '../helpers/helpers';


export const AttributeSelector = ({ controllerActions, selectedIdx, setSelectedIdx }) => {
  let content = null;

  const availableAttributes = controllerActions.Info.getAvailableAttributes();
  const { name } = controllerActions.Info.getAttributeFromIndex(selectedIdx);
  
  const BackButton = () => {
    if (availableAttributes.length === 0) return null;

    if (selectedIdx < 0) {
      return (
        <div className='start-btn'>
          <div onClick={ () => {
            controllerActions.Action.resetModelRotation();
            setSelectedIdx(0);
          } } >
            Start Building
          </div>
        </div>
      )
    }
    return (
      <div className='nav-btn-container'>
        { isMobile() && selectedIdx > 0 &&
          <div onClick={ () => { setSelectedIdx(selectedIdx - 1); } } >
            back
          </div>
        }
        { selectedIdx < availableAttributes.length - 1 &&
          <div onClick={ () => { setSelectedIdx(selectedIdx + 1); } }>
              <span>Next</span>
          </div>
        }
        { selectedIdx === availableAttributes.length - 1 &&
          <div onClick={ () => {
            const search = controllerActions.Info.getSearchAttrsForUrl();
            navigateToProductPage(search);
            } }>
            <span>DONE</span>
          </div>
        }
      </div>
    );
  }

  switch (name) {
    case 'material':
      const selectedMaterial = controllerActions.Special.getSelectedMaterial() || {};
      content = controllerActions.Special.getAvailableMaterials().reduce((acc, material) => {
        const { color, text, id } = material;
        const optionTile = (
          <label
            className={ `version-tile ${selectedMaterial.id === id ? 'active' : ''}` }
            key={ id }
            onClick={ () => {
              controllerActions.Special.selectMaterial(id);
            } }
          >
            <div className='material-icon' style={ { background: color } }/>
            <h1 className='sel-attr-title sel-material'>{ text }</h1>
          </label>
        );
        return acc.concat(optionTile);
      }, []);
      break;
    case 'text':
      const text = controllerActions.Special.getCustomText();
      const { maxTextLength } = getConfig().specialAttributes.text;
      content = (
        <div className='custom-message-container'>
          <input
            id='custom-message'
            type='text'
            name='properties[Custom Message]'
            maxLength={ maxTextLength }
            placeholder={ `${maxTextLength} Character Limit (Optional)` }
            onChange={ (e) => { controllerActions.Special.setCustomText(e.target.value); } }
            value={ text }
            autoFocus
          />
          <h1 className='sel-attr-title'>custom text</h1>
        </div>
      );
      break;
    default:
      const selectedVersion = controllerActions.Info.getSelectedVersion(name);
      content = controllerActions.Info.getAvailableVersions(name)
        .reduce((acc, version) => {
          const { id, text, img, height } = version;
          const style = { height };

          const optionTile = (
            <div
              className={ `version-tile ${id === selectedVersion.id ? 'active' : ''}` }
              key={ `${id}-${name}` }
              onClick={ () => { controllerActions.Action.selectVersion(name, id); } }
            >
              { img && <img className='tile-img' src={ `${ASSET_PATH}${img}.png` } style={ style } /> }
              <h1 className='sel-attr-title'>{ text }</h1>
            </div>
          );
          return acc.concat(optionTile);
      }, []);
      break;
  }

  return (
    <div className='version-list'>
      <div className='top-container'>
        { content }
      </div>
        <BackButton />
    </div>
  )
}