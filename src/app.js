import { Configurator } from './configurator';
// import { Configurator2 } from './configurator2';
import { Configurator3 } from './configurator3';
// import './configurator4.js';
import { Selector } from './selector';
import { MATERIALS_CONFIG } from './configs';
import './configurator2.css';


const React = window.React;
const { useEffect, useState } = React;

export const App = () => {
  const [modelOpts, setModelOpts] = useState({});
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

  // return <Configurator2 />;
  return <Configurator3 />;

  // return (
  //   <div className='configurator-root'>
  //     {/* <div className='iframe-container'>
  //       <div class='top-strip'></div>
  //       <div class='bottom-strip'></div>
  //       <iframe title='api-frame' id='api-frame' /> 
  //     </div> */}
  //     <Selector modelOpts={ modelOpts } selectedMaterial={ selectedMaterial } />
  //   </div>
  // )
}