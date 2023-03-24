(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    //重写数组方法
    //获取原来的数组方法\'
    let oldArrayProtoMethods=Array.prototype;

    //继承

    let ArrayMethods=Object.create(oldArrayProtoMethods);

    //劫持

    let methods=['push','pop','unshift','shift','splice'];

    methods.forEach(item=>{
        ArrayMethods[item]=function (...args){
            // 劫持数组
            console.log('%carray.js line:16 数组劫持', 'color: #007acc;');
            let result=oldArrayProtoMethods[item].apply(this,args);
            let inserted;
            switch(item){
                case 'push':
                case 'unshift':
                    inserted=args; //将添加的数据进行获取
                    break;
                case 'splice':
                    inserted=args.splice(2); //最后一个
            }
            let ob=this.__ob__;
            if(inserted){
                ob.observerArray(inserted); //对添加的数据进行劫持
            }
            return result
        };
    });

    function observe(data) {

        //1.判断
        if (typeof data != 'object' || data == null) {
            return data
        }
        // 如果是对象
        return new Observe(data)

    }
    class Observe {
        constructor(value) {
            //定义属性,传递this
            Object.defineProperty(value, '__ob__', {
                enumerable: false, //不可枚举/遍历
                value: this
            });
            //判断是数组还是对象
            if (Array.isArray(value)) {
                //函数劫持
                value.__proto__ = ArrayMethods;
                //如果是数组对象
                this.observerArray(value);
            } else {
                this.walk(value); //便利
            }
        }
        //对象属性
        walk(data) {
            let keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
                //对每个属性进行劫持
                let key = keys[i];
                let value = data[key];
                definRtactive(data, key, value);
            }
        }
        // 数组对象劫持
        observerArray(value) {
            for (let i = 0; i < value.length; i++) {
                observe(value[i]);
            }
        }
    }
    //对data里的对象属性进行劫持
    function definRtactive(data, key, value) {
        observe(value); //递归深度劫持
        Object.defineProperty(data, key, {
            get() {
                console.log('%cindex.js line:29 获取', 'color: #007acc;');
                return value
            },
            set(newValue) {
                console.log('%cindex.js line:33 修改', 'color: #007acc;');
                if (newValue == value) return value
                observe(newValue); //深度劫持,将修改过的数据再次进行劫持
                value = newValue;
            }
        });
    }
    //对数组进行劫持

    function initState(vm){
        let opts=vm.$options;
        //对数据初始化处理
        if(opts.data){
            initData(vm);
        }

        function initData(vm){
            //判断data 是对象/函
            let data=vm.$options.data;
            data=vm._data=typeof data==='function'?data.call(vm):data; 
            //数据劫持 -- vue2数据响应式原理
            observe(data); //
            //data{} 对象   数组
        }
    }

    function initMixin(Vue){
        Vue.prototype._init=function(options){
            
            let vm=this;
            vm.$options=options;
            // 初始化状态
            initState(vm);
        };
    }

    function Vue(options){
        //初始化
        this._init(options);

    }
    initMixin(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
