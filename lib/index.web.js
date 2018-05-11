'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollableTabView = exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('./utils');

var _components = require('./components');

var _scrollableTabView = require('./components/scrollable-tab-view');

var _scrollableTabView2 = _interopRequireDefault(_scrollableTabView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScrollPagedView = (0, _components.ScrollPagedHOC)(_class = (_temp = _class2 = function (_Component) {
  _inherits(ScrollPagedView, _Component);

  function ScrollPagedView(props) {
    _classCallCheck(this, ScrollPagedView);

    var _this = _possibleConstructorReturn(this, (ScrollPagedView.__proto__ || Object.getPrototypeOf(ScrollPagedView)).call(this, props));

    _this.onChange = function (index, oldIndex) {
      var onPageChange = _this.props.onPageChange;

      if (onPageChange) onPageChange(index);

      _this.currentPage = index;
      // 肯定处于边界位置,多此一举设置
      _this.isBorder = true;
      _this.borderDirection = oldIndex > index ? 'isBottom' : 'isTop';
      _this.isResponder = false;
    };

    _this._onTouchStart = function (e) {
      var targetTouches = e.targetTouches;

      var _ref = targetTouches[0] || {},
          clientX = _ref.clientX,
          clientY = _ref.clientY;

      _this.startX = clientX;
      _this.startY = clientY;

      _this.isEnd = false;
    };

    _this._onTouchEnd = function (e) {
      if (!_this.isResponder) {
        e.stopPropagation();
        _this.isEnd = true;
        _this._onScroll(e);
      }
    };

    _this._onScroll = function (e) {
      if (_this.isEnd && !_this.isBorder) {
        if (_this.checkIsBorder(e)) {
          _this.isEnd = false;
        }
      }
    };

    _this.checkIsBorder = function (e) {
      var _e$currentTarget = e.currentTarget,
          scrollHeight = _e$currentTarget.scrollHeight,
          scrollTop = _e$currentTarget.scrollTop,
          clientHeight = _e$currentTarget.clientHeight;

      var isTop = parseFloat(scrollTop) <= 0;
      var isBottom = parseFloat((0, _utils.accAdd)(scrollTop, clientHeight).toFixed(2)) >= parseFloat(scrollHeight.toFixed(2));
      _this.borderDirection = isTop ? 'isTop' : isBottom ? 'isBottom' : false;
      _this.isBorder = _this.triggerJudge(isTop, isBottom);
      return _this.isBorder;
    };

    _this._onTouchMove = function (e) {
      var targetTouches = e.targetTouches;

      var _ref2 = targetTouches[0] || {},
          clientX = _ref2.clientX,
          clientY = _ref2.clientY;

      var _e$currentTarget2 = e.currentTarget,
          scrollHeight = _e$currentTarget2.scrollHeight,
          clientHeight = _e$currentTarget2.clientHeight;
      var startY = _this.startY,
          startX = _this.startX;

      if (Math.abs(clientY - startY) > Math.abs(clientX - startX)) {
        var hasScrollContent = parseFloat(scrollHeight.toFixed(2)) > parseFloat(clientHeight.toFixed(2));
        if (hasScrollContent) {
          // 滚动时再此校验是否到达边界，此举防止滚动之外的元素触发change事件使得this.isBorder置为true
          if (_this.isBorder) _this.checkIsBorder(e);

          if (_this.isBorder) {
            var distance = clientY - startY;
            if (distance !== 0) {
              var direction = distance > 0; // 向上
              if (_this.triggerJudge(direction, !direction)) {
                _this.isResponder = true;
              } else {
                _this.isBorder = false;
                _this.borderDirection = false;
                _this.isResponder = false;
              }
            }
          }
        } else {
          _this.isResponder = true;
        }
      }

      if (!_this.isResponder) {
        e.stopPropagation();
      } else {
        e.preventDefault();
      }
    };

    _this.ScrollViewMonitor = function (_ref3) {
      var children = _ref3.children,
          _ref3$webProps = _ref3.webProps,
          webProps = _ref3$webProps === undefined ? {} : _ref3$webProps;

      var mergeProps = getMergeProps(_this.scrollViewProps, webProps);

      return _react2.default.createElement(
        'div',
        mergeProps,
        children
      );
    };

    _this.scrollViewProps = {
      onTouchStart: _this._onTouchStart,
      onTouchMove: _this._onTouchMove,
      onTouchEnd: _this._onTouchEnd,
      onScroll: _this._onScroll,
      style: {
        flex: 1,
        overflow: 'scroll',
        position: 'relative'
      }
    };
    return _this;
  }

  // 子元素调用一定要传入index值来索引对应数据,且最好执行懒加载


  _createClass(ScrollPagedView, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          _props$height = _props.height,
          height = _props$height === undefined ? '100%' : _props$height,
          _props$width = _props.width,
          width = _props$width === undefined ? '100%' : _props$width;


      return _react2.default.createElement(
        'div',
        { style: { display: 'flex', flex: 1, height: height, width: width } },
        _react2.default.createElement(
          _scrollableTabView2.default,
          {
            onChange: this.onChange,
            vertical: true
          },
          this.childrenList
        )
      );
    }
  }]);

  return ScrollPagedView;
}(_react.Component), _class2.propTypes = {
  onPageChange: _propTypes2.default.func
}, _class2.defaultProps = {
  onPageChange: function onPageChange() {}
}, _temp)) || _class;

exports.default = ScrollPagedView;


var getMergeProps = function getMergeProps(originProps, mergeProps) {
  return (0, _utils.mergeWith)(originProps, mergeProps, function (originValue, mergeValue) {
    var type = {}.toString.call(mergeValue).slice(8, -1).toLowerCase();

    switch (type) {
      case 'array':
        return [].concat(_toConsumableArray(originValue), _toConsumableArray(mergeValue));
      case 'function':
        return function () {
          originValue.apply(undefined, arguments);mergeValue.apply(undefined, arguments);
        };
      default:
        return _extends({}, originValue, mergeValue);
    }
  });
};

exports.ScrollableTabView = _scrollableTabView2.default;