import PropTypes from 'prop-types'

import { noop } from '../utils'
import {
  propTypes as commonPropTypes,
  defaultProps as commonDefaultProps,
  IProps as commonIProps
} from './common'

const defaultResponder = (isResponder) => (evt, gestureState) => isResponder

export const propTypes = {
  ...commonPropTypes,
  onStartShouldSetPanResponder: PropTypes.func,
  onStartShouldSetPanResponderCapture: PropTypes.func,
  onMoveShouldSetPanResponder: PropTypes.func,
  onMoveShouldSetPanResponderCapture: PropTypes.func,
  onPanResponderTerminationRequest: PropTypes.func,
  onShouldBlockNativeResponder: PropTypes.func,
  onPanResponderTerminate: PropTypes.func,
  useScrollView: PropTypes.bool,
  scrollViewProps: PropTypes.object
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
  useScrollView: true,
  scrollViewProps: {}
}

type TDefaultResponder = (isResponder: boolean) => boolean

export interface IProps extends commonIProps {
  onStartShouldSetPanResponder: TDefaultResponder
  onStartShouldSetPanResponderCapture: TDefaultResponder
  onMoveShouldSetPanResponder: TDefaultResponder
  onMoveShouldSetPanResponderCapture: TDefaultResponder
  onPanResponderTerminationRequest: TDefaultResponder
  onShouldBlockNativeResponder: TDefaultResponder
  onPanResponderTerminate: TDefaultResponder
  useScrollView: boolean
  scrollViewProps: object
}
