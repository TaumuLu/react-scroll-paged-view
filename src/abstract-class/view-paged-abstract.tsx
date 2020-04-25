import { PanResponderInstance, GestureResponderHandlers } from 'react-native'
import { IProps } from '../prop-types'
import { IViewPagedState } from '../types'
import Common from './common'

export default abstract class ViewPaged<
  P = IProps,
  S = IViewPagedState
> extends Common<P, S> {
  protected _panResponder?: PanResponderInstance

  protected _AnimatedViewProps?:
    | GestureResponderHandlers
    | {
        onTouchStart: (e: any) => void
        ref: (ref: any) => void
        // onTouchMove: this._onTouchMove,
        onTouchEnd: (e: any) => void
      }

  public _isScrollView: boolean

  public _initialPage: number

  public _posPage: number

  public abstract _renderPage(): JSX.Element[]

  public abstract _onChange(): void

  public abstract _TouchStartEvent(): void

  public abstract _TouchMoveEvent(touchState: any): void

  public abstract _TouchEndEvent(touchState: any): void

  public abstract _runMeasurements(width: number, height: number): void
}
