$(function(){
    $.get('/lyric.json').then(function(response){
        let {lyric} = response.lrc //ES6解构赋值
        console.log(lyric.split('\n'))//将字符串从火车的地方拆分

        

        
    })
})