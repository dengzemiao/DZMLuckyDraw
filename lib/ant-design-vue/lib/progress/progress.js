'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProgressProps = exports.ProgressSize = exports.ProgressType = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _configProvider = require('../config-provider');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _line = require('./line');

var _line2 = _interopRequireDefault(_line);

var _circle = require('./circle');

var _circle2 = _interopRequireDefault(_circle);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function addUnit(num, unit) {
  var unitType = unit || 'px';
  return num ? num + unitType : null;
}

var ProgressType = exports.ProgressType = _vueTypes2['default'].oneOf(['line', 'circle', 'dashboard']);
var ProgressSize = exports.ProgressSize = _vueTypes2['default'].oneOf(['default', 'small']);

var ProgressProps = exports.ProgressProps = {
  prefixCls: _vueTypes2['default'].string,
  type: ProgressType,
  percent: _vueTypes2['default'].number,
  successPercent: _vueTypes2['default'].number,
  format: _vueTypes2['default'].func,
  status: _vueTypes2['default'].oneOf(['normal', 'success', 'active', 'exception']),
  showInfo: _vueTypes2['default'].bool,
  strokeWidth: _vueTypes2['default'].number,
  strokeLinecap: _vueTypes2['default'].oneOf(['round', 'square']),
  strokeColor: _vueTypes2['default'].string,
  trailColor: _vueTypes2['default'].string,
  width: _vueTypes2['default'].number,
  gapDegree: _vueTypes2['default'].number,
  gapPosition: _vueTypes2['default'].oneOf(['top', 'bottom', 'left', 'right']),
  size: ProgressSize
};

exports['default'] = {
  name: 'AProgress',
  props: (0, _propsUtil.initDefaultProps)(ProgressProps, {
    type: 'line',
    percent: 0,
    showInfo: true,
    trailColor: '#f3f3f3',
    size: 'default',
    gapDegree: 0,
    strokeLinecap: 'round'
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configProvider.ConfigConsumerProps;
      } }
  },
  methods: {
    renderProcessInfo: function renderProcessInfo(prefixCls, progressStatus) {
      var h = this.$createElement;
      var _$props = this.$props,
          showInfo = _$props.showInfo,
          format = _$props.format,
          type = _$props.type,
          percent = _$props.percent,
          successPercent = _$props.successPercent;

      if (!showInfo) return null;

      var text = void 0;
      var textFormatter = format || function (percentNumber) {
        return percentNumber + '%';
      };
      var iconType = type === 'circle' || type === 'dashboard' ? '' : '-circle';
      if (format || progressStatus !== 'exception' && progressStatus !== 'success') {
        text = textFormatter((0, _utils.validProgress)(percent), (0, _utils.validProgress)(successPercent));
      } else if (progressStatus === 'exception') {
        text = h(_icon2['default'], {
          attrs: { type: 'close' + iconType, theme: type === 'line' ? 'filled' : 'outlined' }
        });
      } else if (progressStatus === 'success') {
        text = h(_icon2['default'], {
          attrs: { type: 'check' + iconType, theme: type === 'line' ? 'filled' : 'outlined' }
        });
      }
      return h(
        'span',
        { 'class': prefixCls + '-text', attrs: { title: typeof text === 'string' ? text : undefined }
        },
        [text]
      );
    }
  },
  render: function render() {
    var _classNames;

    var h = arguments[0];

    var props = (0, _propsUtil.getOptionProps)(this);
    var customizePrefixCls = props.prefixCls,
        _props$percent = props.percent,
        percent = _props$percent === undefined ? 0 : _props$percent,
        status = props.status,
        format = props.format,
        trailColor = props.trailColor,
        size = props.size,
        successPercent = props.successPercent,
        type = props.type,
        strokeWidth = props.strokeWidth,
        width = props.width,
        showInfo = props.showInfo,
        _props$gapDegree = props.gapDegree,
        gapDegree = _props$gapDegree === undefined ? 0 : _props$gapDegree,
        gapPosition = props.gapPosition,
        strokeColor = props.strokeColor,
        _props$strokeLinecap = props.strokeLinecap,
        strokeLinecap = _props$strokeLinecap === undefined ? 'round' : _props$strokeLinecap,
        restProps = (0, _objectWithoutProperties3['default'])(props, ['prefixCls', 'percent', 'status', 'format', 'trailColor', 'size', 'successPercent', 'type', 'strokeWidth', 'width', 'showInfo', 'gapDegree', 'gapPosition', 'strokeColor', 'strokeLinecap']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('progress', customizePrefixCls);

    var progressStatus = parseInt(successPercent !== undefined ? successPercent.toString() : percent.toString(), 10) >= 100 && !('status' in props) ? 'success' : status || 'normal';
    var progress = void 0;
    var progressInfo = this.renderProcessInfo(prefixCls, progressStatus);

    // Render progress shape
    if (type === 'line') {
      var lineProps = {
        props: (0, _extends3['default'])({}, props, {
          prefixCls: prefixCls
        })
      };
      progress = h(
        _line2['default'],
        lineProps,
        [progressInfo]
      );
    } else if (type === 'circle' || type === 'dashboard') {
      var circleProps = {
        props: (0, _extends3['default'])({}, props, {
          prefixCls: prefixCls,
          progressStatus: progressStatus
        })
      };
      progress = h(
        _circle2['default'],
        circleProps,
        [progressInfo]
      );
    }

    var classString = (0, _classnames2['default'])(prefixCls, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-' + (type === 'dashboard' && 'circle' || type), true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-status-' + progressStatus, true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-show-info', showInfo), (0, _defineProperty3['default'])(_classNames, prefixCls + '-' + size, size), _classNames));

    var progressProps = {
      props: (0, _extends3['default'])({}, restProps),
      on: this.$listeners,
      'class': classString
    };
    return h(
      'div',
      progressProps,
      [progress]
    );
  }
};