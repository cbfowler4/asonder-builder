import * as React from 'react';
import { CanvasContainer } from './components/canvasContainer';
import { SelectorContainer } from './components/selectorContainer';
import { AttributeHeader } from './components/attributeHeader';
import { useModelController } from './helpers/modelController';
import { updateViewHeight } from './helpers/helpers';

import './styles/configurator.scss';
import './styles/selector.scss';
import './styles/loader.scss';
import './styles/attributeHeader.scss';
import './styles/index.css';

const { useState, useEffect } = React;

const updateSelectedIndex = (
  selectedIndex: number,
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>,
  numOfAvailableAttributes: number
): void => { 
  if (numOfAvailableAttributes === 0) return;

  if (selectedIndex >= numOfAvailableAttributes) {
    setSelectedIndex(numOfAvailableAttributes - 1);
  }
}

export const App = () => {
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const { controllerActions } = useModelController({}, {});

  useEffect(() => {
    updateSelectedIndex(
      selectedIdx,
      setSelectedIdx,
      controllerActions.Info.getAvailableAttributes().length
    );
  }, [selectedIdx]);

  useEffect(() => {
    updateViewHeight();
    window.addEventListener('resize', () => updateViewHeight());
  }, []);


  return (
    <div className='configurator-root'>
      <AttributeHeader
        controllerActions={ controllerActions }
        setSelectedIdx={ setSelectedIdx }
        selectedIdx={ selectedIdx }
      />
      <CanvasContainer controllerActions={ controllerActions } />
      <SelectorContainer
        controllerActions={ controllerActions }
        selectedIdx={ selectedIdx }
        setSelectedIdx={ setSelectedIdx }
      />
    </div>
  )
}