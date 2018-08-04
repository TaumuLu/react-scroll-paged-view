import React, { Component } from 'react'
import {
  StyleSheet,
  Platform,
  Text,
  Dimensions,
  NativeModules,
  View
} from 'react-native'
import PropTypes from 'prop-types'

import ScrollPagedView, { ViewPaged } from 'react-scroll-paged-view'

console.disableYellowBox = true

let height = Dimensions.get('window').height
const width = Dimensions.get('window').width
if (Platform.OS === 'android') {
  height -= NativeModules.StatusBarManager.HEIGHT
}

export default class App extends Component {
  render() {
    // const WrapView = ScrollPagedView
    const WrapView = ViewPaged

    return (
      <View style={styles.container}>
        <WrapView
          onChange={this._onChange}
          onResponder={this._onResponder}
          // initialPage={0}
          // vertical={false}
          vertical
          infinite
        >
          <View style={[styles.pageView, { backgroundColor: 'black' }]}>
            <Text style={styles.text}>head</Text>
            <Text style={styles.textIndex}>page {0}</Text>
            <Text style={styles.text}>foot</Text>
          </View>
          {Array.from({ length: 3 }, (val, ind) => {
            return (
              <InsideScrollView
                key={ind}
                text={ind + 1}
                style={styles[`pageItem_${ind}`]}
              />
            )
          })}
        </WrapView>
      </View>
    )
  }
}


class InsideScrollView extends Component {
  static contextTypes = {
    ScrollView: PropTypes.func,
  }

  render() {
    const WrapView = this.context.ScrollView || View
    const { text, style } = this.props

    return (
      <View style={{ flex: 1 }}>
        <WrapView style={{ flex: 1 }}>
          <View style={[styles.pageView, style]}>
            <Text style={styles.text}>head</Text>
            <Text style={styles.textIndex}>page {text}</Text>
            <Text style={styles.text}>foot</Text>
          </View>
        </WrapView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height,
    width,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },

  pageView: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 40,
    color: 'white',
  },
  textIndex: {
    fontSize: 80,
    color: 'white',
  },

  pageItem_0: {
    backgroundColor: 'blue',
    height: height * 1.5,
    width,
  },
  pageItem_1: {
    backgroundColor: 'green',
    height,
    width,
  },
  pageItem_2: {
    backgroundColor: 'red',
    height,
    width: width * 2,
  },
})
