import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import classNames from 'classnames';
import Input from './Input';
import Icon from '../icon';
import inputProps from './inputProps';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';

var ActionMap = {
  click: 'click',
  hover: 'mouseover'
};

export default {
  name: 'AInputPassword',
  model: {
    prop: 'value',
    event: 'change.value'
  },
  props: _extends({}, inputProps, {
    prefixCls: PropTypes.string.def('ant-input-password'),
    inputPrefixCls: PropTypes.string.def('ant-input'),
    action: PropTypes.string.def('click'),
    visibilityToggle: PropTypes.bool.def(true)
  }),
  data: function data() {
    return {
      visible: false
    };
  },

  mixins: [BaseMixin],
  methods: {
    onChange: function onChange() {
      this.setState({
        visible: !this.visible
      });
    },
    getIcon: function getIcon() {
      var _on;

      var h = this.$createElement;
      var _$props = this.$props,
          prefixCls = _$props.prefixCls,
          action = _$props.action;

      var iconTrigger = ActionMap[action] || '';
      var iconProps = {
        props: {
          type: this.visible ? 'eye' : 'eye-invisible'
        },
        on: (_on = {}, _defineProperty(_on, iconTrigger, this.onChange), _defineProperty(_on, 'mousedown', function mousedown(e) {
          // Prevent focused state lost
          // https://github.com/ant-design/ant-design/issues/15173
          e.preventDefault();
        }), _on),
        'class': prefixCls + '-icon',
        key: 'passwordIcon'
      };
      return h(Icon, iconProps);
    }
  },
  render: function render() {
    var h = arguments[0];

    var _$props2 = this.$props,
        prefixCls = _$props2.prefixCls,
        inputPrefixCls = _$props2.inputPrefixCls,
        size = _$props2.size,
        suffix = _$props2.suffix,
        visibilityToggle = _$props2.visibilityToggle,
        restProps = _objectWithoutProperties(_$props2, ['prefixCls', 'inputPrefixCls', 'size', 'suffix', 'visibilityToggle']);

    var suffixIcon = visibilityToggle && this.getIcon();
    var inputClassName = classNames(prefixCls, _defineProperty({}, prefixCls + '-' + size, !!size));
    return h(Input, _mergeJSXProps([restProps, {
      attrs: {
        type: this.visible ? 'text' : 'password',
        size: size,

        prefixCls: inputPrefixCls,
        suffix: suffixIcon
      },
      'class': inputClassName }]));
  }
};