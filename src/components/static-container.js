import React, { Component } from 'react'

export default class StaticContainer extends Component {
  shouldComponentUpdate(nextProps) {
    return !!nextProps.shouldUpdate
  }

  render() {
    const { children } = this.props
    if (children === null || children === false) {
      return null
    }

    return React.Children.only(children)
  }
}
