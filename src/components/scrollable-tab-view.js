import React from 'react'
import PropTypes from 'prop-types'

import { size, get, find, findLast } from '../utils'

const transitionParams = 'all 0.5s'
const longSwipesMs = 300
const resetTime = 450

export default class ScrollableTabView extends React.Component {
  static propTypes = {
    scrollWithoutAnimation: PropTypes.bool,
    locked: PropTypes.bool,
    infinite: PropTypes.bool,
    isDot: PropTypes.bool,
    tabLabels: PropTypes.array,
    dotStyle: PropTypes.object,
    dotWrapStyle: PropTypes.object,
    dotActiveStyle: PropTypes.object,
    initialPage: PropTypes.number,
    autoPlay: PropTypes.bool,
    autoplayTimeout: PropTypes.number,
    renderTabBar: PropTypes.func,
    vertical: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    scrollWithoutAnimation: false,
    locked: false,
    infinite: false,
    isDot: false,
    tabLabels: [],
    initialPage: 0,
    autoPlay: false,
    autoplayTimeout: 2,
    vertical: false,
    onChange: () => {},
  }

  constructor(props) {
    const { infinite } = props
    let { initialPage } = props

    if (infinite) {
      initialPage += 1
    }
    super(props)
    this.state = {
      activeTab: initialPage,
      // 按需加载索引
      loadTabList: [initialPage],
    }
    this.containerSize = 0
  }

  componentDidMount() {
    const { infinite } = this.props
    this.autoPlay()
    // 无限轮播初始不加transition动画
    this.setStyle(infinite)
  }

  componentDidUpdate() {
    this.setStyle()
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
    clearTimeout(this.resetTimer)
  }

  // 手动后置设置style 防止手动改变style后render不更新
  setStyle = (withoutTransition = this.props.scrollWithoutAnimation) => {
    if (this.tabsBox) {
      requestAnimationFrame(() => {
        this.tabsBox.style.transition = withoutTransition ? 'none' : transitionParams
        this.tabsBox.style.transform = this.getTransform()
      })
    }
  }

  getTransform = (customSize, currentState = this.state) => {
    const { vertical } = this.props
    const { activeTab } = currentState
    const suffix = vertical ? 'Y' : 'X'

    return `translate${suffix}(${customSize || activeTab * -this.containerSize}px)`
  }

  setBoxAnimation = ({ clientX, clientY }) => {
    const { startX, startY, state: { activeTab }, props: { scrollWithoutAnimation, vertical } } = this
    const distance = vertical ? clientY - startY : clientX - startX

    if (this.isMoveBorder(distance)) {
      const customSize = this.moveDistance = (activeTab * -this.containerSize) + distance

      if (!scrollWithoutAnimation) {
        this.tabsBox.style.transition = 'none'
      }
      this.tabsBox.style.transform = this.getTransform(customSize)
    }
  }

  setInfiniteChildren = () => {
    const head = findLast(this.tabChildren, child => !!child)
    const foot = find(this.tabChildren, child => !!child)
    return [
      React.cloneElement(head, { key: 'tab-head' }),
      ...this.tabChildren,
      React.cloneElement(foot, { key: 'tab-foot' }),
    ]
  }

  setWrapRef = (ref) => {
    if (ref) {
      const { vertical } = this.props
      const { offsetWidth, offsetHeight } = ref
      this.containerSize = vertical ? offsetHeight : offsetWidth
    }
  }

  getResetActiveTab = (isRealActiveTab) => {
    const { infinite } = this.props
    const { activeTab } = this.state
    let resetActiveTab = activeTab

    if (infinite) {
      if (activeTab === 0) resetActiveTab = this.tabsLen - 2
      if (activeTab === this.tabsLen - 1) resetActiveTab = 1

      if (isRealActiveTab) {
        return resetActiveTab - 1
      }
    }

    return resetActiveTab
  }

  tabsBoxRefFunc = (tabBox) => {
    this.tabsBox = tabBox
  }

  autoPlay = () => {
    const { autoPlay, autoplayTimeout } = this.props
    if (autoPlay) {
      const time = isNaN(autoplayTimeout) ? 2 : autoplayTimeout
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        const { activeTab } = this.state
        const nextIndex = activeTab + 1
        this.goToPage(nextIndex)
        this.autoPlay()
      }, time * 1000)
    }
  }

  // 判断未无限滚动时是否到头不可拖动
  isMoveBorder = (distance) => {
    const { locked, infinite } = this.props
    if (locked) return false
    if (infinite) return infinite

    const { activeTab } = this.state
    if (distance > 0 && activeTab !== 0) return true
    if (distance < 0 && activeTab + 1 !== this.tabsLen) return true

    return false
  }

  _children(children = this.props.children, handleFunc = child => child) {
    return React.Children.map(children, handleFunc)
  }

  resetPosition = () => {
    this.resetTimer = setTimeout(() => {
      const { activeTab } = this.state
      const { scrollWithoutAnimation, infinite } = this.props
      if (infinite) {
        const resetActiveTab = this.getResetActiveTab()

        if (resetActiveTab !== activeTab) {
          if (!scrollWithoutAnimation) {
            this.tabsBox.style.transition = 'none'
          }
          this.tabsBox.style.transform = this.getTransform(null, { activeTab: resetActiveTab })
          const loadTabList = this.state.loadTabList.slice()
          if (!loadTabList.includes(+resetActiveTab)) {
            loadTabList.push(+resetActiveTab)
          }
          requestAnimationFrame(() => {
            this.setState({ activeTab: resetActiveTab, loadTabList })
          })
        }
      }
    }, resetTime)
  }

  // 所有页面切换都走此方法，用于控制按需加载
  goToPage = (activeTab, isNoAnimated = false) => {
    const { scrollWithoutAnimation, infinite } = this.props
    const loadTabList = this.state.loadTabList.slice()
    if (!loadTabList.includes(+activeTab)) {
      loadTabList.push(+activeTab)
    }
    if (!scrollWithoutAnimation && isNoAnimated) {
      this.tabsBox.style.transition = 'none'
    }
    const oldActiveTab = this.state.activeTab

    this.setState({ activeTab, loadTabList }, () => {
      // 检查是否需要重置位置
      this.props.onChange(this.getResetActiveTab(true), oldActiveTab)
      this.resetPosition()
    })
  }

  _onTouchStart = (e) => {
    e.stopPropagation()
    const { targetTouches } = e
    const { clientX, clientY } = targetTouches[0] || {}
    this.touchSartTime = Date.now()
    this.startX = clientX
    this.startY = clientY
    // 是否为反向滚动
    this.isScroll = false
    // 是否达成触摸，此类变量可用于web端区分点击事件
    this.isTouch = false
    // 是否判断过移动方向，只判断一次，判断过后不再判断
    this.isMove = false

    if (this.timer) clearTimeout(this.timer)
  }

  _onTouchMove = (e) => {
    e.stopPropagation()
    const { targetTouches } = e
    const { clientX, clientY } = targetTouches[0] || {}
    const { startX, startY } = this
    if (!this.isMove) {
      this.isMove = true
      // 是否达成触摸
      if (clientX !== startX || clientY !== startY) {
        this.isTouch = true
      }
      // 判断滚动方向是否正确
      const horDistance = Math.abs(clientX - startX)
      const verDistance = Math.abs(clientY - startY)
      const { vertical } = this.props
      if (vertical ? verDistance <= horDistance : horDistance <= verDistance) {
        this.isScroll = true
      }
    }

    if (!this.isScroll) {
      // 手拖动动画
      this.setBoxAnimation({ clientX, clientY })
      e.preventDefault()
    }
  }

  speed = (element, start, end, callBack) => {
    let comStart = start
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      let gap = (end - comStart) / 6
      gap = gap > 0 ? Math.ceil(gap) : Math.floor(gap)
      comStart += gap

      element.style.transform = this.getTransform(comStart)
      if (comStart === end) {
        clearInterval(this.timer)
        callBack && callBack()
      }
    }, 20)
  }

  _onTouchEnd = (e) => {
    const { changedTouches } = e
    const { clientX, clientY } = changedTouches[0] || {}
    this.endX = clientX
    this.endY = clientY
    // 触发Move事件才能去判断是否跳转
    if (!this.isScroll && this.isMove) {
      this.isGoToPage()
    }
    this.autoPlay()
  }

  isGoToPage = () => {
    const { startX, startY, endX, endY, state: { activeTab: oldActiveTab }, props: { scrollWithoutAnimation, vertical } } = this
    const judgeSize = this.containerSize / 3
    const distance = vertical ? endY - startY : endX - startX
    this.touchEndTime = Date.now()

    if (this.isMoveBorder(distance)) {
      const diffTime = this.touchEndTime - this.touchSartTime
      // 满足移动tab条件
      if ((diffTime <= longSwipesMs || Math.abs(distance) >= judgeSize) && distance !== 0) {
        const nextActiveTab = distance > 0 ? -1 : 1
        const activeTab = oldActiveTab + nextActiveTab
        // 是否无动画
        if (scrollWithoutAnimation) {
          this.speed(this.tabsBox, this.moveDistance, activeTab * -this.containerSize, () => {
            this.goToPage(activeTab)
          })
        } else {
          this.tabsBox.style.transition = transitionParams
          this.goToPage(activeTab)
        }
        // 否则判断是否无动画更新回去
      } else if (scrollWithoutAnimation) {
        this.speed(this.tabsBox, this.moveDistance, oldActiveTab * -this.containerSize)
      } else {
        this.forceUpdate()
      }
    }
  }

  render() {
    const { children, tabLabels, infinite, isDot, dotWrapStyle, dotStyle, dotActiveStyle, locked, renderTabBar, vertical } = this.props
    const { activeTab, loadTabList } = this.state

    this.tabChildren = this._children(
      children,
      (child, index) => child && React.cloneElement(child, { key: get(tabLabels, index) || index })
    )
    // 无限轮播拼接children
    if (infinite) {
      this.tabChildren = this.setInfiniteChildren()
    }
    this.tabsLen = size(this.tabChildren)
    const containerStype = vertical ? {
      overflowY: 'hidden',
      flexDirection: 'row',
    } : {
      overflowX: 'hidden',
      flexDirection: 'column',
    }
    let eventProps = {}
    if (!locked) {
      eventProps = {
        onTouchStart: this._onTouchStart,
        onTouchMove: this._onTouchMove,
        onTouchEnd: this._onTouchEnd,
      }
    }

    return (
      <div
        style={mergeStyle(Style.tabsContainer, containerStype)}
        ref={this.setWrapRef}
      >
        {!!renderTabBar &&
          renderTabBar({
            goToPage: (activeTab, isNoAnimated) => this.goToPage(infinite ? activeTab + 1 : activeTab, isNoAnimated),
            tabs: tabLabels || Array.from({ length: infinite ? this.tabsLen - 2 : this.tabsLen }, (v, i) => i),
            activeTab: infinite ? activeTab - 1 : activeTab,
          })}
        <TabsBox
          tabsBoxRefFunc={this.tabsBoxRefFunc}
          tabsLen={this.tabsLen}
          loadTabList={loadTabList}
          tabChildren={this.tabChildren}
          getTransform={this.getTransform}
          vertical={vertical}
          eventProps={eventProps}
        />
        <DotNav
          isDot={isDot}
          infinite={infinite}
          dotWrapStyle={dotWrapStyle}
          tabChildren={this.tabChildren}
          dotStyle={dotStyle}
          activeTab={activeTab}
          dotActiveStyle={dotActiveStyle}
          goToPage={this.goToPage}
          tabsLen={this.tabsLen}
        />
      </div>
    )
  }
}

const TabsBox = ({ tabsBoxRefFunc, tabsLen, loadTabList, tabChildren, getTransform, vertical, eventProps = {} }) => {
  const boxStyle = vertical ? {
    // position: 'absolute', // hack
    height: `${100 * tabsLen}%`,
    flexDirection: 'column',
  } : {
    width: `${100 * tabsLen}%`,
    flexDirection: 'row',
  }

  return (
    <div
      ref={tabsBoxRefFunc}
      className='ios-scroll'
      style={mergeStyle(
        Style.tabsBox,
        boxStyle,
        { transform: getTransform() }
      )}
      {...eventProps}
    >
      {tabChildren.map((child, index) => {
        if (loadTabList.includes(index)) return child

        return <div key={index} style={{ flex: 1 }} />
      })}
    </div>
  )
}

const DotNav = ({
  isDot,
  infinite,
  tabChildren,
  activeTab,
  goToPage,
  dotActiveStyle = {},
  dotStyle = {},
  dotWrapStyle = {},
  tabsLen,
}) => {
  if (isDot) {
    return (
      <div style={mergeStyle(Style.dotWrap, dotWrapStyle)}>
        {tabChildren.map((child, index) => {
          if (infinite && (index === 0 || index === tabsLen - 1)) return null
          const activeStyle = index === activeTab ? mergeStyle(Style.dotItemActive, dotActiveStyle) : {}

          return (
            <div key={index} style={mergeStyle(Style.dotItem, dotStyle, activeStyle)} onClick={() => goToPage(index)} />
          )
        })}
      </div>
    )
  }

  return null
}

const mergeStyle = (...styles) => styles.reduce((p, c) => ({ ...(p || {}), ...(c || {}) }), {})

export const Style = {
  tabsContainer: {
    flex: 1,
    display: 'flex',
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  tabsBox: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
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
    bottom: 20,
  },
  dotItem: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  dotItemActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
}
