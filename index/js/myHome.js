Date.prototype.Format = function(fmt)
{ //author: meizz
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
$(function(){
    var storage=window.sessionStorage;
    var json=storage.getItem("userInfo");
    var jsonObj=JSON.parse(json);
    var userId = jsonObj.userInfo._id;
    setTimeout(function(){
        $.ajax({
            type: 'post',
            url: 'http://localhost:3001/user/info',
            data: {
                userId:userId
            },
            dataType: 'json',
            success: function(result){
                $('.username').html(result.userInfo.user_name);
                $('.pass').html(result.userInfo.user_password);
                $('.money').html(result.userInfo.user_money);
                $('.answer').html(result.userInfo.user_answer);
                $('.ques').html(result.userInfo.user_question);
                for(let val of result.user_art){
                    $('.countAll').append(`
                        <div class="countIndex01">
                            <div class="user-info">
                                <span class="user-time">${new Date(val.art_time).Format("yyyy-MM-dd hh:mm:ss")}</span>
                            </div>
                            <p class="count-content">
                                ${val.art_title}
                            </p>
                            <div class="count-btn">
                                <a href="./artical.html?artId=${val._id}">查看评论和问题详情</a>
                            </div>
                        </div>`
                    );
                }
            }
        });
    },0);
});
