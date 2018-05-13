'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PagedView = exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('./utils');

var _components = require('./components');

var _agentScrollView = require('./components/agent-scroll-view');

var _agentScrollView2 = _interopRequireDefault(_agentScrollView);

var _pagedView = require('./components/paged-view');

var _pagedView2 = _interopRequireDefault(_pagedView);

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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ScrollPagedView.__proto__ || Object.getPrototypeOf(ScrollPagedView)).call.apply(_ref, [this].concat(args))), _this), _this.onPageChange = function (index, oldIndex) {
      var onPageChange = _this.props.onPageChange;

      if (onPageChange) onPageChange(index);

      _this.currentPage = index;
      // 肯定处于边界位置,多此一举设置
      _this.isBorder = true;
      _this.borderDirection = oldIndex > index ? 'isBottom' : 'isTop';
      _this.isChange = true;

      _this.setResponder(true);
    }, _this.setResponder = function (flag, callBack) {
      if (_utils.isAndroid) {
        if (_this.currentRef) {
          _this.currentRef.setScrollEnabled(!flag);
          // currentRef.setNativeProps({
          //   scrollEnabled: !flag,
          // })
          // callBack && callBack(currentRef)
        }
      }

      _this.isResponder = flag;

      // ios单独处理阻止外层scrollView滑动
      if (_utils.isIOS) {
        var setResponder = _this.props.setResponder;

        setResponder && setResponder(flag);
      }
    }, _this._onContentSizeChange = function (oldSize, newSize) {
      // 修复高度变化后边界已判断操作,只有第一页需要判断
      if (!(0, _utils.isEmpty)(oldSize)) {
        var _this2 = _this,
            currentPage = _this2.currentPage,
            isResponder = _this2.isResponder;

        if (currentPage === 0 && isResponder && newSize.height > oldSize.height) {
          _this.isBorder = false;
          _this.borderDirection = false;
          _this.setResponder(false);
        }
      }
    }, _this._onTouchStart = function (_ref2, _ref3) {
      var nativeEvent = _ref2.nativeEvent;
      var scrollViewRef = _ref3.scrollViewRef;
      var pageX = nativeEvent.pageX,
          pageY = nativeEvent.pageY,
          timestamp = nativeEvent.timestamp;

      _this.startX = pageX;
      _this.startY = pageY;
      _this.startTimestamp = timestamp;
      _this.currentRef = scrollViewRef;
      _this.setResponder(false);
    }, _this._onScrollEndDrag = function (event) {
      // if (isAndroid && this.androidMove) {
      //   this.androidMove = false
      // const currentRef = this.getScrollViewConfig('scrollViewRef')

      // this._startTime = Date.now()
      // this._onUpdate(this._fromValue, (y) => {
      //   currentRef.scrollTo({ x: 0, y, animated: false })
      // })
      // }

      _this._onMomentumScrollEnd(event);
    }, _this._onMomentumScrollEnd = function (_ref4) {
      var nativeEvent = _ref4.nativeEvent;

      if (!_this.isChange) {
        var y = nativeEvent.contentOffset.y,
            maxHeight = nativeEvent.contentSize.height,
            height = nativeEvent.layoutMeasurement.height;

        var isTop = parseFloat(y) <= 0;
        var isBottom = parseFloat((0, _utils.accAdd)(y, height).toFixed(2)) >= parseFloat(maxHeight.toFixed(2));
        _this.borderDirection = isTop ? 'isTop' : isBottom ? 'isBottom' : false;
        _this.isBorder = _this.triggerJudge(isTop, isBottom);
      }
    }, _this._onTouchMove = function (_ref5, _ref6) {
      var nativeEvent = _ref5.nativeEvent;
      var scrollViewSize = _ref6.scrollViewSize,
          scrollViewLayout = _ref6.scrollViewLayout;
      var pageX = nativeEvent.pageX,
          pageY = nativeEvent.pageY;
      var _this3 = _this,
          startX = _this3.startX,
          startY = _this3.startY;


      _this.isChange = false;
      if (Math.abs(pageY - startY) > Math.abs(pageX - startX)) {
        var hasScrollContent = scrollViewSize.height > scrollViewLayout.height;

        if (hasScrollContent) {
          if (_this.isBorder) {
            var distance = pageY - startY;
            // 大于1.6为了防抖
            if (distance !== 0 && Math.abs(distance) > 1.6) {
              var direction = distance > 0; // 向上
              // console.log(this.borderDirection, direction, pageY, startY, distance)

              if (_this.triggerJudge(direction, !direction)) {
                _this.setResponder(true);
              } else {
                _this.isBorder = false;
                _this.borderDirection = false;
                _this.setResponder(false);
                //  (ref) => {
                // android手动修复边界反向滚动
                // if (isAndroid) {
                //   const { timestamp } = nativeEvent
                //   this.androidMove = true
                //   const currentSize = this.getScrollViewConfig('scrollViewSize')
                //   const currentLayout = this.getScrollViewConfig('scrollViewLayout')
                //   const currentRef = ref || this.getScrollViewConfig('scrollViewRef')
                //   const maxHeight = currentSize.height - currentLayout.height
                //   let y = distance
                //   if (direction) {
                //     y = maxHeight - distance
                //   }
                //   this._velocity = Math.abs(distance) / (timestamp - this.startTimestamp)
                //   y = Math.abs(y)
                //   this._fromValue = y

                //   currentRef.scrollTo({ x: 0, y, animated: false })
                // }
                // })
              }
            }
          }
        } else {
          _this.setResponder(true);
        }
      }
    }, _this.ScrollViewMonitor = function (_ref7) {
      var children = _ref7.children,
          _ref7$webProps = _ref7.webProps,
          webProps = _ref7$webProps === undefined ? {} : _ref7$webProps;

      var mergeProps = (0, _utils.getMergeProps)({
        onContentSizeChange: _this._onContentSizeChange,
        onMomentumScrollEnd: _this._onMomentumScrollEnd,
        onScrollEndDrag: _this._onScrollEndDrag,
        onTouchStart: _this._onTouchStart,
        onTouchMove: _this._onTouchMove,
        onTouchEnd: _this._onTouchEnd,
        showsVerticalScrollIndicator: false,
        bounces: false,
        style: { flex: 1 }
      }, webProps);

      return _react2.default.createElement(
        _agentScrollView2.default,
        mergeProps,
        children
      );
    }, _this._startResponder = function () {
      return false;
    }, _this._moveResponder = function () {
      return _this.isResponder;
    }, _this._startResponderCapture = function () {
      return false;
    }, _this._moveResponderCapture = function () {
      return _this.isResponder;
    }, _this._onPanResponderTerminationRequest = function () {
      return !_this.isResponder;
    }, _this._onPanResponderTerminate = function () {
      if (_this.isResponder) {
        _this.setResponder(false);

        _this.isTerminate = true;
      } else {
        _this.isTerminate = false;
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  // 暂未观测出设置的先后顺序影响


  // _onTouchEnd = () => {
  //   if (isAndroid && this.androidMove) {
  //     const currentRef = this.getScrollViewConfig('scrollViewRef')
  //     this._startTime = Date.now()
  //     this.onUpdate(this._fromValue, (y) => {
  //       console.log(y)
  //       currentRef.scrollTo({ x: 0, y, animated: false })
  //     })

  //     this.androidMove = false
  //   }
  // }

  // 子元素调用一定要传入index值来索引对应数据,且最好执行懒加载


  // android


  _createClass(ScrollPagedView, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _pagedView2.default,
        {
          onStartShouldSetPanResponder: this._startResponder,
          onMoveShouldSetPanResponder: this._moveResponder,
          onStartShouldSetPanResponderCapture: this._startResponderCapture,
          onMoveShouldSetPanResponderCapture: this._moveResponderCapture,
          onPanResponderTerminationRequest: this._onPanResponderTerminationRequest
          // onPanResponderTerminate={this._onPanResponderTerminate}

          , onPageChange: this.onPageChange,
          animationDuration: 400,
          blurredZoom: 1,
          blurredOpacity: 1,
          vertical: true
        },
        this.childrenList
      );
    }
  }]);

  return ScrollPagedView;
}(_react.Component), _class2.propTypes = {
  onPageChange: _propTypes2.default.func,
  setResponder: _propTypes2.default.func
}, _class2.defaultProps = {
  onPageChange: function onPageChange() {},
  setResponder: function setResponder() {}
}, _temp2)) || _class;

exports.default = ScrollPagedView;
exports.PagedView = _pagedView2.default;