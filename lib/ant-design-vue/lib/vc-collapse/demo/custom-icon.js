'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../assets/index.less');

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var text = '\n  A dog is a type of domesticated animal.\n  Known for its loyalty and faithfulness,\n  it can be found as a welcome guest in many households across the world.\n';

function random() {
  return parseInt(Math.random() * 10, 10) + 1;
}

var arrowPath = 'M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88' + '.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.' + '6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-0.7 5.' + '2-2L869 536.2c14.7-12.8 14.7-35.6 0-48.4z';

var Panel = _index2['default'].Panel;
exports['default'] = {
  data: function data() {
    return {
      time: random(),
      accordion: false,
      activeKey: ['4']
    };
  },

  methods: {
    onChange: function onChange(activeKey) {
      this.activeKey = activeKey;
    },
    getItems: function getItems() {
      var h = this.$createElement;

      var items = [];
      for (var i = 0, len = 3; i < len; i++) {
        var key = i + 1;
        items.push(h(
          Panel,
          {
            attrs: { header: 'This is panel header ' + key, disabled: i === 0 },
            key: String(key) },
          [h('p', [text.repeat(this.time)])]
        ));
      }
      items.push(h(
        Panel,
        {
          attrs: { header: 'This is panel header 4' },
          key: '4' },
        [h(
          _index2['default'],
          {
            attrs: { defaultActiveKey: '1', expandIcon: this.expandIcon }
          },
          [h(
            Panel,
            {
              attrs: { header: 'This is panel nest panel', id: 'header-test' },
              key: '1' },
            [h('p', [text])]
          )]
        )]
      ));

      items.push(h(
        Panel,
        {
          attrs: { header: 'This is panel header 5' },
          key: '5' },
        [h(
          _index2['default'],
          {
            attrs: { defaultActiveKey: '1' }
          },
          [h(
            Panel,
            {
              attrs: { header: 'This is panel nest panel', id: 'another-test' },
              key: '1' },
            [h('form', [h(
              'label',
              {
                attrs: { 'for': 'test' }
              },
              ['Name:\xA0']
            ), h('input', {
              attrs: { type: 'text', id: 'test' }
            })])]
          )]
        )]
      ));

      items.push(h(
        Panel,
        {
          attrs: { header: 'This is panel header 6', extra: h('span', ['Extra Node']) },
          key: '6' },
        [h('p', ['Panel with extra'])]
      ));

      return items;
    },
    setActivityKey: function setActivityKey() {
      this.activeKey = ['2'];
    },
    reRender: function reRender() {
      this.time = random();
    },
    toggle: function toggle() {
      this.accordion = !this.accordion;
    },
    expandIcon: function expandIcon(_ref) {
      var isActive = _ref.isActive;
      var h = this.$createElement;

      return h(
        'i',
        { style: { marginRight: '.5rem' } },
        [h(
          'svg',
          {
            attrs: {
              viewBox: '0 0 1024 1024',
              width: '1em',
              height: '1em',
              fill: 'currentColor'
            },
            style: {
              verticalAlign: '-.125em',
              transition: 'transform .2s',
              transform: 'rotate(' + (isActive ? 90 : 0) + 'deg)'
            }
          },
          [h('path', {
            attrs: { d: arrowPath, 'p-id': '5827' }
          })]
        )]
      );
    }
  },
  render: function render() {
    var h = arguments[0];

    var accordion = this.accordion;
    var btn = accordion ? 'Mode: accordion' : 'Mode: collapse';
    var activeKey = this.activeKey;
    return h(
      'div',
      { style: { margin: '20px', width: '400px' } },
      [h(
        'button',
        {
          on: {
            'click': this.reRender
          }
        },
        ['reRender']
      ), h(
        'button',
        {
          on: {
            'click': this.toggle
          }
        },
        [btn]
      ), h('br'), h('br'), h(
        'button',
        {
          on: {
            'click': this.setActivityKey
          }
        },
        ['active header 2']
      ), h('br'), h('br'), h(
        _index2['default'],
        {
          attrs: {
            accordion: accordion,

            activeKey: activeKey,
            expandIcon: this.expandIcon
          },
          on: {
            'change': this.onChange
          }
        },
        [this.getItems()]
      )]
    );
  }
};