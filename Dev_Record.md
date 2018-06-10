# 开发中遇到的问题及总结

## 如何实现
在目前这种实现之前我想了很多种实现方法，不论ios或是android都没能做出来满意的效果  
起初思想一直局限在如何实现嵌套的scrollView，其实这种方式的实现在原生上都不好处理，网上也有很多关于原生scrollview嵌套的问题  
之后我将实现寄托在View版的Animated上，通过改变top值来切换不同页面，通过PanResponder来控制拖动，动画交由RN的Animated处理  
目前的实现为外层`<Animated.View />`，里层的子元素使用`<ScrollView />`  
通过监听ScrollView是否滚动到底部或顶部来判断外层View是否拦截触摸事件滚动整页  


## 关于提供的RNScrollView组件
为什么android要单独提供RNScrollView组件，ios却不需要  
android的手势系统并不完善有bug导致的，需要改动ScrollView的源码所以写了RNScrollView组件，不过相对ios的我没研究，只是对比预期和不同情况下的测试所得的结论，下面会列出测试情况  

### android和ios的手势响应差异
- isResponder代表是否可以进行触摸操作，指RN提供的手势响应系统
- scrollEnabled代表是否响应滚动，作为ScrollView的props在原生的onInterceptTouchEvent和onTouchEvent里会用来判断是否返回false来取消处理事件

#### 差异情况
| 序号 | isResponder | scrollEnabled | ios | android |
| ---- | ----------- | ------------- | --- | ------- |
| 1 | true | true | 只响应外层view | 基本只响应ScrollView，外层view会受到影响抖动 |
| 2 | true | false | 只响应外层view | 只响应外层view |
| 3 | flase | true | 只响应scrollView | 只响应ScrollView |
| 4 | false | false | 都不响应，无法滚动 | 第一次都不响应，无法滚动，之后只响应ScrollView |

#### 用到的api
- onStartShouldSetPanResponder 初次触摸时是否愿意成为响应者
- onMoveShouldSetPanResponder 后续未离开屏幕继续移动时是否愿意成为响应者
- onStartShouldSetPanResponderCapture 是否在“捕获阶段”拦截初次触摸事件，阻止子组件成为响应者
- onMoveShouldSetPanResponderCapture 是否在“捕获阶段”拦截后续移动事件，阻止子组件成为响应者
- onPanResponderTerminationRequest 其他组件请求接替响应者时，当前的组件是否放权
- onPanResponderTerminate 响应者权力已经交出时（可能为强制夺权）触发

#### 数据取用
isResponder的值作为上述前5个api的返回值，即如果为true时，前4个api返回true，第5个取反，表示拦截所有事件自己成为响应者，阻止子组件成为响应者并且不允许放权  
scrollEnabled的值只是作为scrollView的props传入  

### 结论

#### 第一种情况android并未和预期表现一致
- ScrollView还能继续滚动，表示外层的View并未和预期一样拦截事件成为响应者
- 并且外层View还触发了onPanResponderTerminate表示交出权力，这说明onPanResponderTerminationRequest并未触发，通过打日志也说明确实未触发，所以权力会被交出
- 在此还有一点值得注意，除了响应ScrollView，外层View也会受到影响抖动，表明有外层view有成为响应者的时候，不过在刚成为响应者就被夺权了，通过打日志发现每次滚动都会触发onPanResponderTerminate事件，表明每次都在成为响应者后立即又被夺权，所以会有抖动  

#### 第二种和第三种情况ios和android表现一致，这里两个值取反，意义不大，仅作为参考对比实验  

#### 第三种情况值得注意下
- 即使都为false也还是能滚动，给人一种android之后强加事件的感觉
- 作为对比我删除所有组件只有ScrollView并将scrollEnabled设置为false结果是无法滚动了，无论触摸多少次
- 两次的区别是外层的view是否有添加手势响应属性，不过虽然添加了手势响应属性但并未做任何处理，不应该表现不一致，但这是唯一的区别证明问题只能出在这里，添加了onPanResponderTerminate也未触发，表明外层的view并未有成为响应者的机会，这点符合预期


## 解决android下的触摸bug
通过之前的分析其实如果熟悉android的事件响应是能有一些想法解决的，但开始我并不熟悉，于是在网上找解决方法，终于功夫不负有心人，我找到了和我[遇到相同问题的人](https://smallpath.me/post/react-native-bugfix)，他指出是在ReactScrollView.java这个类中的拦截方法onInterceptTouchEvent中会取消掉js层的手势操作，这也就是为何第一种情况会触发onPanResponderTerminate的原因所在  
> 它会将滑动时的触摸操作停止, 转而在当前View的TopView中触发原生手势, 槽点又来了, 这个TopView和React的源码一样, 居然还是先到先得, 没有优先级的判断, 因此直接在ListView中触发了原生手势而导致JS层手势被忽略!

### 如何解决
知道了问题所在就好办了，要如何解决，我拷贝了核心类ReactScrollView并做了修改，其中需要引用到的类我继续引用RN提供的，一番修改作为独立的包后，顺利解决问题，之前也一直是这种处理方式  

### 升级RN造成的问题
当我解决后就准备发布到npm上去，写readme时我需要给出demo，于是我用react-native init命令快速生成了一个RN的app，里面用我提供的包做了个简单的例子，但是在写好后运行时出问题了  
在我写包时用到的RN版本时0.47但demo里生成的是0.54，看了报错发现问题出在RNScrollView上，有些调用RN类的方法签名变了，我只是拷了核心类其他类还是继续引用RN的，但随着版本升级拷贝类中的代码并没有发生变化，而引用的类却跟随RN的升级变了，从而导致调用方法出错  

### 解决方案
1. 升级拷贝的核心类，但这种做法又会造成其他版本的RN使用不了，要兼容所有的RN版本要写很多版本的包，不可取
2. 使用继承，继承核心类，重写onInterceptTouchEvent方法，这种方法应该最好，可以跟随当前的RN版本，但问题出在这个方法需要调用重写的父类方法，这重写就没有意义了，我需要调用的是祖父的方法

### 浅尝辄止
最终我还是选择以继承的方式去解决问题，这让我想起学java时的一句话，要优先使用组合而不是继承，不过我觉得我的情况更适合继承，我需要继承类的改变来满足需求，最大化的复用代码，减少影响

#### 调用祖父方法
开始我一直都陷入java如何调用祖父的方法，并做了很多尝试，终以失败告终，调用祖父的方法，这种实现想法就有问题，不改出现这样的类设计

##### 初次尝试
继承ReactScrollView类，重写onInterceptTouchEvent方法，想利用反射调用，取用祖父的class，通过getDeclaredMethod获取重写的方法，invoke中强转当前this为祖父类型，调用方法结果还是调用到了当前类的方法上，java强转为父类后虽然不能调用子类的方法，但还是能调用子类重写的方法，看来在invoke里也是这种机制，以失败告终

##### 再次尝试
我还是不相信java调用不到祖父的方法，于是再次谷歌终于找到，也就是深入理解java虚拟机上的这本书上的方法（虽然书中的第一个方法是错的），但是书中的方法需要用到java.lang.invoke这个类，这个类是java8提供的，然而android使用的java7，升级会造成minSdkVersion版本提升，兼容不了低版本android，还是以失败告终

#### 修改方法或类
我又想如果可以修改ReactScrollView这个类中的方法不就行了，其实我也就是想注释类里方法中的一行代码而已，直接修改这个方法不就行了，以js的角度来说改相当于改原型上的方法是很容易的，然而我发现我错了，java是门静态语言，相比js很不灵活，想在运行中改源码还是很难得，不过我找到了javassist这个库，看了下android下的使用，需要在gradle里用groovy写插件，这个改动成本大，难度高，之后我又想到但这会造成原始类被改变，作为提供的包不能影响到使用者，虽然我又想可以生成一个新类不在原始类上改动，但想想还是算了，实在无计可施后再考虑这个方案  

#### 使用组合
继承不行那就想办法用组合去解决吧，创建一个祖父类，由它去调方法，spring里有提供了一个工具方法BeanUtils.copyProperties(source, target)，可以拷贝类，android下可以找类似的实现，但问题是虽然两个类的执行环境一样了却操作的不是同一个类，拷贝类的方法里会改自身对象private的值却没有办法改原始类的值，其实我想到可以监听拷贝类值的变化并用反射去改变原始类的值，嗯，这样是不是太麻烦了  

#### 简单即真理
为什么不直接复制祖父的方法到我继承ReactScrollView类，给个其他名字，然后在重写的onInterceptTouchEvent方法里去调这个方法，相当于调用了祖父的方法曲线救国，再用反射解决复制的祖父方法里用到的私有属性呢，嗯，貌似是可以的，撸起袖子就是干，但在写好后一运行发现还是有问题的，很多私有方法用反射竟然取不到，断点调试后发现确实没有找到，奇了怪了源码中明明看到有的，一番谷歌后发现，android会把源码中的方法或类隐藏了，也是不建议去调用  

### 回到起点
在纠结于上述解决方案时，我并未去深入了解真正的原因，但也在一次次尝试中渐渐找到了问题所在  
还是需要了解android的事件流机制，在一番学习后我了解了部分机制，事件流和dom的有点类似，捕获、目标、冒泡，但在事件捕获阶段不同，android会调用dispatchTouchEvent来分发事件，在此期间会调用onInterceptTouchEvent来判断是否需要拦截，好了，到这里才找到我们的主角，问题就出在onInterceptTouchEvent这个方法上，之前一直做的努力都是在重写这个方法，要弄明白这个方法的处理才是关键所在，并不能陷入如何去调用祖父类这样的实现上  

#### onInterceptTouchEvent


这里本来是在onPageChange事件后设置true意味着外层View夺权
但android外层组件一旦夺权无法再传递给子组件，这里指ScrollView
应此外层先放权拦截，这样之后的事件流还是会经过外层view但不处理，被子层ScrollView处理
这样做的目的是页面却换后如果下次事件不是切换页面那么子层ScrollView还能响应滚动，而不是到第二次才作出反应
之后的如果需要翻页外层View也能随时拦截掉给自己处理而不被子层ScrollView的onInterceptTouchEvent事件给取消掉

同名private会在实例上产生多个值


## 最终
至此问题终于解决了，再也不用维护两个版本，世界都清净了！

