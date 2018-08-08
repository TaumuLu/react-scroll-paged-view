import React, { Component } from 'react'
import { View, PanResponder, Easing, Animated } from 'react-native'

import ViewPagedHOC from '../decorators/view-paged-hoc'


@ViewPagedHOC(Animated, Easing)
export default class ViewPaged extends Component {
  constructor(props) {
    super(props)
    const { locked } = props

    let panResponderValue = panResponderKey.reduce((values, key) => ({ [key]: props[key], ...values }), {})
    if (!locked) {
      panResponderValue = {
        ...panResponderValue,
        onPanResponderGrant: this._onPanResponderGrant,
        onPanResponderMove: this._onPanResponderMove,
        onPanResponderRelease: this._onPanResponderRelease,
      }
    }
    this._panResponder = PanResponder.create(panResponderValue)
    this._AnimatedViewProps = this._panResponder.panHandlers
  }

  Style = Style
  View = View
  AnimatedView = Animated.View

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

  _onLayout = (e) => {
    const { width, height } = e.nativeEvent.layout || {}
    this._runMeasurements(width, height)
  }
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

export const Style = {
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
