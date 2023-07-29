export default function createElement(vnode) {
  let node_element = document.createElement(vnode.sel);
  if (vnode.children == undefined) {
    node_element.innerText = vnode.text;

  } else if (Array.isArray(vnode.children)) {

    for (let child of vnode.children) {
      let child_element = createElement(child);
      node_element.appendChild(child_element);
    }

  }

  vnode.elm = node_element;
  // console.log('vnode--->',vnode)

  return node_element;
}
