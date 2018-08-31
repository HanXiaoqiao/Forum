$(function(){
    var $registerBox = $('#reg');
    var $loginBox = $('#log');
    var storage=window.sessionStorage;
    $registerBox.find('.Login_dla').on('click',function(){
        $.ajax({
            type: 'post',
            url: 'http://localhost:3001/user/register',
            data: {
                username: $registerBox.find('[name="username"]').val(),
                password: $registerBox.find('[name="password"]').val(),
                repassword: $registerBox.find('[name="repassword"]').val()
            },
            dataType: 'json',
            success: function(result){
                $registerBox.find('.colWarning').html(result.message);
                if(!result.code){
                    setTimeout(function () {
                        $loginBox.show();
                        $registerBox.hide();
                    },500);
                }
            }
        });
    });
    //登录
    $loginBox.find('.Login_dla').on('click',function(){
        $.ajax({
            type: 'post',
            url: 'http://localhost:3001/user/login',
            data: {
                username: $loginBox.find('[name="username"]').val(),
                password: $loginBox.find('[name="password"]').val()
            },
            dataType: 'json',
            success: function(result){
                $loginBox.find('.colWarning').html(result.message);
                if(!result.code){
                    var d = JSON.stringify(result);
                    storage.setItem("userInfo",d);
                    setTimeout(function(){
                        window.location.href = './index.html';
                    },500)
                }
            }
        });
    });
});
