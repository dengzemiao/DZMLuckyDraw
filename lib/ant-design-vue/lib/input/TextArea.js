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

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _resizeObserverPolyfill = require('resize-observer-polyfill');

var _resizeObserverPolyfill2 = _interopRequireDefault(_resizeObserverPolyfill);

var _inputProps = require('./inputProps');

var _inputProps2 = _interopRequireDefault(_inputProps);

var _calculateNodeHeight = require('./calculateNodeHeight');

var _calculateNodeHeight2 = _interopRequireDefault(_calculateNodeHeight);

var _propsUtil = require('../_util/props-util');

var _propsUtil2 = _interopRequireDefault(_propsUtil);

var _configProvider = require('../config-provider');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function onNextFrame(cb) {
  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame(cb);
  }
  return window.setTimeout(cb, 1);
}

function clearNextFrameAction(nextFrameId) {
  if (window.cancelAnimationFrame) {
    window.cancelAnimationFrame(nextFrameId);
  } else {
    window.clearTimeout(nextFrameId);
  }
}
function fixControlledValue(value) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  return value;
}
function noop() {}

exports['default'] = {
  name: 'ATextarea',
  model: {
    prop: 'value',
    event: 'change.value'
  },
  props: (0, _extends3['default'])({}, _inputProps2['default'], {
    autosize: [Object, Boolean]
  }),
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
      stateValue: fixControlledValue(!(0, _propsUtil2['default'])(this, 'value') ? defaultValue : value),
      nextFrameActionId: undefined,
      textareaStyles: {}
    };
  },

  computed: {},
  watch: {
    value: function value(val) {
      var _this = this;

      this.$nextTick(function () {
        _this.resizeOnNextFrame();
      });
      this.stateValue = fixControlledValue(val);
    },
    autosize: function autosize(val) {
      if (!val && this.$refs.textArea) {
        this.textareaStyles = (0, _omit2['default'])(this.textareaStyles, ['overflowY']);
      }
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.resizeTextarea();
      _this2.updateResizeObserverHook();
      if (_this2.autoFocus) {
        _this2.focus();
      }
    });
  },
  updated: function updated() {
    this.updateResizeObserverHook();
  },
  beforeDestroy: function beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },

  methods: {
    resizeOnNextFrame: function resizeOnNextFrame() {
      if (this.nextFrameActionId) {
        clearNextFrameAction(this.nextFrameActionId);
      }
      this.nextFrameActionId = onNextFrame(this.resizeTextarea);
    },

    // We will update hooks if `autosize` prop change
    updateResizeObserverHook: function updateResizeObserverHook() {
      if (!this.resizeObserver && this.$props.autosize) {
        // Add resize observer
        this.resizeObserver = new _resizeObserverPolyfill2['default'](this.resizeOnNextFrame);
        this.resizeObserver.observe(this.$refs.textArea);
      } else if (this.resizeObserver && !this.$props.autosize) {
        // Remove resize observer
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
    },
    handleKeyDown: function handleKeyDown(e) {
      if (e.keyCode === 13) {
        this.$emit('pressEnter', e);
      }
      this.$emit('keydown', e);
    },
    resizeTextarea: function resizeTextarea() {
      var autosize = this.$props.autosize;

      if (!autosize || !this.$refs.textArea) {
        return;
      }
      var minRows = autosize.minRows,
          maxRows = autosize.maxRows;

      var textareaStyles = (0, _calculateNodeHeight2['default'])(this.$refs.textArea, false, minRows, maxRows);
      this.textareaStyles = textareaStyles;
    },
    handleTextareaChange: function handleTextareaChange(e) {
      if (!(0, _propsUtil2['default'])(this, 'value')) {
        this.stateValue = e.target.value;
        this.resizeTextarea();
      } else {
        this.$forceUpdate();
      }
      if (!e.target.composing) {
        this.$emit('change.value', e.target.value);
      }
      this.$emit('change', e);
      this.$emit('input', e);
    },
    focus: function focus() {
      this.$refs.textArea.focus();
    },
    blur: function blur() {
      this.$refs.textArea.blur();
    }
  },
  render: function render() {
    var h = arguments[0];
    var stateValue = this.stateValue,
        handleKeyDown = this.handleKeyDown,
        handleTextareaChange = this.handleTextareaChange,
        textareaStyles = this.textareaStyles,
        $attrs = this.$attrs,
        $listeners = this.$listeners,
        customizePrefixCls = this.prefixCls,
        disabled = this.disabled;

    var otherProps = (0, _omit2['default'])(this.$props, ['prefixCls', 'autosize', 'type', 'value', 'defaultValue']);
    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('input', customizePrefixCls);

    var cls = (0, _classnames2['default'])(prefixCls, (0, _defineProperty3['default'])({}, prefixCls + '-disabled', disabled));

    var textareaProps = {
      attrs: (0, _extends3['default'])({}, otherProps, $attrs),
      on: (0, _extends3['default'])({}, $listeners, {
        keydown: handleKeyDown,
        input: handleTextareaChange,
        change: noop
      })
    };
    if ($listeners['change.value']) {
      textareaProps.directives = [{ name: 'ant-input' }];
    }
    return h('textarea', (0, _babelHelperVueJsxMergeProps2['default'])([textareaProps, {
      domProps: {
        'value': stateValue
      },

      'class': cls,
      style: textareaStyles,
      ref: 'textArea'
    }]));
  }
};