/* 
假定第一个元素是排序好的
从后往前扫描排序好的元素，比待排序的元素大就往后移
扫描完，将待排序的元素插入那个不大于它的位置
时间 O(n^2) 空间O(1)
*/
let arr = [99, 12, 55, 102, 64, 888, 55];
function insert(arr) {
  if (arr.length < 2) {
    return arr;
  }
  for (let i = 1; i < arr.length; i++) {
    let target = arr[i];
    let j = i;
    while (j > 0 && target <= arr[j - 1]) {
      arr[j] = arr[j - 1];
      j--;
    }
    arr[j] = target;
  }
  return arr;
}
console.log(insert(arr));
/* 
[
  12,  55,  55, 64,
  99, 102, 888
]
*/
