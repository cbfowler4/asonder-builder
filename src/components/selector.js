import Configurator from '../helpers/configurator';
import { debounce, isMobile } from '../helpers/helpers';
import { OptionList } from './optionList';
import { VersionList } from './versionList';

const { React } = window;
const { useState, useEffect } = React;

const updateConfiguratorText = debounce((text) => { Configurator.updateText(text); }, 1000);

export const Selector = ({ modelOptActions, setMaterialKey, materialKey }) => {
  const [selectedAttr, setSelectedAttr] = useState('');
  const [text, setText] = useState('');
  
  useEffect(() => {
    // updateConfiguratorText(text);
  }, [text]);

  return (
    <div
      className={
        `selector
        ${selectedAttr ? 'show-versions' : ''}
        ${isMobile() ? '' : 'not-mobile'}`
      }
    >
      <OptionList
        setSelectedAttr={ setSelectedAttr }
        modelOptActions={ modelOptActions }
        materialKey={ materialKey }
        text={ text }
      />
      <VersionList
        selectedAttr={ selectedAttr }
        setSelectedAttr={ setSelectedAttr }
        modelOptActions={ modelOptActions }
        materialKey={ materialKey }
        setMaterialKey={ setMaterialKey }
        text={ text }
        setText={ setText }
      />
    </div>
  );
}
