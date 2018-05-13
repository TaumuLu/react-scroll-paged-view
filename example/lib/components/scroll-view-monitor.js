'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNative = require('react-native');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScrollViewMonitor = function (_Component) {
  _inherits(ScrollViewMonitor, _Component);

  function ScrollViewMonitor(props) {
    _classCallCheck(this, ScrollViewMonitor);

    var _this = _possibleConstructorReturn(this, (ScrollViewMonitor.__proto__ || Object.getPrototypeOf(ScrollViewMonitor)).call(this, props));

    _this.setLayoutInfo = function (_ref) {
      var nativeEvent = _ref.nativeEvent;
      var _nativeEvent$layout = nativeEvent.layout,
          height = _nativeEvent$layout.height,
          y = _nativeEvent$layout.y;

      if (height > _this.scrollHeight) {
        _this.scrollHeight = height;
      }
    };

    _this.defaultResponder = function (isResponder) {
      return function (evt, gestureState) {
        return isResponder;
      };
    };

    _this.borderJudge = function (value, callback) {
      var height = _this.state.height;

      var maxDistance = -(_this.scrollHeight - height);
      var isBeyondTop = value > 0;
      var isBeyondBottom = value < maxDistance;
      var isScope = !isBeyondTop && !isBeyondBottom;

      if (!isScope && callback) {
        var _value = isBeyondTop ? 0 : maxDistance;
        callback(_value);
      }

      return isScope;
    };

    _this.viewRef = function (ref) {
      _this._viewRef = ref;
    };

    _this._runAfterMeasurements = function (width, height) {
      _this.setState({ width: width, height: height });
    };

    _this.state = {
      pos: new _reactNative.Animated.Value(0),
      width: 0,
      height: 0
    };

    _this._lastPos = 0;
    _this.scrollHeight = 0;
    return _this;
  }

  _createClass(ScrollViewMonitor, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this._panResponder = _reactNative.PanResponder.create({
        onStartShouldSetPanResponder: this.defaultResponder(true),
        onStartShouldSetPanResponderCapture: this.defaultResponder(false),
        onMoveShouldSetPanResponder: this.defaultResponder(true),
        onMoveShouldSetPanResponderCapture: this.defaultResponder(false),
        onPanResponderTerminationRequest: this.defaultResponder(true),

        onPanResponderGrant: function onPanResponderGrant(evt, gestureState) {
          _this2.decayTigger = false;
          _this2.state.pos.stopAnimation();
        },
        onPanResponderMove: function onPanResponderMove(evt, gestureState) {
          if (_this2.decayTigger) _this2.decayTigger = false;

          var nextValue = _this2._lastPos + gestureState.dy;
          // console.log('Move', nextValue)
          if (_this2.borderJudge(nextValue)) {
            _this2.state.pos.setValue(nextValue);
          }
        },
        onPanResponderRelease: function onPanResponderRelease(evt, gestureState) {
          _this2._lastPos += gestureState.dy;
          var isScope = _this2.borderJudge(_this2._lastPos, function (value) {
            _this2._lastPos = value;
          });

          if (isScope) {
            _this2.decayTigger = true;
            _reactNative.Animated.decay(_this2.state.pos, {
              velocity: gestureState.vy,
              deceleration: 0.997
              // useNativeDriver: true,
            }).start();
          }
          // console.log('Release', gestureState.dy)
        },
        onPanResponderTerminate: function onPanResponderTerminate(evt, gestureState) {},
        onShouldBlockNativeResponder: function onShouldBlockNativeResponder(evt, gestureState) {
          return true;
        }
      });

      this.state.pos.addListener(function (_ref2) {
        var value = _ref2.value;

        if (_this2.decayTigger) {
          var isScope = _this2.borderJudge(_this2._lastPos, function (value) {
            _this2.state.pos.stopAnimation();
            _this2.state.pos.setValue(value);
            _this2._lastPos = value;
          });

          if (isScope) {
            _this2._lastPos = value;
          }
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          nativeProps = _objectWithoutProperties(_props, ['children']);

      return _react2.default.createElement(
        _reactNative.ScrollView,
        _extends({
          bounces: false,
          alwaysBounceVertical: false,
          showsVerticalScrollIndicator: false
          // overScrollMode={'never'}
          // scrollEnabled={false}
        }, nativeProps),
        children
      );

      // if (!this.state.width && !this.state.height) {
      //   // Use a transparent screen to render so we can calculate width & height
      //   return (
      //     <View style={{ flex: 1 }}>
      //       <View
      //         style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent' }}
      //         onLayout={(e) => {
      //           const { width, height } = e.nativeEvent.layout
      //           this._runAfterMeasurements(width, height)
      //         }}
      //       />
      //     </View>
      //   )
      // }

      // const containerStyle = {
      //   // flex: 1,
      //   top: this.state.pos,
      //   flexDirection: 'column',
      //   // overflow: 'scroll',
      // }

      // // if (isAndroid) {
      // return (
      //   <Animated.View
      //     ref={this.viewRef}
      //     onLayout={this.setLayoutInfo}
      //     style={containerStyle}
      //     {...this._panResponder.panHandlers}
      //   >
      //     {children}
      //   </Animated.View>
      // )
      // // }
    }
  }]);

  return ScrollViewMonitor;
}(_react.Component);

exports.default = ScrollViewMonitor;