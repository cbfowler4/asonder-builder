import { isMobile } from '../helpers/helpers';
import { AttributeList } from './attributeList';
import { VersionList } from './versionList';

const { React } = window;
const { useState } = React;


export const Selector = ({ controllerActions }) => {
  const [selectedAttr, setSelectedAttr] = useState('');

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
