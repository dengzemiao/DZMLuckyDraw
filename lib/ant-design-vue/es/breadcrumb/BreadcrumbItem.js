import PropTypes from '../_util/vue-types';
import { hasProp, getComponentFromProp } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

export default {
  name: 'ABreadcrumbItem',
  __ANT_BREADCRUMB_ITEM: true,
  props: {
    prefixCls: PropTypes.string,
    href: PropTypes.string,
    separator: PropTypes.any
  },
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
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
    if (hasProp(this, 'href')) {
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
        [getComponentFromProp(this, 'separator') || '/']
      )]);
    }
    return null;
  }
};