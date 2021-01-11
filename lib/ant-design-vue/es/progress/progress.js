import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import { getOptionProps, initDefaultProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import Icon from '../icon';
import Line from './line';
import Circle from './circle';
import { validProgress } from './utils';

function addUnit(num, unit) {
  var unitType = unit || 'px';
  return num ? num + unitType : null;
}

export var ProgressType = PropTypes.oneOf(['line', 'circle', 'dashboard']);
export var ProgressSize = PropTypes.oneOf(['default', 'small']);

export var ProgressProps = {
  prefixCls: PropTypes.string,
  type: ProgressType,
  percent: PropTypes.number,
  successPercent: PropTypes.number,
  format: PropTypes.func,
  status: PropTypes.oneOf(['normal', 'success', 'active', 'exception']),
  showInfo: PropTypes.bool,
  strokeWidth: PropTypes.number,
  strokeLinecap: PropTypes.oneOf(['round', 'square']),
  strokeColor: PropTypes.string,
  trailColor: PropTypes.string,
  width: PropTypes.number,
  gapDegree: PropTypes.number,
  gapPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  size: ProgressSize
};

export default {
  name: 'AProgress',
  props: initDefaultProps(ProgressProps, {
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
        return ConfigConsumerProps;
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
        text = textFormatter(validProgress(percent), validProgress(successPercent));
      } else if (progressStatus === 'exception') {
        text = h(Icon, {
          attrs: { type: 'close' + iconType, theme: type === 'line' ? 'filled' : 'outlined' }
        });
      } else if (progressStatus === 'success') {
        text = h(Icon, {
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

    var props = getOptionProps(this);

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
        restProps = _objectWithoutProperties(props, ['prefixCls', 'percent', 'status', 'format', 'trailColor', 'size', 'successPercent', 'type', 'strokeWidth', 'width', 'showInfo', 'gapDegree', 'gapPosition', 'strokeColor', 'strokeLinecap']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('progress', customizePrefixCls);

    var progressStatus = parseInt(successPercent !== undefined ? successPercent.toString() : percent.toString(), 10) >= 100 && !('status' in props) ? 'success' : status || 'normal';
    var progress = void 0;
    var progressInfo = this.renderProcessInfo(prefixCls, progressStatus);

    // Render progress shape
    if (type === 'line') {
      var lineProps = {
        props: _extends({}, props, {
          prefixCls: prefixCls
        })
      };
      progress = h(
        Line,
        lineProps,
        [progressInfo]
      );
    } else if (type === 'circle' || type === 'dashboard') {
      var circleProps = {
        props: _extends({}, props, {
          prefixCls: prefixCls,
          progressStatus: progressStatus
        })
      };
      progress = h(
        Circle,
        circleProps,
        [progressInfo]
      );
    }

    var classString = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-' + (type === 'dashboard' && 'circle' || type), true), _defineProperty(_classNames, prefixCls + '-status-' + progressStatus, true), _defineProperty(_classNames, prefixCls + '-show-info', showInfo), _defineProperty(_classNames, prefixCls + '-' + size, size), _classNames));

    var progressProps = {
      props: _extends({}, restProps),
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