import PropTypes from 'prop-types'
import { noop } from '../utils'

export const propTypes = {
  style: PropTypes.object,
  initialPage: PropTypes.number,
  vertical: PropTypes.bool,
  onChange: PropTypes.func,
  duration: PropTypes.number,
  withRef: PropTypes.bool,
  infinite: PropTypes.bool,
  // children: PropTypes.array.isRequired,
}

export const defaultProps = {
  style: {},
  initialPage: 0,
  vertical: false,
  onChange: noop,
  duration: 400,
  withRef: false,
  infinite: false,
}
