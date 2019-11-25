import Configurator from './configurator3';
import { ATTR_ORDER, ATTR_DISPLAY_CONFIG, MATERIALS_CONFIG } from './configs';

const { React } = window;
const { useState } = React;

export const Selector = ({ modelOpts, modelOptActions, selectedMaterial }) => {
  const [attrMenu, setAttrMenu] = useState('');
  const [text, setText] = useState('');
  
  const OptionsList = () => {
    const optionsList = ATTR_ORDER.reduce((acc, attr) => {
      const attrDisplay = { ...ATTR_DISPLAY_CONFIG[attr] };
      attrDisplay.versions = modelOptActions.getAvailableVersions(attr);
      if (attrDisplay.versions.length < 2) return acc;

      const selectedVersion = modelOptActions.getSelectedVersion(attr) || {};
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
            console.log('here', attr)
            if (attr === attrMenu) setAttrMenu(''); 
            else setAttrMenu(attr);
          } }
        >
          <h2 className='attr-label'>Material</h2>
          <h1 className='sel-attr-title'>{ materialDisplay.text }</h1>
        </div>
      );
    }

    const CustomTextSelector = () => {
      const attr = 'text';

      return (
        <div
          className={ `option-tile ${attrMenu === 'text' ? 'active' : ''}` }
          key='material-selector'
          onClick={ () => {
            if (attr === attrMenu) setAttrMenu(''); 
            else setAttrMenu(attr);
          } }
        >
          <h2 className='attr-label'>Custom Text</h2>
          <h1
            className='sel-attr-title'
            style={ { textTransform: 'none' } }
          >
            { text ? `"${text}"` : '(No Custom Text)' }
          </h1>
        </div>
      )
    }

    return optionsList.concat(<MaterialSelector />).concat(<CustomTextSelector />);
  }

  const VersionOptionsList = () => {
    let content = null;
    let header = '';

    console.log(attrMenu);
    switch (attrMenu) {
      case 'material':
        header = 'Material';
        content = Object.keys(MATERIALS_CONFIG).reduce((acc, key) => {
          const material = MATERIALS_CONFIG[key];
          const optionTile = (
            <div
              className={ `option-tile ${key === selectedMaterial ? 'active' : ''}` }
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
        break;
      case 'text':
        header = 'Custom Text'
        content = (
          <div className='custom-message-container'>
            <input
              id='custom-message'
              type='text'
              name='properties[Custom Message]'
              maxLength='25'
              placeholder='25 character limit'
              onChange={ (e) => { setText(e.target.value); }}
              value={ text }
              autoFocus
            />
          </div>
        );
        break;
      default:
        const selectedVersion = modelOptActions.getSelectedVersion(attrMenu);
        const versions = modelOptActions.getAvailableVersions(attrMenu);
        if (versions.length === 0) break;

        header = ATTR_DISPLAY_CONFIG[attrMenu].label;
        content = versions.reduce((acc, el) => {
          const optionTile = (
            <div
              className={ `option-tile ${el.id === selectedVersion.id ? 'active' : ''}` }
              key={ el.id }
              onClick={ () => {
                modelOptActions.selectVersion(attrMenu, el.id);
              }}
            >
              <h1 className='sel-attr-title'>{ el.text }</h1>
            </div>
          );
          return acc.concat(optionTile);
        }, []);
        break;
    }

    return (
      <div className={ `verions-options-list ${!content ? 'closed' : ''}` }>
        <h2 className='header'>{ header }</h2>
        { content }
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

