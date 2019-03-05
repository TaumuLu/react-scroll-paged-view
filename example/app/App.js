import React, { Component } from 'react'
import {
  StyleSheet,
  Platform,
  Text,
  Dimensions,
  NativeModules,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'

import ScrollPagedView, { ViewPaged } from 'react-scroll-paged-view'
// import ScrollPagedView, { ViewPaged } from './../src'

let height = Dimensions.get('window').height
const width = Dimensions.get('window').width

if (Platform.OS === 'android') {
  height -= NativeModules.StatusBarManager.HEIGHT
}

export default class App extends Component {

  pageLists = ['blue', 'green', 'red']

  _renderTabBar = ({ activeTab, goToPage }) => {
    return (
      <View style={Style.tabBarContainer}>
        {this.pageLists.map((value, index) => {
          return (
            <TouchableOpacity key={value} style={{ flex: 1 }} onPress={() => goToPage(index)}>
              <View style={[Style.tabBarItem, activeTab === index ? { borderColor: value } : {}]}>
                <Text style={[Style.tabBarItemText, activeTab === index ? { color: value } : {}]}>{value}</Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  _renderDot = ({ activeTab, goToPage }) => {
    return (
      <View style={Style.dotContainer}>
        {this.pageLists.map((value, index) => {
          return (
            <TouchableOpacity key={value} style={{ flex: 1 }} onPress={() => goToPage(index)}>
              <View style={Style.tabBarItem}>
                <View style={[Style.dotItemView, activeTab === index ? { backgroundColor: 'white' } : {}]}></View>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  render() {
    const WrapView = ScrollPagedView
    // const WrapView = ViewPaged

    return (
      <View style={Style.container}>
        <WrapView
          // onChange={this._onChange}
          // onResponder={this._onResponder}
          // renderHeader={this._renderTabBar}
          // renderFooter={this._renderDot}
          // tabBarPosition='top'
          // hasAnimation={false}
          // initialPage={0}
          isMovingRender
          // vertical={false}
          // initialPage={1}
          // infinite
          // locked
          // autoPlay
        >
          {/* <View style={[Style.pageView, { backgroundColor: 'black' }]}>
            <Text style={Style.text}>head</Text>
            <Text style={Style.textIndex}>page {0}</Text>
            <Text style={Style.text}>foot</Text>
          </View> */}
          {Array.from({ length: 3 }, (val, ind) => {
            return (
              <InsideScrollView
                key={ind}
                text={ind + 1}
                style={Style[`pageItem_${ind}`]}
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
    const WrapView = this.context.ScrollView || ScrollView
    const { text, style } = this.props

    return (
      <View style={{ flex: 1 }}>
        <WrapView style={{ flex: 1 }}>
          <View style={[Style.pageView, style]}>
            <Text style={Style.text}>head</Text>
            <Text style={Style.textIndex}>page {text}</Text>
            <Text style={Style.text}>foot</Text>
          </View>
        </WrapView>
      </View>
    )
  }
}

const Style = StyleSheet.create({
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
    height: height * 2,
    width,
  },
  pageItem_2: {
    backgroundColor: 'red',
    height,
    width: width * 2,
  },

  tabBarContainer: {
    minWidth: 50,
    minHeight: 50,
    backgroundColor: 'white',
    borderColor: '#000',
    flexDirection: 'row',
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderColor: 'transparent',
  },
  tabBarItemText: {
    fontSize: 18,
    color: 'gray',
  },

  dotContainer: {
    position: 'absolute',
    bottom: 80,
    left: 100,
    right: 100,
    height: 10,
    flexDirection: 'row',
  },
  dotItemView: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
})
