import { ArrayMethods } from "./array"

export function observe(data) {

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
        })
        //判断是数组还是对象
        if (Array.isArray(value)) {
            //函数劫持
            value.__proto__ = ArrayMethods
            //如果是数组对象
            this.observerArray(value)
        } else {
            this.walk(value) //便利
        }
    }
    //对象属性
    walk(data) {
        let keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {
            //对每个属性进行劫持
            let key = keys[i]
            let value = data[key]
            definRtactive(data, key, value)
        }
    }
    // 数组对象劫持
    observerArray(value) {
        for (let i = 0; i < value.length; i++) {
            observe(value[i])
        }
    }
}
//对data里的对象属性进行劫持
function definRtactive(data, key, value) {
    observe(value) //递归深度劫持
    Object.defineProperty(data, key, {
        get() {
            console.log('%cindex.js line:29 获取', 'color: #007acc;');
            return value
        },
        set(newValue) {
            console.log('%cindex.js line:33 修改', 'color: #007acc;');
            if (newValue == value) return value
            observe(newValue) //深度劫持,将修改过的数据再次进行劫持
            value = newValue
        }
    })
}
//对数组进行劫持