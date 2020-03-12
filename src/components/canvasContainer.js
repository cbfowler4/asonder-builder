import React from 'react';
import Configurator from '../helpers/configurator';
import { HashLoader } from 'react-spinners';

// const { React, moment } = window;


const { useEffect, useState } = React;

const LoadingBarOverlay = ({ loading }) => (
  <div className='loading-overlay'>
    <div className='loading-bar-container'>
      <h2>Launching Builder</h2>
      {/* <div className='loading-bar-total'>
        <div className='loading-bar' style={ { width: `${loading}%`} } />
      </div> */}
      <HashLoader color={ 'white' } size={ 80 } />
    </div>
  </div>
)

export const CanvasContainer = ({ controllerActions }) => {
  const [canvasRef, setCanvasRef] = useState(null);
  const [containerRef, setContainerRef] = useState(null);
  const [loading, setLoading] = useState(0);
  const [grabbing, setGrabbing] = useState(false);

  useEffect(() => {
    if (!canvasRef) return;
    Configurator.init(canvasRef, containerRef);

    const loadModel = async () => {
      await Configurator.loadModel(
        'https://cbfowler4.s3.amazonaws.com/Lauch+2_r2_drc.glb',
        (xhr) => { setLoading(xhr.loaded / xhr.total * 100); }
      );

      const initModelOptions = Configurator.generateModelOptions();
      const initSpecialOptions = controllerActions.Special.generateSpecialOptions();
      controllerActions.Action.reinitialize(initModelOptions, initSpecialOptions);

      setLoading(0);
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

  return (
    <div
      ref={ node => setContainerRef(node) }
      className={ `iframe-container ${grabbing ? 'grabbing' : ''}` }
    >
      <canvas ref={ node => setCanvasRef(node) } />
      { Boolean(loading) &&
        <LoadingBarOverlay loading={ loading } />
      }
    </div>
  );
}

