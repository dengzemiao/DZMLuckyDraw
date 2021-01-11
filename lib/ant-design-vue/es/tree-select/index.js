import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import VcTreeSelect, { TreeNode, SHOW_ALL, SHOW_PARENT, SHOW_CHILD } from '../vc-tree-select';
import classNames from 'classnames';
import { TreeSelectProps } from './interface';
import warning from '../_util/warning';
import { initDefaultProps, getOptionProps, getComponentFromProp, filterEmpty, isValidElement } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';
import Base from '../base';

export { TreeData, TreeSelectProps } from './interface';
import Icon from '../icon';
import omit from 'omit.js';
import { cloneElement } from '../_util/vnode';

var TreeSelect = {
  TreeNode: _extends({}, TreeNode, { name: 'ATreeSelectNode' }),
  SHOW_ALL: SHOW_ALL,
  SHOW_PARENT: SHOW_PARENT,
  SHOW_CHILD: SHOW_CHILD,
  name: 'ATreeSelect',
  props: initDefaultProps(TreeSelectProps(), {
    transitionName: 'slide-up',
    choiceTransitionName: 'zoom',
    showSearch: false
  }),
  model: {
    prop: 'value',
    event: 'change'
  },
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  created: function created() {
    warning(this.multiple !== false || !this.treeCheckable, '`multiple` will alway be `true` when `treeCheckable` is true');
  },

  methods: {
    focus: function focus() {
      this.$refs.vcTreeSelect.focus();
    },
    blur: function blur() {
      this.$refs.vcTreeSelect.blur();
    },
    renderSwitcherIcon: function renderSwitcherIcon(prefixCls, _ref) {
      var isLeaf = _ref.isLeaf,
          loading = _ref.loading;
      var h = this.$createElement;

      if (loading) {
        return h(Icon, {
          attrs: { type: 'loading' },
          'class': prefixCls + '-switcher-loading-icon' });
      }
      if (isLeaf) {
        return null;
      }
      return h(Icon, {
        attrs: { type: 'caret-down' },
        'class': prefixCls + '-switcher-icon' });
    },
    onChange: function onChange() {
      this.$emit.apply(this, ['change'].concat(Array.prototype.slice.call(arguments)));
    },
    updateTreeData: function updateTreeData(treeData) {
      var _this = this;

      var $scopedSlots = this.$scopedSlots;

      return treeData.map(function (item) {
        var label = item.label,
            title = item.title,
            _item$scopedSlots = item.scopedSlots,
            scopedSlots = _item$scopedSlots === undefined ? {} : _item$scopedSlots,
            children = item.children;

        var newLabel = typeof label === 'function' ? label(_this.$createElement) : label;
        var newTitle = typeof title === 'function' ? title(_this.$createElement) : title;
        if (!newLabel && scopedSlots.label && $scopedSlots[scopedSlots.label]) {
          newLabel = $scopedSlots.label(item);
        }
        if (!newTitle && scopedSlots.title && $scopedSlots[scopedSlots.title]) {
          newTitle = $scopedSlots.title(item);
        }
        var treeNodeProps = _extends({}, item, {
          title: newTitle || newLabel,
          dataRef: item
        });
        if (children) {
          return _extends({}, treeNodeProps, { children: _this.updateTreeData(children) });
        }
        return treeNodeProps;
      });
    }
  },

  render: function render(h) {
    var _cls,
        _this2 = this;

    var props = getOptionProps(this);

    var customizePrefixCls = props.prefixCls,
        size = props.size,
        dropdownStyle = props.dropdownStyle,
        dropdownClassName = props.dropdownClassName,
        getPopupContainer = props.getPopupContainer,
        restProps = _objectWithoutProperties(props, ['prefixCls', 'size', 'dropdownStyle', 'dropdownClassName', 'getPopupContainer']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('select', customizePrefixCls);

    var renderEmpty = this.configProvider.renderEmpty;
    var notFoundContent = getComponentFromProp(this, 'notFoundContent');
    var getContextPopupContainer = this.configProvider.getPopupContainer;

    var rest = omit(restProps, ['inputIcon', 'removeIcon', 'clearIcon', 'switcherIcon', 'suffixIcon']);
    var suffixIcon = getComponentFromProp(this, 'suffixIcon');
    suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
    var treeData = props.treeData;
    if (treeData) {
      treeData = this.updateTreeData(treeData);
    }
    var cls = (_cls = {}, _defineProperty(_cls, prefixCls + '-lg', size === 'large'), _defineProperty(_cls, prefixCls + '-sm', size === 'small'), _cls);

    var checkable = getComponentFromProp(this, 'treeCheckable');
    if (checkable) {
      checkable = h('span', { 'class': prefixCls + '-tree-checkbox-inner' });
    }

    var inputIcon = suffixIcon && (isValidElement(suffixIcon) ? cloneElement(suffixIcon) : suffixIcon) || h(Icon, {
      attrs: { type: 'down' },
      'class': prefixCls + '-arrow-icon' });

    var removeIcon = h(Icon, {
      attrs: { type: 'close' },
      'class': prefixCls + '-remove-icon' });

    var clearIcon = h(Icon, {
      attrs: { type: 'close-circle', theme: 'filled' },
      'class': prefixCls + '-clear-icon' });
    var VcTreeSelectProps = {
      props: _extends(_extends({
        switcherIcon: function switcherIcon(nodeProps) {
          return _this2.renderSwitcherIcon(prefixCls, nodeProps);
        },
        inputIcon: inputIcon,
        removeIcon: removeIcon,
        clearIcon: clearIcon
      }, rest, {
        getPopupContainer: getPopupContainer || getContextPopupContainer,
        dropdownClassName: classNames(dropdownClassName, prefixCls + '-tree-dropdown'),
        prefixCls: prefixCls,
        dropdownStyle: _extends({ maxHeight: '100vh', overflow: 'auto' }, dropdownStyle),
        treeCheckable: checkable,
        notFoundContent: notFoundContent || renderEmpty(h, 'Select'),
        __propsSymbol__: Symbol()
      }), treeData ? { treeData: treeData } : {}),
      'class': cls,
      on: _extends({}, this.$listeners, { change: this.onChange }),
      ref: 'vcTreeSelect',
      scopedSlots: this.$scopedSlots
    };
    return h(
      VcTreeSelect,
      VcTreeSelectProps,
      [filterEmpty(this.$slots['default'])]
    );
  }
};

/* istanbul ignore next */
TreeSelect.install = function (Vue) {
  Vue.use(Base);
  Vue.component(TreeSelect.name, TreeSelect);
  Vue.component(TreeSelect.TreeNode.name, TreeSelect.TreeNode);
};

export default TreeSelect;