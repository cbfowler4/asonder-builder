import React from 'react';
import { CanvasContainer } from './components/canvasContainer';
import { Selector } from './components/selector';
import { AttributeHeader } from './components/attributeHeader';
import { useModelController } from './helpers/modelController';
// const { React } = window;

import './styles/configurator.scss';
import './styles/selector.scss';
import './styles/loader.scss';
import './styles/attributeHeader.scss';
import './styles/index.css';

const { useState, useEffect } = React;

export const App = () => {
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const { controllerActions } = useModelController();

  useEffect(() => {
    const maxLength = controllerActions.Info.getAvailableAttributes().length;
    if (maxLength === 0) return;
 
    if (selectedIdx >= maxLength) {
      setSelectedIdx(maxLength - 1);
    }
  }, [selectedIdx]);

  useEffect(() => {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);

  }, []);

  return (
    <div className='configurator-root'>
      <AttributeHeader
        controllerActions={ controllerActions }
        setSelectedIdx={ setSelectedIdx }
        selectedIdx={ selectedIdx }
      />
      <CanvasContainer controllerActions={ controllerActions } />
      <Selector
        controllerActions={ controllerActions }
        selectedIdx={ selectedIdx }
        setSelectedIdx={ setSelectedIdx }
      />
    </div>
  )
}