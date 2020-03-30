# 开发中遇到的问题及总结

## 如何实现

在目前这种实现之前我想了很多种实现方法，不论 ios 或是 android 都没能做出来满意的效果  
起初思想一直局限在如何实现嵌套的 scrollView，其实这种方式的实现在原生上都不好处理，网上也有很多关于原生 scrollview 嵌套的问题  
之后我将实现寄托在 View 版的 Animated 上，通过改变 top 值来切换不同页面，通过 PanResponder 来控制拖动，动画交由 RN 的 Animated 处理  
目前的实现为外层`<Animated.View />`，里层的子元素使用`<ScrollView />`  
通过监听 ScrollView 是否滚动到底部或顶部来判断外层 View 是否拦截触摸事件滚动整页

## 关于提供的 RNScrollView 组件

为什么 android 要单独提供 RNScrollView 组件，ios 却不需要  
android 的手势系统并不完善有 bug 导致的，需要改动 ScrollView 的源码所以写了 RNScrollView 组件，不过相对 ios 的我没研究，只是对比预期和不同情况下的测试所得的结论，下面会列出测试情况

### android 和 ios 的手势响应差异

- isResponder 代表是否可以进行触摸操作，指 RN 提供的手势响应系统
- scrollEnabled 代表是否响应滚动，作为 ScrollView 的 props 在原生的 onInterceptTouchEvent 和 onTouchEvent 里会用来判断是否返回 false 来取消处理事件

#### 差异情况

| 序号 | isResponder | scrollEnabled | ios                | android                                         |
| ---- | ----------- | ------------- | ------------------ | ----------------------------------------------- |
| 1    | true        | true          | 只响应外层 view    | 基本只响应 ScrollView，外层 view 会受到影响抖动 |
| 2    | true        | false         | 只响应外层 view    | 只响应外层 view                                 |
| 3    | flase       | true          | 只响应 scrollView  | 只响应 ScrollView                               |
| 4    | false       | false         | 都不响应，无法滚动 | 第一次都不响应，无法滚动，之后只响应 ScrollView |

#### 用到的 api

- onStartShouldSetPanResponder 初次触摸时是否愿意成为响应者
- onMoveShouldSetPanResponder 后续未离开屏幕继续移动时是否愿意成为响应者
- onStartShouldSetPanResponderCapture 是否在“捕获阶段”拦截初次触摸事件，阻止子组件成为响应者
- onMoveShouldSetPanResponderCapture 是否在“捕获阶段”拦截后续移动事件，阻止子组件成为响应者
- onPanResponderTerminationRequest 其他组件请求接替响应者时，当前的组件是否放权
- onPanResponderTerminate 响应者权力已经交出时（可能为强制夺权）触发

#### 数据取用

isResponder 的值作为上述前 5 个 api 的返回值，即如果为 true 时，前 4 个 api 返回 true，第 5 个取反，表示拦截所有事件自己成为响应者，阻止子组件成为响应者并且不会放权  
scrollEnabled 的值只是作为 scrollView 的 props 传入

### 结论

#### 第一种情况 android 并未和预期表现一致

- ScrollView 还能继续滚动，表示外层的 View 并未和预期一样拦截事件成为响应者
- 并且外层 View 还触发了 onPanResponderTerminate 表示交出权力，这说明 onPanResponderTerminationRequest 并未触发，通过打日志也说明确实未触发，所以权力会被交出
- 在此还有一点值得注意，除了响应 ScrollView，外层 View 也会受到影响抖动，表明有外层 view 有成为响应者的时候，不过在刚成为响应者就被夺权了，通过打日志发现每次滚动都会触发 onPanResponderTerminate 事件，表明每次都在成为响应者后立即又被夺权，所以会有抖动

#### 第二种和第三种情况 ios 和 android 表现一致，这里两个值取反，意义不大，仅作为参考对比实验

#### 第三种情况值得注意下

- 即使都为 false 也还是能滚动，给人一种 android 之后强加事件的感觉
- 作为对比我删除所有组件只有 ScrollView 并将 scrollEnabled 设置为 false 结果是无法滚动了，无论触摸多少次
- 两次的区别是外层的 view 是否有添加手势响应属性，不过虽然添加了手势响应属性但并未做任何处理，不应该表现不一致，但这是唯一的区别证明问题只能出在这里，添加了 onPanResponderTerminate 也未触发，表明外层的 view 并未有成为响应者的机会，这点符合预期

## 解决 android 下的触摸 bug

通过之前的分析其实如果熟悉 android 的事件响应是能有一些想法解决的，但开始我并不熟悉，于是在网上找解决方法，终于功夫不负有心人，我找到了和我[遇到相同问题的人](https://smallpath.me/post/react-native-bugfix)，他指出是在 ReactScrollView.java 这个类中的拦截方法 onInterceptTouchEvent 中会取消掉 js 层的手势操作，这也就是为何第一种情况会触发 onPanResponderTerminate 的原因所在

> 它会将滑动时的触摸操作停止, 转而在当前 View 的 TopView 中触发原生手势, 槽点又来了, 这个 TopView 和 React 的源码一样, 居然还是先到先得, 没有优先级的判断, 因此直接在 ListView 中触发了原生手势而导致 JS 层手势被忽略!

### 如何解决

知道了问题所在就好办了，提供的 RNScrollView 组件，我拷贝了核心类 ReactScrollView 并做了修改，其中需要引用到的类我继续引用 RN 提供的，一番修改作为独立的包后，顺利解决问题，之前也一直是这种处理方式

### 升级 RN 造成的问题

当我解决后就准备发布到 npm 上去，写 readme 时我需要给出 demo，于是我用 react-native init 命令快速生成了一个 RN 的 app，里面用我提供的包做了个简单的例子，但是在写好后运行时出问题了  
我写包时用的 RN 版本是 0.47，但 demo 里生成的是 0.54，看了报错发现问题出在 RNScrollView 上，有些调用 RN 类的方法签名变了，因为之前我只是拷了核心类其他依赖类还是继续引用的 RN，但随着版本升级拷贝类中的代码并没有发生变化，而引用的类却跟随 RN 的升级变了，从而导致调用方法出错

### 解决方案

1. 升级拷贝的核心类，但这种做法又会造成其他版本的 RN 使用不了，要兼容所有的 RN 版本要写很多版本的包，不可取
2. 使用继承，继承核心类，重写 onInterceptTouchEvent 方法，这种方法应该最好，可以跟随当前的 RN 版本，但问题出在这个方法需要调用重写的父类方法，这重写就没有意义了，那我需要调用的是祖父的方法

### 浅尝辄止

最终我还是选择以继承的方式去解决问题，这让我想起学 java 时的一句话，要优先使用组合而不是继承，不过我觉得我的情况更适合继承，我需要继承类的改变来满足需求，最大化的复用代码，减少影响

#### 调用祖父方法

开始我一直都陷入 java 如何调用祖父的方法，并做了很多尝试，终以失败告终，调用祖父的方法，这种实现想法就有问题，不改出现这样的类设计

##### 初次尝试

继承 ReactScrollView 类，重写 onInterceptTouchEvent 方法，想利用反射调用，取用祖父的 class，通过 getDeclaredMethod 获取重写的方法，invoke 中强转当前 this 为祖父类型，调用方法结果还是调用到了当前类的方法上，java 强转为父类后虽然不能调用子类的方法，但还是能调用子类重写的方法，看来在反射中也是这种机制，以失败告终

##### 再次尝试

我还是不相信 java 调用不到祖父的方法，于是再次谷歌找到，也就是深入理解 java 虚拟机上的这本书上的方法（虽然书中的第一个方法是错的），但是书中的方法需要用到 java.lang.invoke 这个类，这个类是 java8 提供的，然而 android 使用的 java7，升级会造成 minSdkVersion 版本提升，兼容不了低版本 android，还是以失败告终

#### 修改方法或类

我又想如果可以修改 ReactScrollView 这个类中的方法不就行了，其实我也就是想注释方法中的一行代码而已，直接修改这个方法不就行了，以 js 的角度来说改相当于改原型上的方法是很容易的，然而我发现我错了，java 是门静态语言，相比 js 很不灵活，想在运行中改源码还是很难得  
不过之后我找到了 javassist 这个库，看了 android 下的使用，需要在 gradle 里用 groovy 写插件，这个改动成本大，难度高，而且修改会造成原始类被改变，作为提供的包不能影响到使用者的代码，虽然可以生成一个类不在原始类上改动，但想想还是算了，实在无计可施后再考虑这个方案

#### 使用组合

继承不行那就想办法用组合去解决吧，创建一个祖父类，由它去调方法，spring 里有提供了一个工具方法 BeanUtils.copyProperties(source, target)，可以拷贝类，android 下可以找类似的实现，但问题是虽然两个类一样了，但操作的不是同一个实例，拷贝类里的方法只会改自身实例对象的值，其实我想到可以监听值的变化并用反射去另一个类的值，嗯，这样是不是太麻烦了

#### 简单即真理

之后我想为什么不直接复制祖父的方法，给个其他名字，然后在重写的 onInterceptTouchEvent 方法里去调这个方法，相当于调用了祖父的方法曲线救国，再用反射解决复制的祖父方法里用到的私有属性，嗯，貌似是可以的，撸起袖子就是干，但在写好后一运行发现还是有问题的，很多私有方法用反射竟然取不到，断点调试后发现确实没有找到，但源码中明明看到有的，一番谷歌后发现，android 会把源码中的方法或类隐藏了，也是不建议去调用源码

### 回到起点

在纠结于上述解决方案时，我并未去深入了解真正的原因，但也在一次次尝试中渐渐找到了问题所在  
还是需要了解下 android 的事件流机制，一番学习发现 android 的触摸事件流和 dom 的看似有点类似，捕获、目标、冒泡，但其实本质上不同，dom 的事件模型是广播和扩散，android 的是责任链模式，他们的表现形式类似

android 通过调用 dispatchTouchEvent 来分发事件，在此期间会调用 onInterceptTouchEvent 来判断是否需要拦截，暂停一下，到这里才找到我们的主角，问题就出在 onInterceptTouchEvent 这个方法上，之前一直做的努力都是在重写这个方法，要弄明白这个方法的处理才是关键所在，并不能陷入如何去调用祖父类这样的实现上

#### onInterceptTouchEvent

作为拦截事件的方法，dispatchTouchEvent 方法分发时会调用，且只关心此方法的返回值，返回 true 交由自身的 onTouchEvent 处理，返回 false 则传递给下级处理

简单了解后再看下 RN 中 ReactScrollView 类对此方法的重写实现，首先判断 scrollEnabled 这个 props 的值，如果为 false 则返回 false，然后调用父类被重写的方法，也就是 android 的原生组件类 ScrollView 中的 onInterceptTouchEvent，如果返回 false 则返回 false，如果为 true 则调用一些方法设置一些变量并返回 true 表示消拦截消费事件，这里贴下源码

```java
public boolean onInterceptTouchEvent(MotionEvent ev) {
    if (!this.mScrollEnabled) {  // 这个变量是组件props中scrollEnabled的值
        return false;
    } else if (super.onInterceptTouchEvent(ev)) {  // 调用重写的父类方法
        NativeGestureUtil.notifyNativeGestureStarted(this, ev);  // 调用dispatchCancelEvent取消js的手势控制
        ReactScrollViewHelper.emitScrollBeginDragEvent(this);
        this.mDragging = true;
        this.enableFpsListener();
        return true;
    } else {
        return false;
    }
}
```

问题出在这个方法里的一行代码，`NativeGestureUtil.notifyNativeGestureStarted(this, ev);`，删除后和 ios 表现就一致了，之前做的努力其实就是为了不执行这行代码，现在删除不执行已经不用考虑了，而需要了解为何这行代码执行后会造成外层 View 手势响应被中止，交出控制权，一番追踪之后我们发现如同之前所说这个方法最后会调用到 dispatchCancelEvent 这个方法来取消 js 的手势控制，手势这里一旦被取消也做不了逆向处理，之有想办法不去执行他了

### 最终解决

如之前所说 onInterceptTouchEvent 这个方法的存在就是返回值给 dispatchTouchEvent 来决定是否拦截，所以某种意义上我们可以不用关心父类被重写的此方法，因为真正处理滚动的是 onTouchEvent 方法  
所以如果我们完全控制这个方法的返回值根据 scrollEnabled，那么就可以不必调用父类的方法，从而直接继承重写此方法即可  
此外还有一点需要注意的是外层 View 在滚动完整页后要设置 isResponder 为 false，从而使得下次触摸事件不会被拦截以保证能传递到 ScrollView 子组件，因为 android 外层组件一但处理了事件，之后的事件都不会再流入到子组件中，所以这里切换完页面后设置 false，保证下次非翻页操作依然可以滚动  
至此问题终于解决了，再也不用维护多个版本，世界都清净了！

### 其他问题

重写的方法里需要用到父类的私有变量 mScrollEnabled，之前我都是在当前类再声明一个同名的变量去取用，也不用写反射了，虽然没有什么问题，后来发现 java 继承类中同名的变量会在实例上产生多个值，以类名.变量的形式作为命名空间，通过反射可以打印出名称，是拼接的出来的，最后子类上的变量才是实例访问的这个变量，这里会有什么问题的，问题就出在父类和子类操作的不是同一个变量，有多个继承，如果都有同名变量那么调用他们方法中所访问的这个同名变量都是各自的，所以还是不要出现同名变量的好，取不到老老实实用反射去获取

## 未了解知识点

RN 手势处理的实现，具体实现在 PanResponder.js 和 ScrollResponder.js，需要花时间研究学习  
RN 的 js 手势和原生如何协调，android 所有触摸相关知识，ios 触摸事件流程

## 总结

从写这个库到现在，断断续续完善了很多，也终于解决了 android 下的问题，学到了很多方面的知识，对 React Native 更加热爱，之后也会继续学习做 RN 相关的包
