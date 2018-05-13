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

import ScrollPagedView from '../lib'

console.disableYellowBox = true

let height = Dimensions.get('window').height
if (Platform.OS === 'android') {
  height -= NativeModules.StatusBarManager.HEIGHT
}

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ScrollPagedView
          onPageChange={this._onPageChange}
          setResponder={this._setResponder}
        >
          {Array.from({ length: 3 }, (val, ind) => {
            return (
              <InsideScrollView key={ind} text={ind + 1} style={styles[`pageItem_${ind}`]}/>
            )
          })}
        </ScrollPagedView>
      </View>
    )
  }
}


class InsideScrollView extends Component {
  static contextTypes = {
    ScrollView: PropTypes.func,
  }

  render() {
    const ScrollView = this.context.ScrollView
    const { text, style } = this.props

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={[styles.wrapView, style]}>
            <Text style={styles.text}>head</Text>
            <Text style={styles.textIndex}>page {text}</Text>
            {/* {Array.from({ length: 15 }, (val, ind) => {
              return (
                <View key={ind} text={ind} style={styles.viewItem}>
                  <Text style={styles.text}>{ind}</Text>
                </View>
              )
            })} */}
            <Text style={styles.text}>foot</Text>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
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

  wrapView: {
    // height: height * 2,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  viewItem: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
    height: 1000,
  },
  pageItem_1: {
    backgroundColor: 'green',
    height,
  },
  pageItem_2: {
    backgroundColor: 'red',
    height: 1200,
  },
})
