'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

var Line = {
  functional: true,
  render: function render(h, context) {
    var props = context.props,
        children = context.children;
    var prefixCls = props.prefixCls,
        percent = props.percent,
        successPercent = props.successPercent,
        strokeWidth = props.strokeWidth,
        size = props.size,
        strokeColor = props.strokeColor,
        strokeLinecap = props.strokeLinecap;

    var percentStyle = {
      width: (0, _utils.validProgress)(percent) + '%',
      height: strokeWidth || (size === 'small' ? '6px' : '8px'),
      background: strokeColor,
      borderRadius: strokeLinecap === 'square' ? 0 : '100px'
    };
    var successPercentStyle = {
      width: (0, _utils.validProgress)(successPercent) + '%',
      height: strokeWidth || (size === 'small' ? '6px' : '8px'),
      borderRadius: strokeLinecap === 'square' ? 0 : '100px'
    };
    var successSegment = successPercent !== undefined ? h('div', { 'class': prefixCls + '-success-bg', style: successPercentStyle }) : null;
    return h('div', [h(
      'div',
      { 'class': prefixCls + '-outer' },
      [h(
        'div',
        { 'class': prefixCls + '-inner' },
        [h('div', { 'class': prefixCls + '-bg', style: percentStyle }), successSegment]
      )]
    ), children]);
  }
};

exports['default'] = Line;