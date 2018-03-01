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
        }
    }
    controller.init(view,model)
}