import React from 'react'

import Connect from './connect'
import { size, find, findLast, mergeStyle } from '../utils'

// position: 'absolute', top: 0, left: 0, right: 0, bottom: 0
const initialStyle = { flex: 1, display: 'flex', backgroundColor: 'transparent' }
const longSwipesMs = 300
const flexDirectionMap = {
  top: 'column',
  bottom: 'column-reverse',
  left: 'row',
  right: 'row-reverse',
}


export default function ScrollPageHOC(Animated, Easing) {
  return (WrappedComponent) => {
    @Connect
    class ViewPaged extends WrappedComponent {
      constructor(props) {
        super(props)
        const { infinite } = props
        this._posPage = this.getCheckInitialPage()
        if (infinite) {
          this._posPage += 1
        }

        this.state = {
          width: 0,
          height: 0,
          loadIndex: [this._posPage],
        }

        this._lastPos = 0
        this._autoPlayTimer = null
        this.currentPage = this._getCurrnetPage()
      }

      componentDidMount() {
        if (super.componentDidMount) {
          super.componentDidMount()
        }
        this.autoPlay()
      }

      // 检验纠正初始页参数
      getCheckInitialPage() {
        let { initialPage } = this.props
        if (initialPage < 0) {
          initialPage = 0
        } else if (initialPage >= this._childrenSize) {
          initialPage = this._childrenSize - 1
        }

        return initialPage
      }

      autoPlay() {
        const { autoPlay, autoPlaySpeed } = this.props
        if (autoPlay) {
          this._clearAutoPlayTimer()
          // 排除第0页时重置操作，否则更新pos至下次连续切换
          if (this._posPage && this._resetLastPos()) {
            this._updateAnimatedValue(this._lastPos)
          }

          this._autoPlayTimer = setTimeout(() => {
            const nextPosPage = this._getNextPosPage()
            this._goToPage(nextPosPage)
            // this.autoPlay()
          }, autoPlaySpeed)
        }
      }

      // 计算下一索引，针对无限滚动
      _getNextPosPage() {
        const { infinite } = this.props
        const nextPosPage = this._posPage + 1
        if (nextPosPage > this.childrenSize - 1) {
          return infinite ? 2 : 0
        }

        return nextPosPage
      }

      _getCurrnetPage() {
        return this._getCurrentPageForPosPage(this._posPage)
      }

      _getCurrentPageForPosPage(posPage) {
        const { infinite } = this.props
        if (infinite) {
          switch (posPage) {
            case 0:
              return this.childrenSize - 3
            case this.childrenSize - 1:
              return 0
            default:
              return posPage - 1
          }
        }
        return posPage
      }

      _getPosPageForCurrentPage(page) {
        const { infinite } = this.props
        if (infinite) {
          return page + 1
        }
        return page
      }

      // 计算重制跳转页
      _getResetPage() {
        const { _posPage, currentPage } = this
        if (Math.abs(_posPage - currentPage) > 1) {
          return _posPage === 0 ? _posPage + this._childrenSize : _posPage - this._childrenSize
        }
        return _posPage
      }

      // 无限滚动重置滚动位置
      _resetLastPos() {
        const { _posPage } = this
        const page = this._getResetPage()
        if (page !== _posPage) {
          this._lastPos = this._getPosForPage(page)
          return true
        }
        return false
      }

      // 判断未无限滚动时是否到头不可拖动
      _isMoveBorder = (distance) => {
        const { locked, infinite } = this.props
        if (locked) return false
        if (infinite) return infinite

        if (distance > 0 && this.currentPage !== 0) return true
        if (distance < 0 && this.currentPage + 1 !== this.childrenSize) return true

        return false
      }

      _TouchStartEvent() {
        this._touchSartTime = Date.now()

        this._clearAutoPlayTimer()
      }

      _TouchMoveEvent(TouchState) {
        this._resetLastPos()
        const distance = this._getDistance(TouchState)
        const nextValue = this._lastPos + distance

        this._updateAnimatedValue(nextValue)
      }

      _TouchEndEvent(TouchState) {
        const distance = this._getDistance(TouchState)
        const { _boxSize, _touchSartTime } = this
        const judgeSize = _boxSize / 3
        const touchEndTime = Date.now()

        // 检测边界拖动
        if (this._isMoveBorder(distance)) {
          const diffTime = touchEndTime - _touchSartTime
          // 满足移动跳转下一页条件
          if ((diffTime <= longSwipesMs || Math.abs(distance) >= judgeSize) && distance !== 0) {
            this._lastPos += distance
          }

          // 重置或跳转下一页
          const posPage = this._getPageForPos(distance)
          this._goToPage(posPage, true)
        }

        // this.autoPlay()
      }

      // 对外提供跳转页数，检验页数正确性
      goToPage = (page) => {
        if (page < 0 || page > this._childrenSize - 1) {
          return
        }

        this._clearAutoPlayTimer()
        const posPage = this._getPosPageForCurrentPage(page)
        this._goToPage(posPage)
      }

      // 对内提供跳转页数，传入定位的页数
      _goToPage(posPage, hasAnimation) {
        this._posPage = posPage
        // 使用传入的下一页值，非计算的下一页值，无限滚动懒加载用
        this._lastPos = this._getPosForPage(this._posPage)
        // 处理切换动画
        this._updateAnimatedQueue(hasAnimation)
        const nextPage = this._getCurrnetPage()
        // 没有跳转页仅仅重置动画return处理
        if (+nextPage === +this.currentPage) return

        this._prevPage = this.currentPage
        this.currentPage = this._getCurrnetPage()

        const { loadIndex: oldLoadIndex } = this.state
        const loadIndex = oldLoadIndex.slice()

        if (loadIndex.indexOf(this._posPage) === -1) {
          loadIndex.push(this._posPage)
          // 加载未重置的页
          const page = this._getResetPage()
          if (page !== this._posPage) {
            loadIndex.push(page)
          }
        }

        const { onChange } = this.props
        // // 减少空render次数
        // if (size(loadIndex) !== size(oldLoadIndex)) {
        this.setState({ loadIndex }, () => {
          onChange(this.currentPage, this._prevPage)
        })
        // } else {
        //   onChange(this.currentPage, this._prevPage)
        // }
      }

      // move时设置动画值
      _updateAnimatedValue(nextValue) {
        const { infinite } = this.props
        if (!infinite) {
          // 回弹限制
          if (nextValue <= 0 && nextValue >= this._maxPos) {
            this.state.pos.setValue(nextValue)
          }
        } else {
          this.state.pos.setValue(nextValue)
        }
      }

      _updateAnimatedQueue(hasAnimation = this.props.hasAnimation) {
        const { duration } = this.props
        const { pos } = this.state
        const animations = []
        const toValue = this._lastPos

        if (hasAnimation) {
          animations.push(
            Animated.timing(pos, {
              toValue,
              duration,
              easing: Easing.out(Easing.ease),  // default
            })
          )
          this._clearAutoPlayTimer()
          Animated.parallel(animations).start(() => {
            // 所有类型的动画结束后都启用下次的自动播放，其他地方只用关心何时关闭循环
            this.autoPlay()
          })
        } else {
          this.state.pos.setValue(toValue)
        }
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
        } else if (page > this.childrenSize - 1) {
          page = this.childrenSize - 1
        }

        return page
      }

      _getContainerStyle(style = {}) {
        const { renderPosition } = this.props
        const flexDirection = flexDirectionMap[renderPosition] || flexDirectionMap.top

        return mergeStyle(style, {
          flex: 1,
          flexDirection,
        })
      }

      _runMeasurements(width, height) {
        const { vertical } = this.props

        this._boxSize = vertical ? height : width
        this._maxPos = -(this.childrenSize - 1) * this._boxSize
        this._lastPos = this._getPosForPage(this._posPage)

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

      _clearAutoPlayTimer() {
        clearTimeout(this._autoPlayTimer)
      }

      componentWillUnmount() {
        this._clearAutoPlayTimer()
      }

      _checkRenderComponent(key, props = {}) {
        const Component = this.props[key]
        if (Component) {
          return (
            <Component {...props}/>
          )
        }
        return null
      }

      _renderPropsComponent(key) {
        return this._checkRenderComponent(key, {
          activeTab: this.currentPage,
          goToPage: this.goToPage,
        })
      }

      render() {
        const { width, height, loadIndex } = this.state
        const { infinite } = this.props

        if (infinite) {
          this.childrenList = this.getInfiniteChildren()
          this.childrenSize = size(this.childrenList)
        }
        if (!width && !height) {
          const [initialIndex] = loadIndex
          const initialChild = this.childrenList[initialIndex]
          // 先行测试容器尺寸，并给予初始展示child用于ssr
          return this._renderMeasurements(initialStyle, initialChild)
        }

        return super.render()
      }
    }

    return ViewPaged
  }
}

