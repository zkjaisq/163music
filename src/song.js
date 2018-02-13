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
    audio.src = 'http://p3gaw11jx.bkt.clouddn.com/0671%252Fca73%252F355c%252F2b832330d25a65cab30dbea4ebc4fd28.mp3'
    audio.oncanplay = function () {
        audio.play()
    }
    $('.disco-contain').on('click', function () {
        audio.pause()
        $('.lin').css({'animation-play-state':'paused'})
        $('.disco').css({'animation-play-state':'paused'})
        $('.icon').addClass('active')
        $('.icon').one('click',function(x){
            audio.play()
            x.stopPropagation()
            $('.lin').css({'animation-play-state':'running'})
            $('.disco').css({'animation-play-state':'running'})
            $('.icon').removeClass('active')
        })
    
    })
    })
    
    