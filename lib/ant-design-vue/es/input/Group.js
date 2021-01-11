import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import { filterEmpty } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

export default {
  name: 'AInputGroup',
  props: {
    prefixCls: PropTypes.string,
    size: {
      validator: function validator(value) {
        return ['small', 'large', 'default'].includes(value);
      }
    },
    compact: Boolean
  },
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  computed: {
    classes: function classes() {
      var _ref;

      var customizePrefixCls = this.prefixCls,
          size = this.size,
          _compact = this.compact,
          compact = _compact === undefined ? false : _compact;

      var getPrefixCls = this.configProvider.getPrefixCls;
      var prefixCls = getPrefixCls('input-group', customizePrefixCls);

      return _ref = {}, _defineProperty(_ref, '' + prefixCls, true), _defineProperty(_ref, prefixCls + '-lg', size === 'large'), _defineProperty(_ref, prefixCls + '-sm', size === 'small'), _defineProperty(_ref, prefixCls + '-compact', compact), _ref;
    }
  },
  methods: {},
  render: function render() {
    var h = arguments[0];
    var $listeners = this.$listeners;

    return h(
      'span',
      _mergeJSXProps([{ 'class': this.classes }, { on: $listeners }]),
      [filterEmpty(this.$slots['default'])]
    );
  }
};