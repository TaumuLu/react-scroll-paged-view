import React, { Component, ReactNode } from 'react'
import { size, get } from '../utils'
import { IProps } from '../prop-types'

export default class Common<P = IProps, S = {}> extends Component<P, S> {
  public childrenList: ReactNode[]

  public childrenSize: number

  public _childrenList: ReactNode[]

  public _childrenSize: number

  getChildren(
    children: ReactNode[] = get(this.props, 'children'),
    handleFunc: (child: ReactNode) => ReactNode = (child) => child
  ) {
    return React.Children.map(children, handleFunc)
  }

  setChildrenAttr() {
    this.childrenList = this.getChildren()
    this.childrenSize = size(this.childrenList)
    // 记录初次children值，childrenList之后可能会改变
    this._childrenList = this.childrenList
    this._childrenSize = this.childrenSize
  }
}
