{
    let view = {
        el: '.page-3',
        init() {
            this.$el = $(this.el)
        },
        show() {
            this.$el.addClass('active')
        },
        hide() {
            this.$el.removeClass('active')
        },
        render() {

        }
    }
    let model = {
        data: {
            song: []
        }
    }
    let controller = {
        init() {
            this.view = view
            this.model = model
            this.view.init()
            this.bindEventHub()
        },
        bindEventHub() {
            window.eventHub.on('selectTab', (pageName) => {
                if (pageName === 'page-3') {
                    this.view.show()
                } else {
                    this.view.hide()
                }
            })
          this.view.$el.find('input').on('input',(e)=>{
            this.view.$el.find('.delete').addClass('active')  
            let $input = $(e.currentTarget)
              let value =$input.val()
              let  song = new AV.Query('Song');
              song.contains('content',value);
              song.find().then((result)=>{
              console.log(result)
              })
          })
        }
    }
    controller.init(view, model)
}