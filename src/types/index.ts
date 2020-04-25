import { Animated } from '../components'

export interface IViewPagedState {
  width: number
  height: number
  pos: Animated.Value
  isReady: boolean
  loadIndex: number[]
}
