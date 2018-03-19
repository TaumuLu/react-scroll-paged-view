# react-scroll-paged-view
[以中文查看](./README_zh-CN.md)  
scroll view, Inside scroll, Full page scroll

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

## Notice
**Compatible version "react-native": "~0.54.0"**  
**The react native 0.47 version uses the 0.1.\* version**  
**The click events that do not appear in the inside scrollView component can be used by onPressIn instead**  

## Demo
| IOS | Android |
| --- | ------- |
| ![IOS](./demo.ios.gif) | ![Android](./demo.android.gif) |

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

### Inside scrollView
Name | propType | default value | description
--- | --- | --- | ---
nativeProps(native only) | object | undefined | RN scrollView Props
webProps(web only) | object | undefined | Web scrollView Props
height(web only) | css unit | '100%' | Web scrollView Props
width(web only) | css unit | '100%' | Web scrollView Props

## Export module
- default - ScrollPagedView
- RN - PagedView
- Web - ScrollableTabView

## TODO
- [x] Optimize scroll region index, use proxy scrollView to complete
- [x] Android compatible React Native different versions
- [x] Support web side components
- [ ] More props configuration
- [ ] Optimize web side components

## Changelog
- 0.1.0
- 1.0.0
- 1.0.1
- 1.1.0
- 1.1.1
- 1.1.2
