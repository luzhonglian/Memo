import createElement from "./createElement.js";
import patchVnode from "./patchVnode.js";

function sameVnode(v1, v2) {
  return v1.key === v2.key && v1.sel === v2.sel;
}
/* updateChildren是为了最大化地复用旧结点，能patch的patch，不能的add/del */
export default function updateChildren(parent_element, old_ch, new_ch) {
  let old_start_index = 0;
  let new_start_index = 0;
  let old_end_index = old_ch.length - 1;
  let new_end_index = new_ch.length - 1;

  let old_start = old_ch[0];
  let old_end = old_ch[old_end_index];
  let new_start = new_ch[0];
  let new_end = new_ch[new_end_index];

  /* 首首 尾尾 首尾 尾首 检查有无复用可能 add/del */
  while (old_start_index <= old_end_index && new_start_index <= new_end_index) {
    //----------------------------------------过滤已复用的
    if (old_start == undefined) {
      old_start = old_ch[++old_start_index];
    } else if (old_end == undefined) {
      old_end = old_ch[--old_end_index];
    }
    //----------------------------------------首首
    else if (sameVnode(old_start, new_start)) {
      patchVnode(old_start, new_start);
      new_start.elm = old_start.elm;
      old_start = old_ch[++old_start_index];
      new_start = new_ch[++new_start_index];
    }
    //----------------------------------------尾尾
    else if (sameVnode(old_end, new_end)) {
      patchVnode(old_end, new_end);
      old_end.elm = new_end.elm;
      old_end = old_ch[--old_end_index];
      new_end = new_ch[--new_end_index];
    }
    //----------------------------------------首尾
    else if (sameVnode(old_start, new_end)) {
      patchVnode(old_start, new_end);
      new_end.elm = old_start.elm;
      parent_element.insertBefore(old_start.elm, old_end.elm.nextSibling);
      old_start = old_ch[++old_start_index];
      new_end = new_ch[--new_end_index];
    }
    //----------------------------------------尾首
    else if (sameVnode(old_end, new_start)) {
      patchVnode(old_end, new_start);
      new_start.elm = old_end.elm;
      parent_element.insertBefore(old_end.elm, old_start.elm);
      old_end = old_ch[--old_end_index];
      new_start = new_ch[++new_start_index];
    }
    //----------------------------------------复用已有的，无法复用就创建
    else {
      let key_index = {};
      for (let i = old_start_index; i <= old_end_index; i++) {
        if (sameVnode(old_ch[i], new_start)) {
          key_index[new_start.key] = i;
        }
      }
      let index_in_oldCh = key_index[new_start.key];
      if (index_in_oldCh) {
        let vnode_to_move = old_ch[index_in_oldCh];
        new_start.elm = vnode_to_move.elm;
        patchVnode(vnode_to_move, new_start);
        parent_element.insertBefore(vnode_to_move.elm, old_start.elm);
        old_ch[index_in_oldCh] = undefined;
      } else {
        let new_element = createElement(new_start);
        parent_element.insertBefore(new_element, old_start.elm);
      }
      new_start = new_ch[++new_start_index];
    }
  }
  //----------------------------------------一方有多的
  if (new_start_index <= new_end_index) {
    for (let i = new_start_index; i <= new_end_index; i++) {
      parent_element.appendChild(createElement(new_ch[i]));
    }
  }
  if (old_start_index <= old_end_index) {
    for (let i = old_start_index; i <= old_end_index; i++) {
      if (old_ch[i]) {
        parent_element.removeChild(old_ch[i].elm);
      }
    }
  }
}
