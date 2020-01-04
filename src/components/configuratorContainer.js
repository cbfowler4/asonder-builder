import Configurator from '../helpers/configurator';
const { React, moment } = window;

const { useEffect, useState } = React;

let rotateAt = moment();

const rotateModel = () => {
  window.setTimeout(() => {
    if (moment().isAfter(rotateAt)) Configurator.rotateOnYAxis(.005);
    rotateModel();
  }, 12)
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
        (xhr) => { setLoading(xhr.loaded / xhr.total * 100); }
      );

      const modelOptions = Configurator.generateModelOptions();
      modelOptActions.setModelOpts(modelOptions);
      console.log('here')
      setLoading(0);
      rotateModel();
    }

    loadModel();
  }, [ref])

  useEffect(() => {
    // HANDLE GRABBING BASED ON EVENTS
    if (!ref) return;
    ref.addEventListener('mousedown', () => { setGrabbing(true); });
    ref.addEventListener('mouseout', () => { setGrabbing(false); });
    ref.addEventListener('mouseup', () => { setGrabbing(false); });
  }, [ref])

  useEffect(() => {
    // HANDLE ROTATION BASED ON GRABBING
    if (!grabbing) rotateAt = moment().add(4, 's');
    else rotateAt = moment().add(1, 'y');
  }, [grabbing])

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

