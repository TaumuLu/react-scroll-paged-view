import React, { Component } from 'react'

import { getMergeObject } from './utils'

import ScrollPagedHOC from './decorators/scroll-paged-hoc'
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
  }

  _onTouchEnd = (e) => {
    if (this.isTouchMove) {
      this._onScroll(e)
    }
  }

  _onScroll = (e) => {
    const { currentTarget: { scrollHeight, scrollWidth, scrollTop, scrollLeft, clientHeight, clientWidth } } = e
    const { vertical } = this.props

    const startValue = vertical ? scrollTop : scrollLeft
    const endValue = vertical ? clientHeight : clientWidth
    const maxValue = vertical ? scrollHeight : scrollWidth

    this.setBorderValue(startValue, endValue, maxValue)
  }

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

    if (!this.isResponder) {
      e.stopPropagation()
    // 判断默认行为是否可以被禁用
    } else if (e.cancelable) {
      // 判断默认行为是否已经被禁用
      if (!e.defaultPrevented) {
        e.preventDefault()
      }
    }
  }

  // 子元素调用一定要传入index值来索引对应数据,且最好执行懒加载
  ScrollViewMonitor = ({ children, webProps = {} }) => {
    const { vertical } = this.props
    const mergeProps = getMergeObject({
      onTouchStart: this._onTouchStart,
      onTouchMove: this._onTouchMove,
      onTouchEnd: this._onTouchEnd,
      onScroll: this._onScroll,
      style: {
        flex: 1,
        overflowX: vertical ? 'hidden' : 'scroll',
        overflowY: !vertical ? 'hidden' : 'scroll',
        position: 'relative',
      },
    }, webProps)

    return (
      <div
        {...mergeProps}
        ref={this._scrollViewRef}
      >
        {children}
      </div>
    )
  }
}

export {
  ViewPaged
}
