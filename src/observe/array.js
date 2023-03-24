//重写数组方法
//获取原来的数组方法\'
let oldArrayProtoMethods=Array.prototype

//继承

export let ArrayMethods=Object.create(oldArrayProtoMethods)

//劫持

let methods=['push','pop','unshift','shift','splice']

methods.forEach(item=>{
    ArrayMethods[item]=function (...args){
        // 劫持数组
        console.log('%carray.js line:16 数组劫持', 'color: #007acc;');
        let result=oldArrayProtoMethods[item].apply(this,args)
        let inserted
        switch(item){
            case 'push':
            case 'unshift':
                inserted=args //将添加的数据进行获取
                break;
            case 'splice':
                inserted=args.splice(2); //最后一个
        }
        let ob=this.__ob__
        if(inserted){
            ob.observerArray(inserted) //对添加的数据进行劫持
        }
        return result
    }
})