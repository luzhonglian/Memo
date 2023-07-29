import vnode from './vnode.js'
/* vnode-->sel, data, children, text, elm */
export default function(sel,data,params){
    if(typeof params ==='string'){
        return vnode(sel,data,undefined,params,undefined)
    }else if(Array.isArray(params) && params.length !=0){
        let arr=[]
        for(let param of params){
            arr.push(param)
        }
        return vnode(sel,data,arr,undefined,undefined)
    }
}