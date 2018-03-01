{
    let view = {
        el:'.newSong',
        template:`
        新建歌曲
        `,
        render(data){
            $(this.el).html(this.template)
        }
        
    }
    let model ={}
    let controller ={
        init(view,model){
            this.view =view
            this.model = model
            this.view.render()
            this.active()
            this.bindEvents()
           
        },
        active(){
            $(this.view.el).addClass('active')
        },
        deactive(){
            $(this.view.el).removeClass('active')
                },
        bindEvents(){
            window.eventHub.on('select',()=>{
                this.deactive()
            })
            window.eventHub.on('new',()=>{
                this.active()
            })
            $(this.view.el).on('click',()=>{
                window.eventHub.trigger('new')
                
            })
        },   
    }
   
    controller.init(view,model)
}