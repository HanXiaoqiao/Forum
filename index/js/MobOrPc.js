//浏览器判断
var system = {
    win: false,
    mac: false,
    xll: false
};
//检测平台
var p = navigator.platform;
system.win = p.indexOf("Win") == 0;
system.mac = p.indexOf("Mac") == 0;
system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);

//访问平台
if(!(system.win||system.mac||system.xll)){
    window.location="http://wenda.tianya.cn/m";
}

