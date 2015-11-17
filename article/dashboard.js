$.get("http://localhost:9099/dashboard.html").then(function(data){
	$("body").append(data);
});