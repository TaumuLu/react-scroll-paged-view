'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RNScrollView = require('./RNScrollView');

var _RNScrollView2 = _interopRequireDefault(_RNScrollView);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var viewKeys = ['scrollViewRef', 'scrollViewLayout', 'scrollViewSize'];

var AgentScrollView = function (_React$Component) {
  _inherits(AgentScrollView, _React$Component);

  function AgentScrollView() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AgentScrollView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AgentScrollView.__proto__ || Object.getPrototypeOf(AgentScrollView)).call.apply(_ref, [this].concat(args))), _this), _this.setScrollEnabled = function (flag) {
      if (_this.scrollViewRef) {
        _this.scrollViewRef.setScrollEnabled(flag);
      }
    }, _this._setScrollViewSize = function (width, height) {
      if (width && height) {
        var oldSize = _this.scrollViewSize || {};
        _this.scrollViewSize = { width: width, height: height };

        var onContentSizeChange = _this.props.onContentSizeChange;

        if (onContentSizeChange) onContentSizeChange(oldSize, _this.scrollViewSize);
      }
    }, _this._setScrollViewLayout = function (event) {
      if (event) {
        var layout = event.nativeEvent.layout;

        var height = Math.ceil(layout.height);
        var width = Math.ceil(layout.width);

        _this.scrollViewLayout = { width: width, height: height };
      }
    }, _this._setScrollViewRef = function (ref) {
      if (ref) _this.scrollViewRef = ref;
    }, _this._agentMethod = function (propsKey, event) {
      var nativeProps = _this.props.nativeProps;

      var method = (0, _utils.get)(_this.props, propsKey);
      if (method) {
        var agentInfo = viewKeys.reduce(function (p, key) {
          return Object.assign({}, p, _defineProperty({}, key, _this[key] || {}));
        }, {});
        method(event, agentInfo);
        var nativeMethod = (0, _utils.get)(nativeProps, propsKey);
        nativeMethod && nativeMethod(event);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AgentScrollView, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(_RNScrollView2.default, _extends({}, this.props, {
        ref: this._setScrollViewRef,
        onLayout: this._setScrollViewLayout,
        onContentSizeChange: this._setScrollViewSize

        // onMomentumScrollEnd={this._onMomentumScrollEnd}
        // onScrollEndDrag={this._onScrollEndDrag}
        , onTouchStart: function onTouchStart(event) {
          return _this2._agentMethod('onTouchStart', event);
        },
        onTouchMove: function onTouchMove(event) {
          return _this2._agentMethod('onTouchMove', event);
        }
        // onTouchEnd={this._onTouchEnd}
      }));
    }
  }]);

  return AgentScrollView;
}(_react2.default.Component);

exports.default = AgentScrollView;