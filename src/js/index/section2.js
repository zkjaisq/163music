{
    let view ={
        el:'.page-2',
        init(){
            this.$el =$(this.el)
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        },
        render(data){
            let {songs}=data
            let newSong = songs.slice(0,20)
            newSong.map((song)=>{
                let $li = $(`
                <li>
                <a href="./song.html?id=${song.id}">
                    <h3>${song.name}</h3>
                    <p>
                        <svg class="icon-play" aria-hidden="true">
                            <use xlink:href="#icon-sq"></use>
                        </svg>
                       ${song.artist}
                    </p>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-main-play"></use>
                </svg>
                </a>
            </li>
                `)
            this.$el.find('.newList').append($li)
            })
            
            
        }
    }
    let model={
        data: {
            songs: []
        },
        //获取到数据库中的歌曲
        find() {
            var query = new AV.Query('Song');
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    return { id: song.id, name:song.attributes.name,url:song.attributes.url, 
                        artist:song.attributes.artist,}
                })
                return songs
            })


        }
    }
    
    let controller ={
        init(){
            this.view =view
            this.view.init()
            this.model = model
            this,model.find().then(()=>{
                this.view.render(this.model.data)
            })
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('selectTab',(pageName)=>{
                if(pageName === 'page-2'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view,model)
}