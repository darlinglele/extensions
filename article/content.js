var link = null;
var name = null;
var isRepeatMode= false;
$(document).ready(go);

function go() {
  var artice ={title: "",url:"", content:""};      
  loadDashboard();
}

function favorite(article){  
  $.post("linzhixiong.com:7777:/api/article", article).then(function(res){
    console.log(res);
  },
  function(res){
    console.log(res);
  });
}


function loadDashboard(){
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = "localhost:9099/dashboard.js";
  $("body").append(script);
}

function addLyrics(){
  if($("#lyrics").length==0){
   $("body").append($("<div id='lyrics' class ='lyrics'></div>"));
 }

 $("#lyrics").text(curlLyrics(document.title.split(' -')[0],getArtist(name)));
 $("#lyrics").draggable();
}

function getArtist(name){
  return "";
}

function curlLyrics(song,artist){
 var results;
 if(artist !=""){
   results = curl("http://geci.me/api/lyric/"+song+"/"+artist,"json");
 }
 else{
   results = curl("http://geci.me/api/lyric/"+song,"json");
   console.log(results);
 }
 return curl(results.result[0].lrc, "html");
}


function curl(url,type){
  var response;
  $.ajax({
    url: url,
    async: false,
    dataType:type
  }).done(function(data){
   response = data;
 });
  return response;
}

function requireInforFromBackgroundPage() {
  chrome.extension.sendMessage({from:"douban.fm"}, function (response) {
    link = response.link;
    name = response.name.split(' -')[0];
  });
}


function addDownloadLink(){
  var download = $("<div id='download'><span>下载</span></div>");
  $('#fm-section2').append(download);
  $("#download span").bind("click", downLoadCurrent);
}


function addLyricsLink(){
  var download = $("<div id='lyricsLink'><span>歌词</span></div>");
  $('#fm-section2').append(download);
  $("#lyricsLink span").bind("click",addLyrics);
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
  iframe.src = link;
}



