var current = null;
var isRepeatMode= false;
$(document).ready(go);

function go() {
    addDownloadLink();
    addRepeatModeLink();
    setInterval(requireInforFromBackgroundPage, 1000)
}

function requireInforFromBackgroundPage() {
    chrome.extension.sendMessage({from:"douban.fm"}, function (response) {
      current = response.music;
    });
}


function addDownloadLink(){
    var download = $("<div id='download'><span>下载</span></div>");
    $('#fm-section2').append(download);
    $("#download span").bind("click", downLoadCurrent);
}




function addRepeatModeLink(){
   var repeat = $("<div id='repeat'>循环</div>");
    $('#fm-section2').append(repeat);
    $("#repeat").bind("click", setRepeatMode);
}


function setRepeatMode(){
    isRepeatMode = !isRepeatMode;
    if(isRepeatMode){
      $("#repeat").text("随机");
    }
    else{
       $("#repeat").text("循环");
    }
    chrome.extension.sendMessage({from:"repeat"},function(response){
      console.log(isRepeatMode?"Yes":"No");
    });
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



