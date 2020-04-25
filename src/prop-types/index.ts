import PropTypes from 'prop-types'
import { PanResponderCallbacks } from 'react-native'

import { noop } from '../utils'
import {
  propTypes as commonPropTypes,
  defaultProps as commonDefaultProps,
  IProps as commonIProps
} from './common'

const defaultResponder = (isResponder) => () => isResponder

const panResponderMap = {
  onStartShouldSetPanResponder: {
    propType: PropTypes.func,
    defaultValue: defaultResponder(true)
  },
  onStartShouldSetPanResponderCapture: {
    propType: PropTypes.func,
    defaultValue: defaultResponder(false)
  },
  onMoveShouldSetPanResponder: {
    propType: PropTypes.func,
    defaultValue: defaultResponder(true)
  },
  onMoveShouldSetPanResponderCapture: {
    propType: PropTypes.func,
    defaultValue: defaultResponder(false)
  },
  onPanResponderTerminationRequest: {
    propType: PropTypes.func,
    defaultValue: defaultResponder(true)
  },
  onShouldBlockNativeResponder: {
    propType: PropTypes.func,
    defaultValue: defaultResponder(true)
  },
  onPanResponderTerminate: {
    propType: PropTypes.func,
    defaultValue: noop
  }
}

export const panResponderKey = Object.keys(panResponderMap)

const getProperty = (name: string) => {
  return panResponderKey.reduce((p, k) => {
    p[k] = panResponderMap[k][name]
    return p
  }, {})
}

export const propTypes = {
  ...commonPropTypes,
  ...getProperty('propType'),
  useScrollView: PropTypes.bool,
  scrollViewProps: PropTypes.object
}

export const defaultProps = {
  ...commonDefaultProps,
  ...getProperty('defaultValue'),
  useScrollView: true,
  scrollViewProps: {}
}

type keys = keyof typeof panResponderMap

type PanResponder = Pick<PanResponderCallbacks, keys>

export interface IProps extends commonIProps, PanResponder {
  useScrollView?: boolean
  scrollViewProps?: object
}
