import _extends from 'babel-runtime/helpers/extends';
import _slicedToArray from 'babel-runtime/helpers/slicedToArray';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { getOptionProps, hasProp, initDefaultProps } from '../_util/props-util';
import * as moment from 'moment';
import FullCalendar from '../vc-calendar/src/FullCalendar';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import Header from './Header';
import interopDefault from '../_util/interopDefault';
import { ConfigConsumerProps } from '../config-provider';
import enUS from './locale/en_US';
import Base from '../base';

function noop() {
  return null;
}

function zerofixed(v) {
  if (v < 10) {
    return '0' + v;
  }
  return '' + v;
}
export var MomentType = {
  type: Object,
  validator: function validator(value) {
    return moment.isMoment(value);
  }
};
function isMomentArray(value) {
  return Array.isArray(value) && !!value.find(function (val) {
    return moment.isMoment(val);
  });
}
export var CalendarMode = PropTypes.oneOf(['month', 'year']);

export var CalendarProps = function CalendarProps() {
  return {
    prefixCls: PropTypes.string,
    value: MomentType,
    defaultValue: MomentType,
    mode: CalendarMode,
    fullscreen: PropTypes.bool,
    // dateCellRender: PropTypes.func,
    // monthCellRender: PropTypes.func,
    // dateFullCellRender: PropTypes.func,
    // monthFullCellRender: PropTypes.func,
    locale: PropTypes.object,
    // onPanelChange?: (date?: moment.Moment, mode?: CalendarMode) => void;
    // onSelect?: (date?: moment.Moment) => void;
    disabledDate: PropTypes.func,
    validRange: PropTypes.custom(isMomentArray)
  };
};

var Calendar = {
  name: 'ACalendar',
  mixins: [BaseMixin],
  props: initDefaultProps(CalendarProps(), {
    locale: {},
    fullscreen: true,
    mode: 'month'
  }),
  model: {
    prop: 'value',
    event: 'change'
  },
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    var value = this.value || this.defaultValue || interopDefault(moment)();
    if (!interopDefault(moment).isMoment(value)) {
      throw new Error('The value/defaultValue of Calendar must be a moment object, ');
    }
    this._sPrefixCls = undefined;
    return {
      sValue: value,
      sMode: this.mode
    };
  },

  watch: {
    value: function value(val) {
      this.setState({
        sValue: val
      });
    },
    mode: function mode(val) {
      this.setState({
        sMode: val
      });
    }
  },
  methods: {
    monthCellRender2: function monthCellRender2(value) {
      var h = this.$createElement;
      var _sPrefixCls = this._sPrefixCls,
          $scopedSlots = this.$scopedSlots;

      var monthCellRender = this.monthCellRender || $scopedSlots.monthCellRender || noop;
      return h(
        'div',
        { 'class': _sPrefixCls + '-month' },
        [h(
          'div',
          { 'class': _sPrefixCls + '-value' },
          [value.localeData().monthsShort(value)]
        ), h(
          'div',
          { 'class': _sPrefixCls + '-content' },
          [monthCellRender(value)]
        )]
      );
    },
    dateCellRender2: function dateCellRender2(value) {
      var h = this.$createElement;
      var _sPrefixCls = this._sPrefixCls,
          $scopedSlots = this.$scopedSlots;

      var dateCellRender = this.dateCellRender || $scopedSlots.dateCellRender || noop;
      return h(
        'div',
        { 'class': _sPrefixCls + '-date' },
        [h(
          'div',
          { 'class': _sPrefixCls + '-value' },
          [zerofixed(value.date())]
        ), h(
          'div',
          { 'class': _sPrefixCls + '-content' },
          [dateCellRender(value)]
        )]
      );
    },
    setValue: function setValue(value, way) {
      if (way === 'select') {
        this.$emit('select', value);
      } else if (way === 'changePanel') {
        this.onPanelChange(value, this.sMode);
      }
      if (!hasProp(this, 'value')) {
        this.setState({ sValue: value });
      }
    },
    setType: function setType(type) {
      var mode = type === 'date' ? 'month' : 'year';
      if (this.sMode !== mode) {
        this.setState({ sMode: mode });
        this.onPanelChange(this.sValue, mode);
      }
    },
    onHeaderValueChange: function onHeaderValueChange(value) {
      this.setValue(value, 'changePanel');
    },
    onHeaderTypeChange: function onHeaderTypeChange(type) {
      this.setType(type);
    },
    onPanelChange: function onPanelChange(value, mode) {
      this.$emit('panelChange', value, mode);
      if (value !== this.sValue) {
        this.$emit('change', value);
      }
    },
    onSelect: function onSelect(value) {
      this.setValue(value, 'select');
    },
    getDateRange: function getDateRange(validRange, disabledDate) {
      return function (current) {
        if (!current) {
          return false;
        }

        var _validRange = _slicedToArray(validRange, 2),
            startDate = _validRange[0],
            endDate = _validRange[1];

        var inRange = !current.isBetween(startDate, endDate, 'days', '[]');
        if (disabledDate) {
          return disabledDate(current) || inRange;
        }
        return inRange;
      };
    },
    getDefaultLocale: function getDefaultLocale() {
      var result = _extends({}, enUS, this.$props.locale);
      result.lang = _extends({}, result.lang, (this.$props.locale || {}).lang);
      return result;
    },
    renderCalendar: function renderCalendar(locale, localeCode) {
      var h = this.$createElement;

      var props = getOptionProps(this);
      var value = this.sValue,
          mode = this.sMode,
          $listeners = this.$listeners,
          $scopedSlots = this.$scopedSlots;

      if (value && localeCode) {
        value.locale(localeCode);
      }
      var customizePrefixCls = props.prefixCls,
          fullscreen = props.fullscreen,
          dateFullCellRender = props.dateFullCellRender,
          monthFullCellRender = props.monthFullCellRender;

      var getPrefixCls = this.configProvider.getPrefixCls;
      var prefixCls = getPrefixCls('fullcalendar', customizePrefixCls);
      var type = mode === 'year' ? 'month' : 'date';

      // To support old version react.
      // Have to add prefixCls on the instance.
      // https://github.com/facebook/react/issues/12397
      this._sPrefixCls = prefixCls;

      var cls = '';
      if (fullscreen) {
        cls += ' ' + prefixCls + '-fullscreen';
      }

      var monthCellRender = monthFullCellRender || $scopedSlots.monthFullCellRender || this.monthCellRender2;
      var dateCellRender = dateFullCellRender || $scopedSlots.dateFullCellRender || this.dateCellRender2;

      var disabledDate = props.disabledDate;

      if (props.validRange) {
        disabledDate = this.getDateRange(props.validRange, disabledDate);
      }
      var fullCalendarProps = {
        props: _extends({}, props, {
          Select: {},
          locale: locale.lang,
          type: type,
          prefixCls: prefixCls,
          showHeader: false,
          value: value,
          monthCellRender: monthCellRender,
          dateCellRender: dateCellRender,
          disabledDate: disabledDate
        }),
        on: _extends({}, $listeners, {
          select: this.onSelect
        })
      };
      return h(
        'div',
        { 'class': cls },
        [h(Header, {
          attrs: {
            fullscreen: fullscreen,
            type: type,
            value: value,
            locale: locale.lang,
            prefixCls: prefixCls,

            validRange: props.validRange
          },
          on: {
            'typeChange': this.onHeaderTypeChange,
            'valueChange': this.onHeaderValueChange
          }
        }), h(FullCalendar, fullCalendarProps)]
      );
    }
  },

  render: function render() {
    var h = arguments[0];

    return h(LocaleReceiver, {
      attrs: {
        componentName: 'Calendar',
        defaultLocale: this.getDefaultLocale
      },
      scopedSlots: { 'default': this.renderCalendar }
    });
  }
};

/* istanbul ignore next */
Calendar.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Calendar.name, Calendar);
};
export { HeaderProps } from './Header';
export default Calendar;