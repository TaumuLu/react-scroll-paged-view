import React from 'react'
import Connect from './connect'
import { Animated, AnimatedView, Easing, Style, View, SceneComponent } from './../components'
import { size, find, findLast, mergeStyle, getMergeObject } from '../utils'

// position: 'absolute', top: 0, left: 0, right: 0, bottom: 0
// const initialStyle = { flex: 1, display: 'flex', backgroundColor: 'transparent' }
const longSwipesMs = 300
const flexDirectionMap = {
  top: 'column',
  bottom: 'column-reverse',
  left: 'row',
  right: 'row-reverse',
}


export default function ViewPageHOC(WrappedComponent) {
  @Connect
  class ViewPaged extends WrappedComponent {
    constructor(props) {
      super(props)
      const { infinite } = props
      this._posPage = this.getCheckInitialPage()
      if (infinite) {
        this._posPage += 1
      }
      // 真正的初始页
      this._initialPage = this._posPage
      const pos = new Animated.Value(0)
      this._posListener = this._saveListener(pos)

      this.state = {
        width: 0,
        height: 0,
        pos,
        isReady: false,
        loadIndex: [this._initialPage],
      }

      this._lastPos = 0
      this._autoPlayTimer = null
      this.currentPage = this._getCurrnetPage()
      this._addIndexs = []
    }

    componentDidMount() {
      if (super.componentDidMount) {
        super.componentDidMount()
      }
      this.autoPlay()
    }

    // 检验纠正初始页参数
    getCheckInitialPage() {
      let { initialPage } = this.props
      if (initialPage < 0) {
        initialPage = 0
      } else if (initialPage >= this._childrenSize) {
        initialPage = this._childrenSize - 1
      }

      return initialPage
    }

    autoPlay() {
      const { autoPlay, autoPlaySpeed } = this.props
      if (autoPlay) {
        this._clearAutoPlayTimer()
        // 排除第0页时重置操作，否则更新pos至下次连续切换
        if (this._posPage && this._resetLastPos()) {
          this._updateAnimatedValue(this._lastPos)
        }

        this._autoPlayTimer = setTimeout(() => {
          const nextPosPage = this._getNextPosPage()
          this._goToPage(nextPosPage)
            // this.autoPlay()
        }, autoPlaySpeed)
      }
    }

    // 计算下一索引，针对无限滚动
    _getNextPosPage() {
      const { infinite } = this.props
      const nextPosPage = this._posPage + 1
      if (nextPosPage > this.childrenSize - 1) {
        return infinite ? 2 : 0
      }

      return nextPosPage
    }

    _getCurrnetPage() {
      return this._getCurrentPageForPosPage(this._posPage)
    }

    _getCurrentPageForPosPage(posPage) {
      const { infinite } = this.props
      if (infinite) {
        switch (posPage) {
          case 0:
            return this.childrenSize - 3
          case this.childrenSize - 1:
            return 0
          default:
            return posPage - 1
        }
      }
      return posPage
    }

    _getPosPageForCurrentPage(page) {
      const { infinite } = this.props
      if (infinite) {
        return page + 1
      }
      return page
    }

    // 计算重制跳转页
    _getResetPage() {
      const { _posPage } = this
      const { infinite } = this.props
      if (infinite) {
        if (_posPage === 0) {
          return this._childrenSize
        } else if (_posPage === this._childrenSize + 1) {
          // return _posPage - this._childrenSize
          return 1
        }
      }
      return _posPage
    }

    // 无限滚动重置滚动位置
    _resetLastPos() {
      const { _posPage } = this
      const page = this._getResetPage()
      if (page !== _posPage) {
        this._lastPos = this._getPosForPage(page)
        return true
      }
      return false
    }

    // 判断未无限滚动时是否到头不可拖动
    _isMoveBorder = (distance) => {
      const { locked, infinite } = this.props
      if (locked) return false
      if (infinite) return infinite

      if (distance > 0 && this.currentPage !== 0) return true
      if (distance < 0 && this.currentPage + 1 !== this.childrenSize) return true

      return false
    }

    _TouchStartEvent() {
      if (!this.state.isReady) return

      this._touchSartTime = Date.now()

      this._clearAutoPlayTimer()
    }

    _TouchMoveEvent(TouchState) {
      if (!this.state.isReady) return
      const { isMovingRender } = this.props

      this._resetLastPos()
      const distance = this._getDistance(TouchState)
      const nextValue = this._lastPos + distance
      if (isMovingRender) {
        // 预加载页数
        const posPage = this._getPageForPos(distance, nextValue)
        this._onChange(posPage, true, false)
      }

      this._updateAnimatedValue(nextValue)
    }

    _TouchEndEvent(TouchState) {
      this._addIndexs = []
      if (!this.state.isReady) return

      const distance = this._getDistance(TouchState)
      const { _boxSize, _touchSartTime } = this
      const judgeSize = _boxSize / 3
      const touchEndTime = Date.now()

      // 检测边界拖动
      if (this._isMoveBorder(distance)) {
        const diffTime = touchEndTime - _touchSartTime
        // 满足移动跳转下一页条件
        if ((diffTime <= longSwipesMs || Math.abs(distance) >= judgeSize) && distance !== 0) {
          this._lastPos += distance
        }

        // 重置或跳转下一页
        const posPage = this._getPageForPos(distance)
        this._goToPage(posPage, true)
      }

      // this.autoPlay()
    }

    // 对外提供跳转页数，检验页数正确性
    goToPage = (page) => {
      if (page < 0 || page > this._childrenSize - 1) {
        return
      }

      this._clearAutoPlayTimer()
      const posPage = this._getPosPageForCurrentPage(page)
      // RN scrollView走自己的处理方法
      if (this._isScrollView) {
        this._scrollToPage(posPage)
      } else {
        this._goToPage(posPage)
      }
    }

    // 对内提供跳转页数，传入定位的页数
    _goToPage(posPage, hasAnimation) {
      if (!this.state.isReady) return

      this._posPage = posPage
      // 使用传入的下一页值，非计算的下一页值，无限滚动懒加载用
      this._lastPos = this._getPosForPage(this._posPage)
      // 处理切换动画
      this._updateAnimatedQueue(hasAnimation)
      const nextPage = this._getCurrnetPage()
      // 没有跳转页仅仅重置动画return处理，只有1页的除外，让1页也可以无限循环
      if (this._childrenSize > 1 && +nextPage === +this.currentPage) return

      this._onChange()
    }

    _onChange(_posPage = this._posPage, isDiff = false, isOnChange = true) {
      const { loadIndex: oldLoadIndex } = this.state
      const loadIndex = oldLoadIndex.slice()

      this._prevPage = this.currentPage
      this.currentPage = this._getCurrnetPage()
      if (loadIndex.indexOf(_posPage) === -1) {
        loadIndex.push(_posPage)
        this._addIndexs.push(_posPage)
        // 加载未重置的页
        const page = this._getResetPage()
        if (page !== this._posPage) {
          loadIndex.push(page)
          this._addIndexs.push(page)
        }
      }

      const { onChange } = this.props
      // 减少空render次数
      if (!isDiff || size(loadIndex) !== size(oldLoadIndex)) {
        this.setState({ loadIndex }, () => {
          if (isOnChange) {
            onChange(this.currentPage, this._prevPage)
          }
        })
      } else {
        if (isOnChange) {
          onChange(this.currentPage, this._prevPage)
        }
        this._addIndexs = []
      }
    }

    // move时设置动画值
    _updateAnimatedValue(nextValue) {
      const { infinite } = this.props
      if (!infinite) {
        // 回弹限制
        if (nextValue <= 0 && nextValue >= this._maxPos) {
          this.state.pos.setValue(nextValue)
        }
      } else {
        this.state.pos.setValue(nextValue)
      }
    }

    _updateAnimatedQueue(hasAnimation = this.props.hasAnimation) {
      const { duration } = this.props
      const { pos } = this.state
      const animations = []
      const toValue = this._lastPos

      if (hasAnimation) {
        animations.push(
          Animated.timing(pos, {
            toValue,
            duration,
            easing: Easing.out(Easing.ease),  // default
          })
        )
        this._clearAutoPlayTimer()
        Animated.parallel(animations).start(() => {
          // 所有类型的动画结束后都启用下次的自动播放，其他地方只用关心何时关闭循环
          this.autoPlay()
        })
      } else {
        this.state.pos.setValue(toValue)
      }
    }

    _getPosForPage(page) {
      return -page * this._boxSize
    }

    _getPageForPos(distance, _lastPos = this._lastPos) {
      const pageDecimal = Math.abs(_lastPos / this._boxSize)
      let page

      if (distance < 0) {
        page = Math.ceil(pageDecimal)
      } else {
        page = Math.floor(pageDecimal)
      }

      if (page < 0) {
        page = 0
      } else if (page > this.childrenSize - 1) {
        page = this.childrenSize - 1
      }

      return page
    }

    // 无限轮播拼接children
    getInfiniteChildren = () => {
      const head = findLast(this.childrenList, child => !!child)
      const foot = find(this.childrenList, child => !!child)

      return [
        React.cloneElement(head, { key: 'page-head' }),
        ...this.childrenList,
        React.cloneElement(foot, { key: 'page-foot' }),
      ]
    }

    _clearAutoPlayTimer() {
      clearTimeout(this._autoPlayTimer)
    }

    componentWillUnmount() {
      this._clearAutoPlayTimer()
    }

    _checkRenderComponent(key, props = {}) {
      const Component = this.props[key]
      if (Component) {
        const element = Component(props) || null
        // 使用cloneElement防止重复创建组件
        return element && React.cloneElement(element, { key })
        // return (
        //   <Component key={key} {...props}/>
        // )
      }
      return null
    }

    _renderPropsComponent(key) {
      const { width, height, pos } = this.state
      const { vertical } = this.props

      return this._checkRenderComponent(key, {
        activeTab: this.currentPage,
        goToPage: this.goToPage,
        vertical,
        width,
        height,
        pos,
      })
    }

    _saveListener(animatedValue) {
      const listeners = new Set()
      const { addListener } = animatedValue
      animatedValue.addListener = (listener) => {
        let wrapListener = listener
        if (!this._isScrollView) {
          wrapListener = (params) => {
            // 模拟scrollView取反给正向值
            const value = -params.value
            listener({ value })
          }
        }
        listeners.add(wrapListener)
        addListener.call(animatedValue, wrapListener)
      }

      return listeners
    }

    _restoreListener(animatedValue, listeners) {
      listeners.forEach((listener) => {
        animatedValue.addListener(listener)
      })
    }

    _runMeasurements(width, height) {
      const { vertical } = this.props

      this._boxSize = vertical ? height : width
      this._maxPos = -(this.childrenSize - 1) * this._boxSize
      this._lastPos = this._getPosForPage(this._posPage)
      const pos = new Animated.Value(this._lastPos)
      // 恢复pos监听的回掉
      this._restoreListener(pos, this._posListener)

      const initialState = {
        isReady: true,
        width,
        height,
        pos,
      }

      this.setState(initialState)
      return initialState
    }

    _getStyles(isClearCache) {
      if (isClearCache) this.Styles = null
      if (this.Styles) return this.Styles

      const { props: { vertical, renderPosition, style }, state: { isReady, width, height }, _boxSize } = this
      const flexDirection = flexDirectionMap[renderPosition] || flexDirectionMap.top
      let commonStyle = {
        containerStyle: {
          flexDirection,
        },
      }

      if (vertical) {
        commonStyle = {
          ...commonStyle,
          wrapStyle: { flexDirection: 'column' },
          AnimatedStyle: { flexDirection: 'column' },
          pageStyle: { height: _boxSize, width },
        }
      } else {
        commonStyle = {
          ...commonStyle,
          wrapStyle: { flexDirection: 'row' },
          AnimatedStyle: { flexDirection: 'row' },
          pageStyle: { width: _boxSize, height },
        }
      }

      const mergeStyles = getMergeObject(commonStyle, super._getStyles())
      const Styles = getMergeObject(Style, mergeStyles)

      if (isReady) {
        Styles.containerStyle = mergeStyle(style, Styles.containerStyle)
      } else {
        // 不需要设置initialStyle，在android上会造成setState后不展示子视图的问题
        // Style.wrapStyle = initialStyle
        // Style.AnimatedStyle = initialStyle
        Styles.pageStyle = {
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
        }
      }

      this.Styles = Styles

      return this.Styles
    }

    _shouldRenderPage(index) {
      const { preRenderRange } = this.props
      const hasRange = index < (this._posPage + preRenderRange + 1) && index > (this._posPage - preRenderRange - 1)
      const hasIndex = this._addIndexs.includes(index)
      const isUpdate = hasRange || hasIndex

      return isUpdate
    }

    _renderPage() {
      const { isReady, loadIndex } = this.state
      const { pageStyle } = this._getStyles()

      return this.childrenList.map((page, index) => {
        const isRender = loadIndex.includes(index)

        return (
          <SceneComponent
            key={index}
            shouldUpdated={this._shouldRenderPage(index)}
            style={!isReady ? isRender ? pageStyle : {} : pageStyle}
          >
            {isRender ? page : null}
          </SceneComponent>
        )
      })
    }

    _renderContent() {
      let superRender = null
      if (super._renderContent) {
        superRender = super._renderContent()
        if (superRender) return superRender
      }
      const { AnimatedStyle } = this._getStyles()

      return (
        <AnimatedView
          style={AnimatedStyle}
          {...this._AnimatedViewProps}
        >
          {this._renderPage()}
        </AnimatedView>
      )
    }

    render() {
      const { infinite } = this.props
      const { isReady } = this.state

      if (infinite) {
        this.childrenList = this.getInfiniteChildren()
        this.childrenSize = size(this.childrenList)
      }
      const { containerStyle, wrapStyle } = this._getStyles(true)

      return (
        <View style={containerStyle}>
          {this._renderPropsComponent('renderHeader')}
          <View style={wrapStyle} onLayout={!isReady ? this._onLayout : null}>
            {this._renderContent()}
          </View>
          {this._renderPropsComponent('renderFooter')}
        </View>
      )
    }
  }

  return ViewPaged
}

