function init() {
    console.log('init');

    checkOS();

    document.addEventListener("deviceready", deviceReady, false);
    // delete init; ???
}

function deviceReady() {
    console.log('deviceReady');

    document.addEventListener("online", onOnline, false);
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);

    checkCredentials();
}

function checkOS() {
    console.log('checkOS');

    if(navigator.userAgent.indexOf("Android") > 0) {
        $("script").attr("src", "cordova/android/cordova-2.5.0.js").appendTo("head");
    }
    else if(navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("iPad") > 0 || navigator.userAgent.indexOf("iPod") > 0) {
        $("script").attr("src", "cordova/ios/cordova-2.5.0.js").appendTo("head");
    }
}

function onOnline() {
    // set app to 'online' in some kind of variable
    console.log('online :D');
}

function onOffline() {
    // set app to 'offline' in some kind of variable
    console.log('offline :(');
}

function onPause() {
    console.log('pause');
}

function onResume() {
    console.log('resume');
}

function checkCredentials() {
    console.log('checkCredentials');

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
    console.log('login');

    //var form = $("#login-form");
    //disable the button so we can't resubmit while we wait
    $("#login-form-submit").attr("disabled","disabled");
    var u = $("#login-form-username").val();
    var p = $("#login-form-password").val();

    if(u != '' && p!= '') {
        console.log('if');
        $.mobile.loading('show');
        //$.post("http://eerstelinks.nl/api/v1/authenticate", {username:u,password:p,pathname:pn}, function(res) {
        $.post("http://eerstelinks.nl/api/v1/authenticate", {username:u,password:p}, function(res) {
            //console.log('post');
            //console.log(typeof(res));
            //console.log(res);

            if(res.status == 'success') {
                //store
                window.localStorage["username"] = u;
                window.localStorage["password"] = p;

                // stop loading animation
                $.mobile.loading('hide');
                // replace page with menu.html (for android back button)
                //window.location.replace("menu.html");
                $.mobile.changePage('#menu-page')
            } else if(res.status == 'error') {
                $.mobile.loading('hide');
                navigator.notification.alert(res.message);
            } else {
                $.mobile.loading('hide');
                navigator.notification.alert("Log in mislukt", function() {});
            }
         $("#login-form-submit").removeAttr("disabled");
        },"json");
    } else {
        //console.log('else');
        navigator.notification.alert("E-mail adres en wachtwoord invoeren", function() {});
        $("#login-form-submit").removeAttr("disabled");
    }
    return false;
}

function test24() {
    console.log('i hate JS');
}

function logout() {
    //
    console.log('logout');
    delete window.localStorage["password"];
    //window.location.replace("index.html");
    refreshPage();
    $.mobile.changePage('#login-page');
}

function refreshPage() {
    $.mobile.changePage(window.location.href, { allowSamePageTransition : true,
                                                transition              : 'none',
                                                showLoadMsg             : false,
                                                reloadPage              : true });
}