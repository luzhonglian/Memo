let arr = [99, 12,55,102,888,64];
/* 
先把arr全部分为单个元素的数组
然后通过merge规则一层层往上合并
merge时，两个数组谁的第一个元素小就把那个元素放进新数组
通过array.shift()即删掉第一个元素又返回删掉的那个元素
时间 O(n*logn) 空间O(n)
*/
function mergeSort(arr){
    if(arr.length<2){
        return arr
    }
    let mid=Math.floor(arr.length/2)
    let leftArr=arr.slice(0,mid)
    let rightArr=arr.slice(mid)
    return merge(mergeSort(leftArr),mergeSort(rightArr))
}

function merge(left,right){
    let result=[]
    /* 
    左一<右一--------删左一，进res
    */
    while(left.length && right.length){
        if(left[0]<right[0]){
            result.push(left.shift())
        }else{
            result.push(right.shift())
        }
    }
    return result=result.concat(left).concat(right)
}

console.log(mergeSort(arr))