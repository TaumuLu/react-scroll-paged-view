import React, { Component } from 'react'

import { getMergeProps } from './utils'
import ScrollPagedHOC from './components/scroll-paged-hoc'
import ViewPaged from './components/view-paged'

import { propTypes, defaultProps } from './utils/propTypes'

@ScrollPagedHOC
export default class ScrollPagedView extends Component {
  static propTypes = propTypes.WebViewPaged
  static defaultProps = {
    ...defaultProps.WebViewPaged,
    vertical: true,
  }

  onChange = (index, oldIndex) => {
    const { onChange } = this.props

    this.currentPage = index
    // 肯定处于边界位置,多此一举设置
    this.isBorder = true
    this.borderDirection = oldIndex > index ? 'isEnd' : 'isStart'
    this.isResponder = false

    onChange(index, oldIndex)
  }

  _onTouchStart = (e) => {
    const { targetTouches } = e
    const { clientX, clientY } = targetTouches[0] || {}

    this.startX = clientX
    this.startY = clientY

    this.isTouchEnd = false
    // 是否达成触摸滑动操作，此类变量可用于web端区分点击事件
    // 所有children共享类变量，从当前组件获取
    this.isTouch = false
  }

  _onTouchEnd = (e) => {
    if (!this.isResponder) {
      e.stopPropagation()
      this.isTouchEnd = true
      this._onScroll(e)
    }
  }

  _onScroll = (e) => {
    if (this.isTouchEnd && !this.isBorder) {
      if (this.checkIsBorder(e)) {
        this.isTouchEnd = false
      }
    }
  }

  checkIsBorder = (e) => {
    const { currentTarget: { scrollHeight, scrollWidth, scrollTop, scrollLeft, clientHeight, clientWidth } } = e
    const { vertical } = this.props

    const startValue = vertical ? scrollTop : scrollLeft
    const endValue = vertical ? clientHeight : clientWidth
    const maxValue = vertical ? scrollHeight : scrollWidth

    this.setBorderValue(startValue, endValue, maxValue)
    return this.isBorder
  }

  _onTouchMove = (e) => {
    const { targetTouches } = e
    const { clientX, clientY } = targetTouches[0] || {}
    const { currentTarget: { scrollHeight, scrollWidth, clientHeight, clientWidth } } = e

    const { startY, startX, props: { vertical } } = this
    // 是否达成触摸滑动操作
    if (!this.isTouch) {
      if (clientX !== startX || clientY !== startY) {
        this.isTouch = true
      }
    }
    if (this.checkMove(clientY, clientX)) {
      const sizeValue = vertical ? scrollHeight : scrollWidth
      const layoutValue = vertical ? clientHeight : clientWidth
      const hasScrollContent = this.checkScrollContent(sizeValue, layoutValue)

      if (hasScrollContent) {
        // 滚动时再此校验是否到达边界，此举防止滚动之外的元素触发change事件使得this.isBorder置为true
        if (this.isBorder) this.checkIsBorder(e)

        if (this.isBorder) {
          const distance = vertical ? clientY - startY : clientX - startX
          if (distance !== 0) {
            const direction = distance > 0 // 向上
            if (this.triggerJudge(direction, !direction)) {
              this.isResponder = true
            } else {
              this.isBorder = false
              this.borderDirection = false
              this.isResponder = false
            }
          }
        }
      } else {
        this.isResponder = true
      }
    }

    if (!this.isResponder) {
      e.stopPropagation()
    // 判断默认行为是否可以被禁用
    } else if (e.cancelable) { {
      // 判断默认行为是否已经被禁用
      if (!e.defaultPrevented) {
        e.preventDefault()
      }
    }
  }

  // 子元素调用一定要传入index值来索引对应数据,且最好执行懒加载
  ScrollViewMonitor = ({ children, webProps = {} }) => {
    const { vertical } = this.props
    const mergeProps = getMergeProps({
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
      <div {...mergeProps}>
        {children}
      </div>
    )
  }

  render() {
    return (
      <ViewPaged
        {...this.props}
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
