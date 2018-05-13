import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { accAdd, isAndroid, isEmpty, isIOS, getMergeProps } from './utils'
import { ScrollPagedHOC } from './components'
import AgentScrollView from './components/agent-scroll-view'
import PagedView from './components/paged-view'

@ScrollPagedHOC
export default class ScrollPagedView extends Component {

  static propTypes = {
    onPageChange: PropTypes.func,
    setResponder: PropTypes.func,
  }

  static defaultProps = {
    onPageChange: () => {},
    setResponder: () => {},
  }

  onPageChange = (index, oldIndex) => {
    const { onPageChange } = this.props
    if (onPageChange) onPageChange(index)

    this.currentPage = index
    // 肯定处于边界位置,多此一举设置
    this.isBorder = true
    this.borderDirection = oldIndex > index ? 'isBottom' : 'isTop'
    this.isChange = true

    this.setResponder(true)
  }

  // 暂未观测出设置的先后顺序影响
  setResponder = (flag, callBack) => {
    if (isAndroid) {
      if (this.currentRef) {
        this.currentRef.setScrollEnabled(!flag)
        // currentRef.setNativeProps({
        //   scrollEnabled: !flag,
        // })
        // callBack && callBack(currentRef)
      }
    }

    this.isResponder = flag

    // ios单独处理阻止外层scrollView滑动
    if (isIOS) {
      const { setResponder } = this.props
      setResponder && setResponder(flag)
    }
  }

  _onContentSizeChange = (oldSize, newSize) => {
    // 修复高度变化后边界已判断操作,只有第一页需要判断
    if (!isEmpty(oldSize)) {
      const { currentPage, isResponder } = this
      if (currentPage === 0 && isResponder && newSize.height > oldSize.height) {
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
      const { contentOffset: { y }, contentSize: { height: maxHeight }, layoutMeasurement: { height } } = nativeEvent
      const isTop = parseFloat(y) <= 0
      const isBottom = parseFloat(accAdd(y, height).toFixed(2)) >= parseFloat(maxHeight.toFixed(2))
      this.borderDirection = isTop ? 'isTop' : isBottom ? 'isBottom' : false
      this.isBorder = this.triggerJudge(isTop, isBottom)
    }
  }

  _onTouchMove = ({ nativeEvent }, { scrollViewSize, scrollViewLayout }) => {
    const { pageX, pageY } = nativeEvent
    const { startX, startY } = this

    this.isChange = false
    if (Math.abs(pageY - startY) > Math.abs(pageX - startX)) {
      const hasScrollContent = scrollViewSize.height > scrollViewLayout.height

      if (hasScrollContent) {
        if (this.isBorder) {
          const distance = pageY - startY
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
  ScrollViewMonitor = ({ children, webProps = {} }) => {
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
    }, webProps)

    return (
      <AgentScrollView
        {...mergeProps}
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

  // android
  _onPanResponderTerminate = () => {
    if (this.isResponder) {
      this.setResponder(false)

      this.isTerminate = true
    } else {
      this.isTerminate = false
    }
  }

  render() {
    return (
      <PagedView
        onStartShouldSetPanResponder={this._startResponder}
        onMoveShouldSetPanResponder={this._moveResponder}
        onStartShouldSetPanResponderCapture={this._startResponderCapture}
        onMoveShouldSetPanResponderCapture={this._moveResponderCapture}
        onPanResponderTerminationRequest={this._onPanResponderTerminationRequest}
        // onPanResponderTerminate={this._onPanResponderTerminate}

        onPageChange={this.onPageChange}
        animationDuration={400}
        blurredZoom={1}
        blurredOpacity={1}
        vertical
      >
        {this.childrenList}
      </PagedView>
    )
  }
}

export {
  PagedView
}
