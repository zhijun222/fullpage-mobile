// 需求：
// 1、页面满屏展示（没有滚动条）
// 2、鼠标滚轮滚动和鼠标按下、滑动、松开和手指按下，滑动，松开，都可以切换上下每一屏
// 3、满足条件的时候，动画的方式切换每一屏（过渡）
// 4、页面右侧有导航点，导航点跟随页面每一屏的切换，设置高亮背景
// 5、进入每一屏，设置页面的内容带有动画效果（过渡）

//思维思路：
// 1.0 如何添加属性 记录所需要的数据
// 2.0 如何添加方法 执行指定的逻辑

// 步骤：
// 1.0 立即执行函数
; (function (w, d) {
    // .0 判断传递两个对象
    if (typeof w != 'object' || typeof d != 'object') {
        return;
    }
    // .0 构造函数
    function FullPage(option) {
        // .0 添加属性
        this.fullpageElement = d.getElementById(option.id);
        this.wrapperElement = this.fullpageElement.children[0];
        this.sectionElements = this.wrapperElement.getElementsByTagName("section");
        this.sectionColor = option.sectionColor;
        this.index = 0;
        this.afterLoad = option.afterLoad;
        this.transitionV = "transform 1000ms";
        this.propagation = option.propagation;
        this.pElement = this.fullpageElement.children[1];
        this.distance = 200;// 是否切换区块的临界值
        // console.log(this);
        // .0 初始化 
        this.init();
    }
    // .0 原型对象 初始化
    FullPage.prototype.init = function () {
        // .0 设置每一屏的样式
        this.setSectionElement();
        // .0调用鼠标滚轮滚动事件
        this.addMouseWheel();
        // .0 判断
        if (this.propagation) {
            // .0 设置导航点
            this.setPropagation();
        }
        // .0 PC端的滑动
        this.addMouseEvent();
        // .0 移动端的滑动
        this.addTouchEvent()
    }
    // .0 原型对象 设置每一屏的样式 高度 、背景色
    FullPage.prototype.setSectionElement = function () {
        // .0 添加属性
        this.clientHeight = document.documentElement.offsetHeight || document.body.offsetHeight || window.innerHeight;
        //.0 数组长度
        this.length = this.sectionElements.length;
        // .0 循环标签数组
        for (var i = 0; i < this.length; i++) {
            // .0 设置每一屏的高度
            this.sectionElements[i].style.height = this.clientHeight + "px";
            // .0 判断
            if (this.sectionColor.length != 0) {
                // .0 设置每一屏标签的背景色
                this.sectionElements[i].style.backgroundColor = this.sectionColor[i];
            }
        }
    }
    // .0 原型对象 添加过渡属性
    FullPage.prototype.addTransition = function () {
        // .0 设置过渡
        this.wrapperElement.style.webkitTransition = this.transitionV;
        this.wrapperElement.style.transition = this.transitionV;
    }
    // .0 原型对象 移除过渡属性
    FullPage.prototype.removeTransition = function () {
        // .0 设置过渡
        this.wrapperElement.style.webkitTransition = "none";
        this.wrapperElement.style.transition = "none";
    }
    // .0 原型对象 设置元素垂直位置
    FullPage.prototype.setTranslate = function (translateY) {
        // .0 设置位移
        this.wrapperElement.style.webkitTransform = "translateY(" + translateY + "px)";
        this.wrapperElement.style.transform = "translateY(" + translateY + "px)";
    }
    // .0 原型对象 设置鼠标滚轮事件
    FullPage.prototype.addMouseWheel = function () {//函数作用域1
        // .0 记录当前函数作用域的this
        var _this = this;
        // .0 添加一个代表方向的属性
        this.direction = "down";
        // .0 防抖思想
        var delayer = null;
        // .0 事件绑定 监听滚轮滚动事件
        w.addEventListener('mousewheel', function (e) { //函数作用域2
            // console.log("mousewheel")
            // console.log(e.wheelDelta);// 判断滚轮上下滚动的属性
            // 鼠标滚轮向后 负数
            // 鼠标滚轮向前 正数
            // .0 清除延时函数
            // .0 判断 当前是否正在执行延迟函数 ，是，就清除延迟函数
            if (delayer) clearTimeout(delayer);
            // .0 否则，执行延迟函数
            delayer = setTimeout(function () {
                // .0设置属性值
                _this.direction = e.wheelDelta > 0 ? "up" : "down";
                // .0 打印方向属性
                // console.log(  _this.direction )
                // .0 判断鼠标滚轮滚动的方向
                if (_this.direction == "down") {
                    // 自增一
                    _this.index++;
                    // 三元运算
                    _this.index = _this.index > (_this.length - 1) ? (_this.length - 1) : _this.index;
                } else {
                    // 自减一
                    _this.index--;
                    // 三元运算
                    _this.index = _this.index < 0 ? 0 : _this.index;
                }
                // console.log(_this.index);
                // .0 添加过渡属性
                _this.addTransition();
                // .0 设置元素位置
                _this.setTranslate(-(_this.index * _this.clientHeight));
                // .0 设置导航点的排他
                if(_this.propagation){
                    _this.setPoint();
                }
                // .0 执行回调函数
                if (typeof _this.afterLoad == 'function') {
                    // 传递索引值 、标签数组
                    _this.afterLoad(_this.index, _this.sectionElements);
                }
            }, 300)
        })

    }
    // .0 原型对象 设置导航点
    FullPage.prototype.setPropagation = function () {// 函数作用域1
        // .0 记录当前函数作用域的this
        var _this = this;
        // .0 字符串
        var html = "<ul>";
        // .0 共多少屏
        var len = this.sectionElements.length;
        // .0 循环
        for (var i = 0; i < len; i++) {
            html += "<li data-index=" + i + " class=" + (i == 0 ? 'active' : '') + "></li>"
        }
        html += "</ul>";
        // .0 显示
        this.pElement.style['display'] = "block";
        // .0 显示导航点
        this.pElement.innerHTML = html;
        // .0 记录所有的导航点
        this.points = this.pElement.children[0].children;
        // console.log(this.points)
        // .0 事件委托
        // this.pElement.children[0].onclick = function(event){
        //     console.log(event.target);//事件源
        // }
        this.pElement.addEventListener("mouseenter", function (event) {
            // console.log(event.target);
            // 目标元素
            var ele = event.target;
            // 获取索引值
            var i = ele.getAttribute("data-index");
            // 检查索引值  
            if (i && typeof i === 'string') {
                // 记录索引值
                _this.index = i - 0;
                // 设置导航点高亮切换
                _this.setPoint();
                // .0 添加过渡属性
                _this.addTransition();
                // .0 设置元素位置
                _this.setTranslate(-(_this.index * _this.clientHeight));
            }
        }, true)
    }
    // .0 原型对象 导航点排他思想
    FullPage.prototype.setPoint = function () {
        for (var j = 0; j < this.points.length; j++) {
            this.points[j].className = "";
        }
        this.points[this.index].className = "active";
    }
    // .0 原型对象 PC 端的鼠标滑动
    FullPage.prototype.addMouseEvent = function () {//函数作用域1
        // .0 记录当前函数作用域this
        var _this = this;
        // .0 记录鼠标按下 滑动 当前的位置 是否按下鼠标布尔值
        this.startY = 0;
        this.moveY = 0;
        this.resY = 0;
        this.curY = 0;
        this.isMouseDown = false;
        // .0 事件绑定
        this.fullpageElement.onmousedown = function (event) {
            // .0 设置布尔值
            _this.isMouseDown = true;
            // .0 坐标位置 按下
            _this.startY = event.clientY;
            // .0 禁止选择文字
            event.preventDefault();
        }
        document.onmousemove = function (event) {
            // .0 判断
            if (_this.isMouseDown) {
                // .0 坐标位置 滑动
                _this.moveY = event.clientY;
                // .0 计算滑动的距离
                _this.resY = _this.moveY - _this.startY;
                // .0 移除过渡属性
                _this.removeTransition();
                // .0 设置元素位置
                _this.setTranslate(_this.resY + _this.curY);
                // console.log(_this.resY )
            }
        }
        document.onmouseup = function () {
            console.log("mouseup")
            // .0 正数往下 负数往上
            if (Math.abs(_this.resY) > _this.distance) {
                // console.log(Math.abs(_this.resY),_this.distance)
                if (_this.resY > 0) {//往下滑动
                    _this.index--;
                    // 不能小于最小索引值
                    _this.index = _this.index < 0 ? 0 : _this.index;
                } else { //往上滑动
                    _this.index++;
                    // 不能超过 最大索引值
                    _this.index = _this.index > _this.sectionElements.length - 1 ? _this.sectionElements.length - 1 : _this.index;
                }
                // .0 添加过渡
                _this.addTransition();
                // .0 设置元素位置
                _this.setTranslate(-(_this.index * _this.clientHeight));
                // console.log(_this.index * _this.clientHeight)
                // .0 记录标签位置
                _this.curY = -(_this.index * _this.clientHeight);
               // .0 设置导航点的排他
                if(_this.propagation){
                    _this.setPoint();
                }
            } else {
                // .0 添加过渡
                _this.addTransition();
                // .0 设置元素位置
                _this.setTranslate(-(_this.index * _this.clientHeight));
                // .0 记录标签位置
                _this.curY = -(_this.index * _this.clientHeight);
                // .0 设置导航点的排他
                if(_this.propagation){
                    _this.setPoint();
                }
            }
            // .0 设置布尔值
            _this.isMouseDown = false;
        }
    }
    // .0 原型对象 移动端触摸滑动
    FullPage.prototype.addTouchEvent = function () {
        // .0 记录当前函数作用域this
        var _this = this;
        // .0 记录鼠标按下 滑动 当前的位置 是否按下鼠标布尔值
        this.startY = 0;
        this.moveY = 0;
        this.resY = 0;
        this.curY = 0;
        this.isMouseDown = false;
        // .0 事件绑定
        this.fullpageElement.ontouchstart = function (event) {
            // .0 设置布尔值
            _this.isMouseDown = true;
            // console.log(event.touches[0])
            // .0 坐标位置 按下
            _this.startY = event.touches[0].clientY;
            // .0 禁止选择文字
            event.preventDefault();
        }
        document.ontouchmove = function (event) {
            // .0 判断
            if (_this.isMouseDown) {
                // .0 坐标位置 滑动
                _this.moveY = event.touches[0].clientY;
                // .0 计算滑动的距离
                _this.resY = _this.moveY - _this.startY;
                // .0 设置缓冲区
                if(Math.abs(_this.resY) > 220) return ;
                // .0 移除过渡属性
                _this.removeTransition();
                // .0 设置元素位置
                _this.setTranslate(_this.resY + _this.curY);
                // console.log(_this.resY )
            }
        }
        document.ontouchend = function () {
            // .0 正数往下 负数往上
            if (Math.abs(_this.resY) > _this.distance) {
                // console.log(Math.abs(_this.resY),_this.distance)
                if (_this.resY > 0) {//往下滑动
                    _this.index--;
                    // 不能小于最小索引值
                    _this.index = _this.index < 0 ? 0 : _this.index;
                } else { //往上滑动
                    _this.index++;
                    // 不能超过 最大索引值
                    _this.index = _this.index > _this.sectionElements.length - 1 ? _this.sectionElements.length - 1 : _this.index;
                }
                // .0 添加过渡
                _this.addTransition();
                // .0 设置元素位置
                _this.setTranslate(-(_this.index * _this.clientHeight));
                // console.log(_this.index * _this.clientHeight)
                // .0 记录标签位置
                _this.curY = -(_this.index * _this.clientHeight);
                 // .0 设置导航点的排他
                 if(_this.propagation){
                    _this.setPoint();
                }
            } else {
                // .0 添加过渡
                _this.addTransition();
                // .0 设置元素位置
                _this.setTranslate(-(_this.index * _this.clientHeight));
                // .0 记录标签位置
                _this.curY = -(_this.index * _this.clientHeight);
                // .0 设置导航点的排他
                if(_this.propagation){
                    _this.setPoint();
                }
            }
            // .0 设置布尔值
            _this.isMouseDown = false;
        }
    }

    // .0 挂载构造函数在全局对象下
    w.FullPage = FullPage;

})(window, document)

