import { isMobile } from '../helpers/helpers';
import { VersionList } from './versionList';

const { React } = window;
const { useEffect } = React;


export const Selector = ({ controllerActions, selectedIdx, setSelectedIdx }) => {
  const { name } = controllerActions.Info.getAttributeFromIndex(selectedIdx);

  useEffect(() => {
    controllerActions.Action.centerAttribute(name);
    controllerActions.Action.updateControls(name);
  }, [name]);

  return (
    <div
      className={
        `selector show-versions
        ${isMobile() ? '' : 'not-mobile'}`
      }
    >
      <VersionList
        selectedIdx={ selectedIdx }
        setSelectedIdx={ setSelectedIdx }
        controllerActions={ controllerActions }
      />
    </div>
  );
}
