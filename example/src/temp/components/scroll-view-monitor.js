import React, { Component } from 'react'
import { ScrollView, Animated, PanResponder } from 'react-native'
// import { isAndroid } from '../utils'


export default class ScrollViewMonitor extends Component {

  constructor(props) {
    super(props)
    this.state = {
      pos: new Animated.Value(0),
      width: 0,
      height: 0,
    }

    this._lastPos = 0
    this.scrollHeight = 0
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.defaultResponder(true),
      onStartShouldSetPanResponderCapture: this.defaultResponder(false),
      onMoveShouldSetPanResponder: this.defaultResponder(true),
      onMoveShouldSetPanResponderCapture: this.defaultResponder(false),
      onPanResponderTerminationRequest: this.defaultResponder(true),

      onPanResponderGrant: (evt, gestureState) => {
        this.decayTigger = false
        this.state.pos.stopAnimation()
      },
      onPanResponderMove: (evt, gestureState) => {
        if (this.decayTigger) this.decayTigger = false

        const nextValue = this._lastPos + gestureState.dy
        // console.log('Move', nextValue)
        if (this.borderJudge(nextValue)) {
          this.state.pos.setValue(nextValue)
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        this._lastPos += gestureState.dy
        const isScope = this.borderJudge(this._lastPos, (value) => {
          this._lastPos = value
        })

        if (isScope) {
          this.decayTigger = true
          Animated.decay(this.state.pos, {
            velocity: gestureState.vy,
            deceleration: 0.997,
            // useNativeDriver: true,
          }).start()
        }
        // console.log('Release', gestureState.dy)
      },
      onPanResponderTerminate: (evt, gestureState) => {
      },
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    })

    this.state.pos.addListener(({ value }) => {
      if (this.decayTigger) {
        const isScope = this.borderJudge(this._lastPos, (value) => {
          this.state.pos.stopAnimation()
          this.state.pos.setValue(value)
          this._lastPos = value
        })

        if (isScope) {
          this._lastPos = value
        }
      }
    })
  }

  setLayoutInfo = ({ nativeEvent }) => {
    const { layout: { height, y } } = nativeEvent
    if (height > this.scrollHeight) {
      this.scrollHeight = height
    }
  }

  defaultResponder = isResponder => (evt, gestureState) => isResponder

  borderJudge = (value, callback) => {
    const { height } = this.state
    const maxDistance = -(this.scrollHeight - height)
    const isBeyondTop = value > 0
    const isBeyondBottom = value < maxDistance
    const isScope = !isBeyondTop && !isBeyondBottom

    if (!isScope && callback) {
      const value = isBeyondTop ? 0 : maxDistance
      callback(value)
    }

    return isScope
  }

  viewRef = (ref) => {
    this._viewRef = ref
  }

  _runAfterMeasurements = (width, height) => {
    this.setState({ width, height })
  }

  render() {
    const { children, ...nativeProps } = this.props

    return (
      <ScrollView
        bounces={false}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
        // overScrollMode={'never'}
        // scrollEnabled={false}
        {...nativeProps}
      >
        {children}
      </ScrollView>
    )

    // if (!this.state.width && !this.state.height) {
    //   // Use a transparent screen to render so we can calculate width & height
    //   return (
    //     <View style={{ flex: 1 }}>
    //       <View
    //         style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent' }}
    //         onLayout={(e) => {
    //           const { width, height } = e.nativeEvent.layout
    //           this._runAfterMeasurements(width, height)
    //         }}
    //       />
    //     </View>
    //   )
    // }

    // const containerStyle = {
    //   // flex: 1,
    //   top: this.state.pos,
    //   flexDirection: 'column',
    //   // overflow: 'scroll',
    // }

    // // if (isAndroid) {
    // return (
    //   <Animated.View
    //     ref={this.viewRef}
    //     onLayout={this.setLayoutInfo}
    //     style={containerStyle}
    //     {...this._panResponder.panHandlers}
    //   >
    //     {children}
    //   </Animated.View>
    // )
    // // }
  }
}
