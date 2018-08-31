window.onload = function () {
    var storage=window.sessionStorage;
    var json=storage.getItem("userInfo");
    var jsonObj=JSON.parse(json);
    $myPage = document.getElementById("myPage");
    $newQ = document.getElementsByClassName("newQ")[0];
    $alert = document.getElementById("alert");
    $myPage.onclick = function () {
        if(!json){
            $alert.style.display = "block";
        }else{
            window.location.href = './myHome.html';
        }
    };
    $newQ.onclick = function () {
        if(!json){
            $alert.style.display = "block";
        }else{
            window.location.href = './question.html';
        }
    };
    /*window.onbeforeunload = function () {
        storage.clear();
    }*/
};
