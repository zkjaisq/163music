{
    let view = {
        el: '.page > main > .formArea',
        init() {
            this.$el = $(this.el)
        },
        template: ` 
        <form class="form">
            <div class="row">
                    <label for="songName">
                          歌名：
                    </label>
                <input id="songName"  name="name"  type="text" value ="__name__">
            </div>
            <div class="row">
                    <label for="singer">
                           歌手：
                    </label>
                <input id="singer"  name="artist"  type="text"  value="__artist__">
            </div>
            <div class="row">
                <label for="link">
                        外链：
                </label>
               
                <input id="link"  name = "url"  type="text" value = "__url__">
            </div>
            <div class="row">
            <label for="cover">
                  封面：
            </label>
        <input id="cover"  name="cover"  type="text" value ="__cover__">
    </div>
            <button type="submit">上传</button>
        </form>`,
        render(data = {}) {
            let placeholder = ['url', 'name', 'artist','cover']
            let html = this.template
            placeholder.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        },
        reset() {
            this.render({})
        }
    }
    let model = {
        data: {
            name: '', artist: '', url: ''
            , id: '',cover:''
        },
        //save数据
        creat(data) {
            // 声明类型
            var Song = AV.Object.extend('Song');
            // 新建对象
            var song = new Song();
            // 设置名称
            song.set('name', data.name);
            song.set('artist', data.artist);
            song.set('url', data.url);
            song.set('cover', data.cover);
            // 设置优先级
            return song.save().then((newSong) => {
                //let id = newSong.id
                //let attributes = newSong.attributes
                let { id, attributes } = newSong
                // this.data.id =id
                //this.data.name =attributes.name
                //this.data.url =attributes.url
                //下面的Onject.assign等同于上面的三行
                Object.assign(this.data, {
                    id: id,
                    ...attributes,
                    // name:attributes.name,
                    //artist:attributes.artist,
                    // url:attributes.url,

                })

            }, (error) => {
                console.error(error);
            });
        },
        updata(data) {
            var  song = AV.Object.createWithoutData('Song', this.data.id);
            // 修改属性
            song.set('name', data.name);
            song.set('artist',data.artist);
            song.set('url',data.url);
            song.set('cover',data.cover);
            // 保存到云端
            return song.save().then((response)=>{
                Object.assign(this.data,data)
                return response
            });
        },
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            //当有数据上传的时候就渲染view
            window.eventHub.on('select', (data)=>{
                this.model.data = data
                this.view.render(this.model.data)
              })
        },
        creat() {
            let needs = "name artist url cover".split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name = ${string}]`).val()
            })

            this.model.creat(data).then(() => {
                this.view.reset()
                let string = JSON.stringify(this.model.data)
                let object = JSON.parse(string)
                window.eventHub.trigger('creat', object)
                //当成功创建一个表单，songlist就可以监听创建事件
            })
        },
        updata() {
            let needs = "name artist url cover".split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name = ${string}]`).val()
            })
            // 第一个参数是 className，第二个参数是 objectId
            this.model.updata(data).then(()=>{
                alert('数据更新成功')
                window.eventHub.trigger('updata',JSON.parse(JSON.stringify(this.model.data)))
            })
        },
        //事件相关的代码，当表单提交的时候就进行收集我们需要的数据，然后通过model调用model的方法将数据保存到数据库中
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()//阻止表单提交事件
                console.log(this.model.data.id)
                if (this.model.data.id) {
                    this.updata()
                } else {
                    this.creat()
                }
            })
            window.eventHub.on('select', (data) => {
                console.log(data)
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', (data) => {
                if(this.model.data.id){
                    this.model.data = {
                      name: '', url: '', id: '', singer: ''
                    }
                  }else{
                    Object.assign(this.model.data, data)
                  }
                  this.view.render(this.model.data)
                })
        }
    }
    controller.init(view, model)
}