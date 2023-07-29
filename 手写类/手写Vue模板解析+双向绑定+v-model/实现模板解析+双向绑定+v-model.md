**Observer**:用于调用 Object.defineProperty 对 Vue 实例中的 data 的每一个属性进行数据劫持  
**Watcher**:一旦 DOM 里使用到了插值表达式就会创建一个 watcher 实例，用于记录哪个 Vue 实例(vm)的data属性的哪个属性(key)被用到了，这个属性更新的时候是如何改变 DOM 结点的内容的(callback)  
**Dependency**：用于统一管理 watcher，和 Obserber 中劫持数据的 getter 和 setter 配合，  
生成 watcher 实例时，在构造函数中显式调用 getter，将这个实例添加到订阅数组里  
data 中有属性被重新赋值时，调用 setter，Dependency 实例通知观察者该属性的 watcher 去更新

```javascript
//watcher需要调用getter，将这个实例添加到订阅数组里
class Watcher {
  constructor(vm, key, callback) {
    this.vm = vm;
    this.key = key;
    this.callback = callback;
    Dependency.temp = this;
    key.split(".").reduce((accumulator, cur) => accumulator[cur], vm.$data);
    Dependency.temp = null;
  }
  ...
}
```

```javascript
//Dependency在getter和setter中进行操作
Object.defineProperty(data_instance, key, {
  enumerable: true,
  configurable: true,
  get() {
    Dependency.temp && dependency.addSub(Dependency.temp);
    //此刻依赖于某个属性的watcher被加入到订阅数组里
    return value;
  },
  set(newValue) {
    value = newValue;
    Observer(value);
    dependency.notify();
  },
});
```

```javascript
/* 
收集依赖，统一管理watcher， 
*/
class Dependency {
  constructor() {
    this.subscribers = [];
  }
  addSub(sub) {
    this.subscribers.push(sub);
  }
  notify() {
    this.subscribers.forEach((sub) => sub.update());
  }
}
```
