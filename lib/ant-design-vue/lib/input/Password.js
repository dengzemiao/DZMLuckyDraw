'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Input = require('./Input');

var _Input2 = _interopRequireDefault(_Input);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _inputProps = require('./inputProps');

var _inputProps2 = _interopRequireDefault(_inputProps);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ActionMap = {
  click: 'click',
  hover: 'mouseover'
};

exports['default'] = {
  name: 'AInputPassword',
  model: {
    prop: 'value',
    event: 'change.value'
  },
  props: (0, _extends3['default'])({}, _inputProps2['default'], {
    prefixCls: _vueTypes2['default'].string.def('ant-input-password'),
    inputPrefixCls: _vueTypes2['default'].string.def('ant-input'),
    action: _vueTypes2['default'].string.def('click'),
    visibilityToggle: _vueTypes2['default'].bool.def(true)
  }),
  data: function data() {
    return {
      visible: false
    };
  },

  mixins: [_BaseMixin2['default']],
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
        on: (_on = {}, (0, _defineProperty3['default'])(_on, iconTrigger, this.onChange), (0, _defineProperty3['default'])(_on, 'mousedown', function mousedown(e) {
          // Prevent focused state lost
          // https://github.com/ant-design/ant-design/issues/15173
          e.preventDefault();
        }), _on),
        'class': prefixCls + '-icon',
        key: 'passwordIcon'
      };
      return h(_icon2['default'], iconProps);
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
        restProps = (0, _objectWithoutProperties3['default'])(_$props2, ['prefixCls', 'inputPrefixCls', 'size', 'suffix', 'visibilityToggle']);

    var suffixIcon = visibilityToggle && this.getIcon();
    var inputClassName = (0, _classnames2['default'])(prefixCls, (0, _defineProperty3['default'])({}, prefixCls + '-' + size, !!size));
    return h(_Input2['default'], (0, _babelHelperVueJsxMergeProps2['default'])([restProps, {
      attrs: {
        type: this.visible ? 'text' : 'password',
        size: size,

        prefixCls: inputPrefixCls,
        suffix: suffixIcon
      },
      'class': inputClassName }]));
  }
};