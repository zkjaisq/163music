$(function () {
    $.get('/lyric.json').then(function (response) {
        let { lyric } = response.lrc //ES6解构赋值
        let array = lyric.split('\n')//将字符串从回车的地方拆分

        let regex = /^\[(.+)\](.*)$/
        array = array.map(function (string, index) {
            let matches = string.match(regex)
            if (matches) {
                return { time: matches[1], word: matches[2] }
            }
        })

        //遍历所有的对象，添加歌词
        let $lyric = $('.lyric')
        console.log($lyric)
        array.map(function (lyric) {
            let $p = $('<p></p>')
            $p.attr('date-time', lyric.item).text(lyric.word)
            $p.appendTo($lyric.children('.lines'))
        })
    })
    let audio = document.createElement('audio')
    audio.src = 'http://dl.stream.qqmusic.qq.com/C400003yTXr93OYkOZ.m4a?vkey=366A0A5EA2F32828D679582C25A88968B820D0F6AD438951976B95668B6F3EDCE5622C8D92B7977DA021CEA5D27F3BC44C51DA55922C6529&guid=4326069320&uin=1551311205&fromtag=66'
    audio.oncanplay = function () {
        audio.play()
        $('.lin').addClass('playing')
        $('.disco').addClass('playing')
    }
    $('.disco-contain').on('click', function () {
        audio.pause()
        $('.lin').removeClass('playing')
        $('.disco').removeClass('playing')
        $('.icon').addClass('active')
        $('.icon').one('click',function(x){
            audio.play()
            x.stopPropagation()
            $('.lin').addClass('playing')
            $('.disco').addClass('playing')
            $('.icon').removeClass('active')
        })
    
    })
    })
    
    