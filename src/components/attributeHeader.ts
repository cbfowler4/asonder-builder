import * as React from 'react';
import { isMobile } from '../helpers/helpers';


const { useState, useEffect } = React;

export const AttributeHeader = ({ controllerActions, selectedIdx, setSelectedIdx }) => {
  const [zoomedOut, setZoomedOut] = useState(false);

  const availableAttributes = controllerActions.Info.getAvailableAttributes();
  const selectedAttr = availableAttributes[selectedIdx] || {};

  useEffect(() => {
    if (zoomedOut) controllerActions.Action.centerAttribute();
    else controllerActions.Action.centerAttribute(selectedAttr.name);
  }, [zoomedOut])

  useEffect(() => { setZoomedOut(false); }, [selectedIdx])

  if (availableAttributes.length === 0) return <div className='attribute-header'></div>
  if (selectedIdx < 0) {
    return (
      <div className='attribute-header default-header'>
        <img src='https://uncut-public.s3.amazonaws.com/assets/asonder_purple.svg'/>
      </div>
    )
  }
  return (
    <div className={ `attribute-header ${isMobile() ? 'default-header' : ''}` }>
      { isMobile() ?
          <h2>{ selectedAttr.label }</h2> :
          availableAttributes.map((attr, idx) => (
            <div
              key={ attr.label }
              className={`header-container ${idx === selectedIdx ? 'active' : ''}`}
              onClick={ () => { setSelectedIdx(idx); }}
            >
              <h2>{ `${attr.label}` }</h2>
            </div>
          ))
      }
      {/* <img
        className='zoom-icon'
        onClick={ () => { setZoomedOut(!zoomedOut); }}
        src={`https://uncut-public.s3.amazonaws.com/assets/${zoomedOut ? 'zoom-in' : 'search'}.svg`}
        alt='expand'
      /> */}
      <div
        className='zoom-btn btn'
        onClick={ () => { setZoomedOut(!zoomedOut); }}
      >
        { `zoom ${zoomedOut ? 'in' : 'out'}`}
      </div>
    </div>
  );
}