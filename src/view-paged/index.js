import React, { Component } from 'react'
import { View, PanResponder, Easing, Animated, Dimensions } from 'react-native'

import ViewPagedHOC from '../decorators/view-paged-hoc'


const AnimatedView = Animated.View

const Style = {
  containerStyle: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  wrapStyle: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  AnimatedStyle: {
    flex: 1,
  },
  pageStyle: {},
}

const panResponderKey = [
  'onStartShouldSetPanResponder',
  'onStartShouldSetPanResponderCapture',
  'onMoveShouldSetPanResponder',
  'onMoveShouldSetPanResponderCapture',
  'onPanResponderTerminationRequest',
  'onPanResponderTerminate',
  'onShouldBlockNativeResponder',
]

@ViewPagedHOC({ Animated, Easing, Style, View, AnimatedView })
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
    if (this._isScrollView) {
      const { width } = Dimensions.get('window')
      const pos = new Animated.Value(0)
      const widthAnimatedValue = new Animated.Value(width)
      widthAnimatedValue.__makeNative()
      const scrollValue = Animated.divide(pos, widthAnimatedValue)
      const callListeners = this._polyfillAnimatedValue(scrollValue)
      pos.addListener(({ value }) => callListeners(value / width))

      this.state = {
        pos,
        width,
        scrollValue,
      }
    }
  }

  _getStyle() {
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

  _polyfillAnimatedValue(animatedValue) {
    const listeners = new Set()
    const addListener = (listener) => {
      listeners.add(listener)
    }

    const removeListener = (listener) => {
      listeners.delete(listener)
    }

    const removeAllListeners = () => {
      listeners.clear()
    }

    animatedValue.addListener = addListener
    animatedValue.removeListener = removeListener
    animatedValue.removeAllListeners = removeAllListeners
    return value => listeners.forEach(listener => listener({ value }))
  }

  _onLayout = ({ nativeEvent }) => {
    const { width, height } = nativeEvent.layout || {}
    const initialState = this._runMeasurements(width, height)
    if (!initialState) return
    let { pos } = initialState

    if (this._isScrollView) {
      pos = this.state.pos
      let scrollValue = this.state.scrollValue

      if (width !== this.state.width) {
        const widthAnimatedValue = new Animated.Value(width)
        widthAnimatedValue.__makeNative()
        scrollValue = Animated.divide(pos, widthAnimatedValue)
        // const callListeners = this._polyfillAnimatedValue(scrollValue)
        // pos.addListener(({ value }) => callListeners(value / width))
        this.setState({ scrollValue })
      }
      this.setState({ pos })
      // requestAnimationFrame(() => {
      //   this._scrollToPage(this._posPage, false)
      // })
    }
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

  _onScroll = ({ nativeEvent }) => {
    const { width } = this.state
    const { onScroll } = this.props
    const offsetX = nativeEvent.contentOffset.x

    if (offsetX === 0 && !this.scrollOnMountCalled) {
      this.scrollOnMountCalled = true
    } else {
      onScroll && onScroll(offsetX / width)
    }
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

  _renderContent(styles) {
    if (this._isScrollView) {
      const { pageStyle } = styles
      const { locked, scrollViewProps } = this.props
      const { width, pos } = this.state

      return (
        <Animated.ScrollView
          horizontal
          pagingEnabled
          automaticallyAdjustContentInsets={false}
          contentOffset={{ x: this._initialPage * width }}
          ref={this._setScrollViewRef}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: pos } } }],
            { useNativeDriver: true, listener: this._onScroll }
          )}
          // onMomentumScrollBegin={this._onMomentumScrollHandle}
          onMomentumScrollEnd={this._onMomentumScrollHandle}
          scrollEventThrottle={16}
          scrollsToTop={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={!locked}
          directionalLockEnabled
          alwaysBounceVertical={false}
          // keyboardDismissMode='on-drag'
          {...scrollViewProps}
        >
          {this._renderPage({ pageStyle: { ...pageStyle, width } })}
        </Animated.ScrollView>
      )
    }

    return null
  }
}
