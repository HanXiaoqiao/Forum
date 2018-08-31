/**
 * 自定义 Hasmap
 */
function HashMap()
{
    /** Map 大小 **/
    var size = 0;
    /** 对象 **/
    var entry = new Object();

    /** 存 **/
    this.put = function (key , value)
    {
        if(!this.containsKey(key))
        {
            size ++ ;
        }
        entry[key] = value;
    }

    /** 取 **/
    this.get = function (key)
    {
        return this.containsKey(key) ? entry[key] : null;
    }

    /** 删除 **/
    this.remove = function ( key )
    {
        if( this.containsKey(key) && ( delete entry[key] ) )
        {
            size --;
        }
    }

    /** 是否包含 Key **/
    this.containsKey = function ( key )
    {
        return (key in entry);
    }

    /** 是否包含 Value **/
    this.containsValue = function ( value )
    {
        for(var prop in entry)
        {
            if(entry[prop] == value)
            {
                return true;
            }
        }
        return false;
    }

    /** 所有 Value **/
    this.values = function ()
    {
        var values = new Array();
        for(var prop in entry)
        {
            values.push(entry[prop]);
        }
        return values;
    }

    /** 所有 Key **/
    this.keys = function ()
    {
        var keys = new Array();
        for(var prop in entry)
        {
            keys.push(prop);
        }
        return keys;
    }

    /** Map Size **/
    this.size = function ()
    {
        return size;
    }

    /** 清空 **/
    this.clear = function ()
    {
        size = 0;
        entry = new Object();
    }
}

/**
 * 弹出下拉菜单函数
 * 弹出下拉菜单命名规则：激活弹出菜单的父元素id=XXXX,则弹出菜单id=XXXXPop
 * 弹出菜单一律带有属性：ctype=static-pop-fragment
 * 弹出激活方式是：鼠标悬停在弹出菜单的父元素上
 */
(function(window){
    PopMenu = function(){
        this.toShowTargetPop = null;
        this.targetMenuTimer = null;
        this.isPopShow = false;
        this.map = new HashMap();
    };

    PopMenu.prototype = {
        initPopMenu : function(){
            var _self = this;

            //登录显示判断
            //this.login();
            //设置父级宽度和定位，利于弹出元素定位hainan_online_head_container
            var parent = jQuery("[ctype='static-pop-click-fragment']").closest("[id*='control']");
            if(!parent.length) parent = jQuery("[ctype='static-pop-click-fragment']").closest("[id*='hainan_online_head_container']");
            if(!parent.length) return;
            //parent.css({position:"relative",width:"950px",margin:"0px auto"});
            var parentLeft = parent.offset() != null ? parent.offset().left : 0;
            var parentTop = parent.offset() != null ? parent.offset().top : 0;
            //鼠标悬停弹出菜单类
            if(jQuery("[ctype='static-pop-hover-fragment']").size() > 0){

                jQuery("[ctype='static-pop-hover-fragment']").each(function(){
                    var showTargetPop = jQuery(this);
                    var parentId = jQuery(this).attr("id").replace("Pop","");
                    //把相应的弹出菜单和父元素绑定到一起
                    _self.map.put(parentId,showTargetPop);
                    //初次进来，隐藏弹出菜单
                    jQuery(this).hide();

                    //鼠标悬停在弹出菜单父元素上
                    jQuery("#" + parentId).hover(function(e){
                        var id = jQuery(this).attr("id");
                        //取得和父元素相对应的pop菜单
                        var targetPop = _self.map.get(jQuery(this).attr("id"));

                        var offset = jQuery(this).offset();
                        targetPop.css({position:"absolute",top:offset.top - parentTop + jQuery(this).height(),left:offset.left - parentLeft});
                        targetPop.show();

                        _self.isPopShow  = true;
                        _self.toShowTargetPop = targetPop;

                        _self.hideOthers();
                    },function(){
                        _self.isPopShow  = false;
                        _self.hideTarget();
                    });

                    //鼠标悬停在弹出菜单上
                    jQuery(this).hover(function(e){
                        jQuery(this).show();
                        _self.isPopShow = true;
                        _self.toShowTargetPop = jQuery(this);
                    },function(){
                        _self.isPopShow = false;
                        _self.hideTarget();
                    });

                    //手动关闭弹出菜单
                    jQuery(this).find("#close").click(function(){
                        jQuery(this).closest("[ctype*='static-pop']").hide();
                    });

                    //悬停在弹出菜单内容之上的背景色
                    jQuery(this).find("li").each(function(){
                        jQuery(this).hover(function(){
                            jQuery(this).addClass("hover-class2");
                        },function(){jQuery(this).removeClass("hover-class2");})
                    });
                });
            }

            //鼠标点击弹出菜单类
            if(jQuery("[ctype='static-pop-click-fragment']").size() > 0){
//				//设置父级宽度和定位，利于弹出元素定位
//				parent.css({position:"relative",width:"950px",margin:"0px auto"});
//				var parentLeft = parent.offset().left;

                jQuery("[ctype='static-pop-click-fragment']").each(function(){
                    var showTargetPop = jQuery(this);
                    var parentId = jQuery(this).attr("id").replace("Pop","");
                    _self.map.put(parentId,showTargetPop);
                    //初次进来，隐藏弹出菜单
                    jQuery(this).hide();

                    //鼠标悬停在弹出菜单父元素上
                    jQuery("#" + parentId).click(function(e){
                        var id = jQuery(this).attr("id");
                        //取得和父元素相对应的pop菜单
                        var targetPop = _self.map.get(jQuery(this).attr("id"));

                        var offset = jQuery(this).offset();
                        targetPop.css({position:"absolute",top:offset.top - parentTop + jQuery(this).height(),left:offset.left - parentLeft - showTargetPop.width() +  jQuery(this).width()});
                        targetPop.show();
                        _self.isPopShow  = true;
                        _self.toShowTargetPop = targetPop;

                        _self.hideOthers();
                    });

                    //手动关闭弹出菜单
                    jQuery(this).find("#close").click(function(){
                        jQuery(this).closest("[ctype*='static-pop']").hide();
                    });

                    //悬停在弹出菜单内容之上的背景色
                    jQuery(this).find("li").each(function(){
                        jQuery(this).hover(function(){
                            jQuery(this).addClass("hover-class1");
                        },function(){jQuery(this).removeClass("hover-class1");})
                    });
                });
            }
        },
        //保证一次只显示一个弹出菜单
        hideOthers : function(){
            for(var i=0;i < this.map.values().length; i++){
                if(this.map.values()[i] != this.toShowTargetPop){
                    this.map.values()[i].hide();
                }
            }
        },
        //移开鼠标，隐藏弹出菜单
        hideTarget : function(){
            var _self = this;
            if(this.targetMenuTimer!=null){
                window.clearTimeout(this.targetMenuTimer);
            }
            this.targetMenuTimer = window.setTimeout(function(){
                if(!_self.isPopShow){
                    _self.toShowTargetPop.hide();
                }
            },1500);
        }
//		login: function(){
//			if(typeof __global != "undefined"){
//				if(!__global.isOnline()){
//					jQuery("#login").attr("style","display:block;");
//					jQuery("#logId").attr("style","display:none;");
//
//					jQuery("#regist").attr("style","display:block;");
//					jQuery("#logout").attr("style","display:none;");
//				}else{
//					jQuery("#logId").text(__global.getUserName());
//					jQuery("#logId").attr("style","display:block;");
//					jQuery("#login").attr("style","display:none;");
//
//					jQuery("#regist").attr("style","display:none;");
//					jQuery("#logout").attr("style","display:block;");
//				}
//			}
//		}
    };

    window.PopMenu=PopMenu;
    if(window.addEventListener){
        window.addEventListener("load",function(){new PopMenu().initPopMenu();},false);
    }else if(window.attachEvent){
        window.attachEvent('onload', function(){new PopMenu().initPopMenu()});
    }
})(window);
//登录显示判断
jQuery(function() {
    if(jQuery("body").find("div[ftype='static-hainan-navigation'],div[id*='online_head']").length > 0){
        jQuery("div[ftype='static-hainan-navigation'],div[id*='online_head']").ready(function(){
            if(typeof __global != "undefined"){
                if(!__global.isOnline()){
                    jQuery("#login").show();
                    jQuery("#logId").hide();

                    jQuery("#regist").show();
                    jQuery("#logout").hide();
                }else{
                    jQuery("#logId").text(__global.getUserName());
                    jQuery("#logId").show();
                    jQuery("#logId").attr("src","http://my.tianya.cn/").attr("target","_blank");
                    jQuery("#login").hide();

                    jQuery("#regist").hide();
                    jQuery("#logout").show();
                }
            }
        });
    }
});

//tab栏目框函数 by sunjihao
(function(window){
    function ty_cms_template_visualTe(event,selector){
        try{
            //if(!selector)selector="[ctype='static-tab-column-fragment']";
            //jQuery(selector).each(
            jQuery(".tui-tabsection").each(
                function(){
                    var eventType=jQuery(this).attr("eventType");
                    var lis=jQuery(this).children(".hd").children("ul").find("li");
                    var bds=jQuery(this).children(".static-tab-column-bd").children(".bd");
                    if(eventType){
                        if(eventType && eventType=="mouseover")eventType="mouseenter";
                        for(var i=0;i<lis.size();++i){
                            var li=jQuery(lis.get(i));
                            li.attr("order",i);
                            if(i == 0){//默认选择第一项
                                li.removeClass("taboff").addClass("tabon");
                                bds.eq(i).show();
                            }else{
                                li.removeClass("tabon").addClass("taboff");
                                bds.eq(i).hide();
                            }
                            li.bind(eventType,function(){
                                var _this=jQuery(this);
                                var hd=null;
                                _this.parent().find("li").each(
                                    function(){
                                        if(jQuery(this).attr("class").indexOf("tabon")>-1){
                                            if(jQuery.browser.msie && jQuery.browser.version==7){
                                                //前端服务器上的版本需要注释这一行
                                                //hd=bds.eq(jQuery(this).attr("order")).height()+parseInt(bds.get(jQuery(this).attr("order")).currentStyle.borderBottomWidth)+parseInt(bds.get(jQuery(this).attr("order")).currentStyle.borderTopWidth);
                                            }
                                            else hd=bds.eq(jQuery(this).attr("order")).height();
                                        }
                                        jQuery(this).removeClass("tabon").addClass("taboff");
                                    }
                                );
                                _this.removeClass("taboff");
                                _this.addClass("tabon");//tabon
                                for(var j=0;j<bds.size();++j){
                                    if(j==_this.attr("order")){
                                        //jQuery(bds.get(j)).height(hd).show();//前端服务器上的版本需要注释这一行
                                        jQuery(bds.get(j)).show();//前端服务器上的版本不需要注释这一行
                                    }
                                    else {
                                        jQuery(bds.get(j)).hide();
                                    }
                                }
                            });
                        }}
                }
            );
        }catch(e){}
        /**前端服务器注释下面4行------
         if ( window.document.addEventListener ) {
		window.document.removeEventListener( "DOMContentLoaded", ty_cms_template_visualTe, false );
	} else if ( window.document.attachEvent ) {
		window.document.detachEvent( "onreadystatechange", ty_cms_template_visualTe);
	}*/

    }

    window.ty_cms_template_visualTe=ty_cms_template_visualTe; //前端服务器放开
    /**前端服务器注释下面7行------
     if( window.document.addEventListener ){
  	 window.document.addEventListener( "DOMContentLoaded", ty_cms_template_visualTe, false );
  	  window.addEventListener( "load", ty_cms_template_visualTe, false );
  }else if( window.document.attachEvent ){
     window.document.attachEvent("onreadystatechange", ty_cms_template_visualTe);
	 window.attachEvent('onload', ty_cms_template_visualTe);
  }*/
    /**前端服务器放开这个注释*/
    window.jQuery(document).ready(
        function(){
            window.ty_cms_template_visualTe();
        }
    );
})(window);
/***
 * by sunjihao
 * 调用接口 elementsScrollor.scroll(selector,config);
 *  //调用例子 1、elementsScrollor.scroll("#tt ul li",{showNbr:4,interval:2000});
 *  2、 elementsScrollor.scroll(jQuery("#tt ul li"),{showNbr:2,interval:3000});
 *  selector jQuery选择器出同级元素，字符串，config目前接受两个参数，showNbr,interval
 *
 * */
function elementsScrollor(selector,config){
    this.selector=selector;
    this.elemArray=[];
    this.parentOb=jQuery(selector).parent();
    this.divParentOb=jQuery(selector).closest("div");
    this.divParentObHd=0;
    this.firstElemHd=0;
    this.config={
        showNbr:2,
        interval:10000,
        speed:"slow",
        direction:"down",
        fade:true,
        scrollPx:0,
        scrollNbr:1,
        keepMarginTop:false //是否保持原来的margin-top  如果保持的话，会使动画出现弹跳
    };
    this.hideElemQueue=new Array();//隐藏数组
    this.showElemQueue=new Array();//展现数组
    if(this.selector.length==0)return;

    //初始化
    (function init(){
        //初始化config
        if( config ) {
            var config_param;

            for( config_param in config ){
                this.config[config_param]=config[config_param];
            }
        }
        //入数组
        var arr=[];
        var i=0;
        jQuery(selector).each(
            function(){
                arr[i++]=jQuery(this);
            }
        );
        this.elemArray=arr;
        if(this.config.fade){
            for(var i=0;i<this.elemArray.length;i++){
                this.elemArray[i].height(this.elemArray[i].height()+"px");
                var tempHtml=this.elemArray[i].html();
                this.elemArray[i].html("<div></div>");
                this.elemArray[i].children().html(tempHtml);
                if(i<this.config.showNbr){
                    this.elemArray[i].show();
                    this.parentOb.append(this.elemArray[i]);
                    this.showElemQueue.push(this.elemArray[i]);
                    this.divParentObHd+=this.elemArray[i].outerHeight();
                }
                else {
                    this.elemArray[i].remove();
                    this.hideElemQueue.push(this.elemArray[i]);
                }
            }
        }else {
            for(var i=0;i<this.elemArray.length;i++){
                if(i<this.config.showNbr){
                    this.showElemQueue.push(this.elemArray[i]);
                    var ElmHd=0;
                    if( !this.config.scrollPx ){
                        ElmHd = this.elemArray[i].height()+(this.elemArray[i].css("margin-top")=="auto"?0:parseInt(this.elemArray[i].css("margin-top")))*2;
                    }
                    else  {
                        ElmHd = this.config.scrollPx
                    }
                    this.divParentObHd+=ElmHd;
                }
                else {
                    this.hideElemQueue.push(this.elemArray[i]);
                }
            }
        }
    }).call(this);
}

elementsScrollor.prototype.setStyle=function(){
    //设置高度度
    if(this.divParentOb.attr("style")==undefined||this.divParentOb.attr("style").indexOf("height")<0){
        if(this.config.fade){
            if( this.divParentOb.closest("div.bd").size() ){
                this.divParentObHd=this.divParentOb.closest("div.bd").height();
                this.divParentOb.css("height",this.divParentObHd+"px");
            }else {
                //this.divParentObHd=this.divParentOb.height();
                this.divParentOb.css("height",this.divParentObHd+"px");
            }
        }else{
            this.divParentOb.height(this.divParentObHd);
        }
    };

    this.divParentOb.css("overflow","hidden");

    if(this.config.fade){
        //加DIV层
        var coverDiv=jQuery('<div class="bottomcover"></div>');
        var bottomcover = [//"background:url(/template_base/images/halftransp.png) no-repeat scroll 0 -5px transparent;",
            "position:absolute;",
            "height:30px;",
            "z-index:1;",
            "_background:none;",
            "_filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='halftransp.png',sizingMethod='crop');"];
        bottomcover = bottomcover.join("");
        coverDiv.attr("style",bottomcover);
        if( this.divParentOb.closest("div.bd").size() )coverDiv.css("top",this.divParentOb.closest("div.bd").offset().top+this.divParentOb.closest("div.bd").height()-20+"px");
        else coverDiv.css("top",this.divParentOb.offset().top+this.divParentOb.height()-20+"px");
        coverDiv.css("width",this.divParentOb.width()+"px");
        coverDiv.insertAfter(this.parentOb);
    }
    //为让滚动效果平滑，将li的上外边距去掉
    if(!this.keepMarginTop&&this.config.fade){
        for(var i=0;i<this.elemArray.length;++i){
            this.elemArray[i].css("margin-top","0");
        }
    }
}

elementsScrollor.prototype.getHideElemQueue=function(){
    return this.hideElemQueue;
}

elementsScrollor.prototype.getShowElemQueue=function(){
    return this.showElemQueue;
}

elementsScrollor.prototype.swapElement=function(){
    var tmpObj=this.showElemQueue.pop();
    this.hideElemQueue.push(tmpObj);
    var hideElem=this.hideElemQueue.shift();
    this.showElemQueue.unshift(hideElem.hide());
    return {hide:hideElem,show:tmpObj};
}

elementsScrollor.prototype.bindMouseEvent=function(){
    var obj=this;
    obj.divParentOb.bind("mouseover",
        function(event){
            window.clearInterval(elementsScrollor[obj.selector+"_timer"]);
            return false;
        }
    ).bind("mouseout",
        function(event){
            window.clearInterval(elementsScrollor[obj.selector+"_timer"]);
            elementsScrollor[obj.selector+"_timer"]=window.setInterval("elementsScrollor['"+obj.selector+"'].start()",obj.config.interval);
            return false;
        }
    );

}

elementsScrollor.prototype.start=function(){
    var _this=this;
    if(this.config.fade){
        var eles=this.swapElement();
        eles.hide.children().hide();
        this.parentOb.prepend(eles.hide.css("margin-bottom","0"));
        eles.hide.slideDown(this.config.speed,function(){
            eles.hide.children().fadeIn("slow");
        });
    }else {
        var firstElem=this.parentOb.children().first();
        var firstElemMargin=firstElem.css("margin-top")=="auto"?0:parseInt(firstElem.css("margin-top"));
        if( !this.config.scrollPx )this.firstElemHd=firstElem.height()+firstElemMargin*2;
        else this.firstElemHd = this.config.scrollPx;
        var parentObMarginTp=this.parentOb.css("margin-top")=="auto"?0:parseInt(this.parentOb.css("margin-top"));
        var slideHd=parentObMarginTp-this.firstElemHd;
        this.parentOb.animate({marginTop:slideHd},_this.config.speed,null,function(){
            if(_this.config.scrollNbr==1) {
                firstElem.remove().appendTo(_this.parentOb);
            }
            else {
                for( var i=0;i<_this.config.scrollNbr;i++ ){
                    _this.parentOb.children().first().remove().appendTo(_this.parentOb);
                }
            }
            _this.parentOb.css("margin-top",parentObMarginTp+"px");
        });
    }

}
elementsScrollor.scroll=function(selector,config){
    if(elementsScrollor[selector+"_timer"]!==undefined||elementsScrollor[selector+"_timer"]){
        window.clearInterval(elementsScrollor[selector+"_timer"]);
    }
    if(typeof selector==="string"){
        elementsScrollor[selector]=new elementsScrollor(selector,config);
        if(elementsScrollor[selector].getHideElemQueue().length==0)return;
        elementsScrollor[selector].setStyle();
        elementsScrollor[selector].start();
        elementsScrollor[selector].bindMouseEvent();
        elementsScrollor[selector+"_timer"]=window.setInterval("elementsScrollor['"+selector+"'].start()",elementsScrollor[selector].config.interval);
        return elementsScrollor[selector+"_timer"];
    }
}

elementsScrollor.stop = function ( selector ){
    window.clearInterval(elementsScrollor[selector+"_timer"]);
}

/***
 * by sunjihao
 图片翻滚函数
 适用文档结构如下

 <body>
 <div class="bd ui-resizable" style="float:left;width:700px;">
 <div onmouseout="this.className=''" onmouseover="this.className='selected'" id="efpListLeftArr" class=""></div>
 <div class="tui-pic-list pic-b_1 cf" style="float:left;">
 <ul class="scrollPicElements" style="width:1000px;">
 <li>
 <a href="#"><img style="width:120px;height:90px;" src="1.jpg"></a>
 <h3 class="subject"><a href="#">图片标题</a></h3>
 </li>
 <li style="">
 <a href="#"><img style="width:120px;height:90px;" src="4010.jpg"></a>
 <h3 class="subject"><a href="#">图片标题</a>
 </h3>
 </li>
 <li style="">
 <a href="#"><img style="width:120px;height:90px;" src="2.jpg"></a>
 <h3 class="subject"><a href="#">图片标题</a></h3>
 </li>
 <li style="">
 <a href="#"><img style="width:120px;height:90px;" src="3.jpg"></a>
 <h3 class="subject"><a href="#">图片标题</a></h3>
 </li>
 </ul>
 </div>
 <div onmouseout="this.className=''" onmouseover="this.className='selected'" id="efpListRightArr" style="float:left;"></div>
 </div>
 </body>
 使用方式如下
 <script type="text/javascript">
 ty_cms_template_picElementsScroll.scroll(".scrollPicElements li",{leftButton:"#efpListLeftArr",rightButton:"#efpListRightArr",showNbr:3});
 </script>
 * */

function ty_cms_template_picElementsScroll(selector,config){
    if(!selector)return;
    //debugger;
    this.selector=selector;
    this.divParentOb=jQuery(selector).closest("div");
    this.parentOb=jQuery(selector).parent();
    this.divParentOb.addClass("picScrollParentDiv");
    this.parentOb.addClass("picScrollParent");
    this.elemMargin=0;
    this.elemMarginV=0;
    var instance=this;
    jQuery(selector).each(
        function(){
            jQuery(this).css("width","");
            jQuery(this).addClass("picMargin");
            instance.elemMargin=parseFloat(jQuery(this).css("margin-left"));
            instance.elemMarginV=parseFloat(jQuery(this).css("margin-top"));
        }
    );
    this.elemWidth = jQuery(selector).width();
    jQuery(selector).each(
        function (){
            var targetElement = jQuery( this );
            jQuery( this ).ready( function(){
                instance.elemWidth =  targetElement.width();//加载完成才取得宽度
                targetElement.width( targetElement.width() );
            } );
            jQuery(this).width(jQuery(this).width());
        } );
    this.elemHd=jQuery(selector).height();
    this.leftButtonObj=null;
    this.rightButtonObj=null;
    this.elemCt=jQuery(selector).size();
    this.firstElem=jQuery(selector).first();
    this.lastElem=jQuery(selector).last();
    this.orgClientX=0;//存放模拟滚动条鼠标元素的x位置
    this.scrollBarIconLeft=0;//模拟滚动条的left
    this.scrollBarLeftMax=0;//模拟滚动条能滚动的左边最大距离
    this.scrollBarRightMax=0;//模拟滚动条能滚动的右边的最大距离
    this.rate=0;
    this.scrollBar=null;
    this.scrollBarIcon=null;
    this.config={
        showNbr:3,
        speed:3000,
        director:"H",//H 横向  V 纵向
        pageSize:0,
        isAutoScroll:true,
        leftButton:null,
        leftButtonV:null,
        rightButtonV:null,
        rightButton:null,
        autoScrollSped:1000,
        autoScrollInterval:5000,
        showScrollBar:false,
        starNum:0
    };
    this.scrollWhere={
        R:"R",
        L:"L",
        B:"B",
        T:"T"
    };
    if( config ) {

        for( var config_param in config ){
            this.config[config_param]=config[config_param];
        }
    }


}

ty_cms_template_picElementsScroll.prototype.InstanceUtil = function (){
    var instant=this;
    return{
        //div 与ul 右边距 距离

        rightInstance:(this.parentOb.offset().left+this.parentOb.width())-(this.divParentOb.offset().left+this.divParentOb.width()),
        //div 与ul 下边距 距离
        bottomInstance:(this.parentOb.offset().top+this.parentOb.height())-(this.divParentOb.offset().top+this.divParentOb.height()),
        //div 与 ul 左边距 距离
        leftInstance:this.divParentOb.offset().left-this.parentOb.offset().left,
        //div 与 ul 上边距 距离
        topInstance:this.divParentOb.offset().top-this.parentOb.offset().top,
        //每页的宽度或长度
        pageInstance:function(){
            if( instant.config.pageSize ==0 ){
                return instant.config.director==="H"?instant.config.showNbr*(instant.elemWidth+instant.elemMargin*2):instant.config.showNbr*(instant.elemHd+instant.elemMarginV*2);
            }
            else {
                return instant.config.director==="H"?instant.config.pageSize*(instant.elemWidth+instant.elemMargin*2):instant.config.pageSize*(instant.elemHd+instant.elemMarginV*2);
            }
        }
    }

}
//图片展示的时候，设定其实图片位置
ty_cms_template_picElementsScroll.prototype.showInit=function(){
    var _startNum = this.config.starNum;
    var _this = this;
    if(_startNum > 0){
        if( _this.config.isAutoScroll ){window.clearInterval(ty_cms_template_picElementsScroll[ _this.selector+"_timer"]);}
        //初始化图片滚动参数
        if( _this.config.director === "H" ) _this.start(_this.scrollWhere.L);
        else if ( _this.config.director === "V" ) _this.start(_this.scrollWhere.B);
        var pageInstance = _this.config.director==="H" ? _startNum*(_this.elemWidth+_this.elemMargin*2) : _startNum*(_this.elemHd+_this.elemMarginV*2);
        //初始化开始显示图片
        jQuery(_this.parentOb).stop();
        var mod = 0;
        var rightIns = _this.InstanceUtil().rightInstance;
        var adust = (pageInstance - rightIns > 0) ? parseFloat(_this.divParentOb.width()) : parseFloat(_this.divParentOb.width())/2;
        if( _this.config.director === "H" ){//横着滚动
            //_this.adust(_this.scrollWhere.L,pageInstance,200);
            if(pageInstance > _this.divParentOb.width() ) mod = parseFloat(pageInstance) - adust;
            _this.parentOb.animate({left: "-" + mod + "px"},"fast","swing",function(){
                if(_this.InstanceUtil().rightInstance<=0)ty_cms_template_picElementsScroll["toWhere"]=_this.scrollWhere.R;
            });
        }else{//竖着滚动
            if(pageInstance > _this.divParentOb.width() ) mod = parseFloat(pageInstance) - adust;
            _this.parentOb.animate({top: "-" + mod + "px"},"fast","swing",function(){
                if(_this.InstanceUtil().rightInstance<=0)ty_cms_template_picElementsScroll["toWhere"]=_this.scrollWhere.B;
            });
        }
        if( _this.config.isAutoScroll ){
            ty_cms_template_picElementsScroll[ _this.selector+"_timer"]=window.setInterval(function(){
                    ty_cms_template_picElementsScroll[ _this.selector].autoScroll();},
                ty_cms_template_picElementsScroll[ _this.selector].config.autoScrollInterval);
        }

    }
}

ty_cms_template_picElementsScroll.scroll=function(selector,config){
    if(typeof selector === "string"){//有滚动按钮，则注册滚动事件
        ty_cms_template_picElementsScroll[selector]=new ty_cms_template_picElementsScroll(selector,config);
        ty_cms_template_picElementsScroll[selector].setStyle();
        ty_cms_template_picElementsScroll[selector].regScrollEvnt();
        ty_cms_template_picElementsScroll[selector].showInit();
        ty_cms_template_picElementsScroll[selector].config.director==="H"?ty_cms_template_picElementsScroll["toWhere"]=ty_cms_template_picElementsScroll[selector].scrollWhere.L:ty_cms_template_picElementsScroll["toWhere"]=ty_cms_template_picElementsScroll[selector].scrollWhere.T;
        if(ty_cms_template_picElementsScroll[selector+"_timer"])window.clearInterval(ty_cms_template_picElementsScroll[selector+"_timer"]);
        if(ty_cms_template_picElementsScroll[selector].config.isAutoScroll){
            ty_cms_template_picElementsScroll[selector+"_timer"]=window.setInterval(
                function(){
                    ty_cms_template_picElementsScroll[selector].autoScroll();
                },
                ty_cms_template_picElementsScroll[selector].config.autoScrollInterval);
            return ty_cms_template_picElementsScroll[selector+"_timer"];
        }
    }
}

ty_cms_template_picElementsScroll.stop = function (selector){
    window.clearInterval(ty_cms_template_picElementsScroll[selector+"_timer"]);
}

ty_cms_template_picElementsScroll.prototype.setScrollBar = function (){
    if( !this.config.showScrollBar )return;
    if(this.config.director==="H"&&this.scrollBar==null){
        this.scrollBar=jQuery("<div>&nbsp;</div>").addClass("picListScrollBar");
        var _this=this;
        this.scrollBarIcon=jQuery("<div></div>").addClass("picListScrollBarIcon");
        this.scrollBar.append(this.scrollBarIcon);
        this.divParentOb.eq(0).append(_this.scrollBar);
        _this.scrollBar.width(this.divParentOb.width());
        _this.scrollBar.css("top",this.divParentOb.height()-20+"px");
        //对ie7做特殊处理
        _this.scrollBarIcon.css("top","0px");
        if(jQuery.browser.msie && jQuery.browser.version==7){
            _this.parentOb.css("position","absolute");
        }
        //_this.scrollBar.hide();//Let the scrollbar show aways!
        this.regScrollBarEvent();
    }else if(this.scrollBar){
        //设置滚动条的初始位置
        this.rate=(this.parentOb.width()-this.divParentOb.width())/(this.scrollBar.width()-this.scrollBarIcon.width());
        var iconLeft=this.InstanceUtil().leftInstance/this.rate;
        this.scrollBarIconLeft=iconLeft;
        this.scrollBarIcon.css("left",iconLeft+"px");
        this.scrollBarLeftMax=parseFloat(this.scrollBarIcon.css("left"));
        this.scrollBarRightMax=this.scrollBar.width()-parseFloat(this.scrollBarIcon.css("left"))-this.scrollBarIcon.width();
        this.scrollBar.show();
    }
}

ty_cms_template_picElementsScroll.setScrollBar = function( jParentOb,jScrollElem ){
    var scrollBar=jQuery("<div>&nbsp;</div>").addClass("picListScrollBar");
    var scrollBarIcon=jQuery("<div></div>").addClass("picListScrollBarIcon");
    if( jParentOb.width()>=jScrollElem.width() )return;

    scrollBar.append( scrollBarIcon );
    jParentOb.append( scrollBar );
    scrollBar.width( jParentOb.width());
    //scrollBar.css("top",jParentOb.height()-20+"px");
    scrollBarIcon.css("top","0px");

    ty_cms_template_picElementsScroll.scrollBar = scrollBar;
    ty_cms_template_picElementsScroll.scrollBarIcon = scrollBarIcon;
    var scrollBarIconLeft = ty_cms_template_picElementsScroll.scrollBarIconLeft = 0;
    var scrollBarLeftMax = ty_cms_template_picElementsScroll.scrollBarLeftMax = parseFloat(scrollBarIcon.css("margin-left")==="auto"?"0":scrollBarIcon.css("margin-left"));
    var scrollBarRightMax = ty_cms_template_picElementsScroll.scrollBarRightMax = scrollBar.width()-parseFloat(scrollBarIcon.css("margin-left")==="auto"?"0":scrollBarIcon.css("margin-left"))-scrollBarIcon.width();
    ty_cms_template_picElementsScroll.rate = ( jScrollElem.width()-jParentOb.width())/(scrollBar.width()-scrollBarIcon.width());
    (function regScrollBarEvent(){
        var canMove,orgClientX=0;
        scrollBarIcon.bind("mousedown",function(event){
                var _event=event?event:window.event;
                canMove=true;
                orgClientX=parseFloat(_event.clientX);
                if(this.setCapture)this.setCapture();
                else if(window.captureEvents)
                    window.captureEvents(Event.MOUSEUP);
            }
        ).bind("mousemove",function(event){
            if(canMove){
                var _event=event?event:window.event;
                var left=parseFloat(_event.clientX)-orgClientX;
                if((left<=0&&-left<=ty_cms_template_picElementsScroll.scrollBarLeftMax)||(left>=0&&left<=ty_cms_template_picElementsScroll.scrollBarRightMax)){
                    jQuery(this).css("margin-left",ty_cms_template_picElementsScroll.scrollBarIconLeft+left+"px");//orgLeft+
                    jScrollElem.css("margin-left",-(ty_cms_template_picElementsScroll.scrollBarIconLeft+left)*ty_cms_template_picElementsScroll.rate+"px");
                }
            }
        }).bind("mouseup",function(event){
            ty_cms_template_picElementsScroll.scrollBarIconLeft=jQuery(this).css("margin-left")=="auto"?0:parseFloat(jQuery(this).css("margin-left"));
            ty_cms_template_picElementsScroll.scrollBarLeftMax = parseFloat(jQuery(this).css("margin-left")=="auto"?"0":jQuery(this).css("margin-left"));
            ty_cms_template_picElementsScroll.scrollBarRightMax = scrollBar.width()-parseFloat(jQuery(this).css("margin-left")=="auto"?"0":jQuery(this).css("margin-left"))-jQuery(this).width();
            canMove=false;
            //debugger;
            if(this.releaseCapture)this.releaseCapture();
            else if(window.releaseEvents)window.releaseEvents(Event.MOUSEDOWN);
            if(parseFloat(jQuery(this).css("margin-left"))<0)jQuery(this).css("margin-left","0px");
            ty_cms_template_picElementsScroll.rate = ( jScrollElem.width()-jParentOb.width())/(scrollBar.width()-jQuery(this).width());
        });
    })();
}

ty_cms_template_picElementsScroll.adjustScrollBar = function( jParentOb,jScrollElem ){
    if( ty_cms_template_picElementsScroll.scrollBar ){

        var scrollBar = ty_cms_template_picElementsScroll.scrollBar ;
        var scrollBarIcon = ty_cms_template_picElementsScroll.scrollBarIcon ;
        var scrollBarLeftMax = ty_cms_template_picElementsScroll.scrollBarLeftMax ;
        var scrollBarRightMax = ty_cms_template_picElementsScroll.scrollBarRightMax ;
        //设置滚动条的初始位置
        ty_cms_template_picElementsScroll.rate =( jScrollElem.width()-jParentOb.width())/(scrollBar.width()-scrollBarIcon.width());

        var iconLeft=(jParentOb.offset().left-jScrollElem.offset().left)/ty_cms_template_picElementsScroll.rate;

        if( iconLeft  >= scrollBar.width() - scrollBarIcon.width() ){
            iconLeft=scrollBar.width() - scrollBarIcon.width();
        }

        ty_cms_template_picElementsScroll.scrollBarIconLeft = iconLeft;
        scrollBarIcon.css("margin-left",iconLeft+"px");
        ty_cms_template_picElementsScroll.scrollBarLeftMax = parseFloat(scrollBarIcon.css("margin-left"));
        ty_cms_template_picElementsScroll.scrollBarRightMax = scrollBar.width()-parseFloat(scrollBarIcon.css("margin-left"))-scrollBarIcon.width();
    }
}

ty_cms_template_picElementsScroll.prototype.regScrollBarEvent = function (){
    var canMove,_this=this;

    this.scrollBarIcon.bind("mousedown",function(event){
            var _event=event?event:window.event;
            canMove=true;
            var firstMove=_this.orgClientX==0?true:false;
            _this.orgClientX=parseFloat(_event.clientX);
            if(this.setCapture)this.setCapture();
            else if(window.captureEvents)
                window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
        }
    ).bind("mousemove",function(event){
        if(canMove){
            var _event=event?event:window.event;
            var left=parseFloat(_event.clientX)-_this.orgClientX;
            if((left<=0&&-left<=_this.scrollBarLeftMax)||(left>=0&&left<=_this.scrollBarRightMax)){
                _this.scrollBarIcon.css("left",_this.scrollBarIconLeft+left+"px");//orgLeft+
                _this.parentOb.css("left",-(_this.scrollBarIconLeft+left)*_this.rate+"px");
            }
        }
    }).bind("mouseup",function(event){
        _this.scrollBarIconLeft=_this.scrollBarIcon.css("left")=="auto"?0:parseFloat(_this.scrollBarIcon.css("left"));
        canMove=false;
        if(this.releaseCapture)this.releaseCapture();
        else if(window.captureEvents)window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
        if(parseFloat(jQuery(this).css("left"))<0)jQuery(this).css("left","0px");
    });
}


ty_cms_template_picElementsScroll.prototype.regScrollEvnt = function (lButton,rButton){
    var picScrl=this;
    //picScrl.setScrollBar();
    if ( !this.config.isAutoScroll  ){
        this.divParentOb.bind("mouseenter",
            function(){picScrl.setScrollBar();}).bind(
            "mouseleave",
            function(event){
                //debugger;
                var _event=event?event:window.event;
                if(picScrl.config.showScrollBar) picScrl.scrollBar.hide();
            }
        );

    }
    if( this.config.isAutoScroll ){
        this.divParentOb.bind(
            "mouseenter",
            function(){
                picScrl.setScrollBar();
                jQuery(picScrl.parentOb).stop();
                window.clearInterval(ty_cms_template_picElementsScroll[picScrl.selector+"_timer"]);
            }
        ).bind(
            "mouseleave",
            function(event){
                // picScrl.autoScroll();
                /**
                 if(ty_cms_template_picElementsScroll["toWhere"]=="R"||ty_cms_template_picElementsScroll["toWhere"]=="B"){
			      	picScrl.leftButtonObj.trigger("mouseup");
			      }else {
			        picScrl.rightButtonObj.trigger("mouseup");
			      }*/
                picScrl.config.director==="H"?jQuery(this).css("overflow-x",""):jQuery(this).css("overflow-y","");
                window.clearInterval(ty_cms_template_picElementsScroll[picScrl.selector+"_timer"]);
                if(picScrl.config.isAutoScroll){
                    ty_cms_template_picElementsScroll[picScrl.selector+"_timer"]=window.setInterval(
                        function(){
                            ty_cms_template_picElementsScroll[picScrl.selector].autoScroll();
                        },
                        ty_cms_template_picElementsScroll[picScrl.selector].config.autoScrollInterval);

                }
                var _event=event?event:window.event;
                //if(picScrl.config.showScrollBar)picScrl.scrollBar.hide();
            }
        );
    }
    if ( this.config.leftButton ){
        this.leftButtonObj=jQuery(this.config.leftButton);
        jQuery(this.config.leftButton).attr("title","上翻").bind(
            "mousedown",
            function(){
                if( picScrl.config.director === "H" )picScrl.start(picScrl.scrollWhere.R);
                else if ( picScrl.config.director === "V" )picScrl.start(picScrl.scrollWhere.B)
            }
        ).bind(
            "mouseup",
            function(){
                jQuery(picScrl.parentOb).stop();
                picScrl.config.director==="H"?picScrl.adust(picScrl.scrollWhere.R,picScrl.InstanceUtil().pageInstance(),200):picScrl.adust(picScrl.scrollWhere.T,picScrl.InstanceUtil().pageInstance(),200)
            }
        ).bind(
            "mouseenter",
            function(){
                jQuery(picScrl.parentOb).stop();
                if( picScrl.config.isAutoScroll )window.clearInterval(ty_cms_template_picElementsScroll[picScrl.selector+"_timer"]);
            }
        ).bind(
            "mouseleave",
            function(){
                if( picScrl.config.isAutoScroll ){
                    window.clearInterval(ty_cms_template_picElementsScroll[picScrl.selector+"_timer"]);
                    ty_cms_template_picElementsScroll[picScrl.selector+"_timer"]=window.setInterval(
                        function(){
                            ty_cms_template_picElementsScroll[picScrl.selector].autoScroll();
                        },
                        ty_cms_template_picElementsScroll[picScrl.selector].config.autoScrollInterval);
                }
            }
        );
    }
    if ( this.config.rightButton ) {
        this.rightButtonObj=jQuery(this.config.rightButton);
        jQuery(this.config.rightButton).attr("title","下翻").bind(
            "mousedown",
            function(){
                picScrl.config.director==="H"?picScrl.start(picScrl.scrollWhere.L):picScrl.start(picScrl.scrollWhere.T);
            }
        ).bind(
            "mouseup",
            function(){
                jQuery(picScrl.parentOb).stop();
                picScrl.config.director==="H"?picScrl.adust(picScrl.scrollWhere.L,picScrl.InstanceUtil().pageInstance(),200):picScrl.adust(picScrl.scrollWhere.B,picScrl.InstanceUtil().pageInstance(),200)
            }
        ).bind(
            "mouseenter",
            function(){
                jQuery(picScrl.parentOb).stop();
                if( picScrl.config.isAutoScroll )window.clearInterval(ty_cms_template_picElementsScroll[picScrl.selector+"_timer"]);
            }
        ).bind(
            "mouseleave",
            function(){
                window.clearInterval(ty_cms_template_picElementsScroll[picScrl.selector+"_timer"]);
                if( picScrl.config.isAutoScroll ){
                    ty_cms_template_picElementsScroll[picScrl.selector+"_timer"]=window.setInterval(
                        function(){
                            ty_cms_template_picElementsScroll[picScrl.selector].autoScroll();
                        },
                        ty_cms_template_picElementsScroll[picScrl.selector].config.autoScrollInterval);
                }
            }
        );
    }
}

//R 表示UL 块向右滑，L 表示UL块向左滑
ty_cms_template_picElementsScroll.prototype.adust = function(where,adustInstance,sped){
    var speed=sped?sped:1;
    if(where==this.scrollWhere.R)var adjust = this.config.director === "H"?this.InstanceUtil().leftInstance:this.InstanceUtil().topInstance;//divParentOb.offset().left-picScrl.parentOb.offset().left;
    else var adjust=this.config.director === "H"?this.InstanceUtil().rightInstance:this.InstanceUtil().bottomInstance;
    var pageInstance=adustInstance;
    var mod=adjust%pageInstance;
    var _this=this;
    if( this.config.director === "H" ){
        if(adjust<=0){
            if(where==this.scrollWhere.L)ty_cms_template_picElementsScroll["toWhere"]=this.scrollWhere.R;
            else if(where==this.scrollWhere.R)ty_cms_template_picElementsScroll["toWhere"]=this.scrollWhere.L;
            return;
        }else if(mod<pageInstance*4/5&&mod>0){
            if(where==this.scrollWhere.R)this.parentOb.animate({left:parseFloat(this.parentOb.css("left")==="auto"?"0":this.parentOb.css("left"))+mod},speed,null,function(){
                if(_this.InstanceUtil().leftInstance<=0)ty_cms_template_picElementsScroll["toWhere"]=_this.scrollWhere.L;
            });
            else this.parentOb.animate({left:parseFloat(_this.parentOb.css("left")==="auto"?"0":_this.parentOb.css("left"))-mod},speed,null,function(){
                if(_this.InstanceUtil().rightInstance<=0)ty_cms_template_picElementsScroll["toWhere"]=_this.scrollWhere.R;
            });
        }else if(adjust<pageInstance){
            if(where==this.scrollWhere.R)this.parentOb.animate({left:parseFloat(this.parentOb.css("left")==="auto"?"0":this.parentOb.css("left"))+adjust},speed,null,function(){
                ty_cms_template_picElementsScroll["toWhere"]=_this.scrollWhere.L;
            });
            else this.parentOb.animate({left:parseFloat(_this.parentOb.css("left")==="auto"?"0":_this.parentOb.css("left"))-adjust},speed,null,function(){
                ty_cms_template_picElementsScroll["toWhere"]=_this.scrollWhere.R;
            });
        }else {
            if(where==this.scrollWhere.L&&this.InstanceUtil().rightInstance<=0)ty_cms_template_picElementsScroll["toWhere"]=this.scrollWhere.R;
            else if(where==this.scrollWhere.L&&this.InstanceUtil().rightInstance>=0)ty_cms_template_picElementsScroll["toWhere"]=this.scrollWhere.L;
            if(where==this.scrollWhere.R&&this.InstanceUtil().leftInstance<=0)ty_cms_template_picElementsScroll["toWhere"]=this.scrollWhere.L;
            else if(where==this.scrollWhere.R&&this.InstanceUtil().leftInstance>=0)ty_cms_template_picElementsScroll["toWhere"]=this.scrollWhere.R;
            return;
        }
    } else {
        if( adjust<=0 ){
            if(where==this.scrollWhere.T&&_this.InstanceUtil().bottomInstance<=0)ty_cms_template_picElementsScroll["toWhere"]=_this.scrollWhere.B;
            else if(where==this.scrollWhere.B&&_this.InstanceUtil().topInstance<=0)ty_cms_template_picElementsScroll["toWhere"]=_this.scrollWhere.T;
            return;
        }
        else if(mod<pageInstance*4/5){
            if(where==this.scrollWhere.T)this.parentOb.animate({top:parseFloat(this.parentOb.css("top")==="auto"?"0":this.parentOb.css("top"))+mod},speed,null,function(){
                if(adjust<=0)ty_cms_template_picElementsScroll["toWhere"]=_this.scrollWhere.B;
            });
            else this.parentOb.animate({top:parseFloat(_this.parentOb.css("top")==="auto"?"0":_this.parentOb.css("top"))-mod},speed,null,function(){
                if(adjust<=0)ty_cms_template_picElementsScroll["toWhere"]=_this.scrollWhere.T;
            });
        }else if(adjust<pageInstance){
            if(where==this.scrollWhere.B)this.parentOb.animate({left:parseFloat(this.parentOb.css("top")==="auto"?"0":this.parentOb.css("top"))+adjust},speed,null,function(){
                ty_cms_template_picElementsScroll["toWhere"]=_this.scrollWhere.T;
            });
            else this.parentOb.animate({left:parseFloat(_this.parentOb.css("top")==="auto"?"0":_this.parentOb.css("top"))-adjust},speed,null,function(){
                ty_cms_template_picElementsScroll["toWhere"]=_this.scrollWhere.B;
            });
        }else {
            if(where==this.scrollWhere.T&&this.InstanceUtil().bottomInstance<=0)ty_cms_template_picElementsScroll["toWhere"]=this.scrollWhere.B;
            else if(where==this.scrollWhere.T&&this.InstanceUtil().bottomInstance>=0)ty_cms_template_picElementsScroll["toWhere"]=this.scrollWhere.T;
            if(where==this.scrollWhere.B&&this.InstanceUtil().topInstance<=0)ty_cms_template_picElementsScroll["toWhere"]=this.scrollWhere.T;
            else if(where==this.scrollWhere.B&&this.InstanceUtil().topInstance>=0)ty_cms_template_picElementsScroll["toWhere"]=this.scrollWhere.B;
            return;
        }
    }
    this
}

/**
 ty_cms_template_picElementsScroll.prototype.showMsg = function (msg){
      var msgOb=jQuery("<div>"+msg+"</div>");
	  msgOb.css("z-index",100).("position","absolute").css("left",this.parentOb.offset().left).width(this.parentOb.offset());
   }*/
//
ty_cms_template_picElementsScroll.prototype.setStyle=function(){
    //debugger;
    if( this.config.director ==="H" ){
        this.divParentOb.width((parseInt(this.elemWidth)+parseInt(this.elemMargin)*2)*this.config.showNbr);
        if(this.config.showScrollBar) this.divParentOb.height(this.elemHd+this.elemMarginV*2+20);//+20 为滚动条预留空间
        else this.divParentOb.height(this.elemHd+this.elemMarginV*2);

        if(jQuery.browser.msie && jQuery.browser.version==6){
            this.parentOb.width((parseInt(this.elemWidth)+parseInt(this.elemMargin)*2)*this.elemCt+parseInt(this.elemMargin));
        }
        else {
            this.parentOb.width((parseInt(this.elemWidth)+parseInt(this.elemMargin)*2)*this.elemCt+2);
        }
        this.setScrollBar();
    }else {
        this.divParentOb.width(parseInt(this.elemWidth)+ parseInt(this.elemMargin)*2+20);//+20 为滚动条预留空间
        this.divParentOb.height((parseInt(this.elemHd)+parseInt(this.elemMarginV)*2)*this.config.showNbr);
        this.parentOb.height((parseInt(this.elemHd)+parseInt(this.elemMarginV)*2)*this.elemCt);
    }
}

// start 方法  scrollWhere : 字符串, L 左滑动，R 右滑动
ty_cms_template_picElementsScroll.prototype.start = function (scrollWhere){
    var instance=this;
    if( instance.config.director ==="H" ){
        var stance1=instance.InstanceUtil().leftInstance;
        var stance2=this.divParentOb.width();
        var stance3=instance.InstanceUtil().rightInstance;
        if( !scrollWhere || scrollWhere == instance.scrollWhere.L){
            if(instance.InstanceUtil().rightInstance<=0){
                ty_cms_template_picElementsScroll["toWhere"]=instance.scrollWhere.R;
                return;
            }
            var rs=stance3;
            this.parentOb.animate({left:parseFloat(instance.parentOb.css("left")==="auto"?"0":instance.parentOb.css("left"))-rs},instance.speed);
        } else if( scrollWhere == instance.scrollWhere.R ) {
            if(instance.InstanceUtil().leftInstance<=0){
                ty_cms_template_picElementsScroll["toWhere"]=instance.scrollWhere.L;
                return;
            }
            var rs=stance1;
            this.parentOb.animate({left:parseFloat(instance.parentOb.css("left")==="auto"?"0":instance.parentOb.css("left"))+rs},instance.speed);
        }
    }else {
        var stance1=(this.parentOb.offset().top+this.parentOb.height())-(this.divParentOb.offset().top+this.divParentOb.height())-this.elemHd-this.elemMarginV;
        var stance2=this.divParentOb.height();
        var stance3=this.divParentOb.offset().top-this.parentOb.offset().top;
        if( !scrollWhere || scrollWhere == instance.scrollWhere.B){
            if(this.divParentOb.offset().top<=this.firstElem.offset().top+this.elemMarginV){
                ty_cms_template_picElementsScroll["toWhere"]=instance.scrollWhere.T;
                return;
            }
            var rs=stance3;
            this.parentOb.animate({top:parseFloat(instance.parentOb.css("top")==="auto"?"0":instance.parentOb.css("top"))+rs},instance.speed);
        } else if( scrollWhere == instance.scrollWhere.T ) {
            if(this.divParentOb.offset().top+instance.divParentOb.height()>=instance.lastElem.offset().top+instance.lastElem.height()){
                ty_cms_template_picElementsScroll["toWhere"]=instance.scrollWhere.T;
                return;
            }
            var rs=stance1;
            this.parentOb.animate({top:parseFloat(instance.parentOb.css("top")==="auto"?"0":instance.parentOb.css("top"))-rs},instance.speed);
        }
    }
}


ty_cms_template_picElementsScroll.prototype.autoScroll=function(){
    var pageInstance=this.InstanceUtil().pageInstance(),instant=this,mod,scrollInstance;
    if( this.config.director==="H" ){
        //往右边滚
        //alert(ty_cms_template_picElementsScroll["toWhere"])
        if( instant["toWhere"]==instant.scrollWhere.R ){
            scrollInstance=Math.min(pageInstance,this.InstanceUtil().leftInstance );
            this.parentOb.animate({left:parseFloat(this.parentOb.css("left")==="auto"?"0":this.parentOb.css("left"))+scrollInstance},instant.config.autoScrollSped,null,
                function(){
                    if(instant.InstanceUtil().leftInstance<=0)instant["toWhere"]=instant.scrollWhere.L;
                    else instant.adust(instant.scrollWhere.R,instant.elemWidth+instant.elemMargin*2, instant.config.autoScrollSped);
                }
            );
        }else {//往左边滚
            scrollInstance=Math.min(pageInstance,this.InstanceUtil().rightInstance);
            this.parentOb.animate({left:parseFloat(this.parentOb.css("left")==="auto"?"0":this.parentOb.css("left"))-scrollInstance},instant.config.autoScrollSped,null,
                function(){
                    if(instant.InstanceUtil().rightInstance<=0)instant["toWhere"]=instant.scrollWhere.R;
                    else instant.adust(instant.scrollWhere.L,instant.elemWidth+instant.elemMargin*2,instant.config.autoScrollSped);
                }
            );
        }
    }else {
        if( instant["toWhere"]==instant.scrollWhere.B){
            scrollInstance=Math.min(pageInstance,this.InstanceUtil().topInstance);
            this.parentOb.animate({top:parseFloat(this.parentOb.css("top")==="auto"?"0":this.parentOb.css("top"))+scrollInstance},instant.config.autoScrollSped,null,
                function(){
                    if(instant.InstanceUtil().topInstance<=0) instant["toWhere"]=instant.scrollWhere.T;
                    instant.adust(instant.scrollWhere.R,instant.elemHd+instant.elemMarginV*2,instant.config.autoScrollSped);
                }
            );
        }else {
            scrollInstance=Math.min(pageInstance,this.InstanceUtil().bottomInstance);
            this.parentOb.animate({top:parseFloat(this.parentOb.css("top")==="auto"?"0":this.parentOb.css("top"))-scrollInstance},instant.config.autoScrollSped,null,
                function(){
                    if(instant.InstanceUtil().bottomInstance<=0) instant["toWhere"]=instant.scrollWhere.B;
                    instant.adust(instant.scrollWhere.L,instant.elemHd+instant.elemMarginV*2,instant.config.autoScrollSped);
                }
            );
        }

    }
}

var __focusArray = new Array();

var __channel = {
    _headline_pic_ad : function (num,picUrl,adUrl,adTitle) {
        if(!picUrl || jQuery.trim(picUrl) == "" ) picUrl = "http://cms.tianyaui.com/template_base/images/errorimg.gif";
        //序号头图、标题头图
        for(i = 0; i < __focusArray.length; i++){
            var ctlObj = __focusArray[i].picContainer.closest("[id*='cms_fragment']");
            var hasAdId = __focusArray[i].picContainer.attr("class");
            if(ctlObj.length > 0) hasAdId = ctlObj.attr("class");
            if(hasAdId.indexOf("no_cms_ad_2focus") < 0){
                __focusArray[i].picContainer.find("img").eq(num-1).attr("src",picUrl);
                __focusArray[i].picSrcs[num-1]=picUrl;
                __focusArray[i].picContainer.find("a").eq(num-1).attr("href",adUrl);
                __focusArray[i].titleTexts[num-1]=adTitle;
                __focusArray[i].titles.eq(num-1).find("a").text(adTitle);
                __focusArray[i].titles.eq(num-1).find("a").attr("href",adUrl);
                __focusArray[i].links[num-1]=adUrl;
            }
        }
        //缩略图广告
        var _sliderList = jQuery("body").find(".tui-slider-focus-pics");
        for(i = 0; i < _sliderList.length; i++){
            var bigWrap = _sliderList.eq(i).find("#bigpic_container");
            var smallWrap = _sliderList.eq(i).find("#smallpiclist_container");
            var titleWrap = _sliderList.eq(i).find("#bigpic_titlebar");

            bigWrap.find("img").eq(num-1).attr("src",picUrl);
            bigWrap.find("img").eq(num-1).attr("title",adTitle);
            bigWrap.find("img").eq(num-1).attr("alt",adTitle);
            bigWrap.find("a").eq(num-1).attr("href",adUrl);

            smallWrap.find("img").eq(num-1).attr("title",adTitle);
            smallWrap.find("img").eq(num-1).attr("src",picUrl);
            smallWrap.find("a").eq(num-1).attr("href",adUrl);

            titleWrap.find("a").eq(num-1).text(adTitle);
            titleWrap.find("a").eq(num-1).attr("href",adUrl);
            titleWrap.find("a").eq(num-1).attr("title",adTitle);
        }
    }
}

function ty_cms_template_focuspics( config ){
    this.config = {
        type : null,
        picNum : 4,
        btns: null,
        btnContainer:null,
        pics: null,
        titles:null,//showStyle=="move"的时候 title传递li
        btnSelectedClass:"selected",
        btnUnSelectedClass:null,
        focuspicsId:"",
        speed: 100,
        picContainer: null,
        showStyle:"flash",//move
        picHd : null,
        picWd : "",
        sumWidth : null,
        sumHeight : null,
        set_title_wd:true,
        play_interval: 5000,
        autoPlay:true
    }
    var _this = this;
    jQuery.extend( _this.config,config );
    jQuery.extend( _this,_this.config );
    if ( this.picHd ){
        this.pics.height(this.picHd.match(/\d+/)[0]);
    }else {
        this.picHd = this.pics.outerHeight();
    }
    this.picOuterHd = this.pics.eq(0).outerHeight(true);
    this.picSrcs=[];
    this.titleTexts = [];
    this.links = [];
    this.picNumHd = 1*( parseFloat( ("" + this.picHd).replace(/[^\d\.%]/g,"") ) );//数字类型的HD
    this.maxMoveS = this.picNumHd*this.picHd;
    this.pics.each(
        function (){
            _this.picSrcs.push( jQuery(this).attr("src") );
        }
    );
    var indx = 0 ;
    this.titles.each(
        function (){
            if ( indx>0&&_this.config.showStyle=="flash" )jQuery(this).parent().hide();
            _this.titleTexts.push( jQuery(this).text() );
            _this.links.push( jQuery(this).attr("href") );
            ++indx;
        }
    );
    indx = 0 ;
    this.btns.each(
        function (){
            if ( indx>0 )jQuery(this).removeClass(_this.config.btnSelectedClass).addClass( _this.config.btnUnSelectedClass );
            else jQuery(this).removeClass(_this.config.btnUnSelectedClass).addClass( _this.config.btnSelectedClass );
            ++indx;
        }
    );
}

ty_cms_template_focuspics.prototype.initStyle = function (){
    this.picContainer.css("overflow","hidden");
    this.picContainer.css("height",this.picHd);
    var _this = this;
    if ( this.type&&this.type=="summary_focus_pics" ){
        if ( !this.sumWidth||!this.sumWidth.replace("px","") ){
            this.btnContainer.width( jQuery(this.focuspicsId).width()-this.picWd.replace(/[^\d\.%]/g,"")-3 );
        }
        else {
            this.btnContainer.width( this.sumWidth );
        }
        if( this.sumHeight||!this.sumHeight.replace(/[^\d\.%]/g,"") )this.btnContainer.height( _this.sumHeight );
    }
    if ( this.showStyle=="move"&&this.set_title_wd ){
        var titleWd = (100/(this.titles.size())).toFixed(2)+"%";
        this.titles.css("width",titleWd);
    }
}

//参数为第几张图片
ty_cms_template_focuspics.prototype.showPic = function( num,thisElem ){
    var _this = this;
    if ( this.showStyle=="flash"){
        this.pics.eq(0).attr("src",_this.picSrcs[num]);
        this.pics.eq(0).closest("a").attr("href",_this.links[num]);
        this.titles.eq(0).attr("href",_this.links[num]);
    }else if ( this.showStyle=="move"){
        //debugger
        var beMovedDiv = this.picContainer.children();
        //debugger;
        //如果当前是最后一个，并且下一个是第一张  margin-top为0
        if ( num==0 ){
            beMovedDiv.animate({marginTop:"0px"},_this.speed);
        }
        else {//
            var s = num *(this.picNumHd);
            s = "-"+s+"px";
            beMovedDiv.animate({marginTop:s},_this.speed);
        }
    }
}

ty_cms_template_focuspics.prototype.showTitle = function( num ){
    if ( this.showStyle=="flash"){
        this.titles.eq(0).html(this.titleTexts[num]);
    }
}

ty_cms_template_focuspics.prototype.showBtn = function( num ){
    var _this = this;
    _this.btns.each(
        function (){
            jQuery(this).removeClass(_this.btnSelectedClass);
            if ( _this.btnUnSelectedClass )jQuery(this).addClass(_this.btnUnSelectedClass);
        }
    );
    _this.btns.eq(num).addClass(_this.btnSelectedClass);
    _this.btns.eq(num).removeClass(_this.btnUnSelectedClass);
}


ty_cms_template_focuspics.prototype.eventReg = function (){
    var _this = this;
    for ( var i =0;i<_this.btns.size();++i ){
        var btn = _this.btns.eq(i);
        btn.attr("order",i).bind("mouseenter",
            function (){
                window.clearInterval(ty_cms_template_focuspics[_this.config.focuspicsId+"_timer"]);
                ty_cms_template_focuspics[_this.config.focuspicsId+"_timer"] = null;
                thisElem = _this.btnContainer.find("."+_this.btnSelectedClass)
                _this.showBtn( jQuery(this).attr("order") );
                _this.showPic( jQuery(this).attr("order"),thisElem );
                _this.showTitle( jQuery(this).attr("order") );
            })
    }


    jQuery(_this.focuspicsId).hover(
        function (){
            window.clearInterval(ty_cms_template_focuspics[_this.config.focuspicsId+"_timer"]);
            //window.ty_cms_focuspics_timer[_this.focuspicsId]=null;
        },
        function (){
            var config = _this.config;
            if ( _this.autoPlay ){
                ty_cms_template_focuspics[config.focuspicsId+"_timer"] = window.setInterval(
                    function(){
                        //debugger;
                        ty_cms_template_focuspics[config.focuspicsId].play();
                    },
                    config.play_interval);
            }
        }
    );

}

ty_cms_template_focuspics.prototype.init = function(){
    this.initStyle();
    this.eventReg();
    return this;
}

ty_cms_template_focuspics.prototype.play = function(){
    var nextElem = null,thisElem=null;
    for ( var i=0;i<this.btns.size();++i ){
        var pat = new RegExp("(^|\s+)"+this.btnSelectedClass+"(\s+|$)");
        if ( this.btns.eq(i).attr("class").indexOf(this.btnSelectedClass)>-1 ){
            thisElem = this.btns.eq(i);
            //最后一个
            if ( i==this.btns.size()-1 ){
                nextElem=this.btns.eq(0);
            }else {
                nextElem=this.btns.eq(i+1);
            }
            break;
        }
    }
    if ( !nextElem ){
        var _this = this;
        window.clearTimeout( ty_cms_template_focuspics[_this.config.focuspicsId+"_timer"] );
    }
    if( nextElem ){
        this.showBtn( nextElem.attr("order") );
        this.showTitle( nextElem.attr("order") );
        this.showPic( nextElem.attr("order"),thisElem );
    }
}


ty_cms_template_focuspics.autoPaly = function( config ){
    ty_cms_template_focuspics.instance=ty_cms_template_focuspics[config.focuspicsId] = new ty_cms_template_focuspics(config).init();//ty_cms_template_focuspics
    window.clearInterval(ty_cms_template_focuspics[config.focuspicsId+"_timer"]);
    if ( ty_cms_template_focuspics[config.focuspicsId].autoPlay ){
        ty_cms_template_focuspics[config.focuspicsId+"_timer"] = window.setInterval(
            function(){
                //debugger;
                ty_cms_template_focuspics[config.focuspicsId].play();
            },
            config.play_interval);
        __focusArray.push(ty_cms_template_focuspics.instance);
        return ty_cms_template_focuspics[config.focuspicsId+"_timer"];
    }
}
ty_cms_template_focuspics.stop = function ( config ){
    window.clearInterval(ty_cms_template_focuspics[config.focuspicsId+"_timer"]);
}

/**
 * 图片头数据加载就绪事件 - 更快获取图片尺寸
 * @version	2013.01.14
 * @author	wuyy@staff.tianya.cn
 * @param	{String}	图片路径
 * @param	{Function}	加载完毕
 * @param	{Function}	加载错误 (可选)
 * @example imgReady('http://www.google.com.hk/intl/zh-CN/images/logo_cn.png', function (img) {
		alert('size ready: width=' + img.width + '; height=' + img.height);
	});
 */
var imgReady = (function () {
    var list = [], intervalId = null, count = 0,

        // 用来执行队列
        tick = function () {
            var i = 0;
            for (; i < list.length; i++) {
                list[i].end ? list.splice(i--, 1) : list[i]();
            };
            !list.length && stop();
        },

        // 停止所有定时器队列
        stop = function () {
            clearInterval(intervalId);
            intervalId = null;
        };

    return function (url, ready, error) {
        var onready, width, height, newWidth, newHeight,
            img = new Image();

        img.src = url;

        // 如果图片被缓存，则直接返回缓存数据
        if (img.complete) {
            ready && ready(img);
            return;
        };
        if(img.onreadystatechange == "complete"){
            ready && ready(img);
            return;
        }
        width = img.width;
        height = img.height;

        // 加载错误后的事件
        img.onerror = function () {
            error && error(img);
            onready.end = true;
            img = img.onload = img.onerror = null;
        };

        // 图片尺寸就绪
        onready = function () {
            newWidth = img.width;
            newHeight = img.height;
            if (newWidth !== width || newHeight !== height ||
                // 如果图片已经在其他地方加载可使用面积检测
                newWidth * newHeight > 1024
            ) {
                ready && ready(img);
                onready.end = true;
            };
        };
        onready();

        // 完全加载完毕的事件
        img.onload = function () {
            // onload在定时器时间差范围内可能比onready快
            // 这里进行检查并保证onready优先执行
            !onready.end && onready();

            // IE gif动画会循环执行onload，置空onload即可
            img = img.onload = img.onerror = null;
        };

        // 加入队列中定期执行
        if (!onready.end) {
            list.push(onready);
            // 无论何时只允许出现一个定时器，减少浏览器性能损耗
            if (intervalId === null) intervalId = setInterval(tick, 40);
        };
    };
})();
/**kuner:20140624:新闻中心增加评论**/
(function($){
    var wrap_html=[
            '<div class="hd">',
            '<h2>最新评论</h2>',
            '<span><a href="http://bbs.tianya.cn/post-{item}-{article}-1.shtml" target="_blank">{num}</a>篇评论</span>',
            '</div>',
            '<div class="bd">',
            '<ul>',
            '{lis}',
            '</ul>',
            '</div>'
        ].join(""),
        li_html=[
            '<li>',
            '<a class="left-img" href="http://www.tianya.cn/{author_id}" target="_blank"><img src="http://tx.tianyaui.com/logo/small/{author_id}" alt="" /></a>',
            '<div class="content">',
            '<p class="cf">',
            '<a  href="http://www.tianya.cn/{author_id}" target="_blank">{author_name}</a>',
            '<span>时间：{reply_time}</span>',
            '</p>',
            '<p>	{content}</p>',
            '<p>',
            '<span><a href="javascript:;" class="replay" t="{i}">回复</a><a href="javascript:;" class="copy" t={i} id="copy_{i}">复制</a></span>',
            '</p>',
            '</div>',
            '</li>',
        ].join(""),

        wrap_id="bbs_remark",
        remarkData=null;

    //字符串格式化
    function format(src,datas){
        var a = datas,data;
        data = (a.length == 1 && typeof(a[0]) == 'object') ? a[0] : a;
        return src.replace(/\{([\d\w]+)\}/g, function (m, n) {
            return data[n] != undefined ? data[n].toString() : "";
        });
    }
    //字符编码
    function htmlCode(str,isdecode) {
        var ar = ['&', '&amp;', '<', '&lt;', '>', '&gt;', ' ', '&nbsp;', '"', '&quot;', "'", '&#039;', '\\r', '<br>', '\r\n', '<br>', '/', '&#047;', '\\\\', '&#092;'];
        if (isdecode) {
            ar.reverse();
        }
        for (var i = 0, r = str; i < ar.length; i += 2) {
            r = r.replace(new RegExp(ar[i], 'g'), ar[1 + i]);
        }
        return r;
    };
    //帖子标题旁边的评论数量
    function makeRemarkNum(link,num){
        var div = $("#cms_fragment_235_bd .info"),
            html = div.html();
        html+="<span class='remark_num'>评论(<a href='"+link+"' target='_blank'>"+num+"</a>)</span>";
        div.html(html);
    }

    //隐藏评论
    function hideContent(){
        $("#"+wrap_id).hide();
        $("#cms_control_306").css({"border-top":"1px solid #CCCCCC"});
    }
    //获取数据
    function getData(){
        var item_id = $(":input[name='item']").val()||0,
            article_id = $(":input[name='itemBbsArticleId']").val()||0,
            url = "http://content.tianya.cn/activity/BbsExecute.jsp?item="+item_id+"&itemBbsArticleId="+article_id+"&v="+Math.random();
        if(item_id!=0 && article_id!=0){
            $.getScript(url, function(){
                var data = remarkList;
                if(data && typeof(data.success)!=undefined && data.success==1){
                    makeData(data.data,item_id,article_id);
                }
            });
        }else{
            hideContent();
        }
    }
    //生成dom结构
    function makeData(data,item_id,article_id){
        var warp = $("#"+wrap_id),
            num = data.reply_count,
            arr = data.last_reply_list,
            len = arr.length,
            lists =[];
        remarkData=arr;

        for(var i=0;i<len;i++){
            arr[i]['i']=i;
            lists.push(format(li_html,arr[i]));
        }
        if(lists.length){
            warp.html(format(wrap_html,{num:num,lis:lists.join(""),'item':item_id,'article':article_id}));
            bindEvent(warp);
            makeRemarkNum("http://bbs.tianya.cn/post-"+item_id+"-"+article_id+"-1.shtml",num);
        }else{
            hideContent();
        }
    }

    //获取评论具体内容
    function getContent(el){
        var t= $(el).attr("t");
        if(remarkData && typeof(remarkData[t])!=undefined){
            remarkData[t]['contentHtml'] = htmlCode(remarkData[t]["content"],true);
            return remarkData[t];
        }
        return false;
    }
    //绑定事件
    function bindEvent(obj){
        var val="@{author_name} {reply_time}\r\n{contentHtml}\r\n -----------------------------\r\n",
            textArea=$("#comment-box textarea"),
            init_val="";

        //回复
        obj.delegate(".replay", "click", function(){
            var ret = getContent(this);
            if(ret){
                init_val=format(val,ret);
                textArea.val(init_val);
                textArea.focus();
            }
            return false;

        })
        //复制
        TY.loader('TY.util.clipboard',function(){
            obj.find(".copy").each(function(i,el){
                el.copy=false;
                $(el).mouseover(function(){
                    if(el.copy==false){
                        var clip=new TY.util.clipboard(
                            {
                                cursor:true,//显示鼠标样式
                                el:"copy_"+i,//元素id
                                event:{
                                    "mouseup":function(clip){
                                        var ret = getContent(el);
                                        if(ret){
                                            try{
                                                clip.setText(ret["contentHtml"]);
                                                alert("复制成功!");
                                            }catch(e){
                                                alert("复制失败!");
                                            }
                                        }else{
                                            alert("复制失败!");
                                        }
                                    }
                                }
                            });
                        el.copy=true;
                    }
                });

            });
        });
    }
    $("document").ready(function(){
        if(jQuery("#bbs_remark").size()!=0){
            getData();
        }
    });
})(jQuery);

