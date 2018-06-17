import React, { Component } from 'react'
import { View, PanResponder, Easing, Animated } from 'react-native'

import { noop } from '../utils'
import ViewPagedHOC from '../decorators/view-paged-hoc'


@ViewPagedHOC(Animated, Easing)
export default class ViewPaged extends Component {
  componentWillMount() {
    const {
      onStartShouldSetPanResponder,
      onStartShouldSetPanResponderCapture,
      onMoveShouldSetPanResponder,
      onMoveShouldSetPanResponderCapture,
      onPanResponderTerminationRequest,
      onPanResponderTerminate,
      onShouldBlockNativeResponder,
    } = this.props

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder,
      onStartShouldSetPanResponderCapture,
      onMoveShouldSetPanResponder,
      onMoveShouldSetPanResponderCapture,
      onPanResponderTerminationRequest,
      onPanResponderTerminate,
      onShouldBlockNativeResponder,

      onPanResponderGrant: noop,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderRelease: this._onPanResponderRelease,
    })
  }

  getViewStyle = () => {
    const { props: { vertical }, state: { pos }, _boxSize } = this
    let wrapStyle = {
      flex: 1,
      overflow: 'hidden',
    }
    let containerStyle = { flex: 1 }
    let boxStyle = {}
    const styleList = [wrapStyle, containerStyle, boxStyle]

    if (vertical) {
      [wrapStyle, containerStyle, boxStyle] = setViewStyle(styleList, [
        { flexDirection: 'column' },
        { top: pos, flexDirection: 'column' },
        { height: _boxSize },
      ])
    } else {
      [wrapStyle, containerStyle, boxStyle] = setViewStyle(styleList, [
        { flexDirection: 'row' },
        { left: pos, flexDirection: 'row' },
        { width: _boxSize },
      ])
    }

    return {
      wrapStyle,
      containerStyle,
      boxStyle,
    }
  }

  _onPanResponderMove = (evt, gestureState) => {
    const suffix = this.props.vertical ? 'y' : 'x'
    const nextValue = this._lastPos + gestureState[`d${suffix}`]

    // 加入回弹限制
    if (nextValue <= 0 && nextValue >= this._maxPos) {
      this.state.pos.setValue(nextValue)
    }
  }

  _onPanResponderRelease = (evt, gestureState) => {
    const suffix = this.props.vertical ? 'y' : 'x'
    this._lastPos += gestureState[`d${suffix}`]

    const page = this._getPageForPos(gestureState[`d${suffix}`])
    this._goToPage(page)
  }

  _onLayout = (e) => {
    const { width, height } = e.nativeEvent.layout || {}
    this._runMeasurements(width, height)
  }

  _renderMeasurements(initialStyle) {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={initialStyle}
          onLayout={this._onLayout}
        />
      </View>
    )
  }

  render() {
    const { wrapStyle, containerStyle, boxStyle } = this.getViewStyle()
    const { style } = this.props
    const { loadIndex } = this.state

    return (
      <View style={[style, wrapStyle]}>
        <Animated.View
          style={containerStyle}
          {...this._panResponder.panHandlers}
        >
          {this.childrenList.map((page, index) => {
            return (
              <View
                key={index}
                style={boxStyle}
              >
                {loadIndex.includes(index) ? React.cloneElement(page, { pageIndex: index }) : null}
              </View>
            )
          })}
        </Animated.View>
      </View>
    )
  }
}


const setViewStyle = (styleList = [], addStyleList = []) => {
  return styleList.map((itemStyle = {}, i) => {
    return Object.assign({}, itemStyle, addStyleList[i] || {})
  })
}
