var app = {

    // Application Constructor
    initialize: function() {
        this.checkOS();
        this.bindEvents();
    },

    checkOS: function() {
        // check OS version and load correct cordova.js
        console.log('checkOS');

        if(navigator.userAgent.indexOf("Android") > 0) {
            $("script").attr("src", "cordova/android/cordova-2.5.0.js").appendTo("head");
        }
        else if(navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("iPad") > 0 || navigator.userAgent.indexOf("iPod") > 0) {
            $("script").attr("src", "cordova/ios/cordova-2.5.0.js").appendTo("head");
        }
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        console.log('bindEvents');
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
        document.addEventListener('online', this.onOnline, false);
        document.addEventListener('offline', this.onOffline, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log('onDeviceReady');
        this.checkCredentials();
    },

    onPause: function() {
        console.log('onPause');
    },

    onResume: function() {
        console.log('onResume');
    },

    onOnline: function() {
        console.log('onOnline');
    },

    onOffline: function() {
        console.log('onOffline');
    },

    checkCredentials: function() {
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
            this.login();
        }
    },

    login: function() {
        console.log('login');

        $("#login-form-submit").attr("disabled","disabled");
        var u = $("#login-form-username").val();
        var p = $("#login-form-password").val();

        if(u != '' && p!= '') {
            $.mobile.loading('show');

            $.post("http://eerstelinks.nl/api/v1/authenticate", {username:u,password:p}, function(res) {

                if(res.status == 'success') {
                    //store
                    window.localStorage["username"] = u;
                    window.localStorage["password"] = p;

                    // stop loading animation
                    $.mobile.loading('hide');
                    // replace page with menu.html (for android back button)
                    //window.location.replace("menu.html");
                    $.mobile.changePage('#menu-page');
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
            navigator.notification.alert("E-mail adres en wachtwoord invoeren", function() {});
            $("#login-form-submit").removeAttr("disabled");
        }
        return false;
    },

    logout: function() {
        console.log('logout');
        delete window.localStorage["password"];
        $("#login-form-password").val('');
        $.mobile.changePage('#login-page');
    },

    testOn: function() {
        console.log('testOn');
        $.mobile.loading('show');
    },

    testOff: function() {
        console.log('testOff');
        $.mobile.loading('hide');
    }
};
