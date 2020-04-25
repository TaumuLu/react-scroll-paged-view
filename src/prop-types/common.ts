import PropTypes from 'prop-types'

export const propTypes = {
  style: PropTypes.object,
  initialPage: PropTypes.number,
  vertical: PropTypes.bool,
  onChange: PropTypes.func,
  duration: PropTypes.number,
  withRef: PropTypes.bool,
  infinite: PropTypes.bool,
  renderHeader: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  renderFooter: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  renderPosition: PropTypes.string,
  autoPlay: PropTypes.bool,
  autoPlaySpeed: PropTypes.number,
  hasAnimation: PropTypes.bool,
  locked: PropTypes.bool,
  preRenderRange: PropTypes.number,
  isMovingRender: PropTypes.bool,
  onScroll: PropTypes.func
  // children: PropTypes.array.isRequired,
}

export const defaultProps = {
  style: {},
  initialPage: 0,
  vertical: true,
  onChange: undefined,
  duration: 400,
  withRef: false,
  infinite: false,
  renderHeader: undefined,
  renderFooter: undefined,
  renderPosition: 'top',
  autoPlay: false,
  autoPlaySpeed: 2000,
  hasAnimation: true,
  locked: false,
  preRenderRange: 0,
  isMovingRender: false,
  onScroll: undefined
}

export interface IProps {
  style: Record<string, string>
  initialPage: number
  vertical: boolean
  onChange: (currentPage: number, prevPage: number) => void
  duration: number
  withRef: boolean
  infinite: boolean
  renderHeader: any
  renderFooter: any
  renderPosition: 'top' | 'left' | 'bottom' | 'right'
  autoPlay: boolean
  autoPlaySpeed: number
  hasAnimation: boolean
  locked: boolean
  preRenderRange: number
  isMovingRender: boolean
  onScroll: (event: any) => void
}
