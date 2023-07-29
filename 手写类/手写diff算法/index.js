import h from "./h.js";
import patch from "./patch.js";
let container = document.querySelector(".container");
let vnode1 = h("ul", {}, [
  h("li", {key:'a'}, "a"),
  h("li", {key:'b'}, "b"),
  h("li", {key:'c'}, "c"),
  h("li", {key:'d'}, "d"),
]);
let vnode2 = h("ul", {}, [
  h("li", {key:'d'}, "d"),
  h("li", {key:'b'}, "b"),
  h("li", {key:'a'}, "a"),
  h("li", {key:'c'}, "c"),
  h("li", {key:'e'}, "e"),
]);
let vnode3=h("ul", {}, [
  h("li", {key:'b'}, "b"),
  h("li", {key:'d'}, "d"),
  h("li", {key:'h'}, "h"),
 
]);
// console.log('1----->',vnode1)
// console.log('2----->',vnode2)
patch(container, vnode1);
patch(vnode1,vnode2);
patch(vnode2,vnode3);


