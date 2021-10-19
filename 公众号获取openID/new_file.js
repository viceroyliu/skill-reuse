function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg);  //匹配目标参数
  if (r != null) return unescape(r[2]); return null; //返回参数值
}
var code = getUrlParam('code');
var HousingResourcesID = getUrlParam('HousingResourcesID');
var EmployeeId = getUrlParam('EmployeeId');

if (code != null) {
  GetOpenid()
} else {
  wx()
}

function GetOpenid() {
  if(sessionStorage.getItem('Openid') != null){
    return;
  }
  $.ajax({
    type: 'GET',
    url: 'https://data.nicexf.com/WxSmallProgram/XFGroupWhereCode/',
    data: {
      CODE: code
    },
    success: function (res) {
      if(res.ReturnCode == -1){
        window.location.href = window.location.pathname + '?EmployeeId=' + EmployeeId + '&HousingResourcesID=' + HousingResourcesID
        return;
      }
      var Openid = res.Openid
      sessionStorage.setItem('Openid',Openid)

    }
  })
}

function wx() {
  if(sessionStorage.getItem('Openid') != null){
    return;
  }

  var Url = window.location.href
  var wxUrl = encodeURIComponent(Url);
  var appid = "wxe86c63f7ff9a83bb";
  var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + wxUrl + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
  location.href = url;

}

