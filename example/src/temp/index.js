import React, { Component } from 'react'

import { isAndroid, isEmpty, getMergeProps } from './utils'

import ScrollPagedHOC from './decorators/scroll-paged-hoc'
import AgentScrollView from './components/agent-scroll-view'
import ViewPaged from './view-paged'


@ScrollPagedHOC
export default class ScrollPagedView extends Component {
  onChange = (index, oldIndex) => {
    const { onChange } = this.props
    this.currentPage = index
    // 肯定处于边界位置,多此一举设置
    this.isBorder = true
    this.borderDirection = oldIndex > index ? 'isEnd' : 'isStart'
    this.isChange = true

    this.setResponder(true)

    onChange(index, oldIndex)
  }

  // 暂未观测出设置的先后顺序影响
  setResponder = (flag, callBack) => {
    if (isAndroid) {
      if (this.currentRef) {
        this.currentRef.setScrollEnabled(!flag)
        // this.currentRef.setNativeProps({
        //   scrollEnabled: !flag,
        // })
        // callBack && callBack(currentRef)
      }
    }

    this.isResponder = flag
  }

  _onContentSizeChange = (oldSize, newSize) => {
    // 修复高度变化后边界已判断操作,只有第一页需要判断
    if (!isEmpty(oldSize)) {
      const { currentPage, isResponder, props: { vertical } } = this
      const newValue = vertical ? newSize.height : newSize.width
      const oldValue = vertical ? oldSize.height : oldSize.width

      if (currentPage === 0 && isResponder && newValue > oldValue) {
        this.isBorder = false
        this.borderDirection = false
        this.setResponder(false)
      }
    }
  }

  _onTouchStart = ({ nativeEvent }, { scrollViewRef }) => {
    const { pageX, pageY, timestamp } = nativeEvent
    this.startX = pageX
    this.startY = pageY
    this.startTimestamp = timestamp
    this.currentRef = scrollViewRef
    this.setResponder(false)
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
    if (!this.isChange) {
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
    const { startX, startY, props: { vertical } } = this

    this.isChange = false
    if (this.checkMove(pageY, pageX)) {
      const sizeValue = vertical ? scrollViewSize.height : scrollViewSize.width
      const layoutValue = vertical ? scrollViewLayout.height : scrollViewLayout.width
      const hasScrollContent = this.checkScrollContent(sizeValue, layoutValue)

      if (hasScrollContent) {
        if (this.isBorder) {
          const distance = vertical ? pageY - startY : pageX - startX
          // 大于1.6为了防抖
          if (distance !== 0 && Math.abs(distance) > 1.6) {
            const direction = distance > 0 // 向上
            // console.log(this.borderDirection, direction, pageY, startY, distance)

            if (this.triggerJudge(direction, !direction)) {
              this.setResponder(true)
            } else {
              this.isBorder = false
              this.borderDirection = false
              this.setResponder(false)
                //  (ref) => {
                // android手动修复边界反向滚动
                // if (isAndroid) {
                //   const { timestamp } = nativeEvent
                //   this.androidMove = true
                //   const currentSize = this.getScrollViewConfig('scrollViewSize')
                //   const currentLayout = this.getScrollViewConfig('scrollViewLayout')
                //   const currentRef = ref || this.getScrollViewConfig('scrollViewRef')
                //   const maxHeight = currentSize.height - currentLayout.height
                //   let y = distance
                //   if (direction) {
                //     y = maxHeight - distance
                //   }
                //   this._velocity = Math.abs(distance) / (timestamp - this.startTimestamp)
                //   y = Math.abs(y)
                //   this._fromValue = y

                //   currentRef.scrollTo({ x: 0, y, animated: false })
                // }
              // })
            }
          }
        }
      } else {
        this.setResponder(true)
      }
    }
  }

  // 子元素调用一定要传入index值来索引对应数据,且最好执行懒加载
  ScrollViewMonitor = ({ children, nativeProps = {} }) => {
    const { vertical } = this.props
    const mergeProps = getMergeProps({
      onContentSizeChange: this._onContentSizeChange,
      onMomentumScrollEnd: this._onMomentumScrollEnd,
      onScrollEndDrag: this._onScrollEndDrag,
      onTouchStart: this._onTouchStart,
      onTouchMove: this._onTouchMove,
      onTouchEnd: this._onTouchEnd,
      showsVerticalScrollIndicator: false,
      bounces: false,
      style: { flex: 1 },
    }, nativeProps)

    return (
      <AgentScrollView
        {...mergeProps}
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

  // _onPanResponderTerminate = () => {
  //   if (this.isResponder) {
  //     this.setResponder(false)

  //     this.isTerminate = true
  //   } else {
  //     this.isTerminate = false
  //   }
  // }

  render() {
    const { onResponder, ...otherProps } = this.props

    return (
      <ViewPaged
        {...otherProps}
        ref={this.setViewPagedRef}
        onStartShouldSetPanResponder={this._startResponder}
        onMoveShouldSetPanResponder={this._moveResponder}
        onStartShouldSetPanResponderCapture={this._startResponderCapture}
        onMoveShouldSetPanResponderCapture={this._moveResponderCapture}
        onPanResponderTerminationRequest={this._onPanResponderTerminationRequest}
        // onShouldBlockNativeResponder={this._onShouldBlockNativeResponder}
        // onPanResponderTerminate={this._onPanResponderTerminate}
        onChange={this.onChange}
      >
        {this.childrenList}
      </ViewPaged>
    )
  }
}

export {
  ViewPaged
}
