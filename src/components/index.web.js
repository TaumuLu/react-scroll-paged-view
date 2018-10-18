import React from 'react'
import Animated from 'animated/lib/targets/react-dom'
import Easing from 'animated/lib/Easing'

export * from './common'

const AnimatedView = Animated.div

const View = (props) => {
  const { onLayout, ...otherProps } = props
  const extraProps = {}
  if (onLayout) {
    extraProps.ref = onLayout
  }

  return (
    <div {...extraProps} {...otherProps}/>
  )
}

const Style = {
  containerStyle: {
    flex: 1,
    display: 'flex',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  wrapStyle: {
    flex: 1,
    display: 'flex',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  AnimatedStyle: {
    flex: 1,
    display: 'flex',
  },
  pageStyle: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
}

export {
  Style,
  Animated,
  AnimatedView,
  Easing,
  View
}
