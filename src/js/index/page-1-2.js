{
    let view = {
        el: 'hotList',
       init(){
        this.$el = $(this.el)
       },
        render(data) {
            let { songs } = data
            newSons = songs.slice(0, 10)
            newSons.map((song) => {
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
                $('ul.list').append($li)

            })
        }
    }
    let model = {
        data: {
            songs: []
        },
        //获取到数据库中的歌曲
        find() {
            var query = new AV.Query('Song');
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    return { id: song.id, ...song.attributes }
                })
                return songs
            })


        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.model.find().then(() => {       
                this.view.render(this.model.data) 
            })
        }
    }
    controller.init(view, model)
}