/* 
        选择排序的核心理论：
        每次都找到最小的那个，找到了就和前面的交换
        和冒泡的区别：冒泡是比较大小---前比后小就交换元素
                     交换是比较大小---找到最小后才交换
        时间 O(n^2) 空间O(1)
        */
let arr = [99, 12, 55, 102];
function selectSort(arr) {
  /* 
    2层循环，第一层--进行的轮数，3个元素就有2轮
            第二层--比较的元素个数，共length-轮数
    */
  for (let index = 0; index < arr.length - 1; index++) {
    let min = index;
    for (let j = index + 1; j < arr.length; j++) {
      min = arr[min] > arr[j] ? j : min;
    }
    if (min != index) {
      [arr[index], arr[min]] = [arr[min], arr[index]];
    }
  }
  return arr;
}
console.log(selectSort(arr));
