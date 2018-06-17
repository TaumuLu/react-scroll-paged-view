import PropTypes from 'prop-types'

import { noop } from '../utils'
import { propTypes as commonPropTypes, defaultProps as commonDefaultProps } from './common'


const defaultResponder = isResponder => (evt, gestureState) => isResponder

export const propTypes = {
  ...commonPropTypes,
  onStartShouldSetPanResponder: PropTypes.func,
  onStartShouldSetPanResponderCapture: PropTypes.func,
  onMoveShouldSetPanResponder: PropTypes.func,
  onMoveShouldSetPanResponderCapture: PropTypes.func,
  onPanResponderTerminationRequest: PropTypes.func,
  onShouldBlockNativeResponder: PropTypes.func,
  onPanResponderTerminate: PropTypes.func,
}

export const defaultProps = {
  ...commonDefaultProps,
  onStartShouldSetPanResponder: defaultResponder(true),
  onStartShouldSetPanResponderCapture: defaultResponder(false),
  onMoveShouldSetPanResponder: defaultResponder(true),
  onMoveShouldSetPanResponderCapture: defaultResponder(false),
  onPanResponderTerminationRequest: defaultResponder(true),
  onShouldBlockNativeResponder: defaultResponder(true),
  onPanResponderTerminate: noop,
}
