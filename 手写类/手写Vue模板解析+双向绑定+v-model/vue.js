class Vue {
  constructor(obj_instance) {
    this.$data = obj_instance.data;
    this.$methods = obj_instance.methods;
    /* 对data里的数据进行数据劫持 */
    /* vue2使用defineProperty进行数据劫持 */
    // Observer2(this.$data);
    /* vue3使用proxy进行数据劫持 */
    Observer3(this.$data, this);
    /* 解析DOM文档里的{{}} */
    Compile(obj_instance.el, this);
  }
}
/* vue2使用defineProperty进行数据劫持 */
function Observer2(data_instance) {
  //递归出口-->子属性为null/子属性不是obj
  if (typeof data_instance !== "object" || !data_instance) {
    return;
  }

  const dependency = new Dependency();
  // 有几层递归就会有几个dependency实例，调用data一个，调用name一个
  Object.keys(data_instance).forEach((key) => {
    let value = data_instance[key];
    Object.defineProperty(data_instance, key, {
      enumerable: true,
      configurable: true,
      get() {
        //get用来在属性第一次使用时收集订阅者
        Dependency.temp && dependency.addSub(Dependency.temp);
        return value;
      },
      set(newValue) {
        value = newValue;
        Observer2(value);
        dependency.notify();
      },
    });
    Observer2(value);
  });
}
/* vue3使用proxy进行数据劫持,set和get都走proxy */
function Observer3(data_instance, vm) {
  const dependency = new Dependency();
  const handler = {
    get(target, propKey, receiver) {
      Dependency.temp && dependency.addSub(Dependency.temp);
      const res = Reflect.get(target, propKey);
      if (res != null && typeof res === "object") {
        //无需遍历所有属性进行劫持，用到才开代理
        return new Proxy(res, handler);
      }
      return res;
    },
    set(target, propKey, value) {
      Reflect.set(target, propKey, value);
      dependency.notify();
    },
  };
  const proxy = new Proxy(data_instance, handler);
  vm.$proxy = proxy;
}

/* 挂载到哪个DOM元素上，使用哪个Vue实例 */
function Compile(element, vm) {
  vm.$el = document.querySelector(element);
  let fragment = document.createDocumentFragment();
  let child;
  while ((child = vm.$el.firstChild)) {
    fragment.append(child);
  }
  compileFragment(fragment);
  function compileFragment(node) {
    const reg_mustache = /\{\{\s*(\S+)\s*\}\}/g;
    if (node.nodeType === 3) {  //文本结点
      let reg_result = null;
      let reg_index = []; //记录匹配成功了几个
      /* exec每次返回匹配成功的一个 */
      while ((reg_result = reg_mustache.exec(node.nodeValue)) !== null) {
        const original_text = node.nodeValue;
        reg_index.push(reg_result.index);
        let mustache_text = reg_result[0];
        const arr = reg_result[1].split(".");
        let value = arr.reduce(
          (accumulator, cur) => accumulator[cur],
          vm.$data
        );
        node.nodeValue = node.nodeValue.replace(reg_result[0], value);
        if (reg_index.length === 1) {
          new Watcher(vm, reg_result[1], (newValue) => {
            node.nodeValue = original_text.replace(mustache_text, newValue);
          });
        } else {
          new Watcher(vm, reg_result[1], (newValue) => {
            node.nodeValue = node.nodeValue.replace(mustache_text, newValue);
          });
        }
      }
      return;
    }
    if (node.nodeType === 1 && node.nodeName === "INPUT" && Reflect.has(node.attributes,'v-model')) {
      let attr = Array.from(node.attributes);
      attr.forEach((item) => {
        if (item.nodeName === "v-model") {
          //item----> v-model="name.lzl"
          const value = item.nodeValue
            .split(".")
            .reduce((accumulator, cur) => accumulator[cur], vm.$data);
          node.value = value;
          new Watcher(
            vm,
            item.nodeValue,
            (newValue) => (node.value = newValue)
          );
          node.addEventListener("input", (e) => {
            /* 
              要先拿到上一级对象的引用
              才能给该对象的属性赋值
                 */

            let key = item.nodeValue.split(".");
            let last_key = key[key.length - 1];
            let superiorObj = key
              .slice(0, length - 1)
              .reduce(
                (accumulator, cur) => accumulator[cur],
                vm.$proxy || vm.$data
              );
            superiorObj[last_key] = e.target.value;
          });
        }
      });
    }
    if (node.nodeType === 1 && node.nodeName === "BUTTON") {
      let attr = Array.from(node.attributes);
      attr.forEach((item) => {
        if (item.nodeName === "@click") {
          let fn = vm.$methods[item.nodeValue].bind(vm.$proxy || vm.$data);
          node.addEventListener("click", () => {
            fn();
          });
        }
      });
    }
    
    if(node.childNodes){
      node.childNodes.forEach((child) => {
        compileFragment(child);
      });
    }
    
  }
  vm.$el.appendChild(fragment);
}
/* Dep用于收集依赖，
对于每一个被用到的属性-->document those subscribers
当属性更新的时候通知最新更新
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
/* 
Subscriber，当属性被用到时生成
vm:which vue_instance
key:which property
callBack:how to use this property
watcher的作用就是在节点依赖更新后更新节点的内容
*/
class Watcher {
  constructor(vm, key, callback) {
    this.vm = vm;
    this.key = key;
    this.callback = callback;
    Dependency.temp = this;
    //显式使用getter，将自己添加到订阅队列
    key
      .split(".")
      .reduce((accumulator, cur) => accumulator[cur], vm.$proxy || vm.$data);
    Dependency.temp = null;
  }
  update() {
    const newValue = this.key
      .split(".")
      .reduce((accumulator, cur) => accumulator[cur], this.vm.$data);
    this.callback(newValue);
  }
}
