'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNative = require('react-native');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PagedView = (_temp = _class = function (_Component) {
  _inherits(PagedView, _Component);

  function PagedView(props) {
    _classCallCheck(this, PagedView);

    var _this = _possibleConstructorReturn(this, (PagedView.__proto__ || Object.getPrototypeOf(PagedView)).call(this, props));

    _this.getViewStyle = function () {
      var vertical = _this.props.vertical,
          pos = _this.state.pos,
          _boxSize = _this._boxSize;

      var wrapStyle = {
        flex: 1,
        overflow: 'hidden'
      };
      var containerStyle = { flex: 1 };
      var boxStyle = {};
      var styleList = [wrapStyle, containerStyle, boxStyle];

      if (vertical) {
        var _setViewStyle = setViewStyle(styleList, [{ flexDirection: 'column' }, { top: pos, flexDirection: 'column' }, { height: _boxSize }]);

        var _setViewStyle2 = _slicedToArray(_setViewStyle, 3);

        wrapStyle = _setViewStyle2[0];
        containerStyle = _setViewStyle2[1];
        boxStyle = _setViewStyle2[2];
      } else {
        var _setViewStyle3 = setViewStyle(styleList, [{ flexDirection: 'row' }, { left: pos, flexDirection: 'row' }, { width: _boxSize }]);

        var _setViewStyle4 = _slicedToArray(_setViewStyle3, 3);

        wrapStyle = _setViewStyle4[0];
        containerStyle = _setViewStyle4[1];
        boxStyle = _setViewStyle4[2];
      }

      return {
        wrapStyle: wrapStyle,
        containerStyle: containerStyle,
        boxStyle: boxStyle
      };
    };

    _this._onPanResponderMove = function (evt, gestureState) {
      var suffix = _this.props.vertical ? 'y' : 'x';
      var nextValue = _this._lastPos + gestureState['d' + suffix];

      // 加入回弹限制
      if (nextValue <= 0 && nextValue >= _this.maxPos) {
        _this.state.pos.setValue(nextValue);
      }
    };

    _this._onPanResponderRelease = function (evt, gestureState) {
      var suffix = _this.props.vertical ? 'y' : 'x';
      _this._lastPos += gestureState['d' + suffix];
      var page = _this._getPageForOffset(_this._lastPos, gestureState['d' + suffix]);
      _this.animateToPage(page);
    };

    var initialPage = props.initialPage;


    _this.state = {
      width: 0,
      height: 0,
      loadIndex: [initialPage]
    };
    return _this;
  }

  _createClass(PagedView, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _props = this.props,
          _props$onStartShouldS = _props.onStartShouldSetPanResponder,
          onStartShouldSetPanResponder = _props$onStartShouldS === undefined ? defaultResponder(true) : _props$onStartShouldS,
          _props$onStartShouldS2 = _props.onStartShouldSetPanResponderCapture,
          onStartShouldSetPanResponderCapture = _props$onStartShouldS2 === undefined ? defaultResponder(false) : _props$onStartShouldS2,
          _props$onMoveShouldSe = _props.onMoveShouldSetPanResponder,
          onMoveShouldSetPanResponder = _props$onMoveShouldSe === undefined ? defaultResponder(true) : _props$onMoveShouldSe,
          _props$onMoveShouldSe2 = _props.onMoveShouldSetPanResponderCapture,
          onMoveShouldSetPanResponderCapture = _props$onMoveShouldSe2 === undefined ? defaultResponder(false) : _props$onMoveShouldSe2,
          _props$onPanResponder = _props.onPanResponderTerminationRequest,
          onPanResponderTerminationRequest = _props$onPanResponder === undefined ? defaultResponder(true) : _props$onPanResponder,
          _props$onPanResponder2 = _props.onPanResponderTerminate,
          onPanResponderTerminate = _props$onPanResponder2 === undefined ? function (evt, gestureState) {} : _props$onPanResponder2;


      this._panResponder = _reactNative.PanResponder.create({
        onStartShouldSetPanResponder: onStartShouldSetPanResponder,
        onStartShouldSetPanResponderCapture: onStartShouldSetPanResponderCapture,
        onMoveShouldSetPanResponder: onMoveShouldSetPanResponder,
        onMoveShouldSetPanResponderCapture: onMoveShouldSetPanResponderCapture,
        onPanResponderTerminationRequest: onPanResponderTerminationRequest,

        onPanResponderGrant: function onPanResponderGrant(evt, gestureState) {},
        onPanResponderMove: this._onPanResponderMove,
        onPanResponderRelease: this._onPanResponderRelease,
        onPanResponderTerminate: onPanResponderTerminate,
        onShouldBlockNativeResponder: function onShouldBlockNativeResponder(evt, gestureState) {
          return true;
        }
      });
    }
  }, {
    key: '_getPosForPage',
    value: function _getPosForPage(pageNb) {
      return -pageNb * this._boxSize;
    }
  }, {
    key: '_getPageForOffset',
    value: function _getPageForOffset(offset, diff) {
      var boxPos = Math.abs(offset / this._boxSize);
      var index = void 0;

      if (diff < 0) {
        // Scrolling forwards
        index = Math.ceil(boxPos);
      } else {
        // Scrolling backwards
        index = Math.floor(boxPos);
      }

      // Make sure index is within bounds
      if (index < 0) {
        index = 0;
      } else if (index > this.props.children.length - 1) {
        index = this.props.children.length - 1;
      }

      return index;
    }
  }, {
    key: '_runAfterMeasurements',
    value: function _runAfterMeasurements(width, height) {
      var length = this.props.vertical ? height : width;
      this._boxSize = length;
      this.maxPos = -(this.len - 1) * this._boxSize;

      var initialPage = this.props.initialPage || 0;
      if (initialPage < 0) {
        initialPage = 0;
      } else if (initialPage >= this.props.children.length) {
        initialPage = this.props.children.length - 1;
      }

      this._currentPage = initialPage;
      this._lastPos = this._getPosForPage(this._currentPage);

      this.setState({
        width: width,
        height: height,
        pos: new _reactNative.Animated.Value(this._getPosForPage(this._currentPage))
      });
    }
  }, {
    key: 'animateToPage',
    value: function animateToPage(page) {
      var _this2 = this;

      var animations = [];
      // if (this._currentPage !== page) {
      // }

      var toValue = this._getPosForPage(page);

      animations.push(_reactNative.Animated.timing(this.state.pos, {
        toValue: toValue,
        duration: this.props.animationDuration,
        easing: _reactNative.Easing.out(_reactNative.Easing.ease)
      }));

      _reactNative.Animated.parallel(animations).start();

      this._lastPos = toValue;
      this._oldPage = this._currentPage;
      this._currentPage = page;

      var loadIndex = this.state.loadIndex;


      if (!loadIndex.includes(page)) {
        loadIndex.push(page);
      }
      this.setState({ loadIndex: loadIndex }, function () {
        _this2.props.onPageChange(page, _this2._oldPage);
      });
    }
  }, {
    key: 'goToPage',
    value: function goToPage(index) {
      if (index < 0 || index > this.props.children.length - 1) {
        return;
      }

      this.animateToPage(index);
    }
  }, {
    key: '_children',
    value: function _children() {
      var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.children;
      var handleFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (child) {
        return child;
      };

      return _react2.default.Children.map(children, handleFunc);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      this.childrenList = this._children();
      this.len = this.childrenList.length;

      if (!this.state.width && !this.state.height) {
        // 先行计算容器尺寸
        return _react2.default.createElement(
          _reactNative.View,
          { style: { flex: 1 } },
          _react2.default.createElement(_reactNative.View, {
            style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent' },
            onLayout: function onLayout(evt) {
              var width = evt.nativeEvent.layout.width;
              var height = evt.nativeEvent.layout.height;
              _this3._runAfterMeasurements(width, height);
            }
          })
        );
      }

      var _getViewStyle = this.getViewStyle(),
          wrapStyle = _getViewStyle.wrapStyle,
          containerStyle = _getViewStyle.containerStyle,
          boxStyle = _getViewStyle.boxStyle;

      var loadIndex = this.state.loadIndex;


      return _react2.default.createElement(
        _reactNative.View,
        { style: wrapStyle },
        _react2.default.createElement(
          _reactNative.Animated.View,
          _extends({
            style: containerStyle
          }, this._panResponder.panHandlers),
          this.childrenList.map(function (page, index) {
            return _react2.default.createElement(
              _reactNative.Animated.View,
              {
                key: index,
                style: boxStyle
              },
              loadIndex.includes(index) ? _react2.default.cloneElement(page, { pageIndex: index }) : null
            );
          })
        )
      );
    }
  }]);

  return PagedView;
}(_react.Component), _class.propTypes = {
  initialPage: _propTypes2.default.number,
  vertical: _propTypes2.default.bool,
  animationDuration: _propTypes2.default.number,
  onPageChange: _propTypes2.default.func,

  children: _propTypes2.default.array.isRequired
}, _class.defaultProps = {
  initialPage: 0,
  animationDuration: 150,
  vertical: false,
  onPageChange: function onPageChange() {}
}, _temp);
exports.default = PagedView;


var defaultResponder = function defaultResponder(isResponder) {
  return function (evt, gestureState) {
    return isResponder;
  };
};

var setViewStyle = function setViewStyle() {
  var styleList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var addStyleList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  return styleList.map(function () {
    var itemStyle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var i = arguments[1];

    return Object.assign({}, itemStyle, addStyleList[i] || {});
  });
};