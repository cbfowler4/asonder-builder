import * as React from 'react';
import { isMobile } from '../helpers/helpers';
import { AttributeSelector } from './attributeSelector';
import { NavigationButton } from './navigationButton';


const { useEffect } = React;


export const SelectorContainer = ({ controllerActions, selectedIdx, setSelectedIdx }) => {
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
        controllerActions={ controllerActions }
      />
      <NavigationButton
        selectedIdx={ selectedIdx }
        setSelectedIdx={ setSelectedIdx }
        controllerActions={ controllerActions }
      />

    </div>
  );
}
