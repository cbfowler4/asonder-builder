import { Configurator } from './configurator';
// import { Configurator2 } from './configurator2';
import { ConfiguratorContainer } from './configuratorContainer';
// import './configurator4.js';
import { Selector } from './selector';
import { useModelOpts } from './helpers';

import { MATERIALS_CONFIG } from './configs';
import './configurator2.css';


const React = window.React;
const { useEffect, useState } = React;

export const App = () => {
  // const [modelOpts, setModelOpts] = useState({});
  const [modelOpts, modelOptActions] = useModelOpts();

  const [selectedMaterial, setSelectedMaterial] = useState(Object.keys(MATERIALS_CONFIG)[0]);
  
  useEffect(() => {
    const iframe = document.getElementById('api-frame');
    // Configurator.init({
    //   iframe,
    //   modelOpts,
    //   setModelOpts,
    //   selectedMaterial,
    //   setSelectedMaterial,
    // });
  }, []);

  useEffect(() => { Configurator.modelOpts = modelOpts; }, [modelOpts]);
  useEffect(() => { Configurator.selectedMaterial = selectedMaterial; }, [selectedMaterial]);


  return (
    <div className='configurator-root'>
      {/* <div className='iframe-container'>
        <div class='top-strip'></div>
        <div class='bottom-strip'></div>
        <iframe title='api-frame' id='api-frame' /> 
      </div> */}
      <ConfiguratorContainer modelOpts={ modelOpts } modelOptActions={ modelOptActions } />
      <Selector modelOpts={ modelOpts } modelOptActions={ modelOptActions } selectedMaterial={ selectedMaterial } />
    </div>
  )
}