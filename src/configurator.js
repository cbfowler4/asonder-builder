const { Sketchfab } = window;
const iframe = document.getElementById('api-frame');
const DEFAULT_URLID = 'bf8ed63c2de24613a564f91c125c84dd';
const DEFAULT_PREFIX = 'hello-bryan ';

const CONFIG = {
  urlid: DEFAULT_URLID,
  prefix: DEFAULT_PREFIX
};
//  opt-<majorAttr>-<minorAttr>-<v#> 
const DEFAULT_MAJOR_ATTR = { minorAttr: 'body', version: 'solo' };

const ATTR_DISPLAY_CONFIG = {
  body: {
    label: 'Size',
    versions: [
      { id: 'v0', text: 'Solo' },
      { id: 'v1', text: 'Communal' },
    ],
  },
  Mouthpiece: {
    label: 'Mouth',
    versions: [
      { id: 'v0', text: 'Open Tube' },
      { id: 'v1', text: 'Mouthpiece' },
    ]
  }
};

const ATTR_ORDER = [
  'body',
  'Mouthpiece'
];


const Configurator = {
    api: null,
    config: null,
    modelOpts: {},
    majorAttr: DEFAULT_MAJOR_ATTR,
    /**
     * Initialize viewer
     */
    init: function (config, iframe) {
      this.config = config;
      var client = new Sketchfab(iframe);
      client.init(config.urlid, {
        ui_infos: 0,
        ui_controls: 0,
        graph_optimizer: 0,
        success: (api) => {
          api.start();
          api.addEventListener('viewerready', () => {
            this.api = api;
            this.initializeOptions(() => {
                console.log('Found the following options:', this.modelOpts);
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
      this.api.getNodeMap((err, nodes) => {
        console.log('get node map results', nodes)
        if (err) {
          console.error(err);
          return;
        }

        Object.values(nodes).forEach((node) => {
          if (!node.name && 'Geometry' !== node.type) return;
          const [opt, size, name, versionFull] = node.name.split('-');

          if (!versionFull) return;
          const version = versionFull.split('_')[0];

          const defaultVersion = ATTR_DISPLAY_CONFIG[name].versions[0];
          const selected = defaultVersion.id === version && this.majorAttr.version === size;

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
        callback();
      });
    },
    /**
     * Select option to show
     */
    selectVersion: function ({ version, minorAttr, majorAttr }) {
      const majorAttrVersion = majorAttr || this.majorAttr.version;
      if (!this.modelOpts[majorAttrVersion]) throw new Error(`Major attribute version ${majorAttrVersion} does not exist`);
      if (!this.modelOpts[majorAttrVersion][minorAttr]) {
        console.log(`WARNING: Minor attribute version ${minorAttr} does not exist`);
      }
      if (!this.modelOpts[majorAttrVersion][minorAttr][version]) {
        console.log(`WARNING: version ${version} does not exist on minor attributue ${minorAttr} from major attribute version ${majorAttrVersion}`)
        const defaultVersion = ATTR_DISPLAY_CONFIG[minorAttr].options[0];
        if (!defaultVersion) throw new Error('No default version to select');
        console.log('Selecting ', majorAttrVersion, minorAttr, defaultVersion.id)
        Object.keys(this.modelOpts[majorAttrVersion][minorAttr]).forEach((v) => {
          this.modelOpts[majorAttrVersion][minorAttr][v] = v === defaultVersion.id;
        })
      } else {
        console.log('Selecting ', majorAttrVersion, minorAttr, version)
        Object.keys(this.modelOpts[majorAttrVersion][minorAttr]).forEach((v) => {
          this.modelOpts[majorAttrVersion][minorAttr][v].selected = v === version; 
        })
      }

    },
    clearSelections: function (majorAttr) {

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
    selectOption: function ({ newMinorAttr, newVersion }) {
      const isMajorAttr = this.majorAttr.minorAttr === newMinorAttr;
      if (isMajorAttr) {
        const currentMinorAttrs = this.modelOpts[this.majorAttr.version];
        const selectedMinorAttrs = Object.keys(currentMinorAttrs).reduce((acc, minorAttr) => {
          const version = Object.keys(currentMinorAttrs[minorAttr]).find((v) => (
            currentMinorAttrs[minorAttr][v].selected
          ));
          return { ...acc, [minorAttr]: version }
        }, {});

        const newMinorAttrs = this.modelOpts[newMinorAttr];
        Object.keys(newMinorAttrs).forEach((minorAttr) => {
          const selectedVersion = selectedMinorAttrs[minorAttr];
          if (selectedVersion && newMinorAttrs[minorAttr][selectedVersion]) {
            this.selectVersion({
              version: selectedVersion,
              minorAttr: this.majorAttr.minorAttr,
              majorAttr: newVersion
            });
          } 
        })
        // Object.keys(selectedOptions).forEach((minorAttrName) => {
        //   this.modelOpts[newVersion][minorAttrName]
        // })
      } else {
        this.selectVersion({ version: newVersion, minorAttr: newMinorAttr })
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
      this.render();

      this.el.addEventListener('change', (e) => {
          e.preventDefault();
          const [minorAttr, version] = e.target.value.split('-');
          this.select({ minorAttr, version });
      });
    },
    select: function ({ minorAttr, version }) {
        Configurator.selectOption({ newMinorAttr: minorAttr, newVersion: version });
        this.render();
    },
    render: function () { this.renderRadio(); },
    renderRadio: function () {
      const radioHTML = ATTR_ORDER.reduce((acc, minorAttr) => {
        const modelOptions = this.modelOpts[Configurator.majorAttr.version][minorAttr];
        const minorAttrDisplay = ATTR_DISPLAY_CONFIG[minorAttr];
        if (!modelOptions || !minorAttrDisplay) return acc;

        const radioButtons = minorAttrDisplay.versions.reduce((btnAcc, el) => {
          const option = modelOptions[el.id];
          if (!option) return btnAcc;

          const btn = `
            <label class="options__option">
              <input type="radio" name=${minorAttr} value="${minorAttr}-${el.id}" ${option.selected ? 'checked' : ''}>
              <span>${el.text}</span>
            </label>
          `
          return btnAcc + btn;
        }, '');

        const fieldSet = `
          <div class="option-set">
            <h2>${minorAttrDisplay.label}</h2>
            <fieldset>
              ${radioButtons}
            </fieldset>
          </div>
        `

        return acc + fieldSet;
      }, '');

      this.el.innerHTML = radioHTML;
    },
}

Configurator.init(CONFIG, iframe);

