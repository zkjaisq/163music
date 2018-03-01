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
            let { songs, selectId } = data
            let liList = songs.map((song) => {
                let $li = $('<li></li>').text(song.name).attr('data-song-id', song.id)
                if (song.id === selectId) { $li.addClass('active') }
                return $li
            })
            $el.find('ul').empty()
            liList.map((domLi) => {
                $el.find('ul').append(domLi)
            })
        },
        removActive() {
            $(this.el).find('.active').removeClass('active')
        },
    }
    let model = {
        data: {
            songs: [],
            selectId: undefined
        },
        //从数据库中获取到数据并且展现在页面上
        find() {
            var query = new AV.Query('Song');
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    return { id: song.id, ...song.attributes }
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
            this.bindEventsHub()
            this.getAllsongs()
            this.bindEvents()
        },
        getAllsongs() {
            return this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            $(this.view.el).on('click', 'li', (e) => {
                let songId = e.currentTarget.getAttribute('data-song-id')
                this.model.data.selectId = songId
                this.view.render(this.model.data)
                let data
                let songs = this.model.data.songs
                for (let i = 0; i < songs.length; i++) {
                    if (songId === songs[i].id) {
                        data = songs[i]
                        break
                    }
                }
                console.log(data)
                window.eventHub.trigger('select', JSON.parse(JSON.stringify(data)))
            })
        },
        bindEventsHub() {
            //如果是创建了一个歌曲就会将这个data添加到songlist的model里面。
            window.eventHub.on('creat', (songData) => {
                console.log(songData)
                this.model.data.songs.push(songData)
                console.log(1)
                this.view.render(this.model.data)
            })
            window.eventHub.on('updata', (song) => {
                console.log(song)
                let songs = this.model.data.songs
                console.log(songs)
                for (let i = 0; i < songs.length; i++) {
                    if (songs[i].id === song.id) {
                        Object.assign(songs[i], song)
                    }
                }
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', () => {
                this.view.removActive()
            })
        }
    }
    controller.init(view, model)
}