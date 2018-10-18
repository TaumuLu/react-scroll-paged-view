import React, { Component } from 'react'
import { PanResponder, Animated } from 'react-native'
import ViewPagedHOC from '../decorators/view-paged-hoc'

const panResponderKey = [
  'onStartShouldSetPanResponder',
  'onStartShouldSetPanResponderCapture',
  'onMoveShouldSetPanResponder',
  'onMoveShouldSetPanResponderCapture',
  'onPanResponderTerminationRequest',
  'onPanResponderTerminate',
  'onShouldBlockNativeResponder',
]


@ViewPagedHOC
export default class ViewPaged extends Component {
  constructor(props) {
    super(props)
    const { locked, infinite, vertical, useScrollView } = props

    let panResponderValue = panResponderKey.reduce((values, key) => ({ [key]: props[key], ...values }), {})
    if (!locked) {
      panResponderValue = {
        ...panResponderValue,
        onPanResponderGrant: this._onPanResponderGrant,
        onPanResponderMove: this._onPanResponderMove,
        onPanResponderRelease: this._onPanResponderRelease,
      }
    }

    this.scrollOnMountCalled = false
    this._isScrollView = !vertical && !infinite && useScrollView
    this._panResponder = PanResponder.create(panResponderValue)
    this._AnimatedViewProps = this._panResponder.panHandlers
  }

  _getStyles() {
    const { props: { vertical }, state: { pos } } = this
    const key = vertical ? 'top' : 'left'

    return {
      AnimatedStyle: {
        [key]: pos,
      },
    }
  }

  _getDistance(gestureState) {
    const { vertical } = this.props
    const suffix = vertical ? 'y' : 'x'
    return gestureState[`d${suffix}`]
  }

  _onPanResponderGrant = (evt, gestureState) => {
    this._TouchStartEvent()
  }

  _onPanResponderMove = (evt, gestureState) => {
    this._TouchMoveEvent(gestureState)
  }

  _onPanResponderRelease = (evt, gestureState) => {
    this._TouchEndEvent(gestureState)
  }

  _onLayout = ({ nativeEvent }) => {
    const { width, height } = nativeEvent.layout || {}
    this._runMeasurements(width, height)
  }

  _scrollToPage = (posPage = this._posPage, hasAnimation = this.props.hasAnimation) => {
    const { width } = this.state
    this._posPage = posPage

    const offset = this._posPage * width
    if (this.scrollView) {
      const animated = hasAnimation
      this.scrollView.getNode().scrollTo({ x: offset, y: 0, animated })
    }

    this._onChange()
  }

  // _onScrollViewTouchStart = () => {
  //   this._referX = null
  //   this._startDirection = null
  // }

  // _onScrollViewTouchEnd = () => {
  //   this._referX = null
  //   this._isTouchEnd = true
  //   // this._endDirection = null
  // }

  _onScroll = (event) => {
    // const { nativeEvent } = event
    const { onScroll } = this.props
    // const { x } = nativeEvent.contentOffset

    // // 优化体验，提前预知需要加载的下一页，避免监听onMomentumScrollEnd需等待滚动结束后才开始加载
    // if (!this._referX) {
    //   this._referX = x
    // } else if (!this._startDirection) {
    //   this._startDirection = x > this._referX ? 'right' : 'left'
    // } else if (this._isTouchEnd) {
    //   const _endDirection = x > this._referX ? 'right' : 'left'
    //   if (this._startDirection === _endDirection) {
    //     let newPosPage = this._posPage
    //     if (_endDirection === 'right') {
    //       newPosPage = this._posPage + 1
    //     } else {
    //       newPosPage = this._posPage - 1
    //     }
    //     // 处理ios两侧回弹计算错误，用scrollView不会处理无限滚动
    //     if (newPosPage >= 0 && newPosPage < this._childrenSize) {
    //       this._posPage = newPosPage
    //       this._onChange()
    //     }
    //   }

    //   this._isTouchEnd = false
    // }

    onScroll && onScroll(event)
  }

  _onMomentumScrollHandle = ({ nativeEvent }) => {
    const { width } = this.state
    const offsetX = nativeEvent.contentOffset.x
    this._posPage = Math.round(offsetX / width)

    this._onChange()
  }

  _setScrollViewRef = (scrollView) => {
    this.scrollView = scrollView
  }

  _renderContent() {
    if (this._isScrollView) {
      const { locked, scrollViewProps } = this.props
      const { width, pos } = this.state

      return (
        <Animated.ScrollView
          automaticallyAdjustContentInsets={false}
          // onScrollBeginDrag={this._onScrollViewTouchStart}
          // onScrollEndDrag={this._onScrollViewTouchEnd}
          onMomentumScrollBegin={this._onMomentumScrollHandle}
          onMomentumScrollEnd={this._onMomentumScrollHandle}
          scrollEventThrottle={16}
          scrollsToTop={false}
          showsHorizontalScrollIndicator={false}
          directionalLockEnabled
          alwaysBounceVertical={false}
          // keyboardDismissMode='on-drag'
          {...scrollViewProps}
          horizontal
          pagingEnabled
          contentOffset={{ x: this._initialPage * width }}
          ref={this._setScrollViewRef}
          scrollEnabled={!locked}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: pos } } }],
            { useNativeDriver: true, listener: this._onScroll }
          )}
        >
          {this._renderPage()}
        </Animated.ScrollView>
      )
    }

    return null
  }
}
