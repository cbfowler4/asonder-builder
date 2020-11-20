import * as React from 'react';
import { isMobile, navigateToProductPage } from '../helpers/helpers';


export const NavigationButton = ({ controllerActions, selectedIdx, setSelectedIdx }) => {
  const availableAttributes = controllerActions.Info.getAvailableAttributes();

  if (availableAttributes.length === 0) return null;

  if (selectedIdx < 0) {
    return (
      <div className='start-btn'>
        <div onClick={ () => {
          controllerActions.Action.resetModelRotation();
          setSelectedIdx(0);
        } } >
          Start Building
        </div>
      </div>
    )
  }
  return (
    <div className='nav-btn-container'>
      { isMobile() && selectedIdx > 0 &&
        <div onClick={ () => { setSelectedIdx(selectedIdx - 1); } } >
          back
        </div>
      }
      { selectedIdx < availableAttributes.length - 1 &&
        <div onClick={ () => { setSelectedIdx(selectedIdx + 1); } }>
            <span>Next</span>
        </div>
      }
      { selectedIdx === availableAttributes.length - 1 &&
        <div onClick={ () => {
          const search = controllerActions.Info.getSearchAttrsForUrl();
          navigateToProductPage(search);
          } }>
          <span>DONE</span>
        </div>
      }
    </div>
  );
}