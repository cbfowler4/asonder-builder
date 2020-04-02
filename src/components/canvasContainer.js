import React from 'react';
import Configurator from '../helpers/configurator';
import { HashLoader } from 'react-spinners';
import BezierEasing from 'bezier-easing';
import { Y_ROT_INITIAL } from '../helpers/configs';
import { getModelPath } from '../helpers/helpers';

const yFinal = 2 * Math.PI;

const easing = BezierEasing(0,0.55,0.60,1);
let step = 0;
const time = 1200; // milliseconds
const stepTime = 15; // milliseconds


const rotateModel = () => {
  const t = stepTime * step / time
  if (t >= 1) return;
  window.setTimeout(() => {
    const { x, z } = Configurator.getRotation();
    const y = (yFinal - Y_ROT_INITIAL) * easing(t) + Y_ROT_INITIAL;
    Configurator.setRotation(x, y, z);
    rotateModel();
    step += 1;
  }, stepTime)
}


const { useEffect, useState } = React;

const LoadingBarOverlay = () => (
  <div className='loading-overlay'>
    <div className='loading-bar-container'>
      <h2>Launching Builder</h2>
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
        getModelPath(),
        (xhr) => { setLoading(xhr.loaded / xhr.total * 100); }
      );

      const initModelOptions = Configurator.generateModelOptions();
      const initSpecialOptions = controllerActions.Special.generateSpecialOptions();

      controllerActions.Action.reinitialize(initModelOptions, initSpecialOptions);   

      setLoading(0);

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

  return (
    <div
      ref={ node => setContainerRef(node) }
      className={ `iframe-container ${grabbing ? 'grabbing' : ''}` }
    >
      <canvas id='configurator-canvas' ref={ node => setCanvasRef(node) } />
      { Boolean(loading) &&
        <LoadingBarOverlay loading={ loading } />
      }
    </div>
  );
}

