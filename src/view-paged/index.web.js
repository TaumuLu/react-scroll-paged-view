import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import Animated from 'animated/lib/targets/react-dom'
import Easing from 'animated/lib/Easing'

import { mergeStyle, getMergeObject, get } from '../utils'

import ViewPagedHOC from '../decorators/view-paged-hoc'


@ViewPagedHOC(Animated, Easing)
export default class ViewPaged extends Component {
  constructor(props) {
    super(props)

    const { locked } = props

    this._touchEvent = {}
    if (!locked) {
      this._touchEvent = {
        onTouchStart: this._onTouchStart,
        ref: this._setAnimatedDivRef, // 代替move事件绑定
        // onTouchMove: this._onTouchMove,
        onTouchEnd: this._onTouchEnd,
      }
    }
  }

  getStyle = () => {
    const { props: { vertical }, state: { pos, width, height }, _boxSize } = this
    let mergeStyle = {}
    const basis = this.childrenSize * 100

    if (vertical) {
      mergeStyle = {
        wrapStyle: { flexDirection: 'column', width, height },
        viewPagedStyle: { transform: [{ translateY: pos }], flexDirection: 'column', flex: `1 0 ${basis}%` },
        pageStyle: { height: _boxSize, width },
      }
    } else {
      mergeStyle = {
        wrapStyle: { flexDirection: 'row', width, height },
        viewPagedStyle: { transform: [{ translateX: pos }], flexDirection: 'row', flex: `1 0 ${basis}%` },
        pageStyle: { width: _boxSize, height },
      }
    }

    return getMergeObject(Style, mergeStyle)
  }

  _onTouchStart = (e) => {
    e.stopPropagation()
    const targetTouche = get(e, 'targetTouches.0') || {}
    const { clientX, clientY } = targetTouche
    this._TouchStartEvent()

    this.startX = clientX
    this.startY = clientY
    // 是否为反向滚动
    this.isScroll = false
    // 是否达成触摸滑动操作，此类变量可用于web端区分点击事件
    this.isTouch = false
    // 是否判断过移动方向，只判断一次，判断过后不再判断
    this.isMove = false
  }

  _getDistance(targetTouche) {
    const { vertical } = this.props
    const suffix = vertical ? 'Y' : 'X'
    return targetTouche[`client${suffix}`] - this[`start${suffix}`]
  }

  _onTouchMove = (e) => {
    const targetTouche = get(e, 'targetTouches.0') || {}
    const { clientX, clientY } = targetTouche
    const { startX, startY } = this
    if (!this.isMove) {
      this.isMove = true
      // 是否达成触摸滑动操作
      if (clientX !== startX || clientY !== startY) {
        this.isTouch = true
      }
      // 判断滚动方向是否正确
      const horDistance = Math.abs(clientX - startX)
      const verDistance = Math.abs(clientY - startY)
      const { vertical } = this.props
      if (vertical ? verDistance <= horDistance : horDistance <= verDistance) {
        this.isScroll = true
      }
    }

    if (!this.isScroll) {
      e.stopPropagation()
      this._TouchMoveEvent(targetTouche)
    }
    // 判断默认行为是否可以被禁用
    if (e.cancelable) {
      // 判断默认行为是否已经被禁用
      if (!e.defaultPrevented) {
        e.preventDefault()
      }
    }
  }

  _onTouchEnd = (e) => {
    const changedTouche = get(e, 'changedTouches.0') || {}
    const { clientX, clientY } = changedTouche
    this.endX = clientX
    this.endY = clientY
    // 触发Move事件才能去判断是否跳转
    if (!this.isScroll && this.isMove) {
      this._TouchEndEvent(changedTouche)
    }
  }

  _onLayout = (dom) => {
    if (dom) {
      const { offsetWidth, offsetHeight } = dom || {}
      this._runMeasurements(offsetWidth, offsetHeight)
    }
  }

  _renderMeasurements(initialStyle, initialChild) {
    return (
      <div style={this._getContainerStyle(Style.container)}>
        {this._renderPropsComponent('renderHeader')}
        <div
          style={initialStyle}
          ref={this._onLayout}
        >
          {initialChild}
        </div>
        {this._renderPropsComponent('renderFooter')}
      </div>
    )
  }

  _setAnimatedDivRef = (ref) => {
    if (ref && !this._animatedDivRef) {
      this._animatedDivRef = ref
      // ReactDOM.findDOMNode(this._animatedDivRef)
      const divDom = get(ref, 'refs.node')
      // safari阻止拖动回弹，通过dom绑定事件
      divDom.addEventListener('touchmove', this._onTouchMove, false)
    }
  }

  render() {
    const { wrapStyle, viewPagedStyle, pageStyle } = this.getStyle()
    const { style } = this.props
    const { loadIndex } = this.state

    return (
      <div style={mergeStyle(style, this._getContainerStyle(Style.container))}>
        {this._renderPropsComponent('renderHeader')}
        <div style={wrapStyle}>
          <Animated.div
            style={viewPagedStyle}
            {...this._touchEvent}
          >
            {this.childrenList.map((page, index) => {
              return (
                <div
                  key={index}
                  style={pageStyle}
                >
                  {loadIndex.includes(index) ? page : null}
                </div>
              )
            })}
          </Animated.div>
        </div>
        {this._renderPropsComponent('renderFooter')}
      </div>
    )
  }
}


export const Style = {
  container: {
    flex: 1,
    display: 'flex',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  wrapStyle: {
    flex: 1,
    display: 'flex',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  },
  viewPagedStyle: {
    display: 'flex',
  },
  pageStyle: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
}
