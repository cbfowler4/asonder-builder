const { Sketchfab } = window;
const iframe = document.getElementById('api-frame');
const DEFAULT_URLID = 'bf8ed63c2de24613a564f91c125c84dd';
const DEFAULT_PREFIX = 'hello-bryan ';

const CONFIG = {
  urlid: DEFAULT_URLID,
  prefix: DEFAULT_PREFIX
};
//  opt-<majorAttr>-<minorAttr>-<v#> 
const DEFAULT_MAJOR_ATTR = { minorAttr: 'body', value: 'solo' };

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
                // this.selectOption(0); //instantiate the visible model
                // instantiate with default values
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
          if (!node.name && !['Geometry', 'Group'].includes(node.type)) return;
          const [opt, size, name, version] = node.name.split('-');

          const newOption = {
            id: node.instanceID,
            name: node.name,
            selected: false
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
    selectOption: function (minorAttr, version) {
      console.log('options ===', this.modelOpts);
      console.log('selecting', minorAttr, version)
      // look up minor attr in display config
      // if major attr -> swap everything
      // if !major attr
        // look up minor attr and iterate over versions
        // if version === input version set selected to true, turn on option on api
        // else set selected to false, turn off option on api



      // for (var i = 0, l = options.length; i < l; i++) {
      //   if (i === index) {
      //       options[i].selected = true;
      //       this.api.show(options[i].id);
      //   } else {
      //       options[i].selected = false;
      //       this.api.hide(options[i].id);
      //   }
      // }
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
          this.select(minorAttr, version);
      });
    },
    select: function (minorAttr, version) {
        Configurator.selectOption(minorAttr, version);
        this.render();
    },
    render: function () { this.renderRadio(); },
    /**
     * Render options as multiple `<input type="radio">`
     */
    renderRadio: function () {
      const radioHTML = ATTR_ORDER.reduce((acc, minorAttr) => {
        const modelOptions = this.modelOpts[DEFAULT_MAJOR_ATTR.value][minorAttr];
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

