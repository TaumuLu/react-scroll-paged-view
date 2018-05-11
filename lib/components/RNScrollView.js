'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNative = require('react-native');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RNScrollView = function (_ScrollView) {
  _inherits(RNScrollView, _ScrollView);

  function RNScrollView() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, RNScrollView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = RNScrollView.__proto__ || Object.getPrototypeOf(RNScrollView)).call.apply(_ref, [this].concat(args))), _this), _this.setScrollEnabled = function (value) {
      _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(_this), _reactNative.UIManager.RNScrollView.Commands.setScrollEnabled, [value]);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(RNScrollView, [{
    key: 'render',
    value: function render() {
      if (_reactNative.Platform.OS === 'ios') {
        return _get(RNScrollView.prototype.__proto__ || Object.getPrototypeOf(RNScrollView.prototype), 'render', this).call(this);
      }

      var ScrollViewClass = AndroidScrollView;
      var ScrollContentContainerViewClass = _reactNative.View;

      var contentContainerStyle = [this.props.horizontal && styles.contentContainerHorizontal, this.props.contentContainerStyle];

      var contentSizeChangeProps = {};
      if (this.props.onContentSizeChange) {
        contentSizeChangeProps = {
          onLayout: this._handleContentOnLayout
        };
      }

      var children = this.props.children;
      var contentContainer = _react2.default.createElement(
        ScrollContentContainerViewClass,
        _extends({}, contentSizeChangeProps, {
          ref: this._setInnerViewRef,
          style: contentContainerStyle,
          removeClippedSubviews:
          // Subview clipping causes issues with sticky headers on Android and
          // would be hard to fix properly in a performant way.
          this.props.removeClippedSubviews,
          collapsable: false
        }),
        children
      );

      var alwaysBounceHorizontal = this.props.alwaysBounceHorizontal !== undefined ? this.props.alwaysBounceHorizontal : this.props.horizontal;

      var alwaysBounceVertical = this.props.alwaysBounceVertical !== undefined ? this.props.alwaysBounceVertical : !this.props.horizontal;

      var DEPRECATED_sendUpdatedChildFrames = !!this.props.DEPRECATED_sendUpdatedChildFrames;

      var baseStyle = this.props.horizontal ? styles.baseHorizontal : styles.baseVertical;
      var props = _extends({}, this.props, {
        alwaysBounceHorizontal: alwaysBounceHorizontal,
        alwaysBounceVertical: alwaysBounceVertical,
        style: [baseStyle, this.props.style],
        // Override the onContentSizeChange from props, since this event can
        // bubble up from TextInputs
        onContentSizeChange: null,
        onMomentumScrollBegin: this.scrollResponderHandleMomentumScrollBegin,
        onMomentumScrollEnd: this.scrollResponderHandleMomentumScrollEnd,
        onResponderGrant: this.scrollResponderHandleResponderGrant,
        onResponderReject: this.scrollResponderHandleResponderReject,
        onResponderRelease: this.scrollResponderHandleResponderRelease,
        onResponderTerminate: this.scrollResponderHandleTerminate,
        onResponderTerminationRequest: this.scrollResponderHandleTerminationRequest,
        onScroll: this._handleScroll,
        onScrollBeginDrag: this.scrollResponderHandleScrollBeginDrag,
        onScrollEndDrag: this.scrollResponderHandleScrollEndDrag,
        onScrollShouldSetResponder: this.scrollResponderHandleScrollShouldSetResponder,
        onStartShouldSetResponder: this.scrollResponderHandleStartShouldSetResponder,
        onStartShouldSetResponderCapture: this.scrollResponderHandleStartShouldSetResponderCapture,
        onTouchEnd: this.scrollResponderHandleTouchEnd,
        onTouchMove: this.scrollResponderHandleTouchMove,
        onTouchStart: this.scrollResponderHandleTouchStart,
        scrollEventThrottle: this.props.scrollEventThrottle,
        sendMomentumEvents: !!(this.props.onMomentumScrollBegin || this.props.onMomentumScrollEnd),
        DEPRECATED_sendUpdatedChildFrames: DEPRECATED_sendUpdatedChildFrames
      });

      return _react2.default.createElement(
        ScrollViewClass,
        _extends({}, props, { ref: this._setScrollViewRef }),
        contentContainer
      );
    }
  }]);

  return RNScrollView;
}(_reactNative.ScrollView);

exports.default = RNScrollView;


var styles = _reactNative.StyleSheet.create({
  baseVertical: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'column',
    overflow: 'scroll'
  },
  baseHorizontal: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    overflow: 'scroll'
  },
  contentContainerHorizontal: {
    flexDirection: 'row'
  }
});

var nativeOnlyProps = {
  nativeOnly: {
    sendMomentumEvents: true
  }
};

var AndroidScrollView = void 0;
if (_reactNative.Platform.OS !== 'ios') {
  AndroidScrollView = (0, _reactNative.requireNativeComponent)('RNScrollView', _reactNative.ScrollView, nativeOnlyProps);
}