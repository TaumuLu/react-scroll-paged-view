# react-scroll-paged-view

[View README in English](./README.md)  
[如果你对我的开发过程感兴趣不妨读读，相信会有所收获](./docs/Dev_Record.md)

**滚动视图，内滚动，整页滚动，嵌套滚动视图**

## 安装

```
npm install react-scroll-paged-view --save
```

## 简介

支持 RN 端，相应的 web 端组件也有  
整页滚动和页内滚动结合，类似京东等 app 的商品详情页上下页查看  
iOS RN 代码完美支持，Android 则提供了原生包支持，基于 RN ScrollView 改动了部分代码得以支持  
目前开源的 RN 项目中并没有内滚动和页滚动结合的，基于需要写了这个组件  
此外还额外提供了核心功能模块 ViewPaged 可供使用  
提供子组件封装的 ScrollView 组件，可以选择使用  
所有分页为按需加载，不必担心初始会全部渲染  
无限分页也是懒处理，最小程度校准当前索引页，即使快速切换滑动也很流畅  
RN 和 web 动画基于 animated 库，共用一套代码处理  
提供了 renderHeader 和 renderFooter 可做 tab 切换或轮播图等  
web 版的两个组件都有提供类变量 isTouch 用于判断是否为触摸事件，可借此区分滚动触发的点击事件  
支持 ssr，2.1+版本移除初始测量尺寸所导致的组件重复创建和销毁，性能更好  
2.1.3+版本在为横向滚动且不无限滚动时使用 ScrollView 作为滚动容器，这样子视图可以使用 ScrollView 来纵向滚动

## 注意

~~**兼容至"react-native": "~0.54.0"版本**~~  
~~**react native0.47 版本的使用 0.1.\*版本**~~  
**已完美兼容以上 RN 的版本，直接安装最新的包即可**  
**没有出现在内部 ScrollView 组件中的点击事件可以用 onPressIn 代替**  
**infinite 和 autoPlay 只提供给 ViewPaged 组件，ScrollPagedView 会默认关闭此选项**

## Demo

| IOS                    | Android                        | Web                    |
| ---------------------- | ------------------------------ | ---------------------- |
| ![IOS](./demo/ios.gif) | ![Android](./demo/android.gif) | ![Web](./demo/web.gif) |

### Other

你所能实现的取决于你所能想象的

| Horizontal                           | Tab                    | Carousel                         |
| ------------------------------------ | ---------------------- | -------------------------------- |
| ![Horizontal](./demo/horizontal.gif) | ![Tab](./demo/tab.gif) | ![Carousel](./demo/carousel.gif) |

## 使用

### ScrollPagedView

ScrollPagedView 组件基于 ViewPaged 组件封装了内滚动组件，通过 context 使用

```javascript
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

#### Context ScrollView(InsideScrollView)

```javascript
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

### ViewPaged

ViewPaged 组件和 ScrollPagedView 组件用法一致，可以自由使用 infinite 和 autoPlay

```javascript
import { ViewPaged } from 'react-scroll-paged-view'
```

## Export module

- default - ScrollPagedView
- ViewPaged

## 属性

### ScrollPagedView

ScrollPagedView 组件基于 ViewPaged 组件，可以根据需要传入 ViewPaged 的 props，参考下面 ViewPaged 组件的 props

| Name    | propType | default value | description                                                   |
| ------- | -------- | ------------- | ------------------------------------------------------------- |
| withRef | bool     | false         | 获取 ViewPaged 实例 ref，通过组件的 getViewPagedInstance 方法 |

### Context ScrollView

| Name                     | propType | default value | description          |
| ------------------------ | -------- | ------------- | -------------------- |
| nativeProps(native only) | object   | {}            | RN scrollView Props  |
| webProps(web only)       | object   | {}            | Web scrollView Props |

### ViewPaged

RN 和 web 有相同的 props，表现也一致

#### Common Props

| Name           | propType         | default value | description                                                        |
| -------------- | ---------------- | ------------- | ------------------------------------------------------------------ |
| style          | object           | {}            | ViewPaged 样式                                                     |
| initialPage    | number           | 0             | 初始页索引                                                         |
| vertical       | bool             | true          | 是否为垂直切换视图                                                 |
| onChange       | function         | () => {}      | 切换分页回调，参数为 currentPage 和 prevPage                       |
| duration       | number           | 400           | 动画持续时间(以毫秒为单位)                                         |
| infinite       | bool             | false         | 是否为无限滚动视图                                                 |
| renderHeader   | function/element | undefined     | Header 组件，参数为 activeTab, goToPage, width, pos                |
| renderFooter   | function/element | undefined     | Footer 组件，参数为 activeTab, goToPage, width, pos                |
| renderPosition | string           | top           | Header/Footer 方向，有 4 个值，分别为'top','left','bottom','right' |
| autoPlay       | bool             | false         | 是否自动轮播                                                       |
| autoPlaySpeed  | number           | 2000          | 自动轮播间隔时间(以毫秒为单位)                                     |
| hasAnimation   | bool             | true          | 点击切换时否有动画                                                 |
| locked         | bool             | false         | 是否允许拖动切换                                                   |
| preRenderRange | number           | 0             | 控制每次更新时 render 组件的范围                                   |
| isMovingRender | bool             | false         | 触摸移动时预加载下一页                                             |

#### RN Only Props

| Name                                | propType | default value | description                        |
| ----------------------------------- | -------- | ------------- | ---------------------------------- |
| onStartShouldSetPanResponder        | function | () => true    | 参考 React Native 官网手势响应系统 |
| onStartShouldSetPanResponderCapture | function | () => false   | 参考 React Native 官网手势响应系统 |
| onMoveShouldSetPanResponder         | function | () => true    | 参考 React Native 官网手势响应系统 |
| onMoveShouldSetPanResponderCapture  | function | () => false   | 参考 React Native 官网手势响应系统 |
| onPanResponderTerminationRequest    | function | () => true    | 参考 React Native 官网手势响应系统 |
| onShouldBlockNativeResponder        | function | () => true    | 参考 React Native 官网手势响应系统 |
| onPanResponderTerminate             | function | () => {}      | 参考 React Native 官网手势响应系统 |

## TODO

- [x] 优化滚动区域索引，使用代理 ScrollView 完成
- [x] Android 兼容 React Native 不同版本
- [x] 支持 web 端组件
- [x] 优化 web 端组件
- [x] 优化 web 无限滚动
- [x] 完善 web 端 ViewPaged
- [x] 优化结构、代码，统一命名
- [x] 统一兼容 React Native 不同版本
- [x] 记录开发过程
- [x] 完善 RN 端 ViewPaged 达到和 web 端表现一致
- [x] 更多 props 配置

## Changelog

- 0.1.\*
- 1.0.\*
- 1.1.\*
- 1.2.\*
- 1.3.\*
- 1.5.\*
- 1.6.\*

### 2.0.\*

- 整体重构项目，针对 web 端重构提高代码复用
- 增加了依赖包 animated，动画处理更为流畅，性能更好
- 使用 hoc 最大程度复用了三端的公共代码，各个端仅保留自己平台的代码
- 统一了 RN 端和 web 端的 props，并使其表现一致
- 针对 ssr 服务端渲染也做了支持

### 2.1.\*

- 针对 ssr 统一了 RN 和 web 的 render 方法
- 移除初始测量组件尺寸时独立的一次 render
- 避免子组件重复创建和销毁，性能更好

### 2.1.4+

- 移除了上传 npm 包里的.babelrc 等配置文件，react native 会使用包里的 babel 配置，没有安装这些配置依赖会报错

### 2.2.0+

- 优化代码结构，精确控制组件 render 次数，提高页面性能，并提供预加载和 render 范围的 props
