import { observe } from "./observe/index.js";

export function initState(vm){
    let opts=vm.$options
    //对数据初始化处理
    if(opts.data){
        initData(vm)
    }

    function initData(vm){
        //判断data 是对象/函
        let data=vm.$options.data
        data=vm._data=typeof data==='function'?data.call(vm):data 
        //数据劫持 -- vue2数据响应式原理
        observe(data) //
        //data{} 对象   数组
    }
}