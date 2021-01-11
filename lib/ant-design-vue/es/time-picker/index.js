import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import * as moment from 'moment';
import omit from 'omit.js';
import VcTimePicker from '../vc-time-picker';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from './locale/en_US';
import BaseMixin from '../_util/BaseMixin';
import PropTypes from '../_util/vue-types';
import warning from '../_util/warning';
import Icon from '../icon';
import interopDefault from '../_util/interopDefault';
import { initDefaultProps, hasProp, getOptionProps, getComponentFromProp, isValidElement } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { ConfigConsumerProps } from '../config-provider';
import Base from '../base';

export function generateShowHourMinuteSecond(format) {
  // Ref: http://momentjs.com/docs/#/parsing/string-format/
  return {
    showHour: format.indexOf('H') > -1 || format.indexOf('h') > -1 || format.indexOf('k') > -1,
    showMinute: format.indexOf('m') > -1,
    showSecond: format.indexOf('s') > -1
  };
}
function isMoment(value) {
  if (Array.isArray(value)) {
    return value.length === 0 || value.findIndex(function (val) {
      return val === undefined || moment.isMoment(val);
    }) !== -1;
  } else {
    return value === undefined || moment.isMoment(value);
  }
}
var MomentType = PropTypes.custom(isMoment);
export var TimePickerProps = function TimePickerProps() {
  return {
    size: PropTypes.oneOf(['large', 'default', 'small']),
    value: MomentType,
    defaultValue: MomentType,
    open: PropTypes.bool,
    format: PropTypes.string,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    prefixCls: PropTypes.string,
    hideDisabledOptions: PropTypes.bool,
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    getPopupContainer: PropTypes.func,
    use12Hours: PropTypes.bool,
    focusOnOpen: PropTypes.bool,
    hourStep: PropTypes.number,
    minuteStep: PropTypes.number,
    secondStep: PropTypes.number,
    allowEmpty: PropTypes.bool,
    allowClear: PropTypes.bool,
    inputReadOnly: PropTypes.bool,
    clearText: PropTypes.string,
    defaultOpenValue: PropTypes.object,
    popupClassName: PropTypes.string,
    popupStyle: PropTypes.object,
    suffixIcon: PropTypes.any,
    align: PropTypes.object,
    placement: PropTypes.any,
    transitionName: PropTypes.string,
    autoFocus: PropTypes.bool,
    addon: PropTypes.any
  };
};

var TimePicker = {
  name: 'ATimePicker',
  mixins: [BaseMixin],
  props: initDefaultProps(TimePickerProps(), {
    align: {
      offset: [0, -2]
    },
    disabled: false,
    disabledHours: undefined,
    disabledMinutes: undefined,
    disabledSeconds: undefined,
    hideDisabledOptions: false,
    placement: 'bottomLeft',
    transitionName: 'slide-up',
    focusOnOpen: true
  }),
  model: {
    prop: 'value',
    event: 'change'
  },
  provide: function provide() {
    return {
      savePopupRef: this.savePopupRef
    };
  },

  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    var value = this.value || this.defaultValue;
    if (value && !interopDefault(moment).isMoment(value)) {
      throw new Error('The value/defaultValue of TimePicker must be a moment object, ');
    }
    warning(!hasProp(this, 'allowEmpty'), '`allowEmpty` in TimePicker is deprecated. Please use `allowClear` instead.');
    return {
      sValue: value
    };
  },

  watch: {
    value: function value(val) {
      this.setState({ sValue: val });
    }
  },
  methods: {
    savePopupRef: function savePopupRef(ref) {
      this.popupRef = ref;
    },
    handleChange: function handleChange(value) {
      if (!hasProp(this, 'value')) {
        this.setState({ sValue: value });
      }
      var _format = this.format,
          format = _format === undefined ? 'HH:mm:ss' : _format;

      this.$emit('change', value, value && value.format(format) || '');
    },
    handleOpenClose: function handleOpenClose(_ref) {
      var open = _ref.open;

      this.$emit('openChange', open);
      this.$emit('update:open', open);
    },
    focus: function focus() {
      this.$refs.timePicker.focus();
    },
    blur: function blur() {
      this.$refs.timePicker.blur();
    },
    getDefaultFormat: function getDefaultFormat() {
      var format = this.format,
          use12Hours = this.use12Hours;

      if (format) {
        return format;
      } else if (use12Hours) {
        return 'h:mm:ss a';
      }
      return 'HH:mm:ss';
    },
    getAllowClear: function getAllowClear() {
      var _$props = this.$props,
          allowClear = _$props.allowClear,
          allowEmpty = _$props.allowEmpty;

      if (hasProp(this, 'allowClear')) {
        return allowClear;
      }
      return allowEmpty;
    },
    renderInputIcon: function renderInputIcon(prefixCls) {
      var h = this.$createElement;

      var suffixIcon = getComponentFromProp(this, 'suffixIcon');
      suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
      var clockIcon = suffixIcon && (isValidElement(suffixIcon) ? cloneElement(suffixIcon, {
        'class': prefixCls + '-clock-icon'
      }) : h(
        'span',
        { 'class': prefixCls + '-clock-icon' },
        [suffixIcon]
      )) || h(Icon, {
        attrs: { type: 'clock-circle', theme: 'outlined' },
        'class': prefixCls + '-clock-icon' });

      return h(
        'span',
        { 'class': prefixCls + '-icon' },
        [clockIcon]
      );
    },
    renderClearIcon: function renderClearIcon(prefixCls) {
      var h = this.$createElement;

      var clearIcon = h(Icon, {
        attrs: { type: 'close-circle', theme: 'filled' },
        'class': prefixCls + '-clear' });
      return clearIcon;
    },
    renderTimePicker: function renderTimePicker(locale) {
      var h = this.$createElement;

      var props = getOptionProps(this);
      props = omit(props, ['defaultValue', 'suffixIcon', 'allowEmpty', 'allowClear']);

      var _props = props,
          customizePrefixCls = _props.prefixCls,
          getPopupContainer = _props.getPopupContainer,
          placeholder = _props.placeholder,
          size = _props.size;

      var getPrefixCls = this.configProvider.getPrefixCls;
      var prefixCls = getPrefixCls('time-picker', customizePrefixCls);

      var format = this.getDefaultFormat();
      var pickerClassName = _defineProperty({}, prefixCls + '-' + size, !!size);
      var tempAddon = getComponentFromProp(this, 'addon', {}, false);
      var pickerAddon = function pickerAddon(panel) {
        return tempAddon ? h(
          'div',
          { 'class': prefixCls + '-panel-addon' },
          [typeof tempAddon === 'function' ? tempAddon(panel) : tempAddon]
        ) : null;
      };
      var inputIcon = this.renderInputIcon(prefixCls);
      var clearIcon = this.renderClearIcon(prefixCls);
      var getContextPopupContainer = this.configProvider.getPopupContainer;

      var timeProps = {
        props: _extends({}, generateShowHourMinuteSecond(format), props, {
          allowEmpty: this.getAllowClear(),
          prefixCls: prefixCls,
          getPopupContainer: getPopupContainer || getContextPopupContainer,
          format: format,
          value: this.sValue,
          placeholder: placeholder === undefined ? locale.placeholder : placeholder,
          addon: pickerAddon,
          inputIcon: inputIcon,
          clearIcon: clearIcon
        }),
        'class': pickerClassName,
        ref: 'timePicker',
        on: _extends({}, this.$listeners, {
          change: this.handleChange,
          open: this.handleOpenClose,
          close: this.handleOpenClose
        })
      };
      return h(VcTimePicker, timeProps);
    }
  },

  render: function render() {
    var h = arguments[0];

    return h(LocaleReceiver, {
      attrs: {
        componentName: 'TimePicker',
        defaultLocale: defaultLocale
      },
      scopedSlots: { 'default': this.renderTimePicker }
    });
  }
};

/* istanbul ignore next */
TimePicker.install = function (Vue) {
  Vue.use(Base);
  Vue.component(TimePicker.name, TimePicker);
};

export default TimePicker;