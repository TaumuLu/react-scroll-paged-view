import React from 'react'
import PropTypes from 'prop-types'
import { get, set } from '../utils'

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
      this.isResponder = false
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

    getViewPagedInstance() {
      const { withRef } = this.props
      if (!withRef) {
        console.warn('To access the viewPage instance, you need to specify withRef=true in the props')
      }
      return this.viewPagedRef
    }

    setViewPagedRef = (ref) => {
      this.viewPagedRef = ref
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

    triggerJudge = (isTop, isBottom) => {
      switch (this.currentPage) {
        case 0:
          return isBottom
        case this.len - 1:
          return isTop
        default:
          return (isTop && this.borderDirection === 'isTop') || (isBottom && this.borderDirection === 'isBottom')
      }
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

