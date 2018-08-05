import React, { Component } from 'react'
import { View, PanResponder, Easing, Animated } from 'react-native'

import { getMergeObject, mergeStyle } from '../utils'

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

@ViewPagedHOC(Animated, Easing)
export default class ViewPaged extends Component {
  constructor(props) {
    super(props)
    const { locked } = props

    let panResponderValue = panResponderKey.map(key => props[key])
    if (!locked) {
      panResponderValue = {
        ...panResponderValue,
        onPanResponderGrant: this._onPanResponderGrant,
        onPanResponderMove: this._onPanResponderMove,
        onPanResponderRelease: this._onPanResponderRelease,
      }
    }
    this._panResponder = PanResponder.create(panResponderValue)
  }

  getStyle = () => {
    const { props: { vertical }, state: { pos, width, height }, _boxSize } = this
    let mergeStyle = {}

    if (vertical) {
      mergeStyle = {
        wrapStyle: { flexDirection: 'column' },
        viewPagedStyle: { top: pos, flexDirection: 'column' },
        pageStyle: { height: _boxSize, width },
      }
    } else {
      mergeStyle = {
        wrapStyle: { flexDirection: 'row' },
        viewPagedStyle: { left: pos, flexDirection: 'row' },
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
      <View style={this._getContainerStyle(Style.container)}>
        {this._renderPropsComponent('renderHeader')}
        <View
          style={initialStyle}
          onLayout={this._onLayout}
        >
          {initialChild}
        </View>
        {this._renderPropsComponent('renderFooter')}
      </View>
    )
  }

  render() {
    const { wrapStyle, viewPagedStyle, pageStyle } = this.getStyle()
    const { style } = this.props
    const { loadIndex } = this.state

    return (
      <View style={mergeStyle(style, this._getContainerStyle(Style.container))}>
        {this._renderPropsComponent('renderHeader')}
        <View style={wrapStyle}>
          <Animated.View
            style={viewPagedStyle}
            {...this._panResponder.panHandlers}
          >
            {this.childrenList.map((page, index) => {
              return (
                <View
                  key={index}
                  style={pageStyle}
                >
                  {loadIndex.includes(index) ? page : null}
                </View>
              )
            })}
          </Animated.View>
        </View>
        {this._renderPropsComponent('renderFooter')}
      </View>
    )
  }
}


export const Style = {
  container: { flex: 1, overflow: 'hidden', position: 'relative' },
  wrapStyle: { flex: 1, overflow: 'hidden', position: 'relative' },
  viewPagedStyle: { flex: 1 },
  pageStyle: {},
}
