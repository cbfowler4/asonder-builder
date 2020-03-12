import { CanvasContainer } from './components/canvasContainer';
import { Selector } from './components/selector';
import { AttributeHeader } from './components/attributeHeader';
import { useModelController } from './helpers/modelController';

import './styles/configurator.scss';
import './styles/selector.scss';
import './styles/loader.scss';
import './styles/attributeHeader.scss';
import './styles/index.css';

const React = window.React;
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