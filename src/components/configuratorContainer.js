import Configurator from '../helpers/configurator';
const { React, moment } = window;

const { useEffect, useState } = React;

let rotateAt = moment();

const rotateModel = () => {
  window.setTimeout(() => {
    if (moment().isAfter(rotateAt)) Configurator.rotateOnYAxis(.015);
    rotateModel();
  }, 35)
}

export const ConfiguratorContainer = ({ modelOpts, modelOptActions, materialKey }) => {
  const [ref, setRef] = useState(null);
  const [loading, setLoading] = useState(0);
  const [grabbing, setGrabbing] = useState(false);

  useEffect(() => {
    if (!ref) return;
    Configurator.init(ref);

    const loadModel = async () => {
      await Configurator.loadModel(
        'https://cbfowler4.s3.amazonaws.com/Initial+Launch+Rev2.fbx',
        (xhr) => { setLoading(xhr.loaded / xhr.total * 100); });

      setLoading(0);
      rotateModel();
      const modelOptions = Configurator.generateModelOptions();
      modelOptActions.setModelOpts(modelOptions);
    }

    loadModel();
  }, [ref])

  useEffect(() => {
    if (!ref) return;
    ref.addEventListener('mousedown', () => {
      setGrabbing(true);
      rotateAt = moment().add(1, 'y');
    });

    ref.addEventListener('mouseup', () => {
      setGrabbing(false);
      rotateAt = moment().add(4, 's');
    });
  }, [ref])

  Configurator.updateModel(modelOpts);
  Configurator.updateMaterial(materialKey);

  return (
    <div className={ `iframe-container ${grabbing ? 'grabbing' : ''}` }>
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

