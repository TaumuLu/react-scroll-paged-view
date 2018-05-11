'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = ScrollPageHOC;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function ScrollPageHOC(WrappedComponent) {
  var _class, _temp;

  return _temp = _class = function (_WrappedComponent) {
    _inherits(ScrollPage, _WrappedComponent);

    function ScrollPage(props) {
      _classCallCheck(this, ScrollPage);

      var _this = _possibleConstructorReturn(this, (ScrollPage.__proto__ || Object.getPrototypeOf(ScrollPage)).call(this, props));

      _this.triggerJudge = function (isTop, isBottom) {
        switch (_this.currentPage) {
          case 0:
            return isBottom;
          case _this.len - 1:
            return isTop;
          default:
            return isTop && _this.borderDirection === 'isTop' || isBottom && _this.borderDirection === 'isBottom';
        }
      };

      _this.isBorder = false;
      _this.isResponder = false;
      _this.currentPage = 0;

      // this.scrollViewRef = []
      // this.scrollViewLayout = []
      // this.scrollViewSize = []
      // 子元素含有多个scrollview的索引数组
      // this.scrollViewIndex = []

      _this._deceleration = 0.997;
      return _this;
    }

    _createClass(ScrollPage, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return {
          ScrollView: this.ScrollViewMonitor
        };
      }

      // setScrollViewConfig = (setKey, value, index, handle) => {
      //   const { currentPage, scrollViewIndex } = this
      //   const setKeyList = [setKey, currentPage]

      //   // 子元素含有多个scrollview
      //   if (scrollViewIndex[currentPage] !== undefined) {
      //     if (!this[setKey][currentPage]) this[setKey][currentPage] = []

      //     setKeyList.push(index)
      //   }
      //   handle && handle(get(this, setKeyList))

      //   return set(this, setKeyList, value)
      // }

      // getScrollViewConfig = (getKey) => {
      //   const { currentPage, scrollViewIndex } = this
      //   const index = scrollViewIndex[currentPage]

      //   // console.log(currentPage, index, this[getKey])
      //   if (index !== undefined) {
      //     return get(this, [getKey, currentPage, index])
      //   }

      //   return get(this, [getKey, currentPage])
      // }

      // onUpdate = (_fromValue, handle) => {
      //   const now = Date.now()

      //   const value =
      //     _fromValue +
      //     this._velocity /
      //       (1 - this._deceleration) *
      //       (1 - Math.exp(-(1 - this._deceleration) * (now - this._startTime)))

      //   if (Math.abs(_fromValue - value) < 0.1) {
      //     return
      //   }
      //   handle && handle(value)
      //   this.onUpdate(value)
      // }

    }, {
      key: 'getChildren',
      value: function getChildren() {
        var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.children;
        var handleFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (child) {
          return child;
        };

        return _react2.default.Children.map(children, handleFunc);
      }
    }, {
      key: 'render',
      value: function render() {
        this.childrenList = this.getChildren();
        this.len = this.childrenList.length;

        return _get(ScrollPage.prototype.__proto__ || Object.getPrototypeOf(ScrollPage.prototype), 'render', this).call(this);
      }
    }]);

    return ScrollPage;
  }(WrappedComponent), _class.childContextTypes = {
    ScrollView: _propTypes2.default.func
  }, _temp;
}