'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _TextArea = require('./TextArea');

var _TextArea2 = _interopRequireDefault(_TextArea);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _inputProps = require('./inputProps');

var _inputProps2 = _interopRequireDefault(_inputProps);

var _propsUtil = require('../_util/props-util');

var _env = require('../_util/env');

var _configProvider = require('../config-provider');

var _Password = require('./Password');

var _Password2 = _interopRequireDefault(_Password);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

function fixControlledValue(value) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  return value;
}

function hasPrefixSuffix(props) {
  return 'prefix' in props || props.suffix || props.allowClear;
}

exports['default'] = {
  name: 'AInput',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change.value'
  },
  props: (0, _extends3['default'])({}, _inputProps2['default']),
  inject: {
    configProvider: { 'default': function _default() {
        return _configProvider.ConfigConsumerProps;
      } }
  },
  data: function data() {
    var _$props = this.$props,
        value = _$props.value,
        defaultValue = _$props.defaultValue;

    return {
      stateValue: !(0, _propsUtil.hasProp)(this, 'value') ? defaultValue : value
    };
  },

  watch: {
    value: function value(val) {
      this.stateValue = val;
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.autoFocus) {
        _this.focus();
      }
    });
  },

  methods: {
    handleKeyDown: function handleKeyDown(e) {
      if (e.keyCode === 13) {
        this.$emit('pressEnter', e);
      }
      this.$emit('keydown', e);
    },
    focus: function focus() {
      this.$refs.input.focus();
    },
    blur: function blur() {
      this.$refs.input.blur();
    },
    select: function select() {
      this.$refs.input.select();
    },
    getInputClassName: function getInputClassName(prefixCls) {
      var _ref;

      var _$props2 = this.$props,
          size = _$props2.size,
          disabled = _$props2.disabled;

      return _ref = {}, (0, _defineProperty3['default'])(_ref, '' + prefixCls, true), (0, _defineProperty3['default'])(_ref, prefixCls + '-sm', size === 'small'), (0, _defineProperty3['default'])(_ref, prefixCls + '-lg', size === 'large'), (0, _defineProperty3['default'])(_ref, prefixCls + '-disabled', disabled), _ref;
    },
    setValue: function setValue(value, e) {
      // https://github.com/vueComponent/ant-design-vue/issues/92
      if (_env.isIE && !_env.isIE9 && this.stateValue === value) {
        return;
      }
      if (!(0, _propsUtil.hasProp)(this, 'value')) {
        this.stateValue = value;
      } else {
        this.$forceUpdate();
      }
      if (!e.target.composing) {
        this.$emit('change.value', value);
      }
      var event = e;
      if (e.type === 'click' && this.$refs.input) {
        // click clear icon
        event = (0, _extends3['default'])({}, e);
        event.target = this.$refs.input;
        event.currentTarget = this.$refs.input;
        var originalInputValue = this.$refs.input.value;
        // change input value cause e.target.value should be '' when clear input
        this.$refs.input.value = '';
        this.$emit('change', event);
        this.$emit('input', event);
        // reset input value
        this.$refs.input.value = originalInputValue;
        return;
      }
      this.$emit('change', e);
      this.$emit('input', e);
    },
    handleReset: function handleReset(e) {
      this.setValue('', e);
    },
    handleChange: function handleChange(e) {
      this.setValue(e.target.value, e);
    },
    renderClearIcon: function renderClearIcon(prefixCls) {
      var h = this.$createElement;
      var allowClear = this.$props.allowClear;
      var stateValue = this.stateValue;

      if (!allowClear || stateValue === undefined || stateValue === null || stateValue === '') {
        return null;
      }
      return h(_icon2['default'], {
        attrs: {
          type: 'close-circle',
          theme: 'filled',

          role: 'button'
        },
        on: {
          'click': this.handleReset
        },

        'class': prefixCls + '-clear-icon' });
    },
    renderSuffix: function renderSuffix(prefixCls) {
      var h = this.$createElement;
      var allowClear = this.$props.allowClear;

      var suffix = (0, _propsUtil.getComponentFromProp)(this, 'suffix');
      if (suffix || allowClear) {
        return h(
          'span',
          { 'class': prefixCls + '-suffix', key: 'suffix' },
          [this.renderClearIcon(prefixCls), suffix]
        );
      }
      return null;
    },
    renderLabeledInput: function renderLabeledInput(prefixCls, children) {
      var _mergedWrapperClassNa, _classNames;

      var h = this.$createElement;

      var props = this.$props;
      var addonAfter = (0, _propsUtil.getComponentFromProp)(this, 'addonAfter');
      var addonBefore = (0, _propsUtil.getComponentFromProp)(this, 'addonBefore');
      // Not wrap when there is not addons
      if (!addonBefore && !addonAfter) {
        return children;
      }

      var wrapperClassName = prefixCls + '-group';
      var addonClassName = wrapperClassName + '-addon';
      addonBefore = addonBefore ? h(
        'span',
        { 'class': addonClassName },
        [addonBefore]
      ) : null;

      addonAfter = addonAfter ? h(
        'span',
        { 'class': addonClassName },
        [addonAfter]
      ) : null;

      var mergedWrapperClassName = (_mergedWrapperClassNa = {}, (0, _defineProperty3['default'])(_mergedWrapperClassNa, prefixCls + '-wrapper', true), (0, _defineProperty3['default'])(_mergedWrapperClassNa, wrapperClassName, addonBefore || addonAfter), _mergedWrapperClassNa);

      var mergedGroupClassName = (0, _classnames2['default'])(prefixCls + '-group-wrapper', (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-group-wrapper-sm', props.size === 'small'), (0, _defineProperty3['default'])(_classNames, prefixCls + '-group-wrapper-lg', props.size === 'large'), _classNames));
      return h(
        'span',
        { 'class': mergedGroupClassName },
        [h(
          'span',
          { 'class': mergedWrapperClassName },
          [addonBefore, children, addonAfter]
        )]
      );
    },
    renderLabeledIcon: function renderLabeledIcon(prefixCls, children) {
      var _classNames2;

      var h = this.$createElement;
      var size = this.$props.size;

      var suffix = this.renderSuffix(prefixCls);
      if (!hasPrefixSuffix(this.$props)) {
        return children;
      }
      var prefix = (0, _propsUtil.getComponentFromProp)(this, 'prefix');
      prefix = prefix ? h(
        'span',
        { 'class': prefixCls + '-prefix', key: 'prefix' },
        [prefix]
      ) : null;

      var affixWrapperCls = (0, _classnames2['default'])(prefixCls + '-affix-wrapper', (_classNames2 = {}, (0, _defineProperty3['default'])(_classNames2, prefixCls + '-affix-wrapper-sm', size === 'small'), (0, _defineProperty3['default'])(_classNames2, prefixCls + '-affix-wrapper-lg', size === 'large'), _classNames2));
      return h(
        'span',
        { 'class': affixWrapperCls, key: 'affix' },
        [prefix, children, suffix]
      );
    },
    renderInput: function renderInput(prefixCls) {
      var h = this.$createElement;

      var otherProps = (0, _omit2['default'])(this.$props, ['prefixCls', 'addonBefore', 'addonAfter', 'prefix', 'suffix', 'allowClear', 'value', 'defaultValue']);
      var stateValue = this.stateValue,
          getInputClassName = this.getInputClassName,
          handleKeyDown = this.handleKeyDown,
          handleChange = this.handleChange,
          $listeners = this.$listeners;

      var inputProps = {
        domProps: {
          value: fixControlledValue(stateValue)
        },
        attrs: (0, _extends3['default'])({}, otherProps, this.$attrs),
        on: (0, _extends3['default'])({}, $listeners, {
          keydown: handleKeyDown,
          input: handleChange,
          change: noop
        }),
        'class': getInputClassName(prefixCls),
        ref: 'input',
        key: 'ant-input'
      };
      if ($listeners['change.value']) {
        inputProps.directives = [{ name: 'ant-input' }];
      }
      return this.renderLabeledIcon(prefixCls, h('input', inputProps));
    }
  },
  render: function render() {
    var h = arguments[0];

    if (this.$props.type === 'textarea') {
      var $listeners = this.$listeners;

      var textareaProps = {
        props: this.$props,
        attrs: this.$attrs,
        on: (0, _extends3['default'])({}, $listeners, {
          change: this.handleChange,
          keydown: this.handleKeyDown
        }),
        directives: [{
          name: 'ant-input'
        }]
      };
      return h(_TextArea2['default'], (0, _babelHelperVueJsxMergeProps2['default'])([textareaProps, { ref: 'input' }]));
    }
    var customizePrefixCls = this.$props.prefixCls;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('input', customizePrefixCls);
    return this.renderLabeledInput(prefixCls, this.renderInput(prefixCls));
  }
};