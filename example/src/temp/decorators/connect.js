import React, { Component } from 'react'
import { getDisplayName, getPrototypeOf, copyStatic, size } from '../utils'


export default function ConnectHOC(Inheritance) {
  class Connect extends Inheritance {
    static displayName = `HOC(${getDisplayName(getPrototypeOf(Inheritance))})`

    getChildren(children = this.props.children, handleFunc = child => child) {
      return React.Children.map(children, handleFunc)
    }

    render() {
      this.childrenList = this.getChildren()
      this.childrenLen = size(this.childrenList)

      return super.render()
    }
  }

  return copyStatic(Connect, Inheritance, { finallyInherit: Component })
}

