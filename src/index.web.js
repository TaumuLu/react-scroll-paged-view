import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { accAdd, getMergeProps, noop } from './utils'
import ScrollPagedHOC from './components/scroll-paged-hoc'
import ScrollTabView from './components/scroll-tab-view'

@ScrollPagedHOC
export default class ScrollPagedView extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    pageProps: PropTypes.object,
    style: PropTypes.object,
  }

  static defaultProps = {
    onChange: noop,
    pageProps: {},
    style: {},
  }

  onChange = (index, oldIndex) => {
    const { onChange } = this.props

    this.currentPage = index
    // 肯定处于边界位置,多此一举设置
    this.isBorder = true
    this.borderDirection = oldIndex > index ? 'isBottom' : 'isTop'
    this.isResponder = false

    onChange(index, oldIndex)
  }

  _onTouchStart = (e) => {
    const { targetTouches } = e
    const { clientX, clientY } = targetTouches[0] || {}

    this.startX = clientX
    this.startY = clientY

    this.isEnd = false
    // 是否达成触摸滑动操作，此类变量可用于web端区分点击事件
    // 所有children共享类变量，从当前组件获取
    this.isTouch = false
  }

  _onTouchEnd = (e) => {
    if (!this.isResponder) {
      e.stopPropagation()
      this.isEnd = true
      this._onScroll(e)
    }
  }

  _onScroll = (e) => {
    if (this.isEnd && !this.isBorder) {
      if (this.checkIsBorder(e)) {
        this.isEnd = false
      }
    }
  }

  checkIsBorder = (e) => {
    const { currentTarget: { scrollHeight, scrollTop, clientHeight } } = e
    const isTop = parseFloat(scrollTop) <= 0
    const isBottom = parseFloat(accAdd(scrollTop, clientHeight).toFixed(2)) >= parseFloat(scrollHeight.toFixed(2))
    this.borderDirection = isTop ? 'isTop' : isBottom ? 'isBottom' : false
    this.isBorder = this.triggerJudge(isTop, isBottom)
    return this.isBorder
  }

  _onTouchMove = (e) => {
    const { targetTouches } = e
    const { clientX, clientY } = targetTouches[0] || {}
    const { currentTarget: { scrollHeight, clientHeight } } = e

    const { startY, startX } = this
    // 是否达成触摸滑动操作
    if (!this.isTouch) {
      if (clientX !== startX || clientY !== startY) {
        this.isTouch = true
      }
    }
    if (Math.abs(clientY - startY) > Math.abs(clientX - startX)) {
      const hasScrollContent = parseFloat(scrollHeight.toFixed(2)) > parseFloat(clientHeight.toFixed(2))
      if (hasScrollContent) {
        // 滚动时再此校验是否到达边界，此举防止滚动之外的元素触发change事件使得this.isBorder置为true
        if (this.isBorder) this.checkIsBorder(e)

        if (this.isBorder) {
          const distance = clientY - startY
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
    } else {
      e.preventDefault()
    }
  }

  // 子元素调用一定要传入index值来索引对应数据,且最好执行懒加载
  ScrollViewMonitor = ({ children, webProps = {} }) => {
    const mergeProps = getMergeProps({
      onTouchStart: this._onTouchStart,
      onTouchMove: this._onTouchMove,
      onTouchEnd: this._onTouchEnd,
      onScroll: this._onScroll,
      style: {
        flex: 1,
        overflow: 'scroll',
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
    const { style, pageProps } = this.props

    return (
      <div style={{ ...defaultStyle, ...style }}>
        <ScrollTabView
          {...pageProps}
          onChange={this.onChange}
          vertical
        >
          {this.childrenList}
        </ScrollTabView>
      </div>
    )
  }
}

const defaultStyle = {
  flex: 1,
  display: 'flex',
  boxSizing: 'border-box',
  height: typeof document !== 'undefined' ? document.documentElement.clientHeight : '100%',
  width: typeof document !== 'undefined' ? document.documentElement.clientWidth : '100%',
}


export {
  ScrollTabView
}
