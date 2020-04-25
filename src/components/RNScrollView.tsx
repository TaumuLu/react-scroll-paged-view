import React, { ReactElement } from 'react'
import {
  ScrollView,
  Platform,
  findNodeHandle,
  requireNativeComponent,
  UIManager,
  ScrollViewProps
} from 'react-native'

export default class RNScrollView extends ScrollView {
  setScrollEnabled = (value) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      // @ts-ignore
      UIManager.RNScrollView.Commands.setScrollEnabled,
      [value]
    )
  }

  render() {
    const reactElement = super.render() as ReactElement
    if (Platform.OS === 'ios') {
      return reactElement
    }
    const { props } = reactElement
    const { horizontal, ...otherProps } = props as ScrollViewProps

    if (horizontal) {
      return <AndroidHorizontalScrollView {...otherProps} />
    }
    return <AndroidScrollView {...otherProps} />
  }
}

const nativeOnlyProps = {
  nativeOnly: {
    sendMomentumEvents: true
  }
}

let AndroidScrollView
let AndroidHorizontalScrollView
if (Platform.OS !== 'ios') {
  AndroidScrollView = requireNativeComponent<ScrollView>(
    'RNScrollView',
    // @ts-ignore
    ScrollView,
    nativeOnlyProps
  )
  AndroidHorizontalScrollView = requireNativeComponent<ScrollView>(
    'RNHorizontalScrollView',
    // @ts-ignore
    ScrollView,
    nativeOnlyProps
  )
}
