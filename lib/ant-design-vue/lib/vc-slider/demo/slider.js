'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _vcTooltip = require('../../vc-tooltip');

var _vcTooltip2 = _interopRequireDefault(_vcTooltip);

require('../assets/index.less');

require('../../vc-tooltip/assets/bootstrap.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var createSliderWithTooltip = _index2['default'].createSliderWithTooltip;


function log(value) {
  console.log(value); //eslint-disable-line
}

var CustomizedSlider = {
  data: function data() {
    return {
      value: 50
    };
  },

  methods: {
    onSliderChange: function onSliderChange(value) {
      log(value);
      this.value = value;
    },
    onAfterChange: function onAfterChange(value) {
      log(value);
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(_index2['default'], {
      attrs: {
        value: this.value
      },
      on: {
        'change': this.onSliderChange,
        'afterChange': this.onAfterChange
      }
    });
  }
};

var DynamicBounds = {
  data: function data() {
    return {
      min: 0,
      max: 100
    };
  },

  methods: {
    onSliderChange: function onSliderChange(value) {
      log(value);
      this.value = value;
    },
    onAfterChange: function onAfterChange(value) {
      log(value);
    },
    onMinChange: function onMinChange(e) {
      this.min = +e.target.value || 0;
    },
    onMaxChange: function onMaxChange(e) {
      this.max = +e.target.value || 100;
    }
  },
  render: function render() {
    var h = arguments[0];

    return h('div', [h('label', ['Min: ']), h('input', {
      attrs: { type: 'number' },
      domProps: {
        'value': this.min
      },
      on: {
        'input': this.onMinChange
      }
    }), h('br'), h('label', ['Max: ']), h('input', {
      attrs: { type: 'number' },
      domProps: {
        'value': this.max
      },
      on: {
        'input': this.onMaxChange
      }
    }), h('br'), h('br'), h(_index2['default'], {
      attrs: { defaultValue: 50, min: this.min, max: this.max },
      on: {
        'change': this.onSliderChange
      }
    })]);
  }
};

var SliderWithTooltip = createSliderWithTooltip(_index2['default']);

exports['default'] = {
  render: function render() {
    var h = arguments[0];

    var style = { width: '400px', margin: '50px' };
    var pStyle = { margin: '20px 0' };

    return h('div', [h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Basic Slider']
      ), h(_index2['default'], {
        on: {
          'change': log
        }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Basic Slider\uFF0C`step=20`']
      ), h(_index2['default'], {
        attrs: { step: 20, defaultValue: 50 },
        on: {
          'beforeChange': log
        }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Basic Slider\uFF0C`step=20, dots`']
      ), h(_index2['default'], {
        attrs: { dots: true, step: 20, defaultValue: 100 },
        on: {
          'afterChange': log
        }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Basic Slider\uFF0C`step=20, dots, dotStyle=', "{borderColor: 'orange'}", ', activeDotStyle=', "{borderColor: 'yellow'}", '`']
      ), h(_index2['default'], {
        attrs: {
          dots: true,
          step: 20,
          defaultValue: 100,

          dotStyle: { borderColor: 'orange' },
          activeDotStyle: { borderColor: 'yellow' }
        },
        on: {
          'afterChange': log
        }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Slider with tooltip, with custom `tipFormatter`']
      ), h(SliderWithTooltip, {
        attrs: {
          tipFormatter: function tipFormatter(v) {
            return v + ' %';
          },
          tipProps: { overlayClassName: 'foo' }
        },
        on: {
          'change': log
        }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Slider with custom handle and track style.', h('strong', ['(old api, will be deprecated)'])]
      ), h(_index2['default'], {
        attrs: {
          defaultValue: 30,
          maximumTrackStyle: { backgroundColor: 'red', height: '10px' },
          minimumTrackStyle: { backgroundColor: 'blue', height: '10px' },
          handleStyle: {
            borderColor: 'blue',
            height: '28px',
            width: '28px',
            marginLeft: '-14px',
            marginTop: '-9px',
            backgroundColor: 'black'
          }
        }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Slider with custom handle and track style.', h('strong', ['(The recommended new api)'])]
      ), h(_index2['default'], {
        attrs: {
          defaultValue: 30,
          trackStyle: { backgroundColor: 'blue', height: '10px' },
          handleStyle: {
            borderColor: 'blue',
            height: '28px',
            width: '28px',
            marginLeft: '-14px',
            marginTop: '-9px',
            backgroundColor: 'black'
          },
          railStyle: { backgroundColor: 'red', height: '10px' }
        }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Basic Slider, disabled']
      ), h(_index2['default'], {
        on: {
          'change': log
        },
        attrs: { disabled: true }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Controlled Slider']
      ), h(_index2['default'], {
        attrs: { value: 50 }
      })]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Customized Slider']
      ), h(CustomizedSlider)]
    ), h(
      'div',
      { style: style },
      [h(
        'p',
        { style: pStyle },
        ['Slider with dynamic `min` `max`']
      ), h(DynamicBounds)]
    )]);
  }
};