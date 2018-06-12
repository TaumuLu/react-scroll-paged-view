# react-scroll-paged-view
[View README in English](./README.md)  
[如果你对我的开发过程感兴趣不妨读读，相信会有所收获](./doc/Dev_Record.md)  

**滚动视图，内滚动，整页滚动，嵌套滚动视图**  

## Installation
```
npm install react-scroll-paged-view --save
```

## Introduction
支持RN端，相应的web端组件也有  
提供子组件封装的ScrollView组件  
整页滚动和页内滚动结合，类似京东等app的商品详情页上下页查看  
iOS RN代码完美支持，Android则提供了原生包支持，基于RN ScrollView改动了部分代码得以支持  
目前开源的RN项目中并没有内滚动和页滚动结合的，基于需要写了这个组件  
此外还额外提供了核心功能模块ViewPaged可供使用  

## Notice
~~**兼容至"react-native": "~0.54.0"版本**~~  
~~**react native0.47版本的使用0.1.\*版本**~~  
**已完美兼容以上RN的版本，直接安装最新的包即可**  
**没有出现在内部ScrollView组件中的点击事件可以用onPressIn代替**  
**web版的ViewPaged需要设置高度，默认高度是document.documentElement.clientHeight**  

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
ScrollPagedView直接使用了ViewPaged组件，因此可以根据需要传入ViewPaged的props，参考下面ViewPaged组件的props  

| Name | propType | default value | description |
| --- | --- | --- | --- |
| onResponder(native only) | function | (isResponder) => {} | 手势状态改变时的回调 |
| withRef | bool | false | 获取ViewPaged实例ref，通过组件的getViewPagedInstance方法 |

### Inside scrollView
Name | propType | default value | description
--- | --- | --- | ---
nativeProps(native only) | object | {} | RN scrollView Props
webProps(web only) | object | {} | Web scrollView Props

## Export module
- default - ScrollPagedView
- ViewPaged

### ViewPaged
web版的类似于react-native-scrollable-tab-view，提供的功能也类似  
rn版的功能不如web版的完整，后续继续完善  

### Properties

#### Common Props
| Name | propType | default value | description |
| --- | --- | --- | --- |
| onChange | function | () => {} | 切换分页回调 |
| initialPage | number | 0 | 初始页索引 |
| vertical | bool | false | 是否为垂直切换视图 |
| duration | number | 400 | 动画持续时间(以毫秒为单位) |
| style | object | {} | ViewPaged样式 |

#### Web Only Props
| Name | propType | default value | description |
| --- | --- | --- | --- |
| scrollWithoutAnimation | bool | false | 点击顶部tab切换是否有动画 |
| locked | bool | false | 是否允许拖动切换 |
| infinite | bool | false | 是否为无限滚动视图 |
| isDot | bool | false | 是否有底部dot |
| tabLabels | array | [] | tab索引，默认使用children数组索引 |
| autoPlay | bool | false | 是否自动轮播 |
| autoPlayTime | number | 2000 | 自动轮播间隔时间(以毫秒为单位) |
| dotStyle | object | {} | dot样式 |
| dotWrapStyle | object | {} | dot外部样式 |
| dotActiveStyle | object | {} | dot激活样式 |
| renderTabBar | function | () => {} | tabBar组件 |

#### RN Only Props
| Name | propType | default value | description |
| --- | --- | --- | --- |
| onStartShouldSetPanResponder | function | () => true | 参考React Native官网手势响应系统 |
| onStartShouldSetPanResponderCapture | function | () => false | 参考React Native官网手势响应系统 |
| onMoveShouldSetPanResponder | function | () => true | 参考React Native官网手势响应系统 |
| onMoveShouldSetPanResponderCapture | function | () => false | 参考React Native官网手势响应系统 |
| onPanResponderTerminationRequest | function | () => true | 参考React Native官网手势响应系统 |
| onShouldBlockNativeResponder | function | () => true | 参考React Native官网手势响应系统 |
| onPanResponderTerminate | function | () => {} | 参考React Native官网手势响应系统 |

## TODO
- [x] 优化滚动区域索引，使用代理ScrollView完成
- [x] Android兼容React Native不同版本
- [x] 支持web端组件
- [x] 优化web端组件
- [x] 优化web无限滚动
- [x] 完善web端ViewPaged
- [x] 优化结构、代码，统一命名
- [x] 统一兼容React Native不同版本
- [x] 记录开发过程
- [ ] 完善RN端ViewPaged达到和web端表现一致
- [ ] 更多props配置

## Changelog
- 0.1.*
- 1.0.*
- 1.1.*
- 1.2.*
- 1.3.*
- 1.5.*
- 1.6.*
