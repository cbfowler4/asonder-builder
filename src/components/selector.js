import { isMobile } from '../helpers/helpers';
import { AttributeList } from './attributeList';
import { VersionList } from './versionList';

const { React } = window;
const { useState, useEffect } = React;


export const Selector = ({ controllerActions }) => {
  const [selectedAttr, setSelectedAttr] = useState('');

  useEffect(() => {
    controllerActions.Action.centerAttribute(selectedAttr);
    controllerActions.Action.updateControls(selectedAttr);
  }, [selectedAttr]);

  return (
    <div
      className={
        `selector
        ${selectedAttr ? 'show-versions' : ''}
        ${isMobile() ? '' : 'not-mobile'}`
      }
    >
      <AttributeList
        selectedAttr={ selectedAttr }
        setSelectedAttr={ setSelectedAttr }
        controllerActions={ controllerActions }
      />
      <VersionList
        selectedAttr={ selectedAttr }
        setSelectedAttr={ setSelectedAttr }
        controllerActions={ controllerActions }
      />
    </div>
  );
}
