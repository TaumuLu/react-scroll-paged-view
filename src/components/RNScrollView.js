import React from 'react'
import { ScrollView, Platform, findNodeHandle, requireNativeComponent, UIManager } from 'react-native'

export default class RNScrollView extends ScrollView {

  setScrollEnabled = (value) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      UIManager.RNScrollView.Commands.setScrollEnabled,
      [value],
    )
  }

  render() {
    const reactElement = super.render()
    if (Platform.OS === 'ios') {
      return reactElement
    }
    const { props } = reactElement
    const { horizontal, ...otherProps } = props

    if (horizontal) {
      return (
        <AndroidHorizontalScrollView {...otherProps}/>
      )
    }
    return (
      <AndroidScrollView {...otherProps}/>
    )
  }
}

const nativeOnlyProps = {
  nativeOnly: {
    sendMomentumEvents: true,
  },
}

let AndroidScrollView
let AndroidHorizontalScrollView
if (Platform.OS !== 'ios') {
  AndroidScrollView = requireNativeComponent(
    'RNScrollView',
    ScrollView,
    nativeOnlyProps
  )
  AndroidHorizontalScrollView = requireNativeComponent(
    'RNHorizontalScrollView',
    ScrollView,
    nativeOnlyProps
  )
}
