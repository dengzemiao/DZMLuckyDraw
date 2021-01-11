import { validProgress } from './utils';

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
      width: validProgress(percent) + '%',
      height: strokeWidth || (size === 'small' ? '6px' : '8px'),
      background: strokeColor,
      borderRadius: strokeLinecap === 'square' ? 0 : '100px'
    };
    var successPercentStyle = {
      width: validProgress(successPercent) + '%',
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

export default Line;