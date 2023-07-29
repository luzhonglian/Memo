/* 时间  worst:O(n^2) avg:O(n*logn) 空间O(logn) */
let arr = [99, 12,55,102,64,888,55];
function fast(arr){     
    let mid=arr[0]
    let left=arr.slice(1).filter(i=>i<=mid)
    let right=arr.slice(1).filter(i=>i>mid)
    return arr.length>1?fast(left).concat([mid],fast(right)):arr
}
console.log(fast(arr))
/* 
[
  12,  55,  55, 64,
  99, 102, 888
]
*/