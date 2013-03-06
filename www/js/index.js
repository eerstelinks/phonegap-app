function init() {
    document.addEventListener("deviceready", deviceReady, true);
    delete init;
}


function checkPreAuth() {
    var form = $("#loginForm");
    if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
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
    //console.log("click");
    if(u != '' && p!= '') {
        $.post("http://eerstelinks.nl/api/v1/authenticate", {username:u,password:p,pathname:pn}, function(res) {
            console.log(res);
            console.log(typeof(res));

            if(res.status == 'success') {
                navigator.notification.alert('success');
                //store
                // pathname, username (email), password
                window.localStorage["username"] = u;
                window.localStorage["password"] = p;

                $.mobile.changePage("menu.html");
                window.location.href="menu.html"
            } else if(res.status == 'error') {
                navigator.notification.alert(res.message);
            } else {
                navigator.notification.alert("Your login failed", function() {});
            }

            $("#submitButton").removeAttr("disabled");
        },"json");
    } else {
        //Thanks Igor!
        navigator.notification.alert("You must enter a username and password", function() {});
        $("#submitButton").removeAttr("disabled");
    }
    return false;
}

function deviceReady() {
    $("#loginForm").on("submit",handleLogin);
}