# react-scroll-paged-view
Inside scroll, Full page scroll

## Installation
```
npm install react-scroll-paged-view --save
```

## Introduction
按页滚动和页内滚动结合，类似京东等app的商品详情页上下页查看  
ios RN代码完美支持，android则基于RN scrollView改动了部分代码得以支持  
目前开源的RN项目中并没有内滚动和页滚动结合的，基于项目需要写了这个组件  
不仅支持RN端，相应的web端组件也有

## Notice
**Compatible version "react-native": "~0.54.0"**
The react native 0.47 version uses the support/0.47 branch

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
onPageChange | function | (pageIndex) => {} | 切换分页回调
setResponder | function | (isResponder) => {} | 手势切换状态回调

### Inside scrollView
Name | propType | default value | description
--- | --- | --- | ---
nativeProps | object | undefined | scrollView Props

## TODO
- [x] 优化滚动区域索引，使用代理scrollView完成
- [x] android组件兼容react native不同版本
- [ ] 支持web端滚动组件
- [ ] 更多props配置

## Changelog
- 1.0.0
