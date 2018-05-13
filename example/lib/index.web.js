'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollableTabView = exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('./utils');

var _components = require('./components');

var _scrollableTabView = require('./components/scrollable-tab-view');

var _scrollableTabView2 = _interopRequireDefault(_scrollableTabView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScrollPagedView = (0, _components.ScrollPagedHOC)(_class = (_temp2 = _class2 = function (_Component) {
  _inherits(ScrollPagedView, _Component);

  function ScrollPagedView() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ScrollPagedView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ScrollPagedView.__proto__ || Object.getPrototypeOf(ScrollPagedView)).call.apply(_ref, [this].concat(args))), _this), _this.onChange = function (index, oldIndex) {
      var onPageChange = _this.props.onPageChange;

      if (onPageChange) onPageChange(index);

      _this.currentPage = index;
      // 肯定处于边界位置,多此一举设置
      _this.isBorder = true;
      _this.borderDirection = oldIndex > index ? 'isBottom' : 'isTop';
      _this.isResponder = false;
    }, _this._onTouchStart = function (e) {
      var targetTouches = e.targetTouches;

      var _ref2 = targetTouches[0] || {},
          clientX = _ref2.clientX,
          clientY = _ref2.clientY;

      _this.startX = clientX;
      _this.startY = clientY;

      _this.isEnd = false;
    }, _this._onTouchEnd = function (e) {
      if (!_this.isResponder) {
        e.stopPropagation();
        _this.isEnd = true;
        _this._onScroll(e);
      }
    }, _this._onScroll = function (e) {
      if (_this.isEnd && !_this.isBorder) {
        if (_this.checkIsBorder(e)) {
          _this.isEnd = false;
        }
      }
    }, _this.checkIsBorder = function (e) {
      var _e$currentTarget = e.currentTarget,
          scrollHeight = _e$currentTarget.scrollHeight,
          scrollTop = _e$currentTarget.scrollTop,
          clientHeight = _e$currentTarget.clientHeight;

      var isTop = parseFloat(scrollTop) <= 0;
      var isBottom = parseFloat((0, _utils.accAdd)(scrollTop, clientHeight).toFixed(2)) >= parseFloat(scrollHeight.toFixed(2));
      _this.borderDirection = isTop ? 'isTop' : isBottom ? 'isBottom' : false;
      _this.isBorder = _this.triggerJudge(isTop, isBottom);
      return _this.isBorder;
    }, _this._onTouchMove = function (e) {
      var targetTouches = e.targetTouches;

      var _ref3 = targetTouches[0] || {},
          clientX = _ref3.clientX,
          clientY = _ref3.clientY;

      var _e$currentTarget2 = e.currentTarget,
          scrollHeight = _e$currentTarget2.scrollHeight,
          clientHeight = _e$currentTarget2.clientHeight;
      var _this2 = _this,
          startY = _this2.startY,
          startX = _this2.startX;

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
    }, _this.ScrollViewMonitor = function (_ref4) {
      var children = _ref4.children,
          _ref4$webProps = _ref4.webProps,
          webProps = _ref4$webProps === undefined ? {} : _ref4$webProps;

      var mergeProps = (0, _utils.getMergeProps)({
        onTouchStart: _this._onTouchStart,
        onTouchMove: _this._onTouchMove,
        onTouchEnd: _this._onTouchEnd,
        onScroll: _this._onScroll,
        style: {
          flex: 1,
          overflow: 'scroll',
          position: 'relative'
        }
      }, webProps);

      return _react2.default.createElement(
        'div',
        mergeProps,
        children
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  // 子元素调用一定要传入index值来索引对应数据,且最好执行懒加载


  _createClass(ScrollPagedView, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          height = _props.height,
          width = _props.width;


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
  onPageChange: _propTypes2.default.func,
  height: _propTypes2.default.string,
  width: _propTypes2.default.string
}, _class2.defaultProps = {
  onPageChange: function onPageChange() {},
  height: document.documentElement.clientHeight,
  width: document.documentElement.clientWidth
}, _temp2)) || _class;

exports.default = ScrollPagedView;
exports.ScrollableTabView = _scrollableTabView2.default;