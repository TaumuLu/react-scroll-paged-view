import React from 'react'
import { ScrollView, Platform, View, StyleSheet, findNodeHandle, requireNativeComponent, UIManager } from 'react-native'

export default class RNScrollView extends ScrollView {

  setScrollEnabled = (value) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      UIManager.RNScrollView.Commands.setScrollEnabled,
      [value],
    )
  }

  render() {
    if (Platform.OS === 'ios') {
      return super.render()
    }

    const ScrollViewClass = AndroidScrollView
    const ScrollContentContainerViewClass = View

    const contentContainerStyle = [
      this.props.horizontal && styles.contentContainerHorizontal,
      this.props.contentContainerStyle,
    ]

    let contentSizeChangeProps = {}
    if (this.props.onContentSizeChange) {
      contentSizeChangeProps = {
        onLayout: this._handleContentOnLayout,
      }
    }

    const children = this.props.children
    const contentContainer = (
      <ScrollContentContainerViewClass
        {...contentSizeChangeProps}
        ref={this._setInnerViewRef}
        style={contentContainerStyle}
        removeClippedSubviews={
          // Subview clipping causes issues with sticky headers on Android and
          // would be hard to fix properly in a performant way.
          this.props.removeClippedSubviews
        }
        collapsable={false}
      >
        {children}
      </ScrollContentContainerViewClass>
    )

    const alwaysBounceHorizontal =
      this.props.alwaysBounceHorizontal !== undefined ?
        this.props.alwaysBounceHorizontal :
        this.props.horizontal

    const alwaysBounceVertical =
      this.props.alwaysBounceVertical !== undefined ?
        this.props.alwaysBounceVertical :
        !this.props.horizontal

    const DEPRECATED_sendUpdatedChildFrames =
      !!this.props.DEPRECATED_sendUpdatedChildFrames

    const baseStyle = this.props.horizontal ? styles.baseHorizontal : styles.baseVertical
    const props = {
      ...this.props,
      alwaysBounceHorizontal,
      alwaysBounceVertical,
      style: [baseStyle, this.props.style],
      // Override the onContentSizeChange from props, since this event can
      // bubble up from TextInputs
      onContentSizeChange: null,
      onMomentumScrollBegin: this.scrollResponderHandleMomentumScrollBegin,
      onMomentumScrollEnd: this.scrollResponderHandleMomentumScrollEnd,
      onResponderGrant: this.scrollResponderHandleResponderGrant,
      onResponderReject: this.scrollResponderHandleResponderReject,
      onResponderRelease: this.scrollResponderHandleResponderRelease,
      onResponderTerminate: this.scrollResponderHandleTerminate,
      onResponderTerminationRequest: this.scrollResponderHandleTerminationRequest,
      onScroll: this._handleScroll,
      onScrollBeginDrag: this.scrollResponderHandleScrollBeginDrag,
      onScrollEndDrag: this.scrollResponderHandleScrollEndDrag,
      onScrollShouldSetResponder: this.scrollResponderHandleScrollShouldSetResponder,
      onStartShouldSetResponder: this.scrollResponderHandleStartShouldSetResponder,
      onStartShouldSetResponderCapture: this.scrollResponderHandleStartShouldSetResponderCapture,
      onTouchEnd: this.scrollResponderHandleTouchEnd,
      onTouchMove: this.scrollResponderHandleTouchMove,
      onTouchStart: this.scrollResponderHandleTouchStart,
      scrollEventThrottle: this.props.scrollEventThrottle,
      sendMomentumEvents: !!((this.props.onMomentumScrollBegin || this.props.onMomentumScrollEnd)),
      DEPRECATED_sendUpdatedChildFrames,
    }

    return (
      <ScrollViewClass {...props} ref={this._setScrollViewRef}>
        {contentContainer}
      </ScrollViewClass>
    )
  }
}


const styles = StyleSheet.create({
  baseVertical: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'column',
    overflow: 'scroll',
  },
  baseHorizontal: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    overflow: 'scroll',
  },
  contentContainerHorizontal: {
    flexDirection: 'row',
  },
})

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
