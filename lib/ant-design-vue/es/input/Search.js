import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import classNames from 'classnames';
import Input from './Input';
import Icon from '../icon';
import inputProps from './inputProps';
import Button from '../button';
import { cloneElement } from '../_util/vnode';
import { getOptionProps, getComponentFromProp, isValidElement } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider';

export default {
  name: 'AInputSearch',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change.value'
  },
  props: _extends({}, inputProps, {
    enterButton: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.object])
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
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

      var suffix = getComponentFromProp(this, 'suffix');
      var enterButton = getComponentFromProp(this, 'enterButton');
      if (enterButton) return suffix;

      var node = h(Icon, { 'class': prefixCls + '-icon', attrs: { type: 'search' },
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

      var enterButton = getComponentFromProp(this, 'enterButton');
      var addonAfter = getComponentFromProp(this, 'addonAfter');
      if (!enterButton) return addonAfter;
      var btnClassName = prefixCls + '-button';
      var enterButtonAsElement = Array.isArray(enterButton) ? enterButton[0] : enterButton;
      var button = void 0;
      if (enterButtonAsElement.tag === 'button' || enterButtonAsElement.componentOptions && enterButtonAsElement.componentOptions.Ctor.extendOptions.__ANT_BUTTON) {
        button = cloneElement(enterButtonAsElement, {
          'class': btnClassName,
          props: { size: size },
          on: {
            click: this.onSearch
          }
        });
      } else {
        button = h(
          Button,
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
          [enterButton === true ? h(Icon, {
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

    var _getOptionProps = getOptionProps(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        customizeInputPrefixCls = _getOptionProps.inputPrefixCls,
        size = _getOptionProps.size,
        others = _objectWithoutProperties(_getOptionProps, ['prefixCls', 'inputPrefixCls', 'size']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('input-search', customizePrefixCls);
    var inputPrefixCls = getPrefixCls('input', customizeInputPrefixCls);

    var enterButton = getComponentFromProp(this, 'enterButton');
    var addonBefore = getComponentFromProp(this, 'addonBefore');
    var inputClassName = void 0;
    if (enterButton) {
      var _classNames;

      inputClassName = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-enter-button', !!enterButton), _defineProperty(_classNames, prefixCls + '-' + size, !!size), _classNames));
    } else {
      inputClassName = prefixCls;
    }

    var on = _extends({}, this.$listeners);
    delete on.search;
    var inputProps = {
      props: _extends({}, others, {
        prefixCls: inputPrefixCls,
        size: size,
        suffix: this.renderSuffix(prefixCls),
        addonAfter: this.renderAddonAfter(prefixCls),
        addonBefore: addonBefore
      }),
      attrs: this.$attrs,
      'class': inputClassName,
      ref: 'input',
      on: _extends({
        pressEnter: this.onSearch
      }, on)
    };
    return h(Input, inputProps);
  }
};