import React from 'react'
import PropTypes from 'prop-types'
import { accAdd } from '../utils'

export default function ScrollPageHOC(WrappedComponent) {
  const { propTypes, defaultProps } = WrappedComponent

  return class ScrollPaged extends WrappedComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps
    static childContextTypes = {
      ScrollView: PropTypes.func,
    }

    constructor(props) {
      super(props)

      this.isBorder = false
      this.isResponder = true
      this.currentPage = 0

      // this.scrollViewRef = []
      // this.scrollViewLayout = []
      // this.scrollViewSize = []
      // 子元素含有多个scrollview的索引数组
      // this.scrollViewIndex = []

      this._deceleration = 0.997
    }

    getChildContext() {
      return {
        ScrollView: this.ScrollViewMonitor,
      }
    }

    // setScrollViewConfig = (setKey, value, index, handle) => {
    //   const { currentPage, scrollViewIndex } = this
    //   const setKeyList = [setKey, currentPage]

    //   // 子元素含有多个scrollview
    //   if (scrollViewIndex[currentPage] !== undefined) {
    //     if (!this[setKey][currentPage]) this[setKey][currentPage] = []

    //     setKeyList.push(index)
    //   }
    //   handle && handle(get(this, setKeyList))

    //   return set(this, setKeyList, value)
    // }

    // getScrollViewConfig = (getKey) => {
    //   const { currentPage, scrollViewIndex } = this
    //   const index = scrollViewIndex[currentPage]

    //   // console.log(currentPage, index, this[getKey])
    //   if (index !== undefined) {
    //     return get(this, [getKey, currentPage, index])
    //   }

    //   return get(this, [getKey, currentPage])
    // }

    // onUpdate = (_fromValue, handle) => {
    //   const now = Date.now()

    //   const value =
    //     _fromValue +
    //     this._velocity /
    //       (1 - this._deceleration) *
    //       (1 - Math.exp(-(1 - this._deceleration) * (now - this._startTime)))

    //   if (Math.abs(_fromValue - value) < 0.1) {
    //     return
    //   }
    //   handle && handle(value)
    //   this.onUpdate(value)
    // }

    triggerJudge(isStart, isEnd) {
      switch (this.currentPage) {
        case 0:
          return isEnd
        case this.len - 1:
          return isStart
        default:
          return (isStart && this.borderDirection === 'isStart') || (isEnd && this.borderDirection === 'isEnd')
      }
    }

    setBorderValue(startValue, endValue, maxValue) {
      const isStart = parseFloat(startValue) <= 0
      const isEnd = parseFloat(accAdd(startValue, endValue).toFixed(2)) >= parseFloat(maxValue.toFixed(2))
      this.borderDirection = isStart ? 'isStart' : isEnd ? 'isEnd' : false
      this.isBorder = this.triggerJudge(isStart, isEnd)
    }

    checkMove(y, x) {
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

    getChildren(children = this.props.children, handleFunc = child => child) {
      return React.Children.map(children, handleFunc)
    }

    render() {
      this.childrenList = this.getChildren()
      this.len = this.childrenList.length

      return super.render()
    }
  }
}

