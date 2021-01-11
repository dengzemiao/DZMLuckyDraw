'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _configProvider = require('../config-provider');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ABreadcrumbItem',
  __ANT_BREADCRUMB_ITEM: true,
  props: {
    prefixCls: _vueTypes2['default'].string,
    href: _vueTypes2['default'].string,
    separator: _vueTypes2['default'].any
  },
  inject: {
    configProvider: { 'default': function _default() {
        return _configProvider.ConfigConsumerProps;
      } }
  },
  render: function render() {
    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        $slots = this.$slots;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);

    var children = $slots['default'];
    var link = void 0;
    if ((0, _propsUtil.hasProp)(this, 'href')) {
      link = h(
        'a',
        { 'class': prefixCls + '-link' },
        [children]
      );
    } else {
      link = h(
        'span',
        { 'class': prefixCls + '-link' },
        [children]
      );
    }
    if (children) {
      return h('span', [link, h(
        'span',
        { 'class': prefixCls + '-separator' },
        [(0, _propsUtil.getComponentFromProp)(this, 'separator') || '/']
      )]);
    }
    return null;
  }
};