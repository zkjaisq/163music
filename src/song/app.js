{
    let view ={
        el:'#app',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {song,status} =data
            this.$el.css('background-image',`url(${song.cover})`)
            let $audio =$('<audio></audio>').attr('src',song.url)
            this.$el.append($audio)
            let audio =$audio[0]
            console.log(audio)
            audio.onended = ()=>{
                window.eventHub.trigger('songEnd')
                console.log('结束了')
            }
            if(status ==='playing'){
                $(this.el).find('.icon').addClass('active')
                $(this.el).find('.disco').addClass('active')
                $(this.el).find('.lin').addClass('active')
            }else{
                this.$el.find('.icon').removeClass('active')
                this.$el.find('.disco').removeClass('active')
                this.$el.find('.lin').removeClass('active')
            }
        },
        play(){
            this.$el.find('audio')[0].play()
        },
        paused(){
            this.$el.find('audio')[0].pause()
        }
    }
    let model={
        data:{
            song:{
                id:'',
                artist:'',
                name:'',
                url:'',
                cover:''
            },
            status:'paused'
          
        },
        getId(id){
            var query = new AV.Query('Song');
             return query.get(id).then((song)=>{
                 console.log(song)
                Object.assign(this.data.song,{id:song.id,...song.attributes})
                return song
            });
        },
    }
    let controller ={
        init(view,model){
            this.view =view
            this.view.init()
            this.model =model
            let id = this.getSongId()
            console.log(id)
            this.model.getId(id).then(()=>{
               console.log(this.model.data)
              this.view.render(this.model.data)
            }) 
            this.bindEvents()
        },
        //获取到songId，并且将id的值从查询参数中分离出来
        getSongId(){
            let search = window.location.search
            console.log(search)
            if(search.indexOf('?')=== 0 ){
               search = search.substring(1)
                console.log(search)
            }
            //将查询参数从&分开，然后当中间有多个&的时候就用filter将空字符串过滤出来
            let array =search.split('&').filter(v=>v)
            console.log(array)
            let id = ''
            for(let i =0;i<array.length;i++){
                let kv = array[i].split('=')
                let k = kv[0]
                let v =kv[1]
                if(k ==='id'){
                    id = v
                    break
                }
            }
           return id
        },
        bindEvents(){
           $(this.view.el).on('click','.icon',()=>{
               this.model.data.status = 'playing'
               this.view.render(this.model.data)
               this.view.play()
           })
           $(this.view.el).on('click','.lin',()=>{
            this.model.data.status = 'paused'
            this.view.render(this.model.data)
            this.view.paused()
        })
        window.eventHub.on('songEnd',()=>{
            this.model.data.status='paused'
            console.log('-------')
            console.log(this.model.data)
            this.view.render(this.model.data)
        })
        }
    }
    controller.init(view,model)
}


