import { Configurator } from './configurator';
import { ATTR_ORDER, ATTR_DISPLAY_CONFIG, MATERIALS_CONFIG } from './configs';

const { React } = window;
const { useState } = React;

export const Selector = ({ modelOpts, selectedMaterial }) => {
  const [attrMenu, setAttrMenu] = useState('');

  const getAvailableVersions = (attr) => {
    let availableVersions = {};
    if (attr === 'major') {
      availableVersions = Object.keys(modelOpts)
        .reduce((acc, key) => ({ ...acc, [key]: true }), {});
    } else {
      availableVersions = (modelOpts[Configurator.majorAttr] || {})[attr] || [];
    }
    if (!ATTR_DISPLAY_CONFIG[attr]) return [];
    return ATTR_DISPLAY_CONFIG[attr].versions
      .filter(version => (availableVersions[version.id]));
  }

  const getSelectedVersion = (attr) => {
    if (attr === 'major') return Configurator.majorAttr;

    const versions = modelOpts[Configurator.majorAttr][attr];
    const selectedVersionId = Object.keys(versions).find((versionId) => versions[versionId].selected);
    return ATTR_DISPLAY_CONFIG[attr].versions.find((version) => version.id === selectedVersionId);
  };
  
  const OptionsList = () => {
    const optionsList = ATTR_ORDER.reduce((acc, attr) => {
      const attrDisplay = { ...ATTR_DISPLAY_CONFIG[attr] };
      attrDisplay.versions = getAvailableVersions(attr);
      if (attrDisplay.versions.length < 2) return acc;

      const selectedVersion = getSelectedVersion(attr);

      acc.push(
        <div
          className={ `option-tile ${attrMenu === attr ? 'active' : ''}` }
          key={ `${attrDisplay.label}-${selectedVersion.text}`}
          onClick={ () => {
            if (attr === attrMenu) setAttrMenu(''); 
            else setAttrMenu(attr);
          }}
        >
          <h2 className='attr-label'>{ attrDisplay.label }</h2>
          <h1 className='sel-attr-title'>{ selectedVersion.text }</h1>
        </div>
      );
      return acc;
    }, []);

    if (optionsList.length === 0) return null;

    const MaterialSelector = () => {
      const materialDisplay = MATERIALS_CONFIG[selectedMaterial];
      const attr = 'material';
      if (!materialDisplay) return null;

      return (
        <div
          className={ `option-tile ${attrMenu === 'material' ? 'active' : ''}` }
          key='material-selector'
          onClick={ () => {
            if (attr === attrMenu) setAttrMenu(''); 
            else setAttrMenu(attr);
          } }
        >
          <h2 className='attr-label'>Material</h2>
          <h1 className='sel-attr-title'>{ materialDisplay.text }</h1>
        </div>
      );
    }

    return optionsList.concat(<MaterialSelector />);
  }

  const VersionOptionsList = () => {
    const versions = getAvailableVersions(attrMenu);
    if (versions.length === 0) return null;
    
    const selectedVersion = getSelectedVersion(attrMenu);
    console.log(selectedVersion);
    const list = versions.reduce((acc, el) => {
      const optionTile = (
        <div
          className={ `option-tile ${el.id === selectedVersion.id ? 'active' : ''}` }
          key={ el.id }
          onClick={ () => {
            Configurator.selectOption({ attr: attrMenu, newVersionId: el.id });
          }}
        >
          <h1 className='sel-attr-title'>{ el.text }</h1>
        </div>
      );
      return acc.concat(optionTile);
    }, []);

    return (
      <div className='verions-options-list'>
        { list }
      </div>
    )
  }

  const MaterialVersionOptionsList = () => {
    if (attrMenu !== 'material') return null;

    const list = Object.keys(MATERIALS_CONFIG).reduce((acc, key) => {
      const material = MATERIALS_CONFIG[key];
      const optionTile = (
        <div
          className='option-tile'
          key={ key }
          onClick={ () => {
            Configurator.selectMaterial(key);
          }}
        >
          <h1 className='sel-attr-title'>{ material.text }</h1>
        </div>
      );
      return acc.concat(optionTile);
    }, []);

    return (
      <div className='verions-options-list'>
        { list }
      </div>
    )
  }

  const HiddenSelect = () => {
    const majorAttrDisp = ATTR_DISPLAY_CONFIG.major;

    const options = majorAttrDisp.versions.reduce((acc, el) => {
      const selected = el.id === Configurator.majorAttr;
      const element = <option key={ el.id } selected={ selected ? true : false } value={ el.variant } />;
      return acc.concat(element);
    }, []);

    return (
      <select name='id' id='ProductSelect' className='product-single__variants no-js'>
        ${options}
      </select>
    );
  }

  return (
    <div className='selector'>
      <OptionsList />
      <VersionOptionsList />
      <MaterialVersionOptionsList />
      <HiddenSelect />
    </div>
  );
}


// var UI = {
//     config: null,
//     options: null,
//     init: function (config, options) {
//       this.config = config;
//       this.modelOpts = options;
//       this.el = document.querySelector('.options');
//       this.priceEl = document.querySelector('.price');
      
//       try {
//         this.loader = document.querySelector('.lds-roller');
//         this.loader.setAttribute('style', 'display: none');
//       } catch (err) {}

//       this.render();

//       this.el.addEventListener('change', (e) => {
//           e.preventDefault();
//           const [attr, versionId] = e.target.id.split('-');
//           this.select({ attr, versionId });
//       });
//     },
//     select: function ({ attr, versionId }) {
//         Configurator.selectOption({ attr, newVersionId: versionId });
//         this.render();
//     },
//     
//     getAvailableVersions: function (attr) {
//       let availableVersions = {};
//       if (attr === 'major') {
//         availableVersions = Object.keys(this.modelOpts)
//           .reduce((acc, key) => ({ ...acc, [key]: true }), {});
//       } else {
//         availableVersions = (this.modelOpts[Configurator.majorAttr] || {})[attr] || [];
//       }
//       if (!ATTR_DISPLAY_CONFIG[attr]) return [];
//       return ATTR_DISPLAY_CONFIG[attr].versions
//         .filter(version => (availableVersions[version.id]));
//     },
//     getSelectedAttrDisplay: function (attr) {
//       const versions = this.getAvailableVersions(attr);
//       const selectedVersion = this.getSelectedVersion(attr);

//       return versions.find((v) => v.id === selectedVersion);
//     },
//     render: function () {
//       const radioHTML = ATTR_ORDER.reduce((acc, attr) => {
//         const attrDisplay = { ...ATTR_DISPLAY_CONFIG[attr] };
//         attrDisplay.versions = this.getAvailableVersions(attr);
//         if (attrDisplay.versions.length < 2) return acc;

//         const selectedVersion = this.getSelectedVersion(attr);
//         const fieldSet = this.generateRadio({ attrDisplay, attr, selectedVersion });
//         return acc + fieldSet;
//       }, '');

//       const selectHTML = this.generateSelect();
//       const materialHTML = this.generateColorRadio();

//       this.el.innerHTML = radioHTML.concat(materialHTML).concat(selectHTML);
//       this.renderPrice();
//     },
//     generateRadio: function ({ attrDisplay, attr, selectedVersion }) {
//       const radioButtons = attrDisplay.versions.reduce((btnAcc, el) => {
//         const checked = el.id === selectedVersion;
//         const btn = `
//           <label class="options__option ${checked ? 'checked' : ''}">
//             <input
//               id="${attr}-${el.id}"
//               type="radio"
//               name="properties[${attrDisplay.label}]"
//               value="${el.text}"
//               ${checked ? 'checked' : ''}
//             >
//             <span>${el.text}</span>
//           </label>
//         `
//         return btnAcc + btn;
//       }, '');

//       return `
//         <div class="option-set radio">
//           <h2>${attrDisplay.label}</h2>
//           <div class="field-set">
//             ${radioButtons}
//           </div>
//         </div>
//       `;
//     },
//     generateSelect: function () {
//       const majorAttrDisp = ATTR_DISPLAY_CONFIG.major;
  
//       const options = majorAttrDisp.versions.reduce((acc, el) => {
//         const selected = el.id === Configurator.majorAttr;
//         const element = `
//           <option 
//             ${selected ? 'selected="selected"' : ''}
//             value="${el.variant}"
//           />
//         `
//         return acc + element;
//       }, '');

//       return `
//         <select name="id" id="ProductSelect" class="product-single__variants no-js">
//           ${options}
//         </select>
//       `;
//     },
//     generateColorRadio: function () {
//       const radioButtons = Object.keys(MATERIALS_CONFIG).map(key => {

//         const checked = key === Configurator.selectedMaterial;
//         const attrDisplay = MATERIALS_CONFIG[key];
      
//         const btn = `
//           <label class="options__option ${checked ? 'checked' : ''}">
//             <input
//               id="material-${key}"
//               type="radio"
//               name="properties[Material]"
//               value="${key}"
//               ${checked ? 'checked' : ''}
//             >
//             <span>${attrDisplay.label}</span>
//           </label>
//         `
//         return btn;
//       }, '').join('');

//       return `
//         <div class="option-set radio">
//           <h2>Material</h2>
//           <div class="field-set">
//             ${radioButtons}
//           </div>
//         </div>
//       `;
//     },
//     renderPrice: function () {
//       const attrDisplay = this.getSelectedAttrDisplay('major');
//       if (!this.priceEl || !attrDisplay || !attrDisplay.price) return;

//       const priceElement = `
//       <span id="ProductPrice" class="product-single__price">
//         $${attrDisplay.price.toFixed(2)}
//       </span>
//       `

//       this.priceEl.innerHTML = priceElement;
//     },
// }

