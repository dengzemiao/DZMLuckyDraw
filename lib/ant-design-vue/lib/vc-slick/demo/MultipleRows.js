'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../assets/index.less');

var _slider = require('../src/slider');

var _slider2 = _interopRequireDefault(_slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  render: function render() {
    var h = arguments[0];

    var settings = {
      props: {
        centerMode: true,
        infinite: true,
        centerPadding: '60px',
        slidesToShow: 3,
        speed: 500,
        rows: 2,
        slidesPerRow: 2
      },
      'class': 'center'
    };
    return h('div', [h('h2', ['Multiple Rows']), h(
      _slider2['default'],
      settings,
      [h(
        'div',
        { style: { width: '400px' } },
        [h('h3', ['1'])]
      ), h('div', [h('h3', ['2'])]), h('div', [h('h3', ['3'])]), h('div', [h('h3', ['4'])]), h('div', [h('h3', ['5'])]), h('div', [h('h3', ['6'])]), h('div', [h('h3', ['7'])]), h('div', [h('h3', ['8'])]), h('div', [h('h3', ['9'])]), h('div', [h('h3', ['10'])]), h('div', [h('h3', ['11'])]), h('div', [h('h3', ['12'])]), h('div', [h('h3', ['13'])]), h('div', [h('h3', ['14'])]), h('div', [h('h3', ['15'])]), h('div', [h('h3', ['16'])])]
    )]);
  }
};