function init() {
    checkOS();

    document.addEventListener("deviceready", deviceReady, true);
    delete init;
}

function checkOS() {
    if(navigator.userAgent.indexOf("Android") > 0) {
        $("script").attr("src", "cordova/android/cordova-2.5.0.js").appendTo("head");
    }
    else if(navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("iPad") > 0 || navigator.userAgent.indexOf("iPod") > 0) {
        $("script").attr("src", "cordova/ios/cordova-2.5.0.js").appendTo("head");
    }
}

function checkPreAuth() {
	console.log("checkPreAuth");
    var form = $("#loginForm");
    if(window.localStorage["username"] != '' && window.localStorage["password"] != '' && window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
        $("#username", form).val(window.localStorage["username"]);
        $("#password", form).val(window.localStorage["password"]);
        handleLogin();
    }
}

function handleLogin() {
    var form = $("#loginForm");
    //disable the button so we can't resubmit while we wait
    $("#submitButton",form).attr("disabled","disabled");
    var u = $("#username", form).val();
    var p = $("#password", form).val();
    var pn = 'sander';
    if(u != '' && p!= '') {
        $.post("http://eerstelinks.nl/api/v1/authenticate", {username:u,password:p,pathname:pn}, function(res) {
        	console.log(typeof(res));
        	console.log(res);

            if(res.status == 'success') {
                //store
                window.localStorage["username"] = u;
                window.localStorage["password"] = p;
                $.mobile.changePage("some.html");
                //window.location.replace("some.html");
            } else if(res.status == 'error') {
            	navigator.notification.alert(res.message);
            } else {
                navigator.notification.alert("Log in mislukt", function() {});
            }
         $("#submitButton").removeAttr("disabled");
        },"json");
    } else {
        navigator.notification.alert("E-mail adres en wachtwoord invoeren", function() {});
        $("#submitButton").removeAttr("disabled");
    }
    return false;
}

function deviceReady() {

	$("#loginPage").on("pageinit",function() {
		$("#loginForm").on("submit",handleLogin);
		checkPreAuth();
	});
	$.mobile.changePage("#loginPage");
}

function logout() {
    //navigator.notification.alert("clicked logout");
    window.localStorage["username"] = '';
    window.localStorage["password"] = '';
    window.location.replace("index.html");
}