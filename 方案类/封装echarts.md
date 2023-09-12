### 核心是监听父组件传入的 width、height、option 的变化并 resize

```javascript
//template
  <div :id="id" :style="style" :options="options" ref="chart"></div>
```

```javascript
//script setup
let props = defineProps({
  width: {
    type: String,
    default: "600px",
  },
  height: {
    type: String,
    default: "400px",
  },
  options: {
    type: Object,
    default: null,
  },
});
let { height, width, options } = toRefs(props);
let style = computed(() => {
  return {
    width: width.value,
    height: height.value,
  };
});
//-------------拿到DOM
const chart = ref(null);
//-----------render Echarts
onMounted(() => {
  let myChart = echarts.init(chart.value);
  myChart.setOption(options.value);
  watch([width, height], () => {
    /* width更新->DOM异步更新->不加settimeout resize的是旧的DOM */
    setTimeout(() => {
      myChart.resize({
        animation: {
          duration: 100,
        },
      });
    }, 100);
  });

  watch(options, () => {
    myChart.setOption(options.value);
  });
});
```

### 父组件中使用

```javascript
<MyEcharts :width="width" :height="height" :options="options"></MyEcharts>
```
