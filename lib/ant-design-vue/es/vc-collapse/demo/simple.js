import '../assets/index.less';
import Collapse from '../index';

var text = '\n  A dog is a type of domesticated animal.\n  Known for its loyalty and faithfulness,\n  it can be found as a welcome guest in many households across the world.\n';

function random() {
  return parseInt(Math.random() * 10, 10) + 1;
}

var Panel = Collapse.Panel;

export default {
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
          Collapse,
          {
            attrs: { defaultActiveKey: '1' }
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
          Collapse,
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
        Collapse,
        {
          attrs: { accordion: accordion, activeKey: activeKey },
          on: {
            'change': this.onChange
          }
        },
        [this.getItems()]
      )]
    );
  }
};