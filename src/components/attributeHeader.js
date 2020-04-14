import { isMobile } from '../helpers/helpers';
import React from 'react';
// const { React } = window;


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
      <div className='attribute-header'>
        <h2>Brooklyn Collection</h2>
      </div>
    )
  }
  return (
    <div className='attribute-header'>
      { isMobile() ?
          <h2>{ `Step ${1 + selectedIdx} of ${availableAttributes.length}: ${selectedAttr.label}` }</h2> :
          availableAttributes.map((attr, idx) => (
            <div
              key={ attr.label }
              className={`header-container ${idx === selectedIdx ? 'active' : ''}`}
              onClick={ () => { setSelectedIdx(idx); }}
            >
              <h2>{ `${1 + idx}. ${attr.label}` }</h2>
            </div>
          ))
      }
      <img
        className='zoom-icon'
        onClick={ () => { setZoomedOut(!zoomedOut); }}
        src={`https://uncut-public.s3.amazonaws.com/assets/${zoomedOut ? 'zoom-in' : 'search'}.svg`}
        alt='expand'
      />
    </div>
  );
}