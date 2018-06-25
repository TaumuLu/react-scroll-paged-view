import PropTypes from 'prop-types'

import { noop } from '../utils'
import { propTypes as commonPropTypes, defaultProps as commonDefaultProps } from './common'


export const propTypes = {
  ...commonPropTypes,
  scrollWithoutAnimation: PropTypes.bool,
  locked: PropTypes.bool,
  autoPlay: PropTypes.bool,
  autoplaySpeed: PropTypes.number,
  renderTabBar: PropTypes.func,
  renderDot: PropTypes.func,
}

export const defaultProps = {
  ...commonDefaultProps,
  scrollWithoutAnimation: false,
  locked: false,
  autoPlay: false,
  autoplaySpeed: 2000,
  renderTabBar: noop,
  renderDot: noop,
}

