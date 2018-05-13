import { AppRegistry, Platform } from 'react-native'
import App from './src'

AppRegistry.registerComponent('example', () => App)
// web
if (Platform.OS === 'web') {
  AppRegistry.runApplication('example', {
    rootTag: document.getElementById('root'),
  })
}
