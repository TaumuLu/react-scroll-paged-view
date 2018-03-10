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
Name | propType | default value | description
--- | --- | --- | ---
onPageChange | function | (pageIndex) => {} | 切换分页回调
setResponder | function | (isResponder) => {} | 手势切换状态回调


## Changelog
- 1.0.0
