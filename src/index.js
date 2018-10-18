import React, { Component } from 'react'
import { isAndroid, isEmpty, getMergeObject } from './utils'
import { ScrollPagedHOC } from './decorators'
import { AgentScrollView } from './components'
import ViewPaged from './view-paged'


@ScrollPagedHOC
export default class ScrollPagedView extends Component {
  constructor(props) {
    super(props)

    this._viewPagedProps = {
      onStartShouldSetPanResponder: this._startResponder,
      onMoveShouldSetPanResponder: this._moveResponder,
      onStartShouldSetPanResponderCapture: this._startResponderCapture,
      onMoveShouldSetPanResponderCapture: this._moveResponderCapture,
      onPanResponderTerminationRequest: this._onPanResponderTerminationRequest,
      // onShouldBlockNativeResponder: this._onShouldBlockNativeResponder,
      // onPanResponderTerminate: this._onPanResponderTerminate,
    }
  }

  // 暂未观测出设置的先后顺序影响
  setResponder(flag) {
    if (isAndroid) {
      if (this.currentRef) {
        this.currentRef.setScrollEnabled(!flag)
        // this.currentRef.setNativeProps({
        //   scrollEnabled: !flag,
        // })
      }
    }
  }

  _onContentSizeChange = (oldSize, newSize) => {
    // 修复高度变化后边界已判断操作,只有第一页需要判断
    if (!isEmpty(oldSize)) {
      const { isResponder, props: { vertical } } = this
      const newValue = vertical ? newSize.height : newSize.width
      const oldValue = vertical ? oldSize.height : oldSize.width

      if (isResponder && newValue > oldValue) {
        this.isBorder = false
        this.borderDirection = false
        this.setResponder(false)
      }
    }
  }

  _onTouchStart = ({ nativeEvent }, { scrollViewRef }) => {
    const { pageX, pageY } = nativeEvent
    this.currentRef = scrollViewRef

    this._TouchStartEvent(pageX, pageY)
  }

  // _onTouchEnd = () => {
  //   if (isAndroid && this.androidMove) {
  //     const currentRef = this.getScrollViewConfig('scrollViewRef')
  //     this._startTime = Date.now()
  //     this.onUpdate(this._fromValue, (y) => {
  //       console.log(y)
  //       currentRef.scrollTo({ x: 0, y, animated: false })
  //     })

  //     this.androidMove = false
  //   }
  // }

  _onScrollEndDrag = (event) => {
    // if (isAndroid && this.androidMove) {
    //   this.androidMove = false
      // const currentRef = this.getScrollViewConfig('scrollViewRef')

      // this._startTime = Date.now()
      // this._onUpdate(this._fromValue, (y) => {
      //   currentRef.scrollTo({ x: 0, y, animated: false })
      // })
    // }

    this._onMomentumScrollEnd(event)
  }

  _onMomentumScrollEnd = ({ nativeEvent }) => {
    if (this.isTouchMove) {
      const { vertical } = this.props
      const {
        contentOffset: { y, x },
        contentSize: { height: maxHeight, width: maxWidth },
        layoutMeasurement: { height, width },
      } = nativeEvent
      const startValue = vertical ? y : x
      const endValue = vertical ? height : width
      const maxValue = vertical ? maxHeight : maxWidth

      this.setBorderValue(startValue, endValue, maxValue)
    }
  }

  _onTouchMove = ({ nativeEvent }, { scrollViewSize, scrollViewLayout }) => {
    const { pageX, pageY } = nativeEvent
    const { vertical } = this.props

    const sizeValue = vertical ? scrollViewSize.height : scrollViewSize.width
    const layoutValue = vertical ? scrollViewLayout.height : scrollViewLayout.width
    this._TouchMoveEvent(pageX, pageY, sizeValue, layoutValue)
  }

  // 子元素调用一定要传入index值来索引对应数据,且最好执行懒加载
  ScrollViewMonitor = ({ children, nativeProps = {} }) => {
    const { vertical } = this.props
    const mergeProps = getMergeObject({
      onContentSizeChange: this._onContentSizeChange,
      onMomentumScrollEnd: this._onMomentumScrollEnd,
      onScrollEndDrag: this._onScrollEndDrag,
      onTouchStart: this._onTouchStart,
      onTouchMove: this._onTouchMove,
      // onTouchEnd: this._onTouchEnd,
      showsVerticalScrollIndicator: false,
      bounces: false,
      style: { flex: 1 },
    }, nativeProps)

    return (
      <AgentScrollView
        {...mergeProps}
        ref={this._setScrollViewRef}
        horizontal={!vertical}
      >
        {children}
      </AgentScrollView>
    )
  }

  _startResponder = () => {
    return false
  }

  _moveResponder = () => {
    return this.isResponder
  }

  _startResponderCapture = () => {
    return false
  }

  _moveResponderCapture = () => {
    return this.isResponder
  }

  _onPanResponderTerminationRequest = () => {
    return !this.isResponder
  }

  // _onShouldBlockNativeResponder = () => {
  //   return false
  // }

  // _onPanResponderTerminate = () => {
  //   if (this.isResponder) {
  //     this.setResponder(false)

  //     this.isTerminate = true
  //   } else {
  //     this.isTerminate = false
  //   }
  // }
}

export {
  ViewPaged
}
