import { Platform } from 'react-native'

export * from './common'

export const isIOS = Platform.OS === 'ios'

export const isAndroid = Platform.OS === 'android'
