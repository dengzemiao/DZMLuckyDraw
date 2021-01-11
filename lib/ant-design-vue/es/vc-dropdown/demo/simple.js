import Menu, { Item as MenuItem, Divider } from '../../vc-menu/index';
import Dropdown from '../src/index.js';
import '../assets/index.less';

export default {
  data: function data() {
    return {};
  },

  methods: {
    onSelect: function onSelect(_ref) {
      var key = _ref.key;

      console.log(key + ' selected');
    },
    onVisibleChange: function onVisibleChange(visible) {
      console.log(visible);
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(
      'div',
      { style: 'margin: 100px' },
      [h('div', { style: 'height: 100px' }), h('div', [h(
        Dropdown,
        {
          attrs: { trigger: ['click'], animation: 'slide-up' },
          on: {
            'visibleChange': this.onVisibleChange
          }
        },
        [h(
          Menu,
          { slot: 'overlay', on: {
              'select': this.onSelect
            }
          },
          [h(
            MenuItem,
            {
              attrs: { disabled: true }
            },
            ['disabled']
          ), h(
            MenuItem,
            { key: '1' },
            ['one']
          ), h(Divider), h(
            MenuItem,
            { key: '2' },
            ['two']
          )]
        ), h(
          'button',
          { style: 'width: 100px' },
          ['open']
        )]
      )])]
    );
  }
};