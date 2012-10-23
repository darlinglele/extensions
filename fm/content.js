var current;

$(document).ready(go);

function go() {
    addDownloadLink();
    setInterval(requireInforFromBackgroundPage, 1000)
}

function  addExtensionPanel(){
    var content = $("<div id='extension_content'><div id='playlist'>Play list</div><div id='control'></div></div>");
     $("body").append(content);
     $("#extension_content").draggable();
 }

function requireInforFromBackgroundPage() {
    chrome.extension.sendMessage({from:"douban.fm"}, function (response) {
        response.musics.forEach(addToPlayList);
        if(response.musics.length>0){
             current= response.musics.pop();
             }
    });
}

function addToPlayList(info){
    var name= info.substring(info.lastIndexOf('/')+1,info.length)
    var item = $("<span class='item'>"+name+"</span>");
    $("#playlist").append(item);
}

function play(url){
        var audio = $("<audio src='" + url + "' controls='controls'></audio>");
        $("#control").children.remove();
        $("#control").append(audio);
}

function addDownloadLink(){
    var download = $("<div id='download'><span>下载</span></div>");
    $('#fm-section2').append(download);
    $("#download span").bind("click", downLoadCurrent);
}

function downLoadCurrent()
{
    var iframe;
    iframe = document.getElementById("hiddenDownloader");
    if (iframe === null)
    {
        iframe = document.createElement('iframe');
        iframe.id = "hiddenDownloader";
        iframe.style.visibility = 'hidden';
        document.body.appendChild(iframe);
    }
    iframe.src = current;
}



