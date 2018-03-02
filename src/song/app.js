{
    let view ={
        el:'.page',
        template:`
        <audio src={{url}}></audio>
        `,
        render(data){
            console.log(data)
           this.$el.append(this.template.replace('{{url}}',data.url))
        },
        play(){
            let audio = this.$el.find('audio')[0]
            console.log(audio)
            audio.play()
        },
        pause(){
            let audio = this.$el.find('audio')[0]
            audio.pause()
        },
        init(){
            this.$el = $(this.el)
        }
    }
    let model={
        data:{
            id:'',
            artist:'',
            name:'',
            url:''
        },
        getId(){
            var query = new AV.Query('Song');
             return query.get(this.data.id).then((song)=>{
                Object.assign(this.data,song.attributes)
                return song
            });
        },
        setId(id){
            this.data.id =id
        }
    }
    let controller ={
        init(view,model){
            this.view =view
            this.view.init()
            this.model =model
            let id = this.getSongId()
            this.model.setId(id)
            this.model.getId().then(()=>{
               console.log(this.model.data)
               this.view.render(this.model.data)
               this.view.play()
            })
       
            
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
        }
    }
    controller.init(view,model)
}


