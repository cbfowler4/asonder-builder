import Configurator from './configurator3';
const { React } = window;

const { useEffect, useState } = React;

export const ConfiguratorContainer = ({ modelOpts, modelOptActions }) => {
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;
    Configurator.init(ref);

    const loadModel = async () => {
      const model = await Configurator.loadModel('https://cbfowler4.s3.amazonaws.com/Initial+Launch+Rev2.fbx');
      console.log('MODEL', model);
      const modelOptions = Configurator.generateModelOptions();
      console.log('MODEL OPTIONS', modelOptions);
      modelOptActions.setModelOpts(modelOptions);
    }

    loadModel();
  }, [ref])

  Configurator.updateModel(modelOpts);

  return (
    <div
      className='iframe-container'
      ref={ node => setRef(node) }
    >
    </div>
  )
}

