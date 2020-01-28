import Configurator from '../helpers/configurator';
const { React, moment } = window;

const { useEffect, useState } = React;

let rotateAt = moment();

const rotateModel = () => {
  window.setTimeout(() => {
    if (moment().isAfter(rotateAt)) Configurator.rotateOnYAxis(.007);
    rotateModel();
  }, 25)
}

export const ConfiguratorContainer = ({ modelOpts, modelOptActions, materialKey }) => {
  const [canvasRef, setCanvasRef] = useState(null);
  const [containerRef, setContainerRef] = useState(null);
  const [loading, setLoading] = useState(0);
  const [grabbing, setGrabbing] = useState(false);

  useEffect(() => {
    if (!canvasRef) return;
    Configurator.init(canvasRef, containerRef);

    const loadModel = async () => {
      await Configurator.loadModel(
        // 'https://uncut-pipes.s3.amazonaws.com/Initial+Launch+Rev2.fbx',
        'https://cbfowler4.s3.amazonaws.com/Initial+Launch+Rev2.fbx',
        (xhr) => { setLoading(xhr.loaded / xhr.total * 100); }
      );

      const modelOptions = Configurator.generateModelOptions();
      modelOptActions.setModelOpts(modelOptions);

      setLoading(0);
      rotateAt = moment();
      rotateModel();
    }

    loadModel();
  }, [canvasRef])

  useEffect(() => {
    // HANDLE GRABBING BASED ON EVENTS
    if (!canvasRef) return;
    canvasRef.addEventListener('mousedown', () => { setGrabbing(true); });
    canvasRef.addEventListener('touchstart', () => { setGrabbing(true); });
    canvasRef.addEventListener('mouseout', () => { setGrabbing(false); });
    canvasRef.addEventListener('mouseup', () => { setGrabbing(false); });
    canvasRef.addEventListener('touchend', () => { setGrabbing(false); });
  }, [canvasRef])

  useEffect(() => {
    // HANDLE ROTATION BASED ON GRABBING
    if (!grabbing) rotateAt = moment().add(4, 's');
    else rotateAt = moment().add(1, 'y');
  }, [grabbing])

  Configurator.updateModel(modelOpts);
  Configurator.updateMaterial(materialKey);

  return (
    <div
      ref={ node => setContainerRef(node) }
      className={ `iframe-container ${grabbing ? 'grabbing' : ''}` }
    >
      <canvas ref={ node => setCanvasRef(node) } />
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

