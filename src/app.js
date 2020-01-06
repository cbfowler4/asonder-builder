import { ConfiguratorContainer } from './components/configuratorContainer';
import { Selector } from './components/selector';
import Configurator from './helpers/configurator';
import { useModelOpts } from './helpers/helpers';
import { MATERIALS_CONFIG } from './helpers/configs';

import './components/configurator.css';
import './index.css';



const React = window.React;
const { useEffect, useState } = React;

export const App = () => {
  const [modelOpts, modelOptActions] = useModelOpts();

  const [materialKey, setMaterialKey] = useState(Object.keys(MATERIALS_CONFIG)[0]);

  useEffect(() => { Configurator.modelOpts = modelOpts; }, [modelOpts]);

  return (
    <div className='configurator-root'>
      <ConfiguratorContainer
        modelOpts={ modelOpts }
        modelOptActions={ modelOptActions }
        materialKey={ materialKey }
      />
      <Selector
        modelOptActions={ modelOptActions }
        setMaterialKey={ setMaterialKey }
        materialKey={ materialKey }
      />
    </div>
  )
}