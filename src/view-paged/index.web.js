import { Component } from 'react'
import { get } from '../utils'
import ViewPagedHOC from '../decorators/view-paged-hoc'


@ViewPagedHOC
export default class ViewPaged extends Component {
  constructor(props) {
    super(props)

    const { locked } = props

    this._AnimatedViewProps = {}
    if (!locked) {
      this._AnimatedViewProps = {
        onTouchStart: this._onTouchStart,
        ref: this._setAnimatedDivRef, // 代替move事件绑定
        // onTouchMove: this._onTouchMove,
        onTouchEnd: this._onTouchEnd,
      }
    }
  }

  _getStyles() {
    const { props: { vertical }, state: { pos, isReady } } = this
    if (!isReady) return {}
    const basis = this.childrenSize * 100
    const key = `translate${vertical ? 'Y' : 'X'}`

    return {
      AnimatedStyle: {
        transform: [{ [key]: pos }],
        flex: `1 0 ${basis}%`,
      },
    }
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

  _setAnimatedDivRef = (ref) => {
    if (ref && !this._animatedDivRef) {
      this._animatedDivRef = ref
      // ReactDOM.findDOMNode(this._animatedDivRef)
      const divDom = get(ref, 'refs.node')
      // safari阻止拖动回弹，通过dom绑定事件
      divDom.addEventListener('touchmove', this._onTouchMove, false)
    }
  }

  _onLayout = (dom) => {
    if (dom) {
      const { offsetWidth, offsetHeight } = dom || {}
      this._runMeasurements(offsetWidth, offsetHeight)
    }
  }
}
