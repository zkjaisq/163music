{
    let view = {
        el: '#app',
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            let { song, status } = data
            this.$el.find('img.lin').attr('src', song.cover)
            this.$el.css('background-image', `url(${song.cover})`)
            let $audio = $('<audio></audio>').attr('src', song.url)
            this.$el.append($audio)
            let audio = $audio[0]
            audio.onended = () => {
                window.eventHub.trigger('songEnd')
                console.log('结束了')
            }
            audio.ontimeupdate = () => {
                this.showLyric(audio.currentTime)
            }
            if (status === 'playing') {
                $(this.el).find('.icon').addClass('active')
                $(this.el).find('.disco').addClass('active')
                $(this.el).find('.lin').addClass('active')
                this.$el.find('.needle').removeClass('active')
            } else {
                this.$el.find('.icon').removeClass('active')
                this.$el.find('.disco').removeClass('active')
                this.$el.find('.lin').removeClass('active')
                this.$el.find('.needle').addClass('active')
            }
            this.$el.find('h3').text(song.name)
            let { lyrices } = song
            let array = lyrices.split('\n').map((string) => {
                let p = document.createElement('p')
                this.$el.find('.lyric > .lines').append(p)
                let regex = /\[([\d:.]+)\](.+)/
                let matches = string.match(regex)
                if (matches) {
                    p.textContent = matches[2]
                    let time = matches[1]
                    let parts = time.split(':')
                    let minute = parts[0]
                    let second = parts[1]
                    let newTime = parseFloat(minute) * 60 + parseFloat(second)
                    p.setAttribute('data_time', newTime)
                } else {
                }
            })
        },
        showLyric(time) {
            let allP = this.$el.find('.lyric > .lines > p')
            let p 
            for (let i = 0; i < allP.length; i++) {
            if(i===allP.length - 1){
                p =allP[i]
                break
            }else{
                let currentTime = allP.eq(i).attr('data_time')
                let nextTime = allP.eq(i+1).attr('data_time')
                if (currentTime<= time && time <nextTime) {
                    p = allP[i]
                break
                    }    
            }
            }
            let pHeight = p.getBoundingClientRect().top
            let lineHeight = this.$el.find('.lyric > .lines')[0].getBoundingClientRect().top
            let height = pHeight - lineHeight
            console.log(height)
            this.$el.find('.lyric > .lines').css('transform',`translateY(${-(height -30)}px)`)
            $(p).addClass('active').siblings('.active').removeClass('active')
        },
        play() {
            this.$el.find('audio')[0].play()
        },
        paused() {
            this.$el.find('audio')[0].pause()
        }
    }
    let model = {
        data: {
            song: {
                id: '',
                artist: '',
                name: '',
                url: '',
                cover: '',
                lyrices: ''
            },
            status: 'paused'

        },
        getId(id) {
            var query = new AV.Query('Song');
            return query.get(id).then((song) => {
                Object.assign(this.data.song, { id: song.id, name: song.attributes.name, artist: song.attributes.artist, url: song.attributes.url, cover: song.attributes.cover, lyrices: song.attributes.lyrices })
                return song
            });
        },
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            let id = this.getSongId()
            this.model.getId(id).then(() => {
                this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        //获取到songId，并且将id的值从查询参数中分离出来
        getSongId() {
            let search = window.location.search
            console.log(search)
            if (search.indexOf('?') === 0) {
                search = search.substring(1)
                console.log(search)
            }
            //将查询参数从&分开，然后当中间有多个&的时候就用filter将空字符串过滤出来
            let array = search.split('&').filter(v => v)
            let id = ''
            for (let i = 0; i < array.length; i++) {
                let kv = array[i].split('=')
                let k = kv[0]
                let v = kv[1]
                if (k === 'id') {
                    id = v
                    break
                }
            }
            return id
        },
        bindEvents() {
            $(this.view.el).on('click', '.icon', () => {
                this.model.data.status = 'playing'
                this.view.render(this.model.data)
                this.view.play()
            })
            $(this.view.el).on('click', '.lin', () => {
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
                this.view.paused()
            })
            window.eventHub.on('songEnd', () => {
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}


