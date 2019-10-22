const { Sketchfab } = window;
const iframe = document.getElementById('api-frame');
const DEFAULT_URLID = '1fe3d58cf57a44c9b6fd2258ed038ed7';
const DEFAULT_PREFIX = 'merchant-account-rev2';


//  opt-<majorAttr>-<minorAttr>-<v#> 

const ATTR_DISPLAY_CONFIG = {
  major: {
    label: 'Size',
    versions: [
      { id: 'solo', text: 'Solo', variant: '14621554311223', price: 99 },
      { id: 'comm', text: 'Communal', variant: '14621554442295', price: 100 },
    ]
  },
  stem: {
    label: 'Stem',
    versions: [
      { id: 'v0', text: 'N/A' },
    ],
  },
  mouth: {
    label: 'Mouth',
    versions: [
      { id: 'v0', text: 'Open Tube' },
      { id: 'v1', text: 'Mouthpiece' },
    ]
  },
  bowl: {
    label: 'Bowl',
    versions: [
      { id: 'v0', text: 'Round' },
      { id: 'v1', text: 'Pyramid' },
      { id: 'v2', text: 'Spiral' },
    ]
  },
  stand: {
    label: 'Stand',
    versions: [
      { id: 'v0', text: 'Round' },
      { id: 'v1', text: 'Square' },
      { id: 'v2', text: 'Octagonal' },
    ]
  },
};

const MATERIALS_CONFIG = {
  black: {
    label: 'Black Matte',
    color: 'black',
    channels: [
      {
        propertyName: 'AlbedoPBR',
        properties: [
          { name: 'color', value: [0.012, 0.012, 0.012] },
          { name: 'factor', value: 0.392 },
        ],
      },
    ]
  },
  bronze: {
    label: 'Bronze-Silver',
    color: 'yellow',
    channels: [
      {
        propertyName: 'AlbedoPBR',
        properties: [
          { name: 'color', value: [200, 200, 200] },
          { name: 'factor', value: 0.392 },
        ],
      },
    ],
  }
}

const ATTR_ORDER = [
  'major',
  'stem',
  'mouth',
  'bowl',
  'stand',
];

const getConfig = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlid = urlParams.get('id') || DEFAULT_URLID;
  const prefix = urlParams.get('prefix') || DEFAULT_PREFIX;
  return { urlid, prefix };
}

const Configurator = {
    api: null,
    config: null,
    modelOpts: {},
    /**
     * Initialize viewer
     */
    init: function (iframe) {
      this.config = getConfig();
      var client = new Sketchfab(iframe);
      client.init(this.config.urlid, {
        ui_infos: 0,
        ui_controls: 0,
        graph_optimizer: 0,
        autostart: 1,
        autospin: 0.5,
        ui_stop: 0,
        ui_general_controls: 0,
        success: (api) => {
          api.start();
          api.addEventListener('viewerready', () => {
            this.api = api;
            this.initializeOptions(() => {
                this.updateModel();
                UI.init(this.config, this.modelOpts);
            });
          });
        }, 
        error: () => { console.log('Viewer error') }
      });
    },
    /**
     * Initialize options from scene
     */
    initializeOptions: function (callback) {
      this.majorAttr = ATTR_DISPLAY_CONFIG.major.versions[0].id;
      this.selectedMaterial = Object.keys(MATERIALS_CONFIG)[0];

      this.api.getNodeMap((err, nodes) => {
        if (err) {
          console.error(err);
          return;
        }

        Object.values(nodes).forEach((node) => {
          if (!node.name && 'Geometry' !== node.type) return;
          const [opt, size, name, versionFull] = node.name.split('-');

          if (!versionFull) return;
          const version = versionFull.split('_')[0];

          const dispAttributes = ATTR_DISPLAY_CONFIG[name];
          if (!ATTR_DISPLAY_CONFIG[name]) return;
          const defaultVersion = dispAttributes.versions[0];
          const selected = defaultVersion.id === version && this.majorAttr === size;

          const newOption = {
            id: node.instanceID,
            name: node.name,
            selected,
          }

          if (!size || !name || !version) return;
          if (!this.modelOpts[size]) this.modelOpts[size] = {};
          if (!this.modelOpts[size][name]) this.modelOpts[size][name] = {};

          this.modelOpts[size][name][version] = newOption;
        });

        this.api.getMaterialList(function (err, materials) {
          this.material = materials[0];
          this.selectMaterial(this.selectedMaterial);
          callback();
        }.bind(this));
      });
    },
    selectMaterial: function (id) {
      const attrDisplay = MATERIALS_CONFIG[id];
      if (!attrDisplay) { console.log(`WARNING: No material with id ${id}`); return; }
      if (!this.material) { console.log('WARNING: No material to update'); return; }

      attrDisplay.channels.forEach(({ propertyName, properties }) => {
        properties.forEach(({ name, value }) => {
          this.material.channels[propertyName][name] = value;
        });
      });

      this.selectedMaterial = id;
      this.api.setMaterial(this.material);
    },
    selectVersion: function ({ versionId, attr, majorAttr }) {
      const safeMajorAttr = majorAttr || this.majorAttr;
      if (!this.modelOpts[safeMajorAttr][attr]) {
        console.log(`WARNING: Minor attribute ${attr} does not exist`);
        return;
      }
      if (!this.modelOpts[safeMajorAttr][attr][versionId]) {
        console.log(`WARNING: versionId ${versionId} does not exist on minor attributue ${attr} from major attribute version ${safeMajorAttr}
        Selecting default version`)
        const defaultVersion = ATTR_DISPLAY_CONFIG[attr].versions[0];
        if (!defaultVersion) throw new Error('No default version to select');
        Object.keys(this.modelOpts[safeMajorAttr][attr]).forEach((v) => {
          this.modelOpts[safeMajorAttr][attr][v] = v === defaultVersion.id;
        })
      } else {
        Object.keys(this.modelOpts[safeMajorAttr][attr]).forEach((v) => {
          this.modelOpts[safeMajorAttr][attr][v].selected = v === versionId; 
        })
      }
    },
    updateModel: function () {
      Object.values(this.modelOpts).forEach((minorAttrs) => {
        Object.values(minorAttrs).forEach((versions) => {
          Object.values(versions).forEach((version) => {
            if (version.selected) {
              this.api.show(version.id);
            } else {
              this.api.hide(version.id);
            }
          })
        })
      })
    },
    deselectInactiveMajorAttrs: function () {
      Object.keys(this.modelOpts).forEach((majorAttr) => {
        if (this.majorAttr === majorAttr) return;
        const minorAttrs = this.modelOpts[majorAttr];
        Object.values(minorAttrs).forEach((versions) => {
          Object.values(versions).forEach((version) => version.selected = false)
        })
      })
    },
    selectOption: function ({ attr, newVersionId }) {
      if (attr === 'major') {
        const nextMajorAttr = newVersionId;
        const prevMinorAttrs = this.modelOpts[this.majorAttr];
        const prevSelVersions = Object.keys(prevMinorAttrs).reduce((acc, minorAttr) => {
          const version = Object.keys(prevMinorAttrs[minorAttr]).find((v) => (
            prevMinorAttrs[minorAttr][v].selected
            ));
          return { ...acc, [minorAttr]: version }
        }, {});

        const nextMinorAttrs = this.modelOpts[newVersionId];

        Object.keys(nextMinorAttrs).forEach((nextMinorAttr) => {
          const newVersionId = prevSelVersions[nextMinorAttr];
          this.selectVersion({
            versionId: newVersionId,
            attr: nextMinorAttr,
            majorAttr: nextMajorAttr,
          });
        });

        this.majorAttr = nextMajorAttr;
        this.deselectInactiveMajorAttrs();
      } else if (attr === 'material') {
        this.selectMaterial(newVersionId);
      } else {
        this.selectVersion({ versionId: newVersionId, attr })
      }
      this.updateModel();
    }
}

var UI = {
    config: null,
    options: null,
    init: function (config, options) {
      this.config = config;
      this.modelOpts = options;
      this.el = document.querySelector('.options');
      this.priceEl = document.querySelector('.price');

      this.render();

      this.el.addEventListener('change', (e) => {
          e.preventDefault();
          const [attr, versionId] = e.target.id.split('-');
          this.select({ attr, versionId });
      });
    },
    select: function ({ attr, versionId }) {
        Configurator.selectOption({ attr, newVersionId: versionId });
        this.render();
    },
    getSelectedVersion: function (attr) {
      if (attr === 'major') return Configurator.majorAttr;

      const versions = this.modelOpts[Configurator.majorAttr][attr];
      return Object.keys(versions).find((versionId) => versions[versionId].selected);
    },
    getAvailableVersions: function (attr) {
      let availableVersions = {};
      if (attr === 'major') {
        availableVersions = Object.keys(this.modelOpts)
          .reduce((acc, key) => ({ ...acc, [key]: true }), {});
      } else {
        availableVersions = (this.modelOpts[Configurator.majorAttr] || {})[attr] || [];
      }
      if (!ATTR_DISPLAY_CONFIG[attr]) return [];
      return ATTR_DISPLAY_CONFIG[attr].versions
        .filter(version => (availableVersions[version.id]));
    },
    getSelectedAttrDisplay: function (attr) {
      const versions = this.getAvailableVersions(attr);
      const selectedVersion = this.getSelectedVersion(attr);

      return versions.find((v) => v.id === selectedVersion);
    },
    render: function () {
      const radioHTML = ATTR_ORDER.reduce((acc, attr) => {
        const attrDisplay = { ...ATTR_DISPLAY_CONFIG[attr] };
        attrDisplay.versions = this.getAvailableVersions(attr);

        if (attrDisplay.versions.length < 2) return acc;

        const selectedVersion = this.getSelectedVersion(attr);
        const fieldSet = this.generateRadio({ attrDisplay, attr, selectedVersion });
        return acc + fieldSet;
      }, '');

      const selectHTML = this.generateSelect();
      const materialHTML = this.generateColorRadio();

      this.el.innerHTML = radioHTML.concat(materialHTML).concat(selectHTML);
      this.renderPrice();
    },
    generateRadio: function ({ attrDisplay, attr, selectedVersion }) {
      const radioButtons = attrDisplay.versions.reduce((btnAcc, el) => {
        const checked = el.id === selectedVersion;
        const btn = `
          <label class="options__option ${checked ? 'checked' : ''}">
            <input
              id="${attr}-${el.id}"
              type="radio"
              name="properties[${attrDisplay.label}]"
              value="${el.text}"
              ${checked ? 'checked' : ''}
            >
            <span>${el.text}</span>
          </label>
        `
        return btnAcc + btn;
      }, '');

      return `
        <div class="option-set radio">
          <h2>${attrDisplay.label}</h2>
          <div class="field-set">
            ${radioButtons}
          </div>
        </div>
      `;
    },
    generateSelect: function () {
      const majorAttrDisp = ATTR_DISPLAY_CONFIG.major;

      const options = majorAttrDisp.versions.reduce((acc, el) => {
        const selected = el.id === Configurator.majorAttr;
        const element = `
          <option 
            ${selected ? 'selected="selected"' : ''}
            value="${el.variant}"
          />
        `
        return acc + element;
      }, '');

      return `
        <select name="id" id="ProductSelect" class="product-single__variants no-js">
          ${options}
        </select>
      `;
    },
    generateColorRadio: function () {
      const radioButtons = Object.keys(MATERIALS_CONFIG).map(key => {

        const checked = key === Configurator.selectedMaterial;
        const attrDisplay = MATERIALS_CONFIG[key];
      
        const btn = `
          <label class="options__option ${checked ? 'checked' : ''}">
            <input
              id="material-${key}"
              type="radio"
              name="properties[Material]"
              value="${key}"
              ${checked ? 'checked' : ''}
            >
            <span>${attrDisplay.label}</span>
          </label>
        `
        return btn;
      }, '').join('');

      return `
        <div class="option-set radio">
          <h2>Material</h2>
          <div class="field-set">
            ${radioButtons}
          </div>
        </div>
      `;
    },
    renderPrice: function () {
      const attrDisplay = this.getSelectedAttrDisplay('major');
      if (!this.priceEl || !attrDisplay || !attrDisplay.price) return;

      const priceElement = `
      <span id="ProductPrice" class="product-single__price">
        $${attrDisplay.price.toFixed(2)}
      </span>
      `

      this.priceEl.innerHTML = priceElement;
    },
}

Configurator.init(iframe);

