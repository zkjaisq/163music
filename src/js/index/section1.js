{
    let view ={
        el:'.page-1',
        init(){
            this.$el =$(this.el)
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        }
    }
    let model={}
    let controller ={
        init(){
            this.view =view
            this.view.init()
            this.model = model
            this.bindEventHub()
            this.loadModule1()
            this.loadModule2()
        },
        bindEventHub(){
            window.eventHub.on('selectTab',(pageName)=>{
                console.log("pageName")
                console.log(pageName)
                if(pageName === 'page-1'){
                    this.view.show()
                }else{
                    console.log(1)
                    this.view.hide()
                }
            })
        },
        loadModule1(){
            let script1 =document.createElement('script')
            script1.src='./js/index/page-1-1.js'
            document.body.appendChild(script1)
        },
        loadModule2(){
            let script2 =document.createElement('script')
            script2.src ='./js/index/page-1-2.js'
            document.body.appendChild(script2)
        }
    }
    controller.init(view,model)
}