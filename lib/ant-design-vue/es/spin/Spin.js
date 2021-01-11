import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import debounce from 'lodash/debounce';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { filterEmpty, initDefaultProps, isValidElement, getComponentFromProp } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { ConfigConsumerProps } from '../config-provider';

export var SpinSize = PropTypes.oneOf(['small', 'default', 'large']);

export var SpinProps = function SpinProps() {
  return {
    prefixCls: PropTypes.string,
    spinning: PropTypes.bool,
    size: SpinSize,
    wrapperClassName: PropTypes.string,
    tip: PropTypes.string,
    delay: PropTypes.number,
    indicator: PropTypes.any
  };
};

// Render indicator
var defaultIndicator = void 0;

function shouldDelay(spinning, delay) {
  return !!spinning && !!delay && !isNaN(Number(delay));
}

export function setDefaultIndicator(content) {
  defaultIndicator = typeof content.indicator === 'function' ? content.indicator : function (h) {
    return h(content.indicator);
  };
}

export default {
  name: 'ASpin',
  mixins: [BaseMixin],
  props: initDefaultProps(SpinProps(), {
    size: 'default',
    spinning: true,
    wrapperClassName: ''
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    var spinning = this.spinning,
        delay = this.delay;

    var shouldBeDelayed = shouldDelay(spinning, delay);
    this.originalUpdateSpinning = this.updateSpinning;
    this.debouncifyUpdateSpinning(this.$props);
    return {
      sSpinning: spinning && !shouldBeDelayed
    };
  },
  mounted: function mounted() {
    this.updateSpinning();
  },
  updated: function updated() {
    var _this = this;

    this.$nextTick(function () {
      _this.debouncifyUpdateSpinning();
      _this.updateSpinning();
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.updateSpinning && this.updateSpinning.cancel) {
      this.updateSpinning.cancel();
    }
  },

  methods: {
    debouncifyUpdateSpinning: function debouncifyUpdateSpinning(props) {
      var _ref = props || this.$props,
          delay = _ref.delay;

      if (delay) {
        this.updateSpinning = debounce(this.originalUpdateSpinning, delay);
      }
    },
    updateSpinning: function updateSpinning() {
      var spinning = this.spinning,
          sSpinning = this.sSpinning;

      if (sSpinning !== spinning) {
        this.setState({ sSpinning: spinning });
      }
    },
    getChildren: function getChildren() {
      if (this.$slots && this.$slots['default']) {
        return filterEmpty(this.$slots['default']);
      }
      return null;
    },
    renderIndicator: function renderIndicator(h, prefixCls) {
      // const h = this.$createElement
      var dotClassName = prefixCls + '-dot';
      var indicator = getComponentFromProp(this, 'indicator');
      if (Array.isArray(indicator)) {
        indicator = filterEmpty(indicator);
        indicator = indicator.length === 1 ? indicator[0] : indicator;
      }
      if (isValidElement(indicator)) {
        return cloneElement(indicator, { 'class': dotClassName });
      }

      if (defaultIndicator && isValidElement(defaultIndicator(h))) {
        return cloneElement(defaultIndicator(h), { 'class': dotClassName });
      }

      return h(
        'span',
        { 'class': dotClassName + ' ' + prefixCls + '-dot-spin' },
        [h('i'), h('i'), h('i'), h('i')]
      );
    }
  },
  render: function render(h) {
    var _spinClassName;

    var _$props = this.$props,
        size = _$props.size,
        customizePrefixCls = _$props.prefixCls,
        tip = _$props.tip,
        wrapperClassName = _$props.wrapperClassName,
        restProps = _objectWithoutProperties(_$props, ['size', 'prefixCls', 'tip', 'wrapperClassName']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('spin', customizePrefixCls);

    var sSpinning = this.sSpinning;

    var spinClassName = (_spinClassName = {}, _defineProperty(_spinClassName, prefixCls, true), _defineProperty(_spinClassName, prefixCls + '-sm', size === 'small'), _defineProperty(_spinClassName, prefixCls + '-lg', size === 'large'), _defineProperty(_spinClassName, prefixCls + '-spinning', sSpinning), _defineProperty(_spinClassName, prefixCls + '-show-text', !!tip), _spinClassName);

    var spinElement = h(
      'div',
      _mergeJSXProps([restProps, { 'class': spinClassName }]),
      [this.renderIndicator(h, prefixCls), tip ? h(
        'div',
        { 'class': prefixCls + '-text' },
        [tip]
      ) : null]
    );
    var children = this.getChildren();
    if (children) {
      var _containerClassName;

      var containerClassName = (_containerClassName = {}, _defineProperty(_containerClassName, prefixCls + '-container', true), _defineProperty(_containerClassName, prefixCls + '-blur', sSpinning), _containerClassName);

      return h(
        'div',
        _mergeJSXProps([{ on: this.$listeners }, { 'class': [prefixCls + '-nested-loading', wrapperClassName] }]),
        [sSpinning && h(
          'div',
          { key: 'loading' },
          [spinElement]
        ), h(
          'div',
          { 'class': containerClassName, key: 'container' },
          [children]
        )]
      );
    }
    return spinElement;
  }
};