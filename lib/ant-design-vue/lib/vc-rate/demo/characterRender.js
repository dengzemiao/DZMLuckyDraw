'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../../vc-tooltip/index');

var _index4 = _interopRequireDefault(_index3);

require('../../vc-tooltip/assets/bootstrap_white.less');

require('../assets/index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  data: function data() {
    return {};
  },
  render: function render() {
    var h = arguments[0];

    return h(
      'div',
      { style: 'margin: 100px' },
      [h(_index2['default'], {
        attrs: {
          defaultValue: 3,
          characterRender: function characterRender(node, props) {
            // console.dir(node);
            // console.dir(props.index);
            return h(
              _index4['default'],
              {
                attrs: { placement: 'top', overlay: props.index }
              },
              [node]
            );
          }
        }
      })]
    );
  }
};