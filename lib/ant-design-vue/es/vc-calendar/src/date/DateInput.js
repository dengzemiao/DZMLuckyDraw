import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { getComponentFromProp } from '../../../_util/props-util';
import moment from 'moment';
import { formatDate } from '../util';
import KeyCode from '../../../_util/KeyCode';

var cachedSelectionStart = void 0;
var cachedSelectionEnd = void 0;
var dateInputInstance = void 0;
import { isIE, isIE9 } from '../../../_util/env';

var DateInput = {
  mixins: [BaseMixin],
  props: {
    prefixCls: PropTypes.string,
    timePicker: PropTypes.object,
    value: PropTypes.object,
    disabledTime: PropTypes.any,
    format: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    locale: PropTypes.object,
    disabledDate: PropTypes.func,
    // onChange: PropTypes.func,
    // onClear: PropTypes.func,
    placeholder: PropTypes.string,
    // onSelect: PropTypes.func,
    selectedValue: PropTypes.object,
    clearIcon: PropTypes.any
  },

  data: function data() {
    var selectedValue = this.selectedValue;
    return {
      str: formatDate(selectedValue, this.format),
      invalid: false,
      hasFocus: false
    };
  },

  watch: {
    selectedValue: function selectedValue() {
      this.updateState();
    },
    format: function format() {
      this.updateState();
    }
  },

  updated: function updated() {
    var _this = this;

    this.$nextTick(function () {
      if (dateInputInstance && _this.$data.hasFocus && !_this.invalid && !(cachedSelectionStart === 0 && cachedSelectionEnd === 0)) {
        dateInputInstance.setSelectionRange(cachedSelectionStart, cachedSelectionEnd);
      }
    });
  },
  getInstance: function getInstance() {
    return dateInputInstance;
  },

  methods: {
    updateState: function updateState() {
      if (dateInputInstance) {
        cachedSelectionStart = dateInputInstance.selectionStart;
        cachedSelectionEnd = dateInputInstance.selectionEnd;
      }
      // when popup show, click body will call this, bug!
      var selectedValue = this.selectedValue;
      if (!this.$data.hasFocus) {
        this.setState({
          str: formatDate(selectedValue, this.format),
          invalid: false
        });
      }
    },
    onClear: function onClear() {
      this.setState({
        str: ''
      });
      this.__emit('clear', null);
    },
    onInputChange: function onInputChange(event) {
      var str = event.target.value;
      // https://github.com/vueComponent/ant-design-vue/issues/92
      if (isIE && !isIE9 && this.str === str) {
        return;
      }
      var _$props = this.$props,
          disabledDate = _$props.disabledDate,
          format = _$props.format,
          selectedValue = _$props.selectedValue;

      // 没有内容，合法并直接退出

      if (!str) {
        this.__emit('change', null);
        this.setState({
          invalid: false,
          str: str
        });
        return;
      }

      // 不合法直接退出
      var parsed = moment(str, format, true);
      if (!parsed.isValid()) {
        this.setState({
          invalid: true,
          str: str
        });
        return;
      }
      var value = this.value.clone();
      value.year(parsed.year()).month(parsed.month()).date(parsed.date()).hour(parsed.hour()).minute(parsed.minute()).second(parsed.second());

      if (!value || disabledDate && disabledDate(value)) {
        this.setState({
          invalid: true,
          str: str
        });
        return;
      }

      if (selectedValue !== value || selectedValue && value && !selectedValue.isSame(value)) {
        this.setState({
          invalid: false,
          str: str
        });
        this.__emit('change', value);
      }
    },
    onFocus: function onFocus() {
      this.setState({ hasFocus: true });
    },
    onBlur: function onBlur() {
      this.setState(function (prevState, prevProps) {
        return {
          hasFocus: false,
          str: formatDate(prevProps.value, prevProps.format)
        };
      });
    },
    onKeyDown: function onKeyDown(_ref) {
      var keyCode = _ref.keyCode;
      var _$props2 = this.$props,
          value = _$props2.value,
          disabledDate = _$props2.disabledDate;

      if (keyCode === KeyCode.ENTER) {
        var validateDate = !disabledDate || !disabledDate(value);
        if (validateDate) {
          this.__emit('select', value.clone());
        }
      }
    },
    getRootDOMNode: function getRootDOMNode() {
      return this.$el;
    },
    focus: function focus() {
      if (dateInputInstance) {
        dateInputInstance.focus();
      }
    },
    saveDateInput: function saveDateInput(dateInput) {
      dateInputInstance = dateInput;
    }
  },

  render: function render() {
    var h = arguments[0];
    var invalid = this.invalid,
        str = this.str,
        locale = this.locale,
        prefixCls = this.prefixCls,
        placeholder = this.placeholder,
        disabled = this.disabled,
        showClear = this.showClear;

    var clearIcon = getComponentFromProp(this, 'clearIcon');
    var invalidClass = invalid ? prefixCls + '-input-invalid' : '';
    return h(
      'div',
      { 'class': prefixCls + '-input-wrap' },
      [h(
        'div',
        { 'class': prefixCls + '-date-input-wrap' },
        [h('input', _mergeJSXProps([{
          directives: [{
            name: 'ant-ref',
            value: this.saveDateInput
          }]
        }, {
          'class': prefixCls + '-input ' + invalidClass,
          domProps: {
            'value': str
          },
          attrs: {
            disabled: disabled,
            placeholder: placeholder
          },
          on: {
            'input': this.onInputChange,
            'keydown': this.onKeyDown,
            'focus': this.onFocus,
            'blur': this.onBlur
          }
        }]))]
      ), showClear ? h(
        'a',
        {
          attrs: { role: 'button', title: locale.clear },
          on: {
            'click': this.onClear
          }
        },
        [clearIcon || h('span', { 'class': prefixCls + '-clear-btn' })]
      ) : null]
    );
  }
};

export default DateInput;