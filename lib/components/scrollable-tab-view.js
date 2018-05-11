'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Style = exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp, _initialiseProps;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var transitionParams = 'all 0.5s';
var longSwipesMs = 300;
var resetTime = 450;

var ScrollableTabView = (_temp = _class = function (_React$Component) {
  _inherits(ScrollableTabView, _React$Component);

  function ScrollableTabView(props) {
    _classCallCheck(this, ScrollableTabView);

    var infinite = props.infinite;
    var initialPage = props.initialPage;


    if (infinite) {
      initialPage += 1;
    }

    var _this = _possibleConstructorReturn(this, (ScrollableTabView.__proto__ || Object.getPrototypeOf(ScrollableTabView)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      activeTab: initialPage,
      // 按需加载索引
      loadTabList: [initialPage]
    };
    _this.containerSize = 0;
    return _this;
  }

  _createClass(ScrollableTabView, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var infinite = this.props.infinite;

      this.autoPlay();
      // 无限轮播初始不加transition动画
      this.setStyle(infinite);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.setStyle();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.timer);
      clearTimeout(this.resetTimer);
    }

    // 手动后置设置style 防止手动改变style后render不更新


    // 判断未无限滚动时是否到头不可拖动

  }, {
    key: '_children',
    value: function _children() {
      var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.children;
      var handleFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (child) {
        return child;
      };

      return _react2.default.Children.map(children, handleFunc);
    }

    // 所有页面切换都走此方法，用于控制按需加载

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          children = _props.children,
          tabLabels = _props.tabLabels,
          infinite = _props.infinite,
          isDot = _props.isDot,
          dotWrapStyle = _props.dotWrapStyle,
          dotStyle = _props.dotStyle,
          dotActiveStyle = _props.dotActiveStyle,
          locked = _props.locked,
          renderTabBar = _props.renderTabBar,
          vertical = _props.vertical;
      var _state = this.state,
          activeTab = _state.activeTab,
          loadTabList = _state.loadTabList;


      this.tabChildren = this._children(children, function (child, index) {
        return child && _react2.default.cloneElement(child, { key: (0, _utils.get)(tabLabels, index) || index });
      });
      // 无限轮播拼接children
      if (infinite) {
        this.tabChildren = this.setInfiniteChildren();
      }
      this.tabsLen = (0, _utils.size)(this.tabChildren);
      var containerStype = vertical ? {
        overflowY: 'hidden',
        flexDirection: 'row'
      } : {
        overflowX: 'hidden',
        flexDirection: 'column'
      };
      var eventProps = {};
      if (!locked) {
        eventProps = {
          onTouchStart: this._onTouchStart,
          onTouchMove: this._onTouchMove,
          onTouchEnd: this._onTouchEnd
        };
      }

      return _react2.default.createElement(
        'div',
        {
          style: mergeStyle(Style.tabsContainer, containerStype),
          ref: this.setWrapRef
        },
        !!renderTabBar && renderTabBar({
          goToPage: function goToPage(activeTab, isNoAnimated) {
            return _this2.goToPage(infinite ? activeTab + 1 : activeTab, isNoAnimated);
          },
          tabs: tabLabels || Array.from({ length: infinite ? this.tabsLen - 2 : this.tabsLen }, function (v, i) {
            return i;
          }),
          activeTab: infinite ? activeTab - 1 : activeTab
        }),
        _react2.default.createElement(TabsBox, {
          tabsBoxRefFunc: this.tabsBoxRefFunc,
          tabsLen: this.tabsLen,
          loadTabList: loadTabList,
          tabChildren: this.tabChildren,
          getTransform: this.getTransform,
          vertical: vertical,
          eventProps: eventProps
        }),
        _react2.default.createElement(DotNav, {
          isDot: isDot,
          infinite: infinite,
          dotWrapStyle: dotWrapStyle,
          tabChildren: this.tabChildren,
          dotStyle: dotStyle,
          activeTab: activeTab,
          dotActiveStyle: dotActiveStyle,
          goToPage: this.goToPage,
          tabsLen: this.tabsLen
        })
      );
    }
  }]);

  return ScrollableTabView;
}(_react2.default.Component), _class.propTypes = {
  scrollWithoutAnimation: _propTypes2.default.bool,
  locked: _propTypes2.default.bool,
  infinite: _propTypes2.default.bool,
  isDot: _propTypes2.default.bool,
  tabLabels: _propTypes2.default.array,
  dotStyle: _propTypes2.default.object,
  dotWrapStyle: _propTypes2.default.object,
  dotActiveStyle: _propTypes2.default.object,
  initialPage: _propTypes2.default.number,
  autoPlay: _propTypes2.default.bool,
  autoplayTimeout: _propTypes2.default.number,
  renderTabBar: _propTypes2.default.func,
  vertical: _propTypes2.default.bool,
  onChange: _propTypes2.default.func
}, _class.defaultProps = {
  scrollWithoutAnimation: false,
  locked: false,
  infinite: false,
  isDot: false,
  tabLabels: [],
  initialPage: 0,
  autoPlay: false,
  autoplayTimeout: 2,
  vertical: false,
  onChange: function onChange() {}
}, _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.setStyle = function () {
    var withoutTransition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this3.props.scrollWithoutAnimation;

    if (_this3.tabsBox) {
      requestAnimationFrame(function () {
        _this3.tabsBox.style.transition = withoutTransition ? 'none' : transitionParams;
        _this3.tabsBox.style.transform = _this3.getTransform();
      });
    }
  };

  this.getTransform = function (customSize) {
    var currentState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this3.state;
    var vertical = _this3.props.vertical;
    var activeTab = currentState.activeTab;

    var suffix = vertical ? 'Y' : 'X';

    return 'translate' + suffix + '(' + (customSize || activeTab * -_this3.containerSize) + 'px)';
  };

  this.setBoxAnimation = function (_ref) {
    var clientX = _ref.clientX,
        clientY = _ref.clientY;
    var startX = _this3.startX,
        startY = _this3.startY,
        activeTab = _this3.state.activeTab,
        _props2 = _this3.props,
        scrollWithoutAnimation = _props2.scrollWithoutAnimation,
        vertical = _props2.vertical;

    var distance = vertical ? clientY - startY : clientX - startX;

    if (_this3.isMoveBorder(distance)) {
      var customSize = _this3.moveDistance = activeTab * -_this3.containerSize + distance;

      if (!scrollWithoutAnimation) {
        _this3.tabsBox.style.transition = 'none';
      }
      _this3.tabsBox.style.transform = _this3.getTransform(customSize);
    }
  };

  this.setInfiniteChildren = function () {
    var head = (0, _utils.findLast)(_this3.tabChildren, function (child) {
      return !!child;
    });
    var foot = (0, _utils.find)(_this3.tabChildren, function (child) {
      return !!child;
    });
    return [_react2.default.cloneElement(head, { key: 'tab-head' })].concat(_toConsumableArray(_this3.tabChildren), [_react2.default.cloneElement(foot, { key: 'tab-foot' })]);
  };

  this.setWrapRef = function (ref) {
    if (ref) {
      var vertical = _this3.props.vertical;
      var offsetWidth = ref.offsetWidth,
          offsetHeight = ref.offsetHeight;

      _this3.containerSize = vertical ? offsetHeight : offsetWidth;
    }
  };

  this.getResetActiveTab = function (isRealActiveTab) {
    var infinite = _this3.props.infinite;
    var activeTab = _this3.state.activeTab;

    var resetActiveTab = activeTab;

    if (infinite) {
      if (activeTab === 0) resetActiveTab = _this3.tabsLen - 2;
      if (activeTab === _this3.tabsLen - 1) resetActiveTab = 1;

      if (isRealActiveTab) {
        return resetActiveTab - 1;
      }
    }

    return resetActiveTab;
  };

  this.tabsBoxRefFunc = function (tabBox) {
    _this3.tabsBox = tabBox;
  };

  this.autoPlay = function () {
    var _props3 = _this3.props,
        autoPlay = _props3.autoPlay,
        autoplayTimeout = _props3.autoplayTimeout;

    if (autoPlay) {
      var time = isNaN(autoplayTimeout) ? 2 : autoplayTimeout;
      if (_this3.timer) clearTimeout(_this3.timer);
      _this3.timer = setTimeout(function () {
        var activeTab = _this3.state.activeTab;

        var nextIndex = activeTab + 1;
        _this3.goToPage(nextIndex);
        _this3.autoPlay();
      }, time * 1000);
    }
  };

  this.isMoveBorder = function (distance) {
    var _props4 = _this3.props,
        locked = _props4.locked,
        infinite = _props4.infinite;

    if (locked) return false;
    if (infinite) return infinite;

    var activeTab = _this3.state.activeTab;

    if (distance > 0 && activeTab !== 0) return true;
    if (distance < 0 && activeTab + 1 !== _this3.tabsLen) return true;

    return false;
  };

  this.resetPosition = function () {
    _this3.resetTimer = setTimeout(function () {
      var activeTab = _this3.state.activeTab;
      var _props5 = _this3.props,
          scrollWithoutAnimation = _props5.scrollWithoutAnimation,
          infinite = _props5.infinite;

      if (infinite) {
        var resetActiveTab = _this3.getResetActiveTab();

        if (resetActiveTab !== activeTab) {
          if (!scrollWithoutAnimation) {
            _this3.tabsBox.style.transition = 'none';
          }
          _this3.tabsBox.style.transform = _this3.getTransform(null, { activeTab: resetActiveTab });
          var loadTabList = _this3.state.loadTabList.slice();
          if (!loadTabList.includes(+resetActiveTab)) {
            loadTabList.push(+resetActiveTab);
          }
          requestAnimationFrame(function () {
            _this3.setState({ activeTab: resetActiveTab, loadTabList: loadTabList });
          });
        }
      }
    }, resetTime);
  };

  this.goToPage = function (activeTab) {
    var isNoAnimated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var _props6 = _this3.props,
        scrollWithoutAnimation = _props6.scrollWithoutAnimation,
        infinite = _props6.infinite;

    var loadTabList = _this3.state.loadTabList.slice();
    if (!loadTabList.includes(+activeTab)) {
      loadTabList.push(+activeTab);
    }
    if (!scrollWithoutAnimation && isNoAnimated) {
      _this3.tabsBox.style.transition = 'none';
    }
    var oldActiveTab = _this3.state.activeTab;

    _this3.setState({ activeTab: activeTab, loadTabList: loadTabList }, function () {
      // 检查是否需要重置位置
      _this3.props.onChange(_this3.getResetActiveTab(true), oldActiveTab);
      _this3.resetPosition();
    });
  };

  this._onTouchStart = function (e) {
    e.stopPropagation();
    var targetTouches = e.targetTouches;

    var _ref2 = targetTouches[0] || {},
        clientX = _ref2.clientX,
        clientY = _ref2.clientY;

    _this3.touchSartTime = Date.now();
    _this3.startX = clientX;
    _this3.startY = clientY;
    // 是否为反向滚动
    _this3.isScroll = false;
    // 是否达成触摸，此类变量可用于web端区分点击事件
    _this3.isTouch = false;
    // 是否判断过移动方向，只判断一次，判断过后不再判断
    _this3.isMove = false;

    if (_this3.timer) clearTimeout(_this3.timer);
  };

  this._onTouchMove = function (e) {
    e.stopPropagation();
    var targetTouches = e.targetTouches;

    var _ref3 = targetTouches[0] || {},
        clientX = _ref3.clientX,
        clientY = _ref3.clientY;

    var startX = _this3.startX,
        startY = _this3.startY;

    if (!_this3.isMove) {
      _this3.isMove = true;
      // 是否达成触摸
      if (clientX !== startX || clientY !== startY) {
        _this3.isTouch = true;
      }
      // 判断滚动方向是否正确
      var horDistance = Math.abs(clientX - startX);
      var verDistance = Math.abs(clientY - startY);
      var vertical = _this3.props.vertical;

      if (vertical ? verDistance <= horDistance : horDistance <= verDistance) {
        _this3.isScroll = true;
      }
    }

    if (!_this3.isScroll) {
      // 手拖动动画
      _this3.setBoxAnimation({ clientX: clientX, clientY: clientY });
      e.preventDefault();
    }
  };

  this.speed = function (element, start, end, callBack) {
    var comStart = start;
    clearInterval(_this3.timer);
    _this3.timer = setInterval(function () {
      var gap = (end - comStart) / 6;
      gap = gap > 0 ? Math.ceil(gap) : Math.floor(gap);
      comStart += gap;

      element.style.transform = _this3.getTransform(comStart);
      if (comStart === end) {
        clearInterval(_this3.timer);
        callBack && callBack();
      }
    }, 20);
  };

  this._onTouchEnd = function (e) {
    var changedTouches = e.changedTouches;

    var _ref4 = changedTouches[0] || {},
        clientX = _ref4.clientX,
        clientY = _ref4.clientY;

    _this3.endX = clientX;
    _this3.endY = clientY;
    if (!_this3.isScroll) {
      _this3.isGoToPage();
    }
    _this3.autoPlay();
  };

  this.isGoToPage = function () {
    var startX = _this3.startX,
        startY = _this3.startY,
        endX = _this3.endX,
        endY = _this3.endY,
        oldActiveTab = _this3.state.activeTab,
        _props7 = _this3.props,
        scrollWithoutAnimation = _props7.scrollWithoutAnimation,
        vertical = _props7.vertical;

    var judgeSize = _this3.containerSize / 3;
    var distance = vertical ? endY - startY : endX - startX;
    _this3.touchEndTime = Date.now();

    if (_this3.isMoveBorder(distance)) {
      var diffTime = _this3.touchEndTime - _this3.touchSartTime;
      // 满足移动tab条件
      if ((diffTime <= longSwipesMs || Math.abs(distance) >= judgeSize) && distance !== 0) {
        var nextActiveTab = distance > 0 ? -1 : 1;
        var activeTab = oldActiveTab + nextActiveTab;
        // 是否无动画
        if (scrollWithoutAnimation) {
          _this3.speed(_this3.tabsBox, _this3.moveDistance, activeTab * -_this3.containerSize, function () {
            _this3.goToPage(activeTab);
          });
        } else {
          _this3.tabsBox.style.transition = transitionParams;
          _this3.goToPage(activeTab);
        }
        // 否则判断是否无动画更新回去
      } else if (scrollWithoutAnimation) {
        _this3.speed(_this3.tabsBox, _this3.moveDistance, oldActiveTab * -_this3.containerSize);
      } else {
        _this3.forceUpdate();
      }
    }
  };
}, _temp);
exports.default = ScrollableTabView;


var TabsBox = function TabsBox(_ref5) {
  var tabsBoxRefFunc = _ref5.tabsBoxRefFunc,
      tabsLen = _ref5.tabsLen,
      loadTabList = _ref5.loadTabList,
      tabChildren = _ref5.tabChildren,
      getTransform = _ref5.getTransform,
      vertical = _ref5.vertical,
      _ref5$eventProps = _ref5.eventProps,
      eventProps = _ref5$eventProps === undefined ? {} : _ref5$eventProps;

  var boxStyle = vertical ? {
    // position: 'absolute', // hack
    height: 100 * tabsLen + '%',
    flexDirection: 'column'
  } : {
    width: 100 * tabsLen + '%',
    flexDirection: 'row'
  };

  return _react2.default.createElement(
    'div',
    _extends({
      ref: tabsBoxRefFunc,
      className: 'ios-scroll',
      style: mergeStyle(Style.tabsBox, boxStyle, { transform: getTransform() })
    }, eventProps),
    tabChildren.map(function (child, index) {
      if (loadTabList.includes(index)) return child;

      return _react2.default.createElement('div', { key: index, style: { flex: 1 } });
    })
  );
};

var DotNav = function DotNav(_ref6) {
  var isDot = _ref6.isDot,
      infinite = _ref6.infinite,
      tabChildren = _ref6.tabChildren,
      activeTab = _ref6.activeTab,
      goToPage = _ref6.goToPage,
      _ref6$dotActiveStyle = _ref6.dotActiveStyle,
      dotActiveStyle = _ref6$dotActiveStyle === undefined ? {} : _ref6$dotActiveStyle,
      _ref6$dotStyle = _ref6.dotStyle,
      dotStyle = _ref6$dotStyle === undefined ? {} : _ref6$dotStyle,
      _ref6$dotWrapStyle = _ref6.dotWrapStyle,
      dotWrapStyle = _ref6$dotWrapStyle === undefined ? {} : _ref6$dotWrapStyle,
      tabsLen = _ref6.tabsLen;

  if (isDot) {
    return _react2.default.createElement(
      'div',
      { style: mergeStyle(Style.dotWrap, dotWrapStyle) },
      tabChildren.map(function (child, index) {
        if (infinite && (index === 0 || index === tabsLen - 1)) return null;
        var activeStyle = index === activeTab ? mergeStyle(Style.dotItemActive, dotActiveStyle) : {};

        return _react2.default.createElement('div', { key: index, style: mergeStyle(Style.dotItem, dotStyle, activeStyle), onClick: function onClick() {
            return goToPage(index);
          } });
      })
    );
  }

  return null;
};

var mergeStyle = function mergeStyle() {
  for (var _len = arguments.length, styles = Array(_len), _key = 0; _key < _len; _key++) {
    styles[_key] = arguments[_key];
  }

  return styles.reduce(function (p, c) {
    return _extends({}, p || {}, c || {});
  }, {});
};

var Style = exports.Style = {
  tabsContainer: {
    flex: 1,
    display: 'flex',
    position: 'relative',
    height: '100%',
    width: '100%'
  },
  tabsBox: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden'
    // touchAction: 'none',
  },

  dotWrap: {
    display: 'flex',
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    bottom: 20
  },
  dotItem: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  dotItemActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
};