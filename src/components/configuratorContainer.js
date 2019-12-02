import Configurator from '../helpers/configurator';
const { React } = window;

const { useEffect, useState } = React;

export const ConfiguratorContainer = ({ modelOpts, modelOptActions, materialKey }) => {
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;
    Configurator.init(ref);

    const loadModel = async () => {
      await Configurator.loadModel('https://cbfowler4.s3.amazonaws.com/Initial+Launch+Rev2.fbx', materialKey);
      const modelOptions = Configurator.generateModelOptions();
      modelOptActions.setModelOpts(modelOptions);
    }

    loadModel();
  }, [ref])

  Configurator.updateModel(modelOpts);
  Configurator.updateMaterial(materialKey);

  return <div className='iframe-container' ref={ node => setRef(node) } />;
}

