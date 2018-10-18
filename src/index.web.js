import React, { Component } from 'react'
import { getMergeObject } from './utils'
import { ScrollPagedHOC } from './decorators'
import ViewPaged from './view-paged'


@ScrollPagedHOC
export default class ScrollPagedView extends Component {
  _onTouchStart = (e) => {
    const { targetTouches } = e
    const { clientX, clientY } = targetTouches[0] || {}

    // 是否达成触摸滑动操作，此类变量可用于web端区分点击事件
    // 所有children共享类变量，从当前组件获取
    this.isTouch = false
    this._TouchStartEvent(clientX, clientY)

    // web端在touchStart中设置一次边界值，这样做的好处是
    // 1 touchStart事件只触发一次，保证下次move事件必定取到最为准确的边界信息
    // 2 虽然touchEnd也只触发一次，但touchEnd的信息并不准确，在touchEnd后页面会滑行一段距离，此时又不得不监听onScroll事件
    //   1 关于滑行在safari上的处理不一致，在回弹时触发翻页时会在翻页onChange事件后继续触发onScroll事件
    //   2 这会导致计算的borderDirection值又会改变，状态又变为上一页的结束状态，且onScroll事件触发的次数也很多，无法监听结束状态
    // 3 所以放在touchStart事件中做处理最好，这里我受定势思维影响采用和Rn一样的处理方法，加入了onTouchEnd和onScroll事件来处理问题，其实根本原因在于RN的touchStart事件中取不到滚动元素的高度和滚动高度这些信息，所以才没在touchStart事件中处理
    this._setBorderValue(e)
    // 记录开始的方向，用来在move事件中检验方向，只有方向一致才能发生翻页
    this._startBorderDirection = this.borderDirection
  }

  _setBorderValue(e) {
    const { currentTarget: { scrollHeight, scrollWidth, scrollTop, scrollLeft, clientHeight, clientWidth } } = e
    const { vertical } = this.props

    const startValue = vertical ? scrollTop : scrollLeft
    const endValue = vertical ? clientHeight : clientWidth
    const maxValue = vertical ? scrollHeight : scrollWidth

    this.setBorderValue(startValue, endValue, maxValue)
  }

  // _onTouchEnd = (e) => {
  //   if(this.borderDirection) {
  //     if (e.cancelable) {
  //       // 判断默认行为是否已经被禁用
  //       if (!e.defaultPrevented) {
  //         e.preventDefault()
  //       }
  //     }
  //   }
  //   if (this.isTouchMove) {
  //     this._scrollEndCommon(e)
  //   }
  // }

  // _onScroll = (e) => {
  //   this._scrollEndCommon(e)
  // }

  _onTouchMove = (e) => {
    const { targetTouches } = e
    const { clientX, clientY } = targetTouches[0] || {}
    const { currentTarget: { scrollHeight, scrollWidth, clientHeight, clientWidth } } = e
    const { vertical } = this.props
    // 是否达成触摸滑动操作
    if (!this.isTouch) {
      const { startX, startY } = this
      if (clientX !== startX || clientY !== startY) {
        this.isTouch = true
      }
    }

    const sizeValue = vertical ? scrollHeight : scrollWidth
    const layoutValue = vertical ? clientHeight : clientWidth
    this._TouchMoveEvent(clientX, clientY, sizeValue, layoutValue)

    // 边界不一致也停止冒泡
    if (!this.isResponder || this.borderDirection !== this._startBorderDirection) {
      e.stopPropagation()
      // 到达边界时阻止默认事件
      if (this.isResponder && this.borderDirection) {
        if (e.cancelable) {
          // 判断默认行为是否已经被禁用
          if (!e.defaultPrevented) {
            e.preventDefault()
          }
        }
      }
    } else if (e.cancelable) {
      // 判断默认行为是否已经被禁用
      if (!e.defaultPrevented) {
        e.preventDefault()
      }
    }
  }

  _webSetScrollViewRef = (ref) => {
    this._setScrollViewRef(ref)
    if (ref) {
      // safari阻止拖动回弹，通过dom绑定事件
      ref.addEventListener('touchmove', this._onTouchMove, false)
    }
  }

  // 子元素调用一定要传入index值来索引对应数据,且最好执行懒加载
  ScrollViewMonitor = ({ children, webProps = {} }) => {
    const { vertical } = this.props
    const mergeProps = getMergeObject({
      onTouchStart: this._onTouchStart,
      // onTouchMove: this._onTouchMove,
      // onTouchEnd: this._onTouchEnd,
      // onScroll: this._onScroll,
      style: {
        flex: 1,
        overflowX: vertical ? 'hidden' : 'scroll',
        overflowY: !vertical ? 'hidden' : 'scroll',
        position: 'relative',
        WebkitOverflowScrolling: 'touch',
      },
    }, webProps)

    return (
      <div
        {...mergeProps}
        ref={this._webSetScrollViewRef}
      >
        {children}
      </div>
    )
  }
}

export {
  ViewPaged
}
