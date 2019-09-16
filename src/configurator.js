const Sketchfab = window.Sketchfab;
const iframe = document.getElementById('api-frame');
const DEFAULT_URLID = 'bf8ed63c2de24613a564f91c125c84dd';
const DEFAULT_PREFIX = 'hello-bryan ';

const CONFIG = {
  urlid: DEFAULT_URLID,
  prefix: DEFAULT_PREFIX
};

const Configurator = {
    api: null,
    config: null,
    options: {},
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
            success: function onSuccess(api) {
                api.start();
                api.addEventListener('viewerready', function () {
                    this.api = api;
                    this.initializeOptions(function () {
                        console.log('Found the following options:', this.options);
                        // this.selectOption(0); //instantiate the visible model
                        UI.init(this.config, this.options);
                    }.bind(this));
                }.bind(this));
            }.bind(this),
            error: function onError() {
                console.log('Viewer error');
            }
        });
    },
    /**
     * Initialize options from scene
     */
    initializeOptions: function initializeOptions(callback) {
      this.api.getNodeMap(function (err, nodes) {
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
          if (!this.options[size]) this.options[size] = {};
          if (!this.options[size][name]) this.options[size][name] = {};

          this.options[size][name][version] = newOption;
        });
        callback();
      }.bind(this));
    },
    /**
     * Select option to show
     */
    selectOption: function selectOption(name, version) {
      var options = this.options;
      if (name === 'size') {

      }
      console.log('options ===', this.options);
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
    init: function init(config, options) {
        this.config = config;
        this.options = options;
        this.el = document.querySelector('.options');
        this.render();

        this.el.addEventListener('change', (e) => {
            e.preventDefault();
            const [name, version] = e.target.classList;
            this.select(name, version);
        });
    },
    select: function (name, version) {
        Configurator.selectOption(name, version);
        // this.render();
    },
    selectSize: function (size) {
      
    },
    render: function () {
      // this.renderBodySelector();
      // this.renderRadio();
    },
    /**
     * Render options as multiple `<input type="radio">`
     */
    renderRadio: function render() {
        // var html = this.options.map(function (option, i) {
        //     var checkedState = option.selected ? 'checked="checked"' : '';
        //     var className = option.name.replace(this.config.prefix, '');
        //     return [
        //         '<label class="options__option">',
        //         '<input type="radio" name="color" value="' + i + '" ' + checkedState + '>',
        //         '<span class="' + className + '">' + option.name + '</span>',
        //         '</label>'
        //     ].join('');
        // }.bind(this)).join('');
        // this.el.innerHTML = html;
    },
    renderBodySelector: function () {
      const bodySelector = document.createElement('div');
      const genSizeInput = (size) => `
        <label>${size}
          <input type='radio' value=${size} class='size ${size}'/>
        </label>
      `;

      const inputs = Object.keys(this.options).map(size => genSizeInput(size)).join('');

      bodySelector.innerHTML = `
        <fieldset>
          <h2>Size</h2>
          ${ inputs }
        </fieldset>
      `

      this.el.appendChild(bodySelector);
    },
    /**
     * Render option as `<select>`
     */
    // renderSelect: function () {
    //     var html = this.options.map(function (option, i) {
    //         var checkedState = option.selected ? 'selected="selected"' : '';
    //         return [
    //             '<option value="' + i + '" ' + checkedState + '>',
    //             option.name,
    //             '</option>',
    //         ].join('');
    //     }).join('');
    //     this.el.innerHTML = '<select name="color">' + html + '</select>';
    // }
}

Configurator.init(CONFIG, iframe);



// 1.) load the model
// 2.) parse nodes to generate options tree
// 3.) 


