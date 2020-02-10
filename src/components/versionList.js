import { S3_PATH } from '../helpers/configs';
const { React } = window;

export const VersionList = ({ setSelectedAttr, controllerActions, selectedAttr }) => {
  let content = null;

  switch (selectedAttr) {
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
      content = (
        <div className='custom-message-container'>
          <input
            id='custom-message'
            type='text'
            name='properties[Custom Message]'
            maxLength='22'
            placeholder='22 character limit'
            onChange={ (e) => { controllerActions.Special.setCustomText(e.target.value); } }
            value={ text }
            autoFocus
          />
        </div>
      );
      break;
    default:
      const selectedVersion = controllerActions.Info.getSelectedVersion(selectedAttr);
      content = controllerActions.Info.getAvailableVersions(selectedAttr)
        .reduce((acc, version) => {
          const { id, text, img } = version;
          const optionTile = (
            <div
              className={ `version-tile ${id === selectedVersion.id ? 'active' : ''}` }
              key={ id }
              onClick={ () => { controllerActions.Action.selectVersion(selectedAttr, id); } }
            >
              { img && <img src={ `${S3_PATH}${img}.png` } /> }
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
      <div
        className='version-back-btn'
        onClick={ () => { setSelectedAttr(''); } }
      >
        <span>BACK TO MENU</span>
      </div>
    </div>
  )
}