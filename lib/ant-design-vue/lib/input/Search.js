'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

var _button = require('../button');

var _button2 = _interopRequireDefault(_button);

var _vnode = require('../_util/vnode');

var _propsUtil = require('../_util/props-util');

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _configProvider = require('../config-provider');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'AInputSearch',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change.value'
  },
  props: (0, _extends3['default'])({}, _inputProps2['default'], {
    enterButton: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].string, _vueTypes2['default'].object])
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configProvider.ConfigConsumerProps;
      } }
  },
  methods: {
    onSearch: function onSearch(e) {
      this.$emit('search', this.$refs.input.stateValue, e);
      this.$refs.input.focus();
    },
    focus: function focus() {
      this.$refs.input.focus();
    },
    blur: function blur() {
      this.$refs.input.blur();
    },
    renderSuffix: function renderSuffix(prefixCls) {
      var h = this.$createElement;

      var suffix = (0, _propsUtil.getComponentFromProp)(this, 'suffix');
      var enterButton = (0, _propsUtil.getComponentFromProp)(this, 'enterButton');
      if (enterButton) return suffix;

      var node = h(_icon2['default'], { 'class': prefixCls + '-icon', attrs: { type: 'search' },
        key: 'searchIcon', on: {
          'click': this.onSearch
        }
      });

      if (suffix) {
        // let cloneSuffix = suffix;
        // if (isValidElement(cloneSuffix) && !cloneSuffix.key) {
        //   cloneSuffix = cloneElement(cloneSuffix, {
        //     key: 'originSuffix',
        //   });
        // }
        return [suffix, node];
      }

      return node;
    },
    renderAddonAfter: function renderAddonAfter(prefixCls) {
      var h = this.$createElement;
      var size = this.size,
          disabled = this.disabled;

      var enterButton = (0, _propsUtil.getComponentFromProp)(this, 'enterButton');
      var addonAfter = (0, _propsUtil.getComponentFromProp)(this, 'addonAfter');
      if (!enterButton) return addonAfter;
      var btnClassName = prefixCls + '-button';
      var enterButtonAsElement = Array.isArray(enterButton) ? enterButton[0] : enterButton;
      var button = void 0;
      if (enterButtonAsElement.tag === 'button' || enterButtonAsElement.componentOptions && enterButtonAsElement.componentOptions.Ctor.extendOptions.__ANT_BUTTON) {
        button = (0, _vnode.cloneElement)(enterButtonAsElement, {
          'class': btnClassName,
          props: { size: size },
          on: {
            click: this.onSearch
          }
        });
      } else {
        button = h(
          _button2['default'],
          {
            'class': btnClassName,
            attrs: { type: 'primary',
              size: size,
              disabled: disabled
            },
            key: 'enterButton',
            on: {
              'click': this.onSearch
            }
          },
          [enterButton === true ? h(_icon2['default'], {
            attrs: { type: 'search' }
          }) : enterButton]
        );
      }
      if (addonAfter) {
        return [button, addonAfter];
      }

      return button;
    }
  },
  render: function render() {
    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        customizeInputPrefixCls = _getOptionProps.inputPrefixCls,
        size = _getOptionProps.size,
        others = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['prefixCls', 'inputPrefixCls', 'size']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('input-search', customizePrefixCls);
    var inputPrefixCls = getPrefixCls('input', customizeInputPrefixCls);

    var enterButton = (0, _propsUtil.getComponentFromProp)(this, 'enterButton');
    var addonBefore = (0, _propsUtil.getComponentFromProp)(this, 'addonBefore');
    var inputClassName = void 0;
    if (enterButton) {
      var _classNames;

      inputClassName = (0, _classnames2['default'])(prefixCls, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-enter-button', !!enterButton), (0, _defineProperty3['default'])(_classNames, prefixCls + '-' + size, !!size), _classNames));
    } else {
      inputClassName = prefixCls;
    }

    var on = (0, _extends3['default'])({}, this.$listeners);
    delete on.search;
    var inputProps = {
      props: (0, _extends3['default'])({}, others, {
        prefixCls: inputPrefixCls,
        size: size,
        suffix: this.renderSuffix(prefixCls),
        addonAfter: this.renderAddonAfter(prefixCls),
        addonBefore: addonBefore
      }),
      attrs: this.$attrs,
      'class': inputClassName,
      ref: 'input',
      on: (0, _extends3['default'])({
        pressEnter: this.onSearch
      }, on)
    };
    return h(_Input2['default'], inputProps);
  }
};