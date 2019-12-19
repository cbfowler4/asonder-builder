import Configurator from '../helpers/configurator';
const { React } = window;

const { useEffect, useState } = React;

const rotateModel = () => {
  console.log('here');
  window.setTimeout(() => {
    Configurator.rotate({ z: .05 });
    rotateModel();
  }, 30)
}

export const ConfiguratorContainer = ({ modelOpts, modelOptActions, materialKey }) => {
  const [ref, setRef] = useState(null);
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    if (!ref) return;
    Configurator.init(ref);

    const loadModel = async () => {
      await Configurator.loadModel(
        'https://cbfowler4.s3.amazonaws.com/Initial+Launch+Rev2.fbx',
        (xhr) => { setLoading(xhr.loaded / xhr.total * 100); });

      setLoading(0);
      // rotateModel();
      const modelOptions = Configurator.generateModelOptions();
      modelOptActions.setModelOpts(modelOptions);
    }

    loadModel();
  }, [ref])

  // useEffect(() => {
  //   if (!ref) return;
  //   let grd = ref.createLinearGradient(300.000, 242.000, 0.000, 58.000);
      
  //   // Add colors
  //   grd.addColorStop(0.000, 'rgba(51, 51, 51, 1.000)');
  //   grd.addColorStop(0.996, 'rgba(229, 229, 229, 1.000)');
    
  //   // Fill with gradient
  //   ref.fillStyle = grd;
  //   ref.fillRect(0, 0, 300.000, 300.000);
  // }, [ref])

  Configurator.updateModel(modelOpts);
  Configurator.updateMaterial(materialKey);

  return (
    <div className='iframe-container'>
      <canvas ref={ node => setRef(node) } />
      { Boolean(loading) &&
        <div className='loading-overlay'>
          <div className='loading-bar-container'>
            <h2>Loading Model...</h2>
            <div className='loading-bar-total'>
              <div className='loading-bar' style={ { width: `${loading}%`} } />
            </div>
          </div>
        </div>
      }
    </div>
  );
}

