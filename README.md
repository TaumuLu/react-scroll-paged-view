# react-scroll-paged-view
[以中文查看](./README_zh-CN.md)  
[If you are interested in my development process, you may read it, I believe you will gain something](./Dev_Record.md)  

**scroll view, Inside scroll, Full page scroll, Nesting ScrollView**  

## Installation
```
npm install react-scroll-paged-view --save
```

## Introduction
Support React(web) & React Native(RN)  
ScrollView component that provides child component packaging  
Full-page scrolling and in-page scrolling  
iOS RN code is perfectly supported. Android provides native package support. Based on RN ScrollView, some code changes are supported  
There is no combination of internal scrolling and page scrolling in open source RN projects. Write this component based on need  
In addition, the core functional module ViewPaged is also available for use  

## Notice
~~**Compatible version "react-native": "~0.54.0"**~~  
~~**The react native 0.47 version uses the 0.1.\* version**~~  
**Has been perfectly compatible with the above RN version, directly install the latest package**  
**Click events that do not appear in the internal ScrollView component can be replaced with onPressIn**  

## Demo
| IOS | Android | Web |
| --- | ------- | --- |
| ![IOS](./demo.ios.gif) | ![Android](./demo.android.gif) | ![Web](./demo.web.gif) |

## Usage

### External Full Page scroll
```
import ScrollPagedView from 'react-scroll-paged-view'
import InsideScrollView from './InsideScrollView'

...
    _onChange = (pageIndex) => {
        ...
    }

    render() {
        return (
            <ScrollPagedView
                onChange={this._onChange}
                onResponder={this._onResponder}
            >
                <InsideScrollView />
                <InsideScrollView />
                <InsideScrollView />
            </ScrollPagedView>
        )
    }
...
```

### Inside scrollView
```
...
    static contextTypes = {
        ScrollView: PropTypes.func,
    }

    render() {
        const ScrollView = this.context.ScrollView
        return (
            <ScrollView>
                ...
            </ScrollView>
        )
    }
...
```

## Properties

### ScrollPagedView
ScrollPagedView directly uses the ViewPaged component, so you can pass in the Props of ViewPaged as needed, refer to the props of the following ViewPaged components  

| Name | propType | default value | description |
| --- | --- | --- | --- |
| onResponder(native only) | function | (isResponder) => {} | Gesture switch state callback |
| withRef | bool | false | Get ViewPaged instance ref, through the component's getViewPagedInstance method |

### Inside scrollView
Name | propType | default value | description
--- | --- | --- | ---
nativeProps(native only) | object | {} | RN scrollView Props
webProps(web only) | object | {} | Web scrollView Props

## Export module
- default - ScrollPagedView
- ViewPaged

### ViewPaged
The web version is similar to react-native-scrollable-tab-view and provides similar functionality  
The functionality of the Rn version is not as complete as the Web version, and the follow-up continues to improve  

### Properties

#### Common Props
| Name | propType | default value | description |
| --- | --- | --- | --- |
| onChange | function | () => {} | Switch paging callbacks |
| initialPage | number | 0 | Initial page index |
| vertical | bool | false | Whether to switch the view vertically |
| duration | number | 400 | Animation duration(In milliseconds) |
| style | object | {} | ViewPaged style |

#### Web Only Props
| Name | propType | default value | description |
| --- | --- | --- | --- |
| scrollWithoutAnimation | bool | false | Click on the top tab to toggle whether there is animation |
| locked | bool | false | Whether to allow drag toggle |
| infinite | bool | false | Whether it is an infinite scroll view |
| isDot | bool | false | Is there a bottom dot |
| tabLabels | array | [] | Tab index, using the children array index by default |
| autoPlay | bool | false | Whether to auto rotate |
| autoPlayTime | number | 2000 | Automatic carousel interval (In milliseconds) |
| dotStyle | object | {} | Dot style |
| dotWrapStyle | object | {} | Dot external style |
| dotActiveStyle | object | {} | Dot activation style |
| renderTabBar | function | () => {} | tabBar component |

#### RN Only Props
| Name | propType | default value | description |
| --- | --- | --- | --- |
| onStartShouldSetPanResponder | function | () => true | Reference React Native website gesture response system |
| onStartShouldSetPanResponderCapture | function | () => false | Reference React Native website gesture response system |
| onMoveShouldSetPanResponder | function | () => true | Reference React Native website gesture response system |
| onMoveShouldSetPanResponderCapture | function | () => false | Reference React Native website gesture response system |
| onPanResponderTerminationRequest | function | () => true | Reference React Native website gesture response system |
| onShouldBlockNativeResponder | function | () => true | Reference React Native website gesture response system |
| onPanResponderTerminate | function | () => {} | Reference React Native website gesture response system |

## TODO
- [x] Optimize scroll region index, use proxy scrollView to complete
- [x] Android compatible React Native different versions
- [x] Support web side components
- [x] Optimize web side components
- [x] Optimize web infinite scrolling
- [x] Perfect web-side ViewPaged
- [x] Optimize structure, code, unified naming
- [x] Uniformly compatible with different versions of React Native
- [x] Record development process
- [ ] Perfect RN end ViewPaged achieves consistency with web performance
- [ ] More props configuration

## Changelog
- 0.1.*
- 1.0.*
- 1.1.*
- 1.2.*
- 1.3.*
- 1.5.*
