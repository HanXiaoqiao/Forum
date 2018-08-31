Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};
//获取参数
function GetUrlPara() {
    var url = document.location.toString();
    var arrUrl = url.split("?");

    var para = arrUrl[1];
    return para;
}
//获取指定参数
function GetUrlParam(paraName) {
    var url = document.location.toString();
    var arrObj = url.split("?");

    if (arrObj.length > 1) {
        var arrPara = arrObj[1].split("&");
        var arr;

        for (var i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split("=");

            if (arr != null && arr[0] == paraName) {
                return arr[1];
            }
        }
        return "";
    }
    else {
        return "";
    }
}
$(function(){
    var art_id = GetUrlParam("artId");
    setTimeout(function(){
        $.ajax({
            type: 'post',
            url: 'http://localhost:3001/artShow',
            data: {
                art_id:art_id
            },
            dataType: 'json',
            success: function(result){
                window.page.totalPageCount = result.pages;
                window.page.totalItemCount = result.sum;
                $('.countTitle').html(result.sum+"个回答");
                $('.a-title').html(result.artDoc.art_title);
                $('.art-title').html(result.artDoc.art_title);
                $('.art-info .name').html(result.message);
                $('.art-info .time').html(new Date(result.artDoc.art_time).Format("yyyy-MM-dd hh:mm:ss"));
                $('.art-info .see').html('浏览量：'+result.artDoc.art_see);
                $('.art-info .count').html('回复数：'+result.artDoc.art_answer);
                $('.art-nr').html(result.artDoc.art_content);
                for(let val of result.countAry){
                    $('.countAll').append(`
                        <div class="countIndex01">
                            <div class="user-info">
                                <a href="" class="user-img">
                                    <img src="./images/user01.jpg" alt="" />
                                </a>
                                <a href="" class="user-name">${val.count_user}</a>
                                <span class="user-time">${new Date(val.count_time).Format("yyyy-MM-dd hh:mm:ss")}</span>
                            </div>
                            <p class="count-content">
                                ${val.count_content}
                            </p>
                            <div class="count-btn">
                                <a href="">举报</a>&nbsp;|&nbsp;<a href="">收藏</a>&nbsp;|&nbsp;<a href="">评论</a>
                            </div>
                        </div>`
                    );
                }
                if(result.sum == 0){
                    $('.countAll .countTitle').html("这里空空如也，不如帮帮ta吧！");
                }
            }
        });
    },0);
    $('.btn-textarea').click(function(){
        var storage=window.sessionStorage;
        var json=storage.getItem("userInfo");
        if(!json){
            alert("请先登录");
        }
        var jsonObj=JSON.parse(json);
        var username = jsonObj.userInfo.username;
        $.ajax({
            type: 'post',
            url: 'http://localhost:3001/count',
            data: {
                countArt :art_id ,
                countUser:username,
                countTime:new Date().Format("yyyy-MM-dd hh:mm:ss"),
                countContent:$("#answer").find('[name="answerArea"]').val()
            },
            dataType: 'json',
            success: function(result){
                $(".mess").html(result.message);
                $(".tarea").val("");
                setTimeout(function(){
                    window.location.href = './artical.html?artId='+art_id;
                },1000);
            }
        });
    });
});
