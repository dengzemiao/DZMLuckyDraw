import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import classNames from 'classnames';
import TextArea from './TextArea';
import omit from 'omit.js';
import inputProps from './inputProps';
import { hasProp, getComponentFromProp } from '../_util/props-util';
import { isIE, isIE9 } from '../_util/env';
import { ConfigConsumerProps } from '../config-provider';
import Password from './Password';
import Icon from '../icon';
import warning from '../_util/warning';

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

export default {
  name: 'AInput',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change.value'
  },
  props: _extends({}, inputProps),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    var _$props = this.$props,
        value = _$props.value,
        defaultValue = _$props.defaultValue;

    return {
      stateValue: !hasProp(this, 'value') ? defaultValue : value
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

      return _ref = {}, _defineProperty(_ref, '' + prefixCls, true), _defineProperty(_ref, prefixCls + '-sm', size === 'small'), _defineProperty(_ref, prefixCls + '-lg', size === 'large'), _defineProperty(_ref, prefixCls + '-disabled', disabled), _ref;
    },
    setValue: function setValue(value, e) {
      // https://github.com/vueComponent/ant-design-vue/issues/92
      if (isIE && !isIE9 && this.stateValue === value) {
        return;
      }
      if (!hasProp(this, 'value')) {
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
        event = _extends({}, e);
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
      return h(Icon, {
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

      var suffix = getComponentFromProp(this, 'suffix');
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
      var addonAfter = getComponentFromProp(this, 'addonAfter');
      var addonBefore = getComponentFromProp(this, 'addonBefore');
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

      var mergedWrapperClassName = (_mergedWrapperClassNa = {}, _defineProperty(_mergedWrapperClassNa, prefixCls + '-wrapper', true), _defineProperty(_mergedWrapperClassNa, wrapperClassName, addonBefore || addonAfter), _mergedWrapperClassNa);

      var mergedGroupClassName = classNames(prefixCls + '-group-wrapper', (_classNames = {}, _defineProperty(_classNames, prefixCls + '-group-wrapper-sm', props.size === 'small'), _defineProperty(_classNames, prefixCls + '-group-wrapper-lg', props.size === 'large'), _classNames));
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
      var prefix = getComponentFromProp(this, 'prefix');
      prefix = prefix ? h(
        'span',
        { 'class': prefixCls + '-prefix', key: 'prefix' },
        [prefix]
      ) : null;

      var affixWrapperCls = classNames(prefixCls + '-affix-wrapper', (_classNames2 = {}, _defineProperty(_classNames2, prefixCls + '-affix-wrapper-sm', size === 'small'), _defineProperty(_classNames2, prefixCls + '-affix-wrapper-lg', size === 'large'), _classNames2));
      return h(
        'span',
        { 'class': affixWrapperCls, key: 'affix' },
        [prefix, children, suffix]
      );
    },
    renderInput: function renderInput(prefixCls) {
      var h = this.$createElement;

      var otherProps = omit(this.$props, ['prefixCls', 'addonBefore', 'addonAfter', 'prefix', 'suffix', 'allowClear', 'value', 'defaultValue']);
      var stateValue = this.stateValue,
          getInputClassName = this.getInputClassName,
          handleKeyDown = this.handleKeyDown,
          handleChange = this.handleChange,
          $listeners = this.$listeners;

      var inputProps = {
        domProps: {
          value: fixControlledValue(stateValue)
        },
        attrs: _extends({}, otherProps, this.$attrs),
        on: _extends({}, $listeners, {
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
        on: _extends({}, $listeners, {
          change: this.handleChange,
          keydown: this.handleKeyDown
        }),
        directives: [{
          name: 'ant-input'
        }]
      };
      return h(TextArea, _mergeJSXProps([textareaProps, { ref: 'input' }]));
    }
    var customizePrefixCls = this.$props.prefixCls;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('input', customizePrefixCls);
    return this.renderLabeledInput(prefixCls, this.renderInput(prefixCls));
  }
};