import { } from 'react'
import PropTypes from 'prop-types'

import { noop } from './index'

const defaultResponder = isResponder => (evt, gestureState) => isResponder

const viewPagedCommon = {
  propTypes: {
    initialPage: PropTypes.number,
    vertical: PropTypes.bool,
    onChange: PropTypes.func,
    style: PropTypes.object,
    duration: PropTypes.number,
    // children: PropTypes.array.isRequired,
  },
  defaultProps: {
    initialPage: 0,
    vertical: false,
    onChange: noop,
    style: {},
    duration: 400,
  },
}

export const propTypes = {
  RnViewPaged: {
    ...viewPagedCommon.propTypes,
    onStartShouldSetPanResponder: PropTypes.func,
    onStartShouldSetPanResponderCapture: PropTypes.func,
    onMoveShouldSetPanResponder: PropTypes.func,
    onMoveShouldSetPanResponderCapture: PropTypes.func,
    onPanResponderTerminationRequest: PropTypes.func,
    onPanResponderTerminate: PropTypes.func,
    onShouldBlockNativeResponder: PropTypes.func,
  },
  WebViewPaged: {
    ...viewPagedCommon.propTypes,
    scrollWithoutAnimation: PropTypes.bool,
    locked: PropTypes.bool,
    infinite: PropTypes.bool,
    isDot: PropTypes.bool,
    tabLabels: PropTypes.array,
    autoPlay: PropTypes.bool,
    autoPlayTime: PropTypes.number,
    dotStyle: PropTypes.object,
    dotWrapStyle: PropTypes.object,
    dotActiveStyle: PropTypes.object,
    renderTabBar: PropTypes.func,
  },
}

export const defaultProps = {
  RnViewPaged: {
    ...viewPagedCommon.defaultProps,
    onStartShouldSetPanResponder: defaultResponder(true),
    onStartShouldSetPanResponderCapture: defaultResponder(false),
    onMoveShouldSetPanResponder: defaultResponder(true),
    onMoveShouldSetPanResponderCapture: defaultResponder(false),
    onPanResponderTerminationRequest: defaultResponder(true),
    onPanResponderTerminate: noop,
    onShouldBlockNativeResponder: defaultResponder(true),
  },
  WebViewPaged: {
    ...viewPagedCommon.defaultProps,
    scrollWithoutAnimation: false,
    locked: false,
    infinite: false,
    isDot: false,
    tabLabels: [],
    autoPlay: false,
    autoPlayTime: 2000,
    dotStyle: {},
    dotWrapStyle: {},
    dotActiveStyle: {},
    renderTabBar: noop,
  },
}
