var url = window.location.href;
var signatureUrl = url.split("#")[0];
//var URL = encodeURIComponent(signatureUrl);
var URL = signatureUrl;

var title = "这是分享的表标题";
var desc = "【亦蓁家】送你300元购物大礼包，亦蓁家邀你体验高品质母婴服务";
var shareUrl = window.location.href;
var logo = "http://yizhenjia.com/dist/newImg/logo.png";
SHARE(title, desc, shareUrl, logo); 

/**
 * cookies
 */
function getCookie(name) 
{ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg))
 
        return unescape(arr[2]); 
    else 
        return null; 
}
console.log(getCookie('nickname'))
if(getCookie('nickname')){
    let img = `<img src="${getCookie('headimgurl')}"/>`
    $('.headimgurl').append(img)
}

$.get("/weixin?url=" + URL, function(result) {
    if (result.code == 0) {
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: result.result.appId, // 必填，公众号的唯一标识
            timestamp: result.result.timestamp, // 必填，生成签名的时间戳
            nonceStr: result.result.nonceStr, // 必填，生成签名的随机串
            signature: result.result.signature, // 必填，签名，见附录1
            jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline", "chooseImage", "scanQRCode", "getLocation", "openLocation"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
    };
});

function clickMe(){
    wx.ready(function() {
        wx.previewImage({
            current: 'http://yizhenjia.com/dist/newImg/registerheader.png', // 当前显示图片的http链接
            urls: [
                "http://yizhenjia.com/dist/newImg/registerheader.png",
                "http://yizhenjia.com/dist/newImg/logo.png",
                "http://yizhenjia.com/dist/newImg/a1.png"
        ], // 需要预览的图片http链接列表
        });
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                alert(localIds)
                //$("#img").append("<img src='"+localIds+"' style='width:100%;'/>")
            }
        });

    })

}
/**
 * 录音
 * @type {String}
 */
let localId = ''
let reCord = () => {
    console.log('..........')
    wx.startRecord();
}
let stopRecord = () => {  //暂时停止不了，不知道为什么
    console.log('ooooo')
    wx.stopRecord({
        success: function (res) {
         localId = res.localId;
         alert('res.localId='+res.localId)
        }
    });
}

let playVoice = () => {
    console.log('playVoice','localId= '+localId)
    alert('localId= '+localId)
    wx.playVoice({
        localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
    });
    
}

/**
 * 网络状态
 */

let getNetworkType = () => {
    wx.getNetworkType({
    success: function (res) {
        var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
        alert(networkType)
    }
    });
    
}

/**
 * 显示地理位置
 */

let openLocation = () => {
    wx.openLocation({
        latitude:30.26, // 纬度，浮点数，范围为90 ~ -90
        longitude: 120.19, // 经度，浮点数，范围为180 ~ -180。
        name: '这里是杭州吗', // 位置名
        address: 'porco mar', // 地址详情说明
        scale: 7, // 地图缩放级别,整形值,范围从1~28。默认为最大
        infoUrl: 'www.yizhenjia.com' // 在查看位置界面底部显示的超链接,可点击跳转
    });
    }

/**
 * 获取位置
 */
let getLocation = () => {
    wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        var speed = res.speed; // 速度，以米/每秒计
        var accuracy = res.accuracy; // 位置精度
        console.log(latitude,longitude,speed,accuracy)
    }
    }); 
}


/**
 * 微信扫一扫
 */
let scanQRCode = () => {
    wx.scanQRCode({
    needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
    success: function (res) {
    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
        alert(result)
    }
    });
}









function SHARE(title, desc, shareUrl, logo) {        
    wx.ready(function() {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        //分享
        wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: shareUrl, // 分享链接
            imgUrl: logo, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
                用户确认分享后执行的回调函数
                alert("分享成功！");
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
            },
            fail: function(err) {
                alert("分享失败");
            }
        });
        wx.onMenuShareTimeline({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: shareUrl, // 分享链接
            imgUrl: logo, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareQQ({
        title: '', // 分享标题
        desc: '', // 分享描述
        link: '', // 分享链接
        imgUrl: '', // 分享图标
        success: function () {
        // 用户确认分享后执行的回调函数
        },
        cancel: function () {
        // 用户取消分享后执行的回调函数
        }
        });
        wx.onMenuShareQZone({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: shareUrl, // 分享链接
            imgUrl: logo, // 分享图标
            success: function () {
            // 用户确认分享后执行的回调函数
            },
            cancel: function () {
            // 用户取消分享后执行的回调函数
            }
        });
    });
    wx.error(function(res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        //alert("Error");
    });
}       












