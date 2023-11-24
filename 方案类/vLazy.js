const vLazy={
    mounted: (el) => {
      let imgsrc=el.src
      el.src=''
      const observer=new IntersectionObserver(callback)
      observer.observe(el)
      function callback(entries){
        entries.forEach(e=>{
            if(e.isIntersecting){
               setTimeout(() => {
                el.src=imgsrc
                observer.unobserve(el)
               }, 300);
            }
        })
      }
    },
  }
export default vLazy