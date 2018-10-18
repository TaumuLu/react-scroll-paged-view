import { View, Easing, Animated } from 'react-native'
import AgentScrollView from './agent-scroll-view'

export * from './common'

const AnimatedView = Animated.View

const Style = {
  containerStyle: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  wrapStyle: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  AnimatedStyle: {
    flex: 1,
  },
  pageStyle: {},
}


export {
  Style,
  Animated,
  AnimatedView,
  Easing,
  View,
  AgentScrollView
}
