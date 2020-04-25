import { PanResponderCallbacks } from 'react-native'
import { IProps } from '../prop-types'
import Common from './common'

export type DirectionValues = 'isStart' | 'isEnd' | 'none'

export default abstract class ScrollPaged<P = IProps, S = {}> extends Common<
  P,
  S
> {
  protected _viewPagedProps?: PanResponderCallbacks

  public isBorder: boolean

  public isResponder: boolean

  public startX: number

  public startY: number

  public isTouchMove: boolean

  public hasScrollViewPages: number[]

  public borderDirection: DirectionValues

  public abstract setBorderValue(
    startValue: number,
    endValue: number,
    maxValue: number
  ): void

  public abstract _TouchStartEvent(x: number, y: number): void

  public abstract _TouchMoveEvent(
    x: number,
    y: number,
    sizeValue: number,
    layoutValue: number
  ): void

  public abstract _setScrollViewRef(ref: any): void
}
