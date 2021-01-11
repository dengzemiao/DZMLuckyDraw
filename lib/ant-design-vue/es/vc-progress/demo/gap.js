import { Circle } from '../index';
import '../assets/index.less';

var colorMap = ['#3FC7FA', '#85D262', '#FE8C6A'];
function getColor(index) {
  return colorMap[(index + colorMap.length) % colorMap.length];
}

export default {
  data: function data() {
    return {
      percent: 30,
      colorIndex: 0
    };
  },

  methods: {
    changeState: function changeState() {
      var value = parseInt(Math.random() * 100, 10);
      var colorIndex = parseInt(Math.random() * 3, 10);
      this.percent = value;
      this.colorIndex = colorIndex;
    }
  },
  render: function render() {
    var h = arguments[0];

    var circleContainerStyle = {
      width: '200px',
      height: '200px'
    };
    var percent = this.percent,
        colorIndex = this.colorIndex;

    var color = getColor(colorIndex);
    return h('div', [h('p', [h(
      'button',
      {
        on: {
          'click': this.changeState
        }
      },
      ['Change State [', percent, ']']
    )]), h(
      'div',
      { style: circleContainerStyle },
      [h(Circle, {
        attrs: {
          percent: this.percent,
          gapDegree: '70',
          gapPosition: 'bottom',
          strokeWidth: '6',
          strokeLinecap: 'square',
          strokeColor: this.color
        }
      })]
    ), h(
      'div',
      { style: circleContainerStyle },
      [h(Circle, {
        attrs: {
          percent: [percent / 3, percent / 3, percent / 3],
          gapDegree: '70',
          gapPosition: 'bottom',
          strokeWidth: '6',
          trailWidth: '6',
          strokeLinecap: 'round',
          strokeColor: [color, getColor(colorIndex + 1), getColor(colorIndex + 2)]
        }
      })]
    ), h(
      'div',
      { style: circleContainerStyle },
      [h(Circle, {
        attrs: {
          percent: this.percent,
          gapDegree: '70',
          gapPosition: 'left',
          strokeWidth: '6',
          strokeLinecap: 'square',
          strokeColor: this.color
        }
      })]
    ), h(
      'div',
      { style: circleContainerStyle },
      [h(Circle, {
        attrs: {
          percent: this.percent,
          gapDegree: '70',
          gapPosition: 'right',
          strokeWidth: '6',
          strokeLinecap: 'square',
          strokeColor: this.color
        }
      })]
    )]);
  }
};