import React from 'react'

import Connect from './connect'
import { size, find, findLast } from '../utils'
import { propTypes, defaultProps } from '../prop-types'


const initialStyle = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent' }

export default function ScrollPageHOC(Animated, Easing) {
  return (WrappedComponent) => {
    @Connect
    class ViewPaged extends WrappedComponent {
      static propTypes = propTypes
      static defaultProps = defaultProps

      constructor(props) {
        super(props)
        const { infinite, children } = props
        let { initialPage } = props

        if (initialPage < 0) {
          initialPage = 0
        } else if (initialPage >= size(children)) {
          initialPage = size(children) - 1
        }
        if (infinite) {
          initialPage += 1
        }

        this.state = {
          width: 0,
          height: 0,
          loadIndex: [initialPage],
        }

        this._currentPage = initialPage
        this._lastPos = 0
        this._autoPlayTimer = null
      }

      // componentDidMount() {
      //   this.autoPlay()
      // }

      // autoPlay() {
      //   const { autoPlay, autoPlayTime } = this.props
      //   if (autoPlay) {
      //     if (this._autoPlayTimer) clearTimeout(this._autoPlayTimer)

      //     this._autoPlayTimer = setTimeout(() => {
      //       const nextPage = this._currentPage + 1
      //       this._goToPage(nextPage)
      //       this.autoPlay()
      //     }, autoPlayTime)
      //   }
      // }

      // 计算下一索引，针对无限滚动
      _getNextInex(index) {
        const { infinite } = this.props
        let nextIndex = index

        if (infinite) {
          if (index === 0) nextIndex = this.childrenLen - 2
          if (index === this.childrenLen - 1) nextIndex = 1
        }

        return nextIndex
      }

      // 对外提供跳转页数
      goToPage(page) {
        const { children } = this.props
        if (page < 0 || page > size(children) - 1) {
          return
        }

        this._goToPage(page)
      }

      // 对内提供跳转页数
      _goToPage(index) {
        const { onChange } = this.props
        const nextIndex = this._getNextInex(index)

        this._lastPos = this._getPosForPage(nextIndex)
        this._prevPage = this._currentPage
        this._currentPage = nextIndex
        // 处理切换动画
        this._updateAnimate()

        const { loadIndex } = this.state

        if (loadIndex.indexOf(this._currentPage) === -1) {
          loadIndex.push(this._currentPage)
        }
        this.setState({ loadIndex }, () => {
          onChange(this._currentPage, this._prevPage)
        })
      }

      _updateAnimate() {
        const { duration } = this.props
        const { pos } = this.state
        const animations = []
        const toValue = this._getPosForPage(this._currentPage)

        animations.push(
          Animated.timing(pos, {
            toValue,
            duration,
            easing: Easing.out(Easing.ease),  // default
          })
        )

        Animated.parallel(animations).start()
      }

      _getPosForPage(page) {
        return -page * this._boxSize
      }

      _getPageForPos(distance) {
        const pageDecimal = Math.abs(this._lastPos / this._boxSize)
        let page

        if (distance < 0) {
          page = Math.ceil(pageDecimal)
        } else {
          page = Math.floor(pageDecimal)
        }

        if (page < 0) {
          page = 0
        } else if (page > this.props.children.length - 1) {
          page = this.props.children.length - 1
        }

        return page
      }

      _runMeasurements(width, height) {
        const { vertical } = this.props

        this._boxSize = vertical ? height : width
        this._maxPos = -(this.childrenLen - 1) * this._boxSize
        this._lastPos = this._getPosForPage(this._currentPage)

        this.setState({
          width,
          height,
          pos: new Animated.Value(this._lastPos),
        })
      }

      // 无限轮播拼接children
      getInfiniteChildren = () => {
        const head = findLast(this.childrenList, child => !!child)
        const foot = find(this.childrenList, child => !!child)

        return [
          React.cloneElement(head, { key: 'page-head' }),
          ...this.childrenList,
          React.cloneElement(foot, { key: 'page-foot' }),
        ]
      }

      componentWillUnmount() {
        clearTimeout(this._autoPlayTimer)
      }

      render() {
        const { width, height } = this.state
        const { infinite } = this.props

        if (!width && !height) {
          // 先行测试容器尺寸
          return this._renderMeasurements(initialStyle)
        }
        if (infinite) {
          this.childrenList = this.getInfiniteChildren()
          this.childrenLen = size(this.childrenList)
        }

        return super.render()
      }
    }

    return ViewPaged
  }
}

