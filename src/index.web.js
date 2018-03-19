import React, { Component } from 'react'
import { mergeWith } from 'lodash'
import ScrollableTabView from './components/scrollable-tab-view'
import { accAdd } from './utils'

import { ScrollPagedHOC } from './components'

@ScrollPagedHOC
export default class ScrollPagedView extends Component {

  constructor(props) {
    super(props)

    this.scrollViewProps = {
      onTouchStart: this._onTouchStart,
      onTouchMove: this._onTouchMove,
      onTouchEnd: this._onTouchEnd,
      onScroll: this._onScroll,
      style: {
        flex: 1,
        overflow: 'scroll',
        position: 'relative',
      },
    }
  }

  onChange = (index) => {
    const { onPageChange } = this.props
    if (onPageChange) onPageChange(index)

    this.currentPage = index

    this.isBorder = true
    this.isResponder = false
  }

  _onTouchStart = (e) => {
    const { targetTouches } = e
    const { clientX, clientY } = targetTouches[0] || {}

    this.startX = clientX
    this.startY = clientY

    this.isEnd = false
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

    this.isBorder = this.triggerJudge(isTop, isBottom)
    return this.isBorder
  }

  _onTouchMove = (e) => {
    const { targetTouches } = e
    const { clientX, clientY } = targetTouches[0] || {}
    const { currentTarget: { scrollHeight, clientHeight } } = e

    const { startY, startX } = this
    if (Math.abs(clientY - startY) > Math.abs(clientX - startX)) {
      const hasScrollContent = parseFloat(scrollHeight.toFixed(2)) > parseFloat(clientHeight.toFixed(2))
      if (hasScrollContent) {
        // 滚动时再此校验是否到达边界，此举防止滚动之外的元素触发change事件使得this.isBorder置为true
        this.isBorder ? this.checkIsBorder(e) : this.isBorder

        if (this.isBorder) {
          const distance = clientY - startY
          if (distance !== 0) {
            const direction = distance > 0 // 向上
            if (this.triggerJudge(direction, !direction)) {
              this.isResponder = true
            } else {
              this.isBorder = false
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
  ScrollViewMonitor = ({ children, index, pageIndex, webProps = {} }) => {
    if (index !== undefined && pageIndex !== undefined) {
      this.scrollViewIndex[pageIndex] = index
    }
    const mergeProps = getMergeProps(this.scrollViewProps, webProps)

    return (
      <div {...mergeProps}>
        {children}
      </div>
    )
  }

  render() {
    const { height = '100%', width = '100%' } = this.props

    return (
      <div style={{ display: 'flex', flex: 1, height, width }}>
        <ScrollableTabView
          onChange={this.onChange}
          vertical
        >
          {this.childrenList}
        </ScrollableTabView>
      </div>
    )
  }
}


const getMergeProps = (originProps, mergeProps) => {
  return mergeWith(originProps, mergeProps, (originValue, mergeValue) => {
    const type = {}.toString.call(mergeValue).slice(8, -1).toLowerCase()

    switch (type) {
      case 'array':
        return [...originValue, ...mergeValue]
      case 'function':
        return (...params) => { originValue(...params); mergeValue(...params) }
      default:
        return { ...originValue, ...mergeValue }
    }
  })
}
