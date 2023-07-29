import createElement from "./createElement.js";
import updateChildren from "./updateChildren.js";
export default function patchVnode(old_vnode, new_vnode) {
  /*    

        old无子，new无子，用text替换
        old有子，new无子，用text替换
        old无子，new有子，用children换
        old有子，new有子，updateChildren
            */
  if (new_vnode.children == undefined) {
    old_vnode.elm.innerText = new_vnode.text;
  } else {
    // old无子，new有子，用children换
    if (old_vnode.children === undefined || old_vnode.children.length === 0) {
      old_vnode.elm.innerHTML = "";
      for (let child of new_vnode.children) {
        let child_element = createElement(child);
        old_vnode.elm.appendChild(child_element);
      }
    } else {
        // old有子，new有子
        new_vnode.elm=old_vnode.elm
        updateChildren(old_vnode.elm,old_vnode.children,new_vnode.children)
    }
  }
}
