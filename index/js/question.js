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
$(function(){
    $('#btnQues').click(function(){
        var storage=window.sessionStorage;
        var json=storage.getItem("userInfo");
        var jsonObj=JSON.parse(json);
        var userId = jsonObj.userInfo._id;
        var username = jsonObj.userInfo.username;
        $.ajax({
            type: 'post',
            url: 'http://localhost:3001/question',
            data: {
                artUser :userId ,
                artName:username,
                artTitle:$("#form1").find('[name="ques_title"]').val(),
                artTime:new Date().Format("yyyy-MM-dd hh:mm:ss"),
                artContent:$("#form1").find('[name="ques_content"]').val(),
                artMoney:$("#form1").find('[name="select"]').val()
            },
            dataType: 'json',
            success: function(result){
                console.log(result);
                $("#form1").find('[name="ques_title"]').val("");
                $("#form1").find('[name="ques_content"]').val("");
                $("#form1").find('[name="select"]').val("");
                $(".tishi p").html(result.message);
            }
        })
    });
});
