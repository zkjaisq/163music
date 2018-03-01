//发布订阅模式，用来解耦的
window.eventHub={
events:{

},//hash
 //发布
    trigger(eventName,data){
        for(let key in this.events){
            if(key === eventName){
                let fnList = this.events[key]
                fnList.map((fn)=>{
                    fn.call(undefined,data)
                })
            }
        }
    },
    //订阅
    on(eventName,fn){
       if(this.events[eventName] === undefined){
          this.events[eventName] =[]
       }
       this.events[eventName].push(fn)
    },
    off(){}
}