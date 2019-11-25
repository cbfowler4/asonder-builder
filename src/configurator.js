const { Sketchfab } = window;
const { getConfig } = require('./helpers');

const {
  ATTR_DISPLAY_CONFIG,
  MATERIALS_CONFIG,
} = require('./configs');

export const Configurator = {
  api: null,
  config: null,

  init: function ({ iframe, modelOpts, setModelOpts, selectedMaterial, setSelectedMaterial }) {
    this.config = getConfig();
    this.modelOpts = modelOpts;
    this.selectedMaterial = selectedMaterial;
    this.setModelOpts = setModelOpts;
    this.setSelectedMaterial = setSelectedMaterial;

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
          this.initializeOptions(() => { this.updateModel(); });
        });
      }, 
      error: () => { console.log('Viewer error') }
    });
  },
  /**
   * Initialize options from scene
   */
  initializeOptions: function (callback) {
    const newModelOpts = {};
    this.majorAttr = ATTR_DISPLAY_CONFIG.major.versions[0].id;

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
        if (version.includes(':')) {
          this.api.show(node.instanceID);
          return;
        }
        const defaultVersion = dispAttributes.versions[0];
        const selected = defaultVersion.id === version && this.majorAttr === size;
        
        
        const newOption = {
          id: node.instanceID,
          name: node.name,
          selected,
        }

        if (!size || !name || !version) return;
        if (!newModelOpts[size]) newModelOpts[size] = {};
        if (!newModelOpts[size][name]) newModelOpts[size][name] = {};

        newModelOpts[size][name][version] = newOption;
      });

      this.setModelOpts(newModelOpts);
      console.log('here');

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

    attrDisplay.channels.forEach(({ propertyName, properties }) => {
      properties.forEach(({ name, value }) => {
        this.material.channels[propertyName][name] = value;
      });
    });

    console.log(this.material);
    this.setSelectedMaterial(id);
    this.api.setMaterial(this.material);
  },
  selectVersion: function ({ versionId, attr, majorAttr }) {
    const newModelOpts = { ...this.modelOpts };
    console.log(attr, versionId, this.majorAttr, newModelOpts);
    const safeMajorAttr = majorAttr || this.majorAttr;
    if (!newModelOpts[safeMajorAttr][attr]) {
      console.log(`WARNING: Minor attribute ${attr} does not exist`);
      return;
    }
    if (!newModelOpts[safeMajorAttr][attr][versionId]) {
      console.log(`WARNING: versionId ${versionId} does not exist on minor attributue ${attr} from major attribute version ${safeMajorAttr}
      Selecting default version`)
      const defaultVersion = ATTR_DISPLAY_CONFIG[attr].versions[0];
      if (!defaultVersion) throw new Error('No default version to select');
      Object.keys(newModelOpts[safeMajorAttr][attr]).forEach((v) => {
        newModelOpts[safeMajorAttr][attr][v] = v === defaultVersion.id;
      })
    } else {
      Object.keys(newModelOpts[safeMajorAttr][attr]).forEach((v) => {
        newModelOpts[safeMajorAttr][attr][v].selected = v === versionId;
      })
    }
    this.setModelOpts(newModelOpts);
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
    const newModelOpts = { ...this.modelOpts };
    Object.keys(newModelOpts).forEach((majorAttr) => {
      if (this.majorAttr === majorAttr) return;
      const minorAttrs = newModelOpts[majorAttr];
      Object.values(minorAttrs).forEach((versions) => {
        Object.values(versions).forEach((version) => version.selected = false)
      })
    })
    this.setModelOpts(newModelOpts);
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

