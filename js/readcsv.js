function loadTextFile(){
$(function(){
    $.get('../data/corecore_cpi.csv',function(data){
        var csv = $.csv()(data);
        //indexを使ってくり返し回数をカウントします
        $(csv).each(function(index){
            //indexが0の場合はタイトル行なのでリンク無し、それ以外はリンクを作成
            if(index == 0){
                if(this[0] && this[1]){
                    $("#result table").append("<tr><td>"+this[0]+"</td><td>"+this[1]+"</td></tr>");
                }
            } else {
                if(this[0] && this[1]){
                    $("#result table").append("<tr><td>"+this[0]+"</td><td>"+this[1]+"</td></tr>");
                }
            }
        })
    })
})
}