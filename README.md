# react-scroll-paged-view
[以中文查看](./README_zh-CN.md)  
scroll view, Inside scroll, Full page scroll, Nesting ScrollView

## Installation
```
npm install react-scroll-paged-view --save
```

## Introduction
Support React(web) & React Native(RN)  
Support Subcomponents can choose whether or not to use scrollView  
Rolling integration in the whole page rolling page  
Ios RN code is perfectly supported, android is based on RN scrollView changed part of the code to supportbased on the project needs  
Currently there is no internal scrolling and page scrolling in the open source RN project. This component is written  
In addition, an additional core function module is provided. The RN side is a PagedView, and the web side is a ScrollableTabView  

## Notice
**Compatible version "react-native": "~0.54.0"**  
**The react native 0.47 version uses the 0.1.\* version**  
**The click events that do not appear in the inside scrollView component can be used by onPressIn instead**  

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
    _onPageChange = (pageIndex) => {
        ...
    }

    render() {
        return (
            <ScrollPagedView
                onPageChange={this._onPageChange}
                setResponder={this._setResponder}
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
Name | propType | default value | description
--- | --- | --- | ---
onPageChange | function | (pageIndex) => {} | Switch paging callback
setResponder(native only) | function | (isResponder) => {} | Gesture switch state callback
pageProps(web only) | object | {} | ScrollableTabView Props
style | object | {} | ScrollPagedView style

### Inside scrollView
Name | propType | default value | description
--- | --- | --- | ---
nativeProps(native only) | object | {} | RN scrollView Props
webProps(web only) | object | {} | Web scrollView Props

## Export module
- default - ScrollPagedView
- RN - PagedView
- Web - ScrollableTabView

### ScrollableTabView
The web version of react-native-scrollable-tab-view provides similar functionality  

### Properties
Name | propType | default value | description
--- | --- | --- | ---
scrollWithoutAnimation | bool | false | Click on the top tab to toggle whether there is animation
locked | bool | false | Whether to allow drag toggle
infinite | bool | false | Whether it is an infinite scroll view
isDot | bool | false | Is there a bottom dot
tabLabels | array | [] | Tab index, using the children array index by default
initialPage | number | 0 | Initial page index
autoPlay | bool | false | Whether to auto rotate
autoPlayTime | number | 2 | Automatic carousel interval (in seconds)
vertical | bool | false | Whether to switch the view vertically
onChange | function | () => {} | Toggle tab callback
dotStyle | object | {} | Dot style
dotWrapStyle | object | {} | Dot external style
dotActiveStyle | object | {} | Dot activation style

## TODO
- [x] Optimize scroll region index, use proxy scrollView to complete
- [x] Android compatible React Native different versions
- [x] Support web side components
- [x] Optimize web side components
- [x] Optimize web infinite scrolling
- [x] Perfect web-side ScrollableTabView
- [ ] Perfect rn end PagedView achieves consistency with web performance
- [ ] Uniformly compatible with different versions of React Native
- [ ] More props configuration

## Changelog
- 0.1.*
- 1.0.*
- 1.1.*
- 1.2.*
