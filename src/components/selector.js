import { isMobile } from '../helpers/helpers';
import { AttributeSelector } from './attributeSelector';

import React from 'react';

const { useEffect } = React;


export const Selector = ({ controllerActions, selectedIdx, setSelectedIdx }) => {
  const { name } = controllerActions.Info.getAttributeFromIndex(selectedIdx);

  useEffect(() => {
    controllerActions.Action.centerAttribute(name);
  }, [name]);

  return (
    <div
      className={
        `selector show-versions
        ${isMobile() ? '' : 'not-mobile'}`
      }
    >
      <AttributeSelector
        selectedIdx={ selectedIdx }
        setSelectedIdx={ setSelectedIdx }
        controllerActions={ controllerActions }
      />
    </div>
  );
}
