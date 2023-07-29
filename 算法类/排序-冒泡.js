function bubbleSort(arr){
    /* 外层是要比较几轮,
        内层是有多少个数要进行比较
        每比完一轮就少一个要比的数
        时间 O(n^2) 空间O(1)
    */
   let temp
for(let i=0;i<arr.length-1;i++){
    for(let j=0;j<arr.length-1-i;j++){
        if(arr[j]>arr[j+1]){
            temp=arr[j]
            arr[j]=arr[j+1]
            arr[j+1]=temp
        }
    }
}
    return arr
}

let arr=[99,12,5,55]
console.log(bubbleSort(arr))    //[ 5, 12, 55, 99 ]