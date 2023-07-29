## 算法作用

直接操作真实 DOM 来更新视图贼慢，故用虚拟结点

通过对比新旧虚拟结点，找出最能复用原有结点的方法，以最小代价最快地更新视图

### 过程

数据变化->调用 setter->生成新的虚拟结点  
->Dependency.notify()  
->订阅了对应依赖的 watcher 调用 patch(old_vnode,new_vnode)

## 函数作用

### vnode

生成虚拟结点对象

```javascript
{
  sel, //DOM结点类型
    data, //数据
    children, //子虚拟结点
    text, //文本内容，text和children只能有一个
    elm, //对应的真实结点
    key; //唯一标识
}
```

### h

vnode 的扩展函数，使能生成嵌套的虚拟结点

根据传入的 params 生成文本虚拟结点/有子元素的虚拟结点

```javascript
else if(Array.isArray(params) && params.length !=0){
        let arr=[]
        for(let param of params){
            arr.push(param)
        }
        return vnode(sel,data,arr,undefined,undefined)
    }
```

### createElement

用虚拟结点生成真实结点，无 children 用 text 赋值 innerText

否则递归调用函数

```javascript
 else if (Array.isArray(vnode.children)) {
    for (let child of vnode.children) {
      let child_element = createElement(child);
      node_element.appendChild(child_element);
    }
  }
```

### patch

考虑原结点不是 vnode 的情况，要将其转为虚拟结点

若新旧 vnode 的 sel 不一样，说明不是一类无法复用，直接删了旧的加新的进去

```javascript
if (old_vnode.sel !== new_vnode.sel) {
  let new_element = createElement(new_vnode);
  // console.log(new_element)
  let parent_element = old_vnode.elm.parentNode;
  if (new_element) {
    parent_element.insertBefore(new_element, old_vnode.elm);
  }
  parent_element.removeChild(old_vnode.elm);
}
```

否则进入 patchVnode，在原有结点上改造得到新的视图

### patchVnode

四种情况

```javascript
/*    
        old无子，new无子，用text替换
        old有子，new无子，用text替换
        old无子，new有子，用children换
        old有子，new有子，updateChildren
  */
```

### updateChildren

给新旧 vnode 加首尾指针。对比差异并移动指针，在一方尾指针移到首指针前停止对比

对比新旧首尾指针指向的 vnode 的 key，顺序是首首->尾尾->首尾->尾首

若上四类都不能复用就遍历旧结点，检查有无复用可能，能复用就将可复用结点移动到对应位置，否则创建新结点插入
