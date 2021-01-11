'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports['default'] = wrapPicker;

var _Panel = require('../vc-time-picker/Panel');

var _Panel2 = _interopRequireDefault(_Panel);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _timePicker = require('../time-picker');

var _en_US = require('./locale/en_US');

var _en_US2 = _interopRequireDefault(_en_US);

var _propsUtil = require('../_util/props-util');

var _configProvider = require('../config-provider');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var DEFAULT_FORMAT = {
  date: 'YYYY-MM-DD',
  dateTime: 'YYYY-MM-DD HH:mm:ss',
  week: 'gggg-wo',
  month: 'YYYY-MM'
};

var LOCALE_FORMAT_MAPPING = {
  date: 'dateFormat',
  dateTime: 'dateTimeFormat',
  week: 'weekFormat',
  month: 'monthFormat'
};

function getColumns(_ref) {
  var showHour = _ref.showHour,
      showMinute = _ref.showMinute,
      showSecond = _ref.showSecond,
      use12Hours = _ref.use12Hours;

  var column = 0;
  if (showHour) {
    column += 1;
  }
  if (showMinute) {
    column += 1;
  }
  if (showSecond) {
    column += 1;
  }
  if (use12Hours) {
    column += 1;
  }
  return column;
}

function wrapPicker(Picker, props, pickerType) {
  return {
    name: Picker.name,
    props: (0, _propsUtil.initDefaultProps)(props, {
      transitionName: 'slide-up',
      popupStyle: {},
      locale: {}
    }),
    model: {
      prop: 'value',
      event: 'change'
    },
    inject: {
      configProvider: { 'default': function _default() {
          return _configProvider.ConfigConsumerProps;
        } }
    },
    provide: function provide() {
      return {
        savePopupRef: this.savePopupRef
      };
    },
    mounted: function mounted() {
      var _this = this;

      var autoFocus = this.autoFocus,
          disabled = this.disabled;

      if (autoFocus && !disabled) {
        this.$nextTick(function () {
          _this.focus();
        });
      }
    },

    methods: {
      savePopupRef: function savePopupRef(ref) {
        this.popupRef = ref;
      },
      handleOpenChange: function handleOpenChange(open) {
        this.$emit('openChange', open);
      },
      handleFocus: function handleFocus(e) {
        this.$emit('focus', e);
      },
      handleBlur: function handleBlur(e) {
        this.$emit('blur', e);
      },
      handleMouseEnter: function handleMouseEnter(e) {
        this.$emit('mouseenter', e);
      },
      handleMouseLeave: function handleMouseLeave(e) {
        this.$emit('mouseleave', e);
      },
      focus: function focus() {
        this.$refs.picker.focus();
      },
      blur: function blur() {
        this.$refs.picker.blur();
      },
      getDefaultLocale: function getDefaultLocale() {
        var result = (0, _extends3['default'])({}, _en_US2['default'], this.locale);
        result.lang = (0, _extends3['default'])({}, result.lang, (this.locale || {}).lang);
        return result;
      },
      renderPicker: function renderPicker(locale, localeCode) {
        var _classNames2,
            _this2 = this;

        var h = this.$createElement;

        var props = (0, _propsUtil.getOptionProps)(this);
        var customizePrefixCls = props.prefixCls,
            customizeInputPrefixCls = props.inputPrefixCls,
            size = props.size,
            showTime = props.showTime,
            disabled = props.disabled,
            format = props.format;

        var mergedPickerType = showTime ? pickerType + 'Time' : pickerType;
        var mergedFormat = format || locale[LOCALE_FORMAT_MAPPING[mergedPickerType]] || DEFAULT_FORMAT[mergedPickerType];

        var getPrefixCls = this.configProvider.getPrefixCls;
        var prefixCls = getPrefixCls('calendar', customizePrefixCls);
        var inputPrefixCls = getPrefixCls('input', customizeInputPrefixCls);

        var pickerClass = (0, _classnames2['default'])(prefixCls + '-picker', (0, _defineProperty3['default'])({}, prefixCls + '-picker-' + size, !!size));
        var pickerInputClass = (0, _classnames2['default'])(prefixCls + '-picker-input', inputPrefixCls, (_classNames2 = {}, (0, _defineProperty3['default'])(_classNames2, inputPrefixCls + '-lg', size === 'large'), (0, _defineProperty3['default'])(_classNames2, inputPrefixCls + '-sm', size === 'small'), (0, _defineProperty3['default'])(_classNames2, inputPrefixCls + '-disabled', disabled), _classNames2));

        var timeFormat = showTime && showTime.format || 'HH:mm:ss';
        var vcTimePickerProps = (0, _extends3['default'])({}, (0, _timePicker.generateShowHourMinuteSecond)(timeFormat), {
          format: timeFormat,
          use12Hours: showTime && showTime.use12Hours
        });
        var columns = getColumns(vcTimePickerProps);
        var timePickerCls = prefixCls + '-time-picker-column-' + columns;
        var timePickerPanelProps = {
          props: (0, _extends3['default'])({}, vcTimePickerProps, showTime, {
            prefixCls: prefixCls + '-time-picker',
            placeholder: locale.timePickerLocale.placeholder,
            transitionName: 'slide-up'
          }),
          'class': timePickerCls
        };
        var timePicker = showTime ? h(_Panel2['default'], timePickerPanelProps) : null;
        var pickerProps = {
          props: (0, _extends3['default'])({}, props, {
            format: mergedFormat,
            pickerClass: pickerClass,
            pickerInputClass: pickerInputClass,
            locale: locale,
            localeCode: localeCode,
            timePicker: timePicker
          }),
          on: (0, _extends3['default'])({}, this.$listeners, {
            openChange: this.handleOpenChange,
            focus: this.handleFocus,
            blur: this.handleBlur,
            mouseenter: this.handleMouseEnter,
            mouseleave: this.handleMouseLeave
          }),
          ref: 'picker',
          scopedSlots: this.$scopedSlots || {}
        };
        return h(
          Picker,
          pickerProps,
          [this.$slots && Object.keys(this.$slots).map(function (key) {
            return h(
              'template',
              { slot: key, key: key },
              [_this2.$slots[key]]
            );
          })]
        );
      }
    },

    render: function render() {
      var h = arguments[0];

      return h(_LocaleReceiver2['default'], {
        attrs: {
          componentName: 'DatePicker',
          defaultLocale: this.getDefaultLocale
        },
        scopedSlots: { 'default': this.renderPicker }
      });
    }
  };
}