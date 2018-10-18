import React from 'react'
import PropTypes from 'prop-types'
import { accAdd } from '../utils'
import Connect from './connect'
import ViewPaged from '../view-paged'


export default function ScrollPageHOC(WrappedComponent) {
  @Connect
  class ScrollPaged extends WrappedComponent {
    static childContextTypes = {
      ScrollView: PropTypes.func,
    }

    constructor(props) {
      super(props)

      this.isBorder = true
      this.borderDirection = 'isStart'
      // 默认为true，为了处理没有使用context的滚动组件child
      this.isResponder = true
      this.isTouchMove = false
      this.hasScrollViewPages = []
    }

    onChange = (index, oldIndex) => {
      const { onChange } = this.props
      // 肯定处于边界位置,多此一举设置
      this.isBorder = true
      // 判断只有下次move事件后才能触发end事件
      this.isTouchMove = false
      // 描述下一页的边界方向
      this.borderDirection = index > oldIndex ? 'isStart' : 'isEnd'

      // 这一步设置false很重要，可以避免页间快速切换造成的scrollView位置错移
      // 通过打印手势和scrollView的事件触发的先后顺序，发现这和设置此值无关
      // 但如果此值为true在下次Touchstart中会被设置为false，之后move中如果是翻页又会被设置为true
      // 造成scrollView的滚动状态切换了3次，如果此值为false，scrollView的滚动状态只会切换一次，推测可能是这里出了问题
      // 是否能作手势操作应完全交给scrollView的Touchmove事件去处理
      const flag = this.hasScrollViewPages.includes(+index)
      this.setResponder(!flag)

      onChange(index, oldIndex)
    }

    setResponder(flag) {
      // RN android需要单独处理
      if (super.setResponder) {
        super.setResponder(flag)
      }
      this.isResponder = flag
    }

    getChildContext() {
      return {
        ScrollView: this.ScrollViewMonitor,
      }
    }

    setViewPagedRef = (ref) => {
      if (ref) {
        this.viewPagedRef = ref
      }
    }

    _setScrollViewRef = (ref) => {
      if (ref) {
        // 初次渲染重置状态并保存页数
        this.setResponder(false)
        if (this.viewPagedRef) {
          const { currentPage } = this.viewPagedRef
          this.hasScrollViewPages.push(+currentPage)
        }
      }
    }

    getViewPagedInstance() {
      const { withRef } = this.props
      if (!withRef) {
        console.warn('To access the viewPage instance, you need to specify withRef=true in the props')
      }
      return this.viewPagedRef
    }

    setBorderValue(startValue, endValue, maxValue) {
      const isStart = parseFloat(startValue) <= 0
      const isEnd = parseFloat(accAdd(startValue, endValue).toFixed(2)) >= parseFloat(maxValue.toFixed(2))
      this.borderDirection = isStart ? 'isStart' : isEnd ? 'isEnd' : false
      this.isBorder = this.triggerJudge(isStart, isEnd)
    }

    triggerJudge(isStart, isEnd) {
      const { infinite } = this.props
      let expression = this.viewPagedRef.currentPage
      if (infinite) expression = false

      switch (expression) {
        case 0:
          return isEnd && this.borderDirection === 'isEnd'
        case this.childrenSize - 1:
          return isStart && this.borderDirection === 'isStart'
        default:
          return (isStart && this.borderDirection === 'isStart') || (isEnd && this.borderDirection === 'isEnd')
      }
    }

    checkMove(x, y) {
      const { startY, startX, props: { vertical } } = this
      const yValue = y - startY
      const xValue = x - startX
      if (vertical) {
        return Math.abs(yValue) > Math.abs(xValue)
      }
      return Math.abs(xValue) > Math.abs(yValue)
    }

    checkScrollContent(sizeValue, layoutValue) {
      return parseFloat(sizeValue.toFixed(2)) > parseFloat(layoutValue.toFixed(2))
    }

    _TouchStartEvent(x, y) {
      this.startX = x
      this.startY = y
      this.setResponder(false)
    }

    _TouchMoveEvent(x, y, sizeValue, layoutValue) {
      if (!this.isTouchMove) this.isTouchMove = true

      if (this.checkMove(x, y)) {
        const { startY, startX, props: { vertical } } = this
        const hasScrollContent = this.checkScrollContent(sizeValue, layoutValue)

        if (hasScrollContent) {
          if (this.isBorder) {
            const distance = vertical ? y - startY : x - startX
            // 大于1.6为了防抖
            if (distance !== 0 && Math.abs(distance) > 1.6) {
              const direction = distance > 0 // 向上

              if (this.triggerJudge(direction, !direction)) {
                this.setResponder(true)
              } else {
                this.isBorder = false
                this.borderDirection = false
                this.setResponder(false)
              }
            }
          }
        } else {
          this.setResponder(true)
        }
      }
    }

    render() {
      return (
        <ViewPaged
          {...this.props}
          {...this._viewPagedProps}
          ref={this.setViewPagedRef}
          // 避免在无限时滚动切换等其他问题，禁用这两个props，如实在有需要可继承此组件重写render方法
          infinite={false}
          autoPlay={false}
          onChange={this.onChange}
        >
          {this.childrenList}
        </ViewPaged>
      )
    }
  }

  // const { defaultProps } = ScrollPaged
  // // 重置默认参数
  // ScrollPaged.defaultProps = {
  //   ...defaultProps,
  //   vertical: true,
  // }

  return ScrollPaged
}

