var backgroud={};
var tab;
var current;
var isRepeatMode = false;

// 接收到前台的请求时触发， 用来和页面进行交互哦 
chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log(request,sender,sendResponse);
      tab = sender.tab;
      if(request.from==null){
        sendResponse({});
        return;
      }
      if(request.from == "douban.fm") {
        sendResponse({"link":current,"name":tab.title,"artist":""});
      }
      if(request.from == "repeat"){
        isRepeatMode = !isRepeatMode;
        sendResponse({});
      }
        else
            sendResponse({});
    });

// 在任何Http请求之前触发，可以在此事件中得到网页中的音频文件地址哦
chrome.webRequest.onBeforeRequest.addListener(
    function (info) {        
        if(isRepeatMode && info.url.indexOf(".mp4")!=-1){
          //重播
          return {redirectUrl:current};
        }
        else if(info.url.lastIndexOf(".mp4")== info.url.length-4){
            current = info.url+"?douban=";
        }

        return {cancel:false};

    },
    {
        urls:[
            "http://*/*",
            "https://*/*"
        ]
    },
["blocking"]);


// 在Http响应头被接收之后出发，这里主要用来修改下载音频文件的名称哦
chrome.webRequest.onHeadersReceived.addListener(function (details) {
    if(details.url.indexOf(".mp4?douban=")!=-1){
     for (i = 0; i < details.responseHeaders.length; i++) {
        console.log(details.responseHeaders[i].name);
       if(details.responseHeaders[i].name.toLowerCase() == "content-type"){
          details.responseHeaders[i].value= "application/x-please-download-me";
        }
     }
     details.responseHeaders.push({name:"Content-disposition",value:"attachment; filename="+tab.title.substring(0, tab.title.lastIndexOf('-')-1)+ ".mp4"});
    }

    return {
        responseHeaders : details.responseHeaders
    };
    }, {
        urls : ["<all_urls>"],
        types : ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
        ["blocking", "responseHeaders"]);


