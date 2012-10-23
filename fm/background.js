var tab;
var musics = [];

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        tab = sender.tab;
        if (request.from!=undefined && request.from == "douban.fm") {
            sendResponse({"musics":musics});
            musics=[];
        }
        else
            sendResponse({}); //clear the requests
    });


chrome.webRequest.onBeforeRequest.addListener(
    function (info) {
        if (info.url.lastIndexOf(".mp3")==info.url.length-4){
            musics.push(info.url+"?douban=");
        }
        return {cancel:false};
    },
    {
        urls:[
            "http://*.douban.com/*"
        ]
    },
    ["blocking"]);


var response;
chrome.webRequest.onHeadersReceived.addListener(function (details) {

    if(details.url.indexOf(".mp3?douban=")!=-1){
     response =details;// for debugging
     for (i = 0; i < details.responseHeaders.length; i++) {
        console.log(details.responseHeaders[i].name);
       if(details.responseHeaders[i].name.toLowerCase() == "content-type"){
          details.responseHeaders[i].value= "application/x-please-download-me";
        }
     }
     details.responseHeaders.push({name:"Content-disposition",value:"attachment; filename="+tab.title.substring(0, tab.title.lastIndexOf('-')-1)+ ".mp3"});
    }

    return {
        responseHeaders : details.responseHeaders
    };
    }, {
        urls : ["<all_urls>"],
        types : ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
        ["blocking", "responseHeaders"]);


