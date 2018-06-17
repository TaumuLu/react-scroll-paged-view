import PropTypes from 'prop-types'

import { accAdd } from '../utils'
import Connect from './connect'
import { propTypes, defaultProps } from '../prop-types'


export default function ScrollPageHOC(WrappedComponent) {
  @Connect
  class ScrollPaged extends WrappedComponent {
    static childContextTypes = {
      ScrollView: PropTypes.func,
    }
    static propTypes = propTypes
    static defaultProps = {
      ...defaultProps,
      vertical: true,
    }

    constructor(props) {
      super(props)

      this.isBorder = false
      this.isResponder = true
      this.currentPage = 0
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

    triggerJudge(isStart, isEnd) {
      switch (this.currentPage) {
        case 0:
          return isEnd
        case this.childrenLen - 1:
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
  }

  return ScrollPaged
}

