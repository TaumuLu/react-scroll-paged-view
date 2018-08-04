import React, { Component } from 'react'
import { View, PanResponder, Easing, Animated } from 'react-native'

import { getMergeObject, mergeStyle } from '../utils'
import ViewPagedHOC from '../decorators/view-paged-hoc'


@ViewPagedHOC(Animated, Easing)
export default class ViewPaged extends Component {
  constructor(props) {
    super(props)

    const {
      onStartShouldSetPanResponder,
      onStartShouldSetPanResponderCapture,
      onMoveShouldSetPanResponder,
      onMoveShouldSetPanResponderCapture,
      onPanResponderTerminationRequest,
      onPanResponderTerminate,
      onShouldBlockNativeResponder,
    } = props

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder,
      onStartShouldSetPanResponderCapture,
      onMoveShouldSetPanResponder,
      onMoveShouldSetPanResponderCapture,
      onPanResponderTerminationRequest,
      onPanResponderTerminate,
      onShouldBlockNativeResponder,

      onPanResponderGrant: this._onPanResponderGrant,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderRelease: this._onPanResponderRelease,
    })
  }

  getStyle = () => {
    const { props: { vertical }, state: { pos, width, height }, _boxSize } = this
    let mergeStyle = {}

    if (vertical) {
      mergeStyle = {
        wrapStyle: { flexDirection: 'column' },
        containerStyle: { top: pos, flexDirection: 'column' },
        pageStyle: { height: _boxSize, width },
      }
    } else {
      mergeStyle = {
        wrapStyle: { flexDirection: 'row' },
        containerStyle: { left: pos, flexDirection: 'row' },
        pageStyle: { width: _boxSize, height },
      }
    }

    return getMergeObject(Style, mergeStyle)
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

  _renderMeasurements(initialStyle, initialChild) {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={initialStyle}
          onLayout={this._onLayout}
        >
          {initialChild}
        </View>
      </View>
    )
  }

  render() {
    const { wrapStyle, containerStyle, pageStyle } = this.getStyle()
    const { style } = this.props
    const { loadIndex } = this.state

    return (
      <View style={mergeStyle(style, wrapStyle)}>
        <Animated.View
          style={containerStyle}
          {...this._panResponder.panHandlers}
        >
          {this.childrenList.map((page, index) => {
            return (
              <View
                key={index}
                style={pageStyle}
              >
                {loadIndex.includes(index) ? React.cloneElement(page) : null}
              </View>
            )
          })}
        </Animated.View>
      </View>
    )
  }
}


export const Style = {
  wrapStyle: { flex: 1, overflow: 'hidden' },
  containerStyle: { flex: 1 },
  pageStyle: {},
}
