function init() {
    checkOS();

    document.addEventListener("deviceready", deviceReady, true);
    //delete init;
}

function deviceReady() {
    document.addEventListener("online", onOnline, false);
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);

    checkCredentials();
}

function something() {
    console.log('something');
}

function checkOS() {
    if(navigator.userAgent.indexOf("Android") > 0) {
        $("script").attr("src", "cordova/android/cordova-2.5.0.js").appendTo("head");
    }
    else if(navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("iPad") > 0 || navigator.userAgent.indexOf("iPod") > 0) {
        $("script").attr("src", "cordova/ios/cordova-2.5.0.js").appendTo("head");
    }
}

function onOnline() {
    // set app to 'online' in some kind of variable
    console.log('you\'re online :D');
}

function onOffline() {
    // set app to 'offline' in some kind of variable
    console.log('you\'re offline :(');
}

function onPause() {
    console.log('pause');
}

function onResume() {
    console.log('resume');
}

function checkCredentials() {
    console.log('check credentials');

    if(window.localStorage["username"] == undefined && window.localStorage["password"] == undefined) {
        // send to login window, first login
        console.log('username and password undefined');
    } else if(window.localStorage["username"] != undefined && window.localStorage["password"] == undefined) {
        // fill in username, username known but password undefined (probably logged out)
        console.log('username defined, password undefined');
        // set form var
        //var form = $("#login-form");
        // fill in the username from local storage

        //$("input[name='username']").val(window.localStorage["username"]);

        document.getElementById('login-form-username').value = window.localStorage["username"];// $("input[name='username']").val(window.localStorage["username"]);
    } else if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
        // login automatically, username and password known
        console.log('username and password defined');
        //var form = $("#login-form");
        //$("#login-form-username", form).val(window.localStorage["username"]);
        //$("#login-form-password", form).val(window.localStorage["password"]);
        document.getElementById('login-form-username').value = window.localStorage["username"];
        document.getElementById('login-form-password').value = window.localStorage["password"];
        login();
    }
}

function login() {
    //
    console.log("login");
    /*window.localStorage["username"] = 'sander';
    window.localStorage["password"] = 'test';
    window.location.replace("menu.html");*/

    var form = $("#login-form");
    //disable the button so we can't resubmit while we wait
    $("#login-form-submit",form).attr("disabled","disabled");
    var u = $("#login-form-username", form).val();
    var p = $("#login-form-password", form).val();
    //var pn = 'sander';

    if(u != '' && p!= '') {
        console.log('if');
        $.mobile.loading('show');
        //$.post("http://eerstelinks.nl/api/v1/authenticate", {username:u,password:p,pathname:pn}, function(res) {
        $.post("http://eerstelinks.nl/api/v1/authenticate", {username:u,password:p}, function(res) {
            console.log('post');
            console.log(typeof(res));
            console.log(res);

            if(res.status == 'success') {
                //store
                window.localStorage["username"] = u;
                window.localStorage["password"] = p;
                //$.mobile.changePage("some.html");

                $.mobile.loading('hide');


                window.location.replace("menu.html");
            } else if(res.status == 'error') {
                navigator.notification.alert(res.message);
                $.mobile.loading('hide');
            } else {
                navigator.notification.alert("Log in mislukt", function() {});
                $.mobile.loading('hide');
            }
         $("#login-form-submit").removeAttr("disabled");
        },"json");
    } else {
        console.log('else');
        navigator.notification.alert("E-mail adres en wachtwoord invoeren", function() {});
        $("#login-form-submit").removeAttr("disabled");
    }
    return false;
}