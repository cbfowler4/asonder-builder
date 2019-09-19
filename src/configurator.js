const { Sketchfab } = window;
const iframe = document.getElementById('api-frame');
const DEFAULT_URLID = 'bf8ed63c2de24613a564f91c125c84dd';
const DEFAULT_PREFIX = 'hello-bryan ';

const CONFIG = {
  urlid: DEFAULT_URLID,
  prefix: DEFAULT_PREFIX
};
//  opt-<majorAttr>-<minorAttr>-<v#> 

const ATTR_DISPLAY_CONFIG = {
  major: {
    label: 'Size',
    versions: [
      { id: 'solo', text: 'Solo' },
      { id: 'com', text: 'Communal' },
    ]
  },
  body: {
    label: 'Stem',
    versions: [
      { id: 'v0', text: 'N/A' },
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
  'major',
  'body',
  'Mouthpiece'
];


const Configurator = {
    api: null,
    config: null,
    modelOpts: {},
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
      this.majorAttr = ATTR_DISPLAY_CONFIG.major.versions[0].id;

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
        callback();
      });
    },
    /**
     * Select option to show
     */
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
      this.render();

      this.el.addEventListener('change', (e) => {
          e.preventDefault();
          const [attr, versionId] = e.target.value.split('-');
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
        availableVersions = this.modelOpts[Configurator.majorAttr][attr];
      }
      return ATTR_DISPLAY_CONFIG[attr].versions
        .filter(version => (availableVersions[version.id]));
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

      this.el.innerHTML = radioHTML;
    },
    generateRadio: function ({ attrDisplay, attr, selectedVersion }) {
      const radioButtons = attrDisplay.versions.reduce((btnAcc, el) => {
        const btn = `
          <label class="options__option">
            <input type="radio" name=${attr} value="${attr}-${el.id}" ${el.id === selectedVersion ? 'checked' : ''}>
            <span>${el.text}</span>
          </label>
        `
        return btnAcc + btn;
      }, '');

      return `
        <div class="option-set">
          <h2>${attrDisplay.label}</h2>
          <fieldset>
            ${radioButtons}
          </fieldset>
        </div>
      `;
    },
}

Configurator.init(CONFIG, iframe);

