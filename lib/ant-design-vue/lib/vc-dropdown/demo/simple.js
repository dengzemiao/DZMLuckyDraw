'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../../vc-menu/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../src/index.js');

var _index4 = _interopRequireDefault(_index3);

require('../assets/index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  data: function data() {
    return {};
  },

  methods: {
    onSelect: function onSelect(_ref) {
      var key = _ref.key;

      console.log(key + ' selected');
    },
    onVisibleChange: function onVisibleChange(visible) {
      console.log(visible);
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(
      'div',
      { style: 'margin: 100px' },
      [h('div', { style: 'height: 100px' }), h('div', [h(
        _index4['default'],
        {
          attrs: { trigger: ['click'], animation: 'slide-up' },
          on: {
            'visibleChange': this.onVisibleChange
          }
        },
        [h(
          _index2['default'],
          { slot: 'overlay', on: {
              'select': this.onSelect
            }
          },
          [h(
            _index.Item,
            {
              attrs: { disabled: true }
            },
            ['disabled']
          ), h(
            _index.Item,
            { key: '1' },
            ['one']
          ), h(_index.Divider), h(
            _index.Item,
            { key: '2' },
            ['two']
          )]
        ), h(
          'button',
          { style: 'width: 100px' },
          ['open']
        )]
      )])]
    );
  }
};