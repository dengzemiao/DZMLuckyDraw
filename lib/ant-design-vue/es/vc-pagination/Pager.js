import PropTypes from '../_util/vue-types';

export default {
  name: 'Pager',
  props: {
    rootPrefixCls: PropTypes.string,
    page: PropTypes.number,
    active: PropTypes.bool,
    last: PropTypes.bool,
    locale: PropTypes.object,
    showTitle: PropTypes.bool,
    itemRender: {
      type: Function,
      'default': function _default() {}
    }
  },
  computed: {
    classes: function classes() {
      var prefixCls = this.rootPrefixCls + '-item';
      var cls = prefixCls + ' ' + prefixCls + '-' + this.page;
      if (this.active) {
        cls = cls + ' ' + prefixCls + '-active';
      }
      return cls;
    }
  },
  methods: {
    handleClick: function handleClick() {
      this.$emit('click', this.page);
    },
    handleKeyPress: function handleKeyPress(event) {
      this.$emit('keypress', event, this.handleClick, this.page);
    }
  },
  render: function render() {
    var h = arguments[0];
    var rootPrefixCls = this.rootPrefixCls,
        page = this.page,
        active = this.active;

    var prefixCls = rootPrefixCls + '-item';
    var cls = prefixCls + ' ' + prefixCls + '-' + page;

    if (active) {
      cls = cls + ' ' + prefixCls + '-active';
    }

    if (!page) {
      cls = cls + ' ' + prefixCls + '-disabled';
    }

    return h(
      'li',
      {
        'class': cls,
        on: {
          'click': this.handleClick,
          'keypress': this.handleKeyPress
        },
        attrs: {
          title: this.showTitle ? this.page : null,
          tabIndex: '0'
        }
      },
      [this.itemRender(this.page, 'page', h('a', [this.page]))]
    );
  }
};