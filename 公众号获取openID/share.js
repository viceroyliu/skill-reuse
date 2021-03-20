
// document.write("<script type='text/javascript' src='./js/jweixin-1.4.0.js'></script>");

function share(){

  var SiginUrl = window.location.href//当前地址栏中的url

  $.ajax({
      type:'GET',
      url: 'https://data.nicexf.com/NewSystem/SharePush/',
      data:{
          SiginUrl:SiginUrl,
      },
      success:function(res){
            wx.config({
              // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: res.appId, // 必填，公众号的唯一标识
              timestamp: res.timestamp, // 必填，生成签名的时间戳
              nonceStr: res.nonceStr, // 必填，生成签名的随机串
              signature: res.signature,// 必填，签名，见附录1
              jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline','onMenuShareQQ','onMenuShareQZone','updateTimelineShareData'] // 必填，需要使用的JS接口列表
            });
         wx.ready(function(){
          wx.onMenuShareTimeline({
                title:homeData.PropertyName + ' ' + homeData.AllPrice + ' ' + homeData.HouseType + ' ' + homeData.Buildarea + ' ' + homeData.Price,
              //   desc:homeData.PropertyName + ' ' + homeData.AllPrice + ' ' + homeData.HouseType + ' ' + homeData.Buildarea + ' ' + homeData.Price,
                link:  SiginUrl,//当前窗口链接
                imgUrl:homeData.ShowImage + '?x-oss-process=style/App_House_List',
                success:function(){
                   // alert('分享成功')
                },
                cancel:function(){
                    //alert('取消分享')
                }
            });
            wx.onMenuShareAppMessage({
                title:homeData.PropertyName,
                desc:homeData.PropertyName + ' ' + homeData.AllPrice + ' ' + homeData.HouseType + ' ' + homeData.Buildarea + ' ' + homeData.Price,
                link:  SiginUrl,
                imgUrl:homeData.ShowImage + '?x-oss-process=style/App_House_List',
                success:function(){
                 // alert('分享成功')
                },
                cancel:function(){
                 // alert('取消分享')
                }
            });
        });
        wx.error(function(res){
            console.log("redy error")
        })

      },
  })


  }