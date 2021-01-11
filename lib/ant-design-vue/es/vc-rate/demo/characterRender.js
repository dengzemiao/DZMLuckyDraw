import Rate from '../index';
import VcTooltip from '../../vc-tooltip/index';
import '../../vc-tooltip/assets/bootstrap_white.less';
import '../assets/index.less';

export default {
  data: function data() {
    return {};
  },
  render: function render() {
    var h = arguments[0];

    return h(
      'div',
      { style: 'margin: 100px' },
      [h(Rate, {
        attrs: {
          defaultValue: 3,
          characterRender: function characterRender(node, props) {
            // console.dir(node);
            // console.dir(props.index);
            return h(
              VcTooltip,
              {
                attrs: { placement: 'top', overlay: props.index }
              },
              [node]
            );
          }
        }
      })]
    );
  }
};