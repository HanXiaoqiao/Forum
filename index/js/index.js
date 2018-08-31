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
    var $ulList = document.getElementById("cms_fragment_140_ul");
    var $newAnswer = document.getElementsByClassName("tabNew")[0];
    var $newA = document.getElementById("newAnswer");
    var $tabZ = document.getElementsByClassName("tabZ")[0];
    var $zoomP = document.getElementById("zoomP");
    var $taboff = document.getElementsByClassName("orange")[1];
    var $tabO = document.getElementById("tabE");
    var off1=1,off2=1,off3=1;
    var ajax = new XMLHttpRequest();
    ajax.open('get','http://localhost:3001/hotDoor');
    ajax.send();
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 &&ajax.status==200) {
            let val = eval(ajax.responseText);
            console.log(val);
            for(let value of val){
                let tr = document.createElement('li');
                tr.classList.add("cf","aid0");
                tr.innerHTML = `
                                                            <div>
                                                                <div class="summary-title"><span class="subject"><a title="" desc="标题" id="cms_fragment_140_1_title" href="" target=_blank></a></span></div>
                                                                <div class="showSubtitle summary-subtitle"><span class="subject2" id="cms_fragment_140_1_subject"><a desc="副标题" href="" title="" target=_blank></a></span></div>
                                                                <div class="summary">
                                                                    <span desc="摘要"><div class=s_title><a target=_blank  href="./artical.html?artId=${value._id}"   class=title_pk title='${value.art_title}'>${value.art_title}<span> </span></a></div><div class=s_name><a target=_blank  href=""  class=25820255 name=经济论坛>${value.art_name}</a> <span> </span></div><div class=s_author><a  target=_blank     href="" class=25820255 name=经济论坛> <img  src=http://tx.tianyaui.com/logo/25820255 desc=图片> </a></div><span class=s_text>${value.art_content}</span><div class=s_oprate> <a target=_blank   href="">添加评论</a><span>浏览数（${value.art_see}）</span></div>…</span>
                                                                </div>
                                                                <div class="clear"></div>
                                                            </div>`;
                $ulList.appendChild(tr);
            }
        }
    };
    $newAnswer.onclick = function(){
        if(off1){
            ajax.open('get','http://localhost:3001/newAnswer');
            ajax.send();
            ajax.onreadystatechange = function () {
                if (ajax.readyState==4 &&ajax.status==200) {
                    let val = eval(ajax.responseText);
                    for(let value of val){
                        let tr = document.createElement('li');
                        tr.classList.add("cf","aid0");
                        tr.innerHTML = `<div class="summary">
                                        <span desc="摘要"><a href=# class=favStar></a><h3><a desc=标题 href="./artical.html?artId=${value._id}" title='${value.art_title}' class=title_pk0 target=_blank >${value.art_title}<span> </span></a></h3><div class=s_tag_out><div class=s_tag></div><div class=s_tag_hide>[娱乐, 生活, 家庭]</div><div class=s_tag_link_hide>[358f4b0e25d5c044, 0467cc31d8f68be1, 0dd42fa4db1921ae]</div></div><div class=s_name><span class=t>${new Date(value.art_time).Format("yyyy-MM-dd hh:mm:ss")}</span><span class=u><a target=_blank class=rank200  href="">${art_name}</a></span></div><span class=s_reply data-a=a2 data-b=b1><a target=_blank    href=""> <b>${value.art_answer}</b> <span>回答</span> </a> </span></span><span class="sumLink"><a title="" desc="详细" href="" target=_blank></a></span>
                                    </div>`;
                        $newA.appendChild(tr);
                    }
                }
            };
            off1 = 0;
        }
    };
    $tabZ.onclick = function(){
        if(off2){
            ajax.open('get','http://localhost:3001/zoomP');
            ajax.send();
            ajax.onreadystatechange = function () {
                if (ajax.readyState==4 &&ajax.status==200) {
                    let val = eval(ajax.responseText);
                    for(let value of val){
                        let tr = document.createElement('li');
                        tr.classList.add("cf","aid0");
                        tr.innerHTML = `<div class="summary">
                                        <span desc="摘要"><a href=# class=favStar></a><h3><a desc=标题 href='./artical.html?artId=${value._id}' title='${value.art_title}' class=title_pk0 target=_blank >${value.art_title}<span> </span></a></h3><div class=s_tag_out><div class=s_tag></div><div class=s_tag_hide>[教育]</div><div class=s_tag_link_hide>[1468f81b3d3ef11e]</div></div><div class=s_name><span class=t>${new Date(value.art_time).Format("yyyy-MM-dd hh:mm:ss")}</span><span class=u><a target=_blank class=rank200 id=3114285     href="">${value.art_name}</a></span></div><span class=s_reply><a class=s_reply0 target=_blank    href=""> <b>${value.art_answer}</b> <span>回答</span> </a> </span></span><span class="sumLink"><a title="" desc="详细" href="" target=_blank></a></span>
                                    </div>`;
                        $zoomP.appendChild(tr);
                    }
                }
            };
            off2 = 0;
        }
    };
    $taboff.onclick = function(){
        if(off3){
            ajax.open('get','http://localhost:3001/tabOff');
            ajax.send();
            ajax.onreadystatechange = function () {
                if (ajax.readyState==4 &&ajax.status==200) {
                    let val = eval(ajax.responseText);
                    for(let value of val){
                        let tr = document.createElement('li');
                        tr.classList.add("cf","aid0");
                        tr.innerHTML = `<div class="summary">
                                        <span desc="摘要"><div class=l><a target=_blank type=1  href="./artical.html?artId=${value._id}" title="${value.art_title}" desc=标题>《${value.art_title}》</a> </div><div class=r><span class=s>${value.art_mongey}</span></div></span><span class="sumLink"><a title="" desc="详细" href="" target=_blank></a></span>
                                    </div>`;
                        $tabO.appendChild(tr);
                    }
                }
            };
            off3 = 0;
        }
    };
