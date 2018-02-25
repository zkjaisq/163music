{
    let view = {
        el: '#contain-songList',
        template: `
        <ul class="songList">
        <li><div>歌曲1</div></li>
        <li><div>歌曲2</div></li>
        <li><div>歌曲3</div></li>
        <li><div>歌曲4</div></li>
        <li><div>歌曲5</div></li>
        <li ><div>歌曲6</div></li>
        <li><div>歌曲7</div></li>
        <li><div>歌曲8</div></li>
        <li><div>歌曲9</div></li>
        <li><div>歌曲10</div></li>
    </ul>
        `,
        render(data) {
            let $el = $(this.el)
            $el.html(this.template)
            let { songs } = data
            console.log(songs)
            let liList = songs.map((song) => {
                return $('<li></li>').text(song.name)
            })
            $el.find('ul').empty()
            liList.map((domList) => {
                $el.find('ul').append(domList)
            })
        },
        removActive() {
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: []
        },
        //从数据库中获取到数据并且展现在页面上
        find() {
            var query = new AV.Query('Song');
            return query.find().then((songs)=>{
                this.data.songs = songs.map((song)=>{
                    return {id:song.id,...song.attributes}
                })
                console.log(this.data.songs)
                return this.data.songs
            })
               

        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload', () => {
                this.view.removActive()
            })
            //如果是创建了一个歌曲就会将这个data添加到songlist的model里面。
            window.eventHub.on('creat', (songData) => {
                console.log(songData)
                this.model.data.songs.push(songData)
                console.log(1)
                this.view.render(this.model.data)
            })
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })

        }
    }
    controller.init(view, model)
}