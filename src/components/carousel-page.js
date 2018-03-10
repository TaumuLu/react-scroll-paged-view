
import React, { Component } from 'react'
import {
  View,
  PanResponder,
  Easing,
  Animated
} from 'react-native'
import PropTypes from 'prop-types'

export default class CarouselPage extends Component {

  static propTypes = {
    initialPage: PropTypes.number,
    vertical: PropTypes.bool,
    animationDuration: PropTypes.number,
    onPageChange: PropTypes.func,

    children: PropTypes.array.isRequired,
  }

  static defaultProps = {
    initialPage: 0,
    animationDuration: 150,
    vertical: false,
    onPageChange: () => {},
  }

  constructor(props) {
    super(props)
    const { initialPage } = props

    this.state = {
      width: 0,
      height: 0,
      loadIndex: [initialPage],
    }
  }

  componentWillMount() {
    const {
      onStartShouldSetPanResponder = defaultResponder(true),
      onStartShouldSetPanResponderCapture = defaultResponder(false),
      onMoveShouldSetPanResponder = defaultResponder(true),
      onMoveShouldSetPanResponderCapture = defaultResponder(false),
      onPanResponderTerminationRequest = defaultResponder(true),
      onPanResponderTerminate = (evt, gestureState) => {},
    } = this.props

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder,
      onStartShouldSetPanResponderCapture,
      onMoveShouldSetPanResponder,
      onMoveShouldSetPanResponderCapture,
      onPanResponderTerminationRequest,

      onPanResponderGrant: (evt, gestureState) => {},
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderRelease: this._onPanResponderRelease,
      onPanResponderTerminate,
      onShouldBlockNativeResponder: (evt, gestureState) => true,
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
    if (nextValue <= 0 && nextValue >= this.maxPos) {
      this.state.pos.setValue(nextValue)
    }
  }

  _onPanResponderRelease = (evt, gestureState) => {
    const suffix = this.props.vertical ? 'y' : 'x'
    this._lastPos += gestureState[`d${suffix}`]
    const page = this._getPageForOffset(this._lastPos, gestureState[`d${suffix}`])
    this.animateToPage(page)
  }

  _getPosForPage(pageNb) {
    return -pageNb * this._boxSize
  }

  _getPageForOffset(offset, diff) {
    const boxPos = Math.abs(offset / this._boxSize)
    let index

    if (diff < 0) {
      // Scrolling forwards
      index = Math.ceil(boxPos)
    } else {
      // Scrolling backwards
      index = Math.floor(boxPos)
    }

    // Make sure index is within bounds
    if (index < 0) {
      index = 0
    } else if (index > this.props.children.length - 1) {
      index = this.props.children.length - 1
    }

    return index
  }

  _runAfterMeasurements(width, height) {
    const length = this.props.vertical ? height : width
    this._boxSize = length
    this.maxPos = -(this.len - 1) * this._boxSize

    let initialPage = this.props.initialPage || 0
    if (initialPage < 0) {
      initialPage = 0
    } else if (initialPage >= this.props.children.length) {
      initialPage = this.props.children.length - 1
    }

    this._currentPage = initialPage
    this._lastPos = this._getPosForPage(this._currentPage)

    this.setState({
      width,
      height,
      pos: new Animated.Value(this._getPosForPage(this._currentPage)),
    })
  }

  animateToPage(page) {
    const animations = []
    // if (this._currentPage !== page) {
    // }

    const toValue = this._getPosForPage(page)

    animations.push(
      Animated.timing(this.state.pos, {
        toValue,
        duration: this.props.animationDuration,
        easing: Easing.out(Easing.ease),
      })
    )

    Animated.parallel(animations).start()

    this._lastPos = toValue
    this._currentPage = page

    const { loadIndex } = this.state

    this.props.onPageChange(page)
    if (!loadIndex.includes(page)) {
      loadIndex.push(page)
    }
    // 先设置state再onPageChange提前加载得知需要scrollView的组件
    this.setState({ loadIndex }, () => {
      this.props.onPageChangeAfter(page)
    })
  }

  goToPage(index) {
    if (index < 0 || index > this.props.children.length - 1) {
      return
    }

    this.animateToPage(index)
  }

  _children(children = this.props.children, handleFunc = child => child) {
    return React.Children.map(children, handleFunc)
  }

  render() {
    this.childrenList = this._children()
    this.len = this.childrenList.length

    if (!this.state.width && !this.state.height) {
      // 先行计算容器尺寸
      return (
        <View style={{ flex: 1 }}>
          <View
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent' }}
            onLayout={(evt) => {
              const width = evt.nativeEvent.layout.width
              const height = evt.nativeEvent.layout.height
              this._runAfterMeasurements(width, height)
            }}
          />
        </View>
      )
    }

    const { wrapStyle, containerStyle, boxStyle } = this.getViewStyle()
    const { loadIndex } = this.state

    return (
      <View style={wrapStyle}>
        <Animated.View
          style={containerStyle}
          {...this._panResponder.panHandlers}
        >
          {this.childrenList.map((page, index) => {
            return (
              <Animated.View
                key={index}
                style={boxStyle}
              >
                {loadIndex.includes(index) ? React.cloneElement(page, { pageIndex: index }) : null}
              </Animated.View>
            )
          })}
        </Animated.View>
      </View>
    )
  }
}


const defaultResponder = isResponder => (evt, gestureState) => isResponder

const setViewStyle = (styleList = [], addStyleList = []) => {
  return styleList.map((itemStyle = {}, i) => {
    return Object.assign({}, itemStyle, addStyleList[i] || {})
  })
}
