import { CanvasContainer } from './components/canvasContainer';
import { Selector } from './components/selector';
import { useModelController } from './helpers/modelController';

import './styles/configurator.scss';
import './styles/selector.scss';
import './styles/loader.scss';
import './styles/index.css';

const React = window.React;

export const App = () => {
  const { controllerActions } = useModelController();

  return (
    <div className='configurator-root'>
      <CanvasContainer controllerActions={ controllerActions } />
      <Selector controllerActions={ controllerActions } />
    </div>
  )
}