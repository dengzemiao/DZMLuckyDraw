import _extends from 'babel-runtime/helpers/extends';
import Vue from 'vue';
import PropTypes from '../_util/vue-types';
import { filterEmpty, getComponentFromProp } from '../_util/props-util';
import defaultRenderEmpty from './renderEmpty';
import Base from '../base';

function getWatch() {
  var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var watch = {};
  keys.forEach(function (k) {
    watch[k] = function () {
      this._proxyVm._data[k] = value;
    };
  });
  return watch;
}

var ConfigProvider = {
  name: 'AConfigProvider',
  props: {
    getPopupContainer: PropTypes.func,
    prefixCls: PropTypes.string,
    renderEmpty: PropTypes.any,
    csp: PropTypes.any,
    autoInsertSpaceInButton: PropTypes.bool
  },
  provide: function provide() {
    var _self = this;
    this._proxyVm = new Vue({
      data: function data() {
        return _extends({}, _self.$props, {
          getPrefixCls: _self.getPrefixCls,
          renderEmpty: _self.renderEmptyComponent
        });
      }
    });
    return {
      configProvider: this._proxyVm._data
    };
  },

  watch: _extends({}, getWatch(['prefixCls', 'csp', 'autoInsertSpaceInButton'])),
  methods: {
    renderEmptyComponent: function renderEmptyComponent(h, name) {
      var renderEmpty = getComponentFromProp(this, 'renderEmpty', {}, false) || defaultRenderEmpty;
      return renderEmpty(h, name);
    },
    getPrefixCls: function getPrefixCls(suffixCls, customizePrefixCls) {
      var _$props$prefixCls = this.$props.prefixCls,
          prefixCls = _$props$prefixCls === undefined ? 'ant' : _$props$prefixCls;

      if (customizePrefixCls) return customizePrefixCls;
      return suffixCls ? prefixCls + '-' + suffixCls : prefixCls;
    }
  },
  render: function render() {
    return this.$slots['default'] ? filterEmpty(this.$slots['default']) : null;
  }
};

export var ConfigConsumerProps = {
  getPrefixCls: function getPrefixCls(suffixCls, customizePrefixCls) {
    if (customizePrefixCls) return customizePrefixCls;
    return 'ant-' + suffixCls;
  },
  renderEmpty: defaultRenderEmpty
};

/* istanbul ignore next */
ConfigProvider.install = function (Vue) {
  Vue.use(Base);
  Vue.component(ConfigProvider.name, ConfigProvider);
};

export default ConfigProvider;