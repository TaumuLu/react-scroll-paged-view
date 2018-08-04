import React, { Component } from 'react'
import { getDisplayName, getPrototypeOf, copyStatic, size } from '../utils'
import { propTypes, defaultProps } from '../prop-types'


export default function ConnectHOC(Inheritance) {
  class Connect extends Inheritance {
    static propTypes = propTypes
    static defaultProps = defaultProps
    static displayName = `HOC(${getDisplayName(getPrototypeOf(Inheritance))})`

    getChildren(children = this.props.children, handleFunc = child => child) {
      return React.Children.map(children, handleFunc)
    }

    render() {
      this.childrenList = this.getChildren()
      this.childrenSize = size(this.childrenList)
      // 记录初次children值
      this._childrenList = this.childrenList
      this._childrenSize = this.childrenSize

      return super.render()
    }
  }

  return copyStatic(Connect, Inheritance, { finallyInherit: Component })
}

