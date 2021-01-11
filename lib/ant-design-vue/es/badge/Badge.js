import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _typeof from 'babel-runtime/helpers/typeof';
import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import ScrollNumber from './ScrollNumber';
import classNames from 'classnames';
import { initDefaultProps, filterEmpty, getComponentFromProp } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import getTransitionProps from '../_util/getTransitionProps';
import isNumeric from '../_util/isNumeric';
import { ConfigConsumerProps } from '../config-provider';

export var BadgeProps = {
  /** Number to show in badge */
  count: PropTypes.any,
  showZero: PropTypes.bool,
  /** Max count to show */
  overflowCount: PropTypes.number,
  /** whether to show red dot without number */
  dot: PropTypes.bool,
  prefixCls: PropTypes.string,
  scrollNumberPrefixCls: PropTypes.string,
  status: PropTypes.oneOf(['success', 'processing', 'default', 'error', 'warning']),
  text: PropTypes.string,
  offset: PropTypes.array,
  numberStyle: PropTypes.object.def({}),
  title: PropTypes.string
};

export default {
  name: 'ABadge',
  props: initDefaultProps(BadgeProps, {
    showZero: false,
    dot: false,
    overflowCount: 99
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  methods: {
    getBadgeClassName: function getBadgeClassName(prefixCls) {
      var _classNames;

      var status = this.$props.status;

      var children = filterEmpty(this.$slots['default']);
      return classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-status', !!status), _defineProperty(_classNames, prefixCls + '-not-a-wrapper', !children.length), _classNames));
    },
    isZero: function isZero() {
      var numberedDispayCount = this.getNumberedDispayCount();
      return numberedDispayCount === '0' || numberedDispayCount === 0;
    },
    isDot: function isDot() {
      var _$props = this.$props,
          dot = _$props.dot,
          status = _$props.status;

      var isZero = this.isZero();
      return dot && !isZero || status;
    },
    isHidden: function isHidden() {
      var showZero = this.$props.showZero;

      var displayCount = this.getDispayCount();
      var isZero = this.isZero();
      var isDot = this.isDot();
      var isEmpty = displayCount === null || displayCount === undefined || displayCount === '';
      return (isEmpty || isZero && !showZero) && !isDot;
    },
    getNumberedDispayCount: function getNumberedDispayCount() {
      var overflowCount = this.$props.overflowCount;

      var count = this.badgeCount;
      var displayCount = count > overflowCount ? overflowCount + '+' : count;
      return displayCount;
    },
    getDispayCount: function getDispayCount() {
      var isDot = this.isDot();
      // dot mode don't need count
      if (isDot) {
        return '';
      }
      return this.getNumberedDispayCount();
    },
    getScrollNumberTitle: function getScrollNumberTitle() {
      var title = this.$props.title;

      var count = this.badgeCount;
      if (title) {
        return title;
      }
      return typeof count === 'string' || typeof count === 'number' ? count : undefined;
    },
    getStyleWithOffset: function getStyleWithOffset() {
      var _$props2 = this.$props,
          offset = _$props2.offset,
          numberStyle = _$props2.numberStyle;

      return offset ? _extends({
        right: -parseInt(offset[0], 10) + 'px',
        marginTop: isNumeric(offset[1]) ? offset[1] + 'px' : offset[1]
      }, numberStyle) : numberStyle;
    },
    renderStatusText: function renderStatusText(prefixCls) {
      var h = this.$createElement;
      var text = this.$props.text;

      var hidden = this.isHidden();
      return hidden || !text ? null : h(
        'span',
        { 'class': prefixCls + '-status-text' },
        [text]
      );
    },
    renderDispayComponent: function renderDispayComponent() {
      var count = this.badgeCount;
      var customNode = count;
      if (!customNode || (typeof customNode === 'undefined' ? 'undefined' : _typeof(customNode)) !== 'object') {
        return undefined;
      }
      return cloneElement(customNode, {
        style: this.getStyleWithOffset()
      });
    },
    renderBadgeNumber: function renderBadgeNumber(prefixCls, scrollNumberPrefixCls) {
      var _scrollNumberCls;

      var h = this.$createElement;
      var status = this.$props.status;

      var count = this.badgeCount;
      var displayCount = this.getDispayCount();
      var isDot = this.isDot();
      var hidden = this.isHidden();

      var scrollNumberCls = (_scrollNumberCls = {}, _defineProperty(_scrollNumberCls, prefixCls + '-dot', isDot), _defineProperty(_scrollNumberCls, prefixCls + '-count', !isDot), _defineProperty(_scrollNumberCls, prefixCls + '-multiple-words', !isDot && count && count.toString && count.toString().length > 1), _defineProperty(_scrollNumberCls, prefixCls + '-status-' + status, !!status), _scrollNumberCls);

      return hidden ? null : h(ScrollNumber, {
        attrs: {
          prefixCls: scrollNumberPrefixCls,
          'data-show': !hidden,

          className: scrollNumberCls,
          count: displayCount,
          displayComponent: this.renderDispayComponent() // <Badge status="success" count={<Icon type="xxx" />}></Badge>
          , title: this.getScrollNumberTitle()
        },
        directives: [{
          name: 'show',
          value: !hidden
        }],
        style: this.getStyleWithOffset(),
        key: 'scrollNumber'
      });
    }
  },

  render: function render() {
    var _classNames2;

    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        customizeScrollNumberPrefixCls = this.scrollNumberPrefixCls,
        status = this.status,
        text = this.text,
        $slots = this.$slots;


    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('badge', customizePrefixCls);
    var scrollNumberPrefixCls = getPrefixCls('scroll-number', customizeScrollNumberPrefixCls);

    var children = filterEmpty($slots['default']);
    var count = getComponentFromProp(this, 'count');
    if (Array.isArray(count)) {
      count = count[0];
    }
    this.badgeCount = count;
    var scrollNumber = this.renderBadgeNumber(prefixCls, scrollNumberPrefixCls);
    var statusText = this.renderStatusText(prefixCls);
    var statusCls = classNames((_classNames2 = {}, _defineProperty(_classNames2, prefixCls + '-status-dot', !!status), _defineProperty(_classNames2, prefixCls + '-status-' + status, !!status), _classNames2));

    // <Badge status="success" />
    if (!children.length && status) {
      return h(
        'span',
        _mergeJSXProps([{ on: this.$listeners }, {
          'class': this.getBadgeClassName(prefixCls),
          style: this.getStyleWithOffset()
        }]),
        [h('span', { 'class': statusCls }), h(
          'span',
          { 'class': prefixCls + '-status-text' },
          [text]
        )]
      );
    }

    var transitionProps = getTransitionProps(children.length ? prefixCls + '-zoom' : '');

    return h(
      'span',
      _mergeJSXProps([{ on: this.$listeners }, { 'class': this.getBadgeClassName(prefixCls) }]),
      [children, h(
        'transition',
        transitionProps,
        [scrollNumber]
      ), statusText]
    );
  }
};