import { Configurator } from './configurator';
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
    Configurator.init({
      iframe,
      modelOpts,
      setModelOpts,
      selectedMaterial,
      setSelectedMaterial,
    });
  }, []);

  useEffect(() => { Configurator.modelOpts = modelOpts; }, [modelOpts]);
  useEffect(() => { Configurator.selectedMaterial = selectedMaterial; }, [selectedMaterial]);

  return (
    <div className='configurator-root'>
      <div className='iframe-container'>
        <iframe title='api-frame' id='api-frame' />
      </div>
      <Selector modelOpts={ modelOpts } selectedMaterial={ selectedMaterial } />
    </div>
  )
}