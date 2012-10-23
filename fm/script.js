//var host = "http://54.251.60.14";
//var port = 8888;

var host = "http://localhost";
var port = "8080";
var notesService = host + ":" + port + "/axis2/services/NoteService/";
var notesService2 = "http://54.251.60.14:8888" + "/axis2/services/NoteService/";

function genericOnClick(info, tab) {
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));
}

function addNote(info, tab) {
    var note = {content:info.selectionText};
    var request = notesService + "addNote?" + "content=" + note.content;
    httpGet(request);
}
function saveImage(info, tab) {

    var request = notesService + "addNote?" + "content=" + "[Image] " + "title:" + tab.title + ", page:" + info.pageUrl + ", src:" + info.srcUrl;
    var request2 = notesService2 + "addNote?" + "content=" + "[Image] " + "title:" + tab.title + ", page:" + info.pageUrl + ", src:" + info.srcUrl;
//    alert(request);
    httpGet(request);
    httpGet(request2);
}

function savePage(info, tab) {
    var page = {url:info.pageUrl, title:tab.title};
    var request = notesService + "addNote?" + "content=" + "[Page] " + page.title + " " + page.url;
    httpGet(request);
}

function encodeAuth(user, password) {
    return "Basic " + btoa(user + ":" + password);
}

function httpGet(theUrl) {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("Get", theUrl, false);
    xmlHttp.setRequestHeader('Authorization', encodeAuth("zhixiong", "xk"));
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

// Create one test item for each context type.
var contexts = ["page", "selection", "link", "editable", "image", "video",
    "audio"];
for (var i = 0; i < contexts.length; i++) {
    var context = contexts[i];
    var title;
    if (context == "selection") {
        title = "Add Selection to Notes Book";
        setContextMenus(context, title, addNote);
    }
    else if (context.toLowerCase() == "image") {
        title = "Save this image";
        setContextMenus(context, title, saveImage);
    }
    else if (context.toLowerCase() == "page") {
        title = "Save this page";
        setContextMenus(context, title, savePage);
    }
    else {
        title = "Test " + context + " menu";
        var id = chrome.contextMenus.create({"title":title, "contexts":[context],
            "onclick":addNote});
        console.log("'" + context + "' item:" + id);
    }
}

function setContextMenus(name, title, onclick) {
    chrome.contextMenus.create({"title":title, "contexts":[name], "onclick":onclick});
}

