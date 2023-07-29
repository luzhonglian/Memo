import vnode from "./vnode.js";
import createElement from "./createElement.js";
import patchVnode from "./patchVnode.js";
/* vnode-->sel, data, children, text, elm */

export default function (old_vnode, new_vnode) {
  if (old_vnode.sel === undefined) {
    old_vnode = vnode(
      old_vnode.tagName.toLowerCase(),
      {},
      [],
      undefined,
      old_vnode
    );
  }
  //sel不一样说明不是一类无法复用，直接删了加新的进去
  if (old_vnode.sel !== new_vnode.sel) {
    let new_element = createElement(new_vnode);
    // console.log(new_element)
    let parent_element = old_vnode.elm.parentNode;
    if (new_element) {
      parent_element.insertBefore(new_element, old_vnode.elm);
    }
    parent_element.removeChild(old_vnode.elm);
  } else {
    /* same sel ,说明可以在原有节点上打补丁
        分类 :
        old无子，new无子，用text替换
        old有子，new无子，用text替换
        old无子，new有子，用children换
        old有子，new有子，updateChildren
*/  
    patchVnode(old_vnode, new_vnode);
  }
  //----------------------------------------
}
