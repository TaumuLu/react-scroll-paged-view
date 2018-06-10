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

    return (
      <AndroidScrollView {...props}/>
    )
  }
}

const nativeOnlyProps = {
  nativeOnly: {
    sendMomentumEvents: true,
  },
}

let AndroidScrollView
if (Platform.OS !== 'ios') {
  AndroidScrollView = requireNativeComponent(
    'RNScrollView',
    ScrollView,
    nativeOnlyProps
  )
}
