# react-scroll-paged-view
[View README in English](./README.md)  
滚动视图，内滚动，整页滚动，嵌套滚动视图  

## Installation
```
npm install react-scroll-paged-view --save
```

## Introduction
支持RN端，相应的web端组件也有  
子组件可以选择是否使用scrollView  
按页滚动和页内滚动结合，类似京东等app的商品详情页上下页查看  
ios RN代码完美支持，android则基于RN scrollView改动了部分代码得以支持  
目前开源的RN项目中并没有内滚动和页滚动结合的，基于项目需要写了这个组件  
此外还额外提供了核心功能模块，rn端为PagedView，web端为ScrollableTabView  

## Notice
**兼容至"react-native": "~0.54.0"版本**  
**react native0.47版本的使用0.1.\*版本**  
**没有出现在内部scrollView组件中的点击事件可以由用onPressIn代替**  

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
onPageChange | function | (pageIndex) => {} | 分页切换回调
setResponder(native only) | function | (isResponder) => {} | 手势状态改变时的回调
pageProps(web only) | object | {} | 整页滚动组件props
style | object | {} | ScrollPagedView样式

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
web版的react-native-scrollable-tab-view，提供的功能也类似  

### Properties
Name | propType | default value | description
--- | --- | --- | ---
scrollWithoutAnimation | bool | false | 点击顶部tab切换是否有动画
locked | bool | false | 是否允许拖动切换
infinite | bool | false | 是否为无限滚动视图
isDot | bool | false | 是否有底部dot
tabLabels | array | [] | tab索引，默认使用children数组索引
initialPage | number | 0 | 初始页索引
autoPlay | bool | false | 是否自动轮播
autoPlayTime | number | 2 | 自动轮播间隔时间(以秒为单位)
vertical | bool | false | 是否为垂直切换视图
onChange | function | () => {} | 切换tab回调
dotStyle | object | {} | dot样式
dotWrapStyle | object | {} | dot外部样式
dotActiveStyle | object | {} | dot激活样式

## TODO
- [x] 优化滚动区域索引，使用代理scrollView完成
- [x] android兼容react native不同版本
- [x] 支持web端组件
- [x] 优化web端组件
- [x] 优化web无限滚动
- [x] 完善web端ScrollableTabView
- [ ] 完善rn端PagedView达到和web端表现一致
- [ ] 统一兼容react native不同版本
- [ ] 更多props配置

## Changelog
- 0.1.*
- 1.0.*
- 1.1.*
- 1.2.*
