import React, { Component } from 'react'
import { isAndroid } from 'app/utils/platform'
import { accAdd } from 'app/utils/formats'
import { isEmpty } from 'lodash'

import { CarouselPage, ScrollPageHOC } from './components'
import RNScrollView from './components/RNScrollView'

@ScrollPageHOC
export default class ScrollPagedView extends Component {

  constructor(props) {
    super(props)
    // android手动move判断
    this.androidMove = false
  }

  // 提前改变currentPage
  onPageChange = (index) => {
    const { onPageChange } = this.props
    if (onPageChange) onPageChange(index)

    this.currentPage = index
  }

  // ios后置处理,此为判断子组件是否包含有scrollView
  onPageChangeAfter = (index) => {
    // if (!isAndroid) {
    if (this.scrollViewRef[index]) {
      // 肯定处于边界位置,多此一举设置
      this.isBorder = true
      this.setResponder(false)
    } else {
      this.setResponder(true)
    }
    // }
  }

  // 暂未观测出设置的先后顺序影响
  setResponder = (flag, callBack) => {
    if (isAndroid) {
      const currentRef = this.getScrollViewConfig('scrollViewRef')

      if (currentRef) {
        currentRef.setScrollEnabled(!flag)
        // currentRef.setNativeProps({
        //   scrollEnabled: !flag,
        // })
        // callBack && callBack(currentRef)
      }
    }

    this.isResponder = flag
    if (flag) {
      // ios单独处理阻止外层scrollView滑动
      if (!isAndroid) {
        const { setWrapScrollView } = this.props
        setWrapScrollView && setWrapScrollView()
      }
    }
    // if (isAndroid) {
    //   const currentRef = this.getScrollViewConfig('scrollViewRef')
    //   if (currentRef && currentRef.setNativeProps) {
    //     callBack && callBack(currentRef)

    //     currentRef.setNativeProps({
    //       scrollEnabled: !flag,
    //     })
    //   }
    // }

    // this.isResponder = flag
  }

  setScrollViewSize = (index, width, height) => {
    if (width && height) {
      this.setScrollViewConfig('scrollViewSize', { width, height }, index, (prevValue) => {
        // 修复高度变化后边界已判断操作,只有第一页需要判断
        const { currentPage, isResponder } = this
        if (currentPage === 0 && isResponder && prevValue && height > prevValue.height) {
          this.isBorder = false
          this.setResponder(false)
        }
      })
    }
  }

  _onTouchStart = (nativeProps, { nativeEvent }) => {
    const { pageX, pageY, timestamp } = nativeEvent
    this.startX = pageX
    this.startY = pageY
    this.startTimestamp = timestamp

    if (isAndroid && this.androidMove) this.androidMove = false

    const { onTouchStart } = nativeProps || {}
    onTouchStart && onTouchStart({ targetTouches: [{ clientX: pageX, clientY: pageY }] })
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
    if (isAndroid && this.androidMove) {
      this.androidMove = false
      // const currentRef = this.getScrollViewConfig('scrollViewRef')

      // this._startTime = Date.now()
      // this._onUpdate(this._fromValue, (y) => {
      //   currentRef.scrollTo({ x: 0, y, animated: false })
      // })
    }

    this._onMomentumScrollEnd(event)
  }

  _onMomentumScrollEnd = ({ nativeEvent }) => {
    const { contentOffset: { y }, contentSize: { height: maxHeight }, layoutMeasurement: { height } } = nativeEvent
    const isTop = parseFloat(y) <= 0
    const isBottom = parseFloat(accAdd(y, height).toFixed(2)) >= parseFloat(maxHeight.toFixed(2))

    this.isBorder = this.triggerJudge(isTop, isBottom)
    if (this.isBorder) {
      // 前置处理拖拽
      // if (isAndroid) {
      //   this.setResponder(true)
      // }
    }
  }

  _onTouchMove = (nativeProps, { nativeEvent }) => {
    const { pageX, pageY } = nativeEvent
    const { startX, startY, getScrollViewConfig } = this

    if (Math.abs(pageY - startY) > Math.abs(pageX - startX)) {
      const currentScrollViewSize = getScrollViewConfig('scrollViewSize')
      const currentScrollViewLayout = getScrollViewConfig('scrollViewLayout')
      let hasScrollContent = true
      if (!isEmpty(currentScrollViewSize) && !isEmpty(currentScrollViewLayout)) {
        hasScrollContent = currentScrollViewSize.height > currentScrollViewLayout.height
      }

      if (hasScrollContent) {
        if (this.isBorder) {
          const distance = pageY - startY
          if (distance !== 0) {
            const direction = distance > 0 // 向上
            if (this.triggerJudge(direction, !direction)) {
              // ios后置处理拖拽
              // if (!isAndroid) {
              this.setResponder(true)
              // }
            } else {
              this.isBorder = false
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

    const { onTouchMove } = nativeProps || {}
    onTouchMove && onTouchMove({ targetTouches: [{ clientX: pageX, clientY: pageY }] })
  }

  _setScrollViewRef = (index, ref) => {
    if (ref) this.setScrollViewConfig('scrollViewRef', ref, index)
  }

  _setScrollViewLayout = (index, event) => {
    if (event) {
      const { layout } = event.nativeEvent
      const height = Math.ceil(layout.height)
      const width = Math.ceil(layout.width)
      this.setScrollViewConfig('scrollViewLayout', { height, width }, index)
    }
  }

  // 子元素调用一定要传入index值来索引对应数据,且最好执行懒加载
  ScrollViewMonitor = ({ children, index, nativeProps = {}, pageIndex }) => {
    if (index !== undefined && pageIndex !== undefined) {
      this.scrollViewIndex[pageIndex] = index
    }

    return (
      <RNScrollView
        ref={this._setScrollViewRef.bind(this, index)}
        onLayout={this._setScrollViewLayout.bind(this, index)}
        onContentSizeChange={this.setScrollViewSize.bind(this, index)}
        onMomentumScrollEnd={this._onMomentumScrollEnd}
        onScrollEndDrag={this._onScrollEndDrag}
        onTouchStart={this._onTouchStart.bind(this, nativeProps)}
        onTouchMove={this._onTouchMove.bind(this, nativeProps)}
        onTouchEnd={this._onTouchEnd}
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{ flex: 1 }}
        // refreshControl={refreshControl}
        // overScrollMode={'never'}
        // scrollEnabled={false}
      >
        {children}
      </RNScrollView>
      // <ScrollViewMonitor
      //   ref={this._setScrollViewRef}
      //   onMomentumScrollEnd={this._onMomentumScrollEnd}
      //   onTouchStart={this._onTouchStart}
      //   onTouchMove={this._onTouchMove}
      //   // onTouchEnd={this._onTouchEnd}
      //   // contentContainerStyle={{ flex: 1 }}
      // >
      //   {children}
      // </ScrollViewMonitor>
    )
  }

  _startResponder = () => {
    return this.isResponder
  }

  _moveResponder = () => {
    return this.isResponder
  }

  _startResponderCapture = () => {
    return this.isResponder
  }

  _moveResponderCapture = () => {
    return this.isResponder
  }

  _onPanResponderTerminationRequest = () => {
    return false
  }

  // android
  _onPanResponderTerminate = () => {
    if (this.isResponder) {
      // console.log('_onPanResponderTerminate')
      this.setResponder(false)

      this.isTerminate = true
    } else {
      this.isTerminate = false
    }
  }

  render() {
    return (
      <CarouselPage
        onStartShouldSetPanResponder={this._startResponder}
        onMoveShouldSetPanResponder={this._moveResponder}
        onStartShouldSetPanResponderCapture={this._startResponderCapture}
        onMoveShouldSetPanResponderCapture={this._moveResponderCapture}
        onPanResponderTerminationRequest={this._onPanResponderTerminationRequest}
        // onPanResponderTerminate={this._onPanResponderTerminate}

        onPageChange={this.onPageChange}
        onPageChangeAfter={this.onPageChangeAfter}
        animationDuration={400}
        blurredZoom={1}
        blurredOpacity={1}
        vertical
      >
        {this.childrenList}
      </CarouselPage>
    )
  }
}

