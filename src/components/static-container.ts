import React, { Component } from 'react'

interface IProps {
  children: React.ReactNode
  shouldUpdate: boolean
}

export default class StaticContainer extends Component<IProps> {
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
