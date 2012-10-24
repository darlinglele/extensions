var host = "http://localhost";
var port = "8080";
$(document).ready(go);

function go() {
    initialize();
    refresh();
}

function encodeAuth(user, password) {
    return "Basic " + btoa(user + ":" + password)
}

function setAuthHeader(xhr) {
    console.log(loadAccountInfo().name + loadAccountInfo().pass);
    xhr.setRequestHeader('Authorization', encodeAuth(loadAccountInfo().name, loadAccountInfo().pass));
}

function authorized() {
    var account = loadAccountInfo();
    return  (account.name == "zhixiong" && account.pass == "xk");
}

function refresh() {
    authorized() ? showContent() : showLoginForm();
}

function showLoginError(message) {
    $("#loginerror").text(message);
}

function showLoginError(message) {
    $("#loginerror").text(message);
}

function authServiceError(xmlHttpRequest, textStatus, errorThrown) {
    showLoginError(xmlHttpRequest.status + "::" + errorThrown + "::" + textStatus);
}

function authenticate(data) {
    var status = $($(data).find("return")[0]).text();
    if (status == 1) {
        saveAccountInfo($("#name").val(), $("#pass").val());
        refresh();
    }
    else {
        showLoginError("username or password is not correct!");
    }
}

function commit() {
    showLoginError("");
    var name = $("#name").val();
    var pass = $("#pass").val();
    $.ajax({
        url:host + ":" + port + "/axis2/services/AuthorizationService/provide?name=" + name + "&pass=" + pass,
        type:"get",
        dataType:"xml",
        async:false,
        timeout:40000,
        success:authenticate,
        error:authServiceError
    });
}


function openOptions() {
    window.close();

}

function saveAccountInfo(name, password) {
    $.cookie("name", name);
    $.cookie("pass", password);
}

function clearAccountInfo() {
    saveAccountInfo(null, null);
}

function loadAccountInfo() {
    var name = $.cookie("name");
    var pass = $.cookie("pass");
    return {"name":name,
        "pass":pass
    }
}

function signout() {
    clearAccountInfo();
    refresh();
}

function initialize() {
    $("#name").focus();
    $("#commit").bind('click', commit);
    $("#signout").bind("click", signout);
    $("#refresh").bind("click", refresh);
    $("#upload").bind("click", openOptions);
}

function before() {
    $("#login").hide();
    $("#content").hide();
}

function notesServiceError(xmlHttpRequest, textStatus, errorThrown) {
    $("#content-loading").hide();
    $("#contenterror").text(xmlHttpRequest.status + "    " + errorThrown);
}

function retrieve(success, error) {
    $("#content-loading").show();
    $.ajax({
        url:host + ":" + port + "/axis2/services/NoteService/getLatest?number=10",
        type:"get",
        dataType:"xml",
        timeout:21000,
        beforeSend:setAuthHeader,
        success:success,
        error:error
    });
}

function onRetrieveSuccess(data) {
    $("#content-loading").hide();
    var notes = data;
    var index = 0;
    $(notes).find("return").each(function () {
        var t = $(this).text();
        if (index == 9)
            $("#issues").append("<div  class='item, last-item'  id='issue-" + index + "' ><span> " + t + "</span></div>");
        else
            $("#issues").append("<div  class='item'  id='issue-" + index + "' ><span> " + t + "</span></div>");
        index++
    });
}

function clearContent() {
    $("#dates").children().remove();
    $("#issues").children().remove();
}

function hideLoginForm() {
    $("#login").hide();
    $("#content").show();
}

function showContent() {
    hideLoginForm();
    clearContent();
    retrieve(onRetrieveSuccess, notesServiceError);
}

function showLoginForm() {
    $("#content").hide();
    $("#login").show();
    $("html").height(200);
    $("body").height(200);
}

