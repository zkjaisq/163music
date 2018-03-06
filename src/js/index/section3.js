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
        render(data) {
            console.log(data)
            let { song } = data
            console.log(song)
            song.map((string) => {
                console.log(string)
                let $li = $(`
                <li>
                <a href="./song.html?id=${string.id}">
                    <h3>${string.name}</h3>
                    <p>
                        <svg class="icon-play" aria-hidden="true">
                            <use xlink:href="#icon-sq"></use>
                        </svg>
                       ${string.artist}
                    </p>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-main-play"></use>
                </svg>
                </a>
            </li>
                `)
                this.$el.find('.searchList').append($li)
            })

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
            let timer = null
            this.view.$el.find('input').on('input', (e) => {
                if (timer) {
                    window.clearTimeout(timer)
                }
                timer = setTimeout(() => {
                    timer = null
                    this.view.$el.find('.delete').addClass('active')
                    let $input = $(e.currentTarget)
                    let value = $input.val()
                    console.log(value)
                    if(!value){return}
                    let song1 = new AV.Query('Song');
                    song1.contains('name', value);
                    let song2 = new AV.Query('Song');
                    song2.contains('artist', value);
                    let query = AV.Query.or(song1, song2);
                    query.find().then((result) => {
                        console.log(result)
                        if (result.length === 0) {
                            let $p = $(`
                        <p>没有结果</p>
                        `)
                            this.view.$el.append($p)
                        } else {
                            this.model.data.song = result.map((song) => {
                                console.log(song)
                                return { id: song.id, cover: song.attributes.cover, url: song.attributes.url, name: song.attributes.name, artist: song.attributes.artist }
                            })

                        }
                        this.view.render(this.model.data)
                    })
                }, 300)
            })
        }
    }
    controller.init(view, model)
}