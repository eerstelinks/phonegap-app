var pictureSource;   // picture source
var destinationType; // sets the format of returned value

var app = {

// vars
test: 'testregergerg',
test2: 'test2ergregerg',
test3: undefined,

// -----------
// initialize: Application Constructor
// -----------
initialize: function() {
    this.checkOS();
    document.addEventListener('deviceready', this.onDeviceReady, false);
},

// --------
// checkOS: checks whether the OS is iOS or Android and loads the correct cordova version
// --------
checkOS: function() {
    // check OS version and load correct cordova.js
    if(navigator.userAgent.indexOf("Android") > 0) {
        $("script").attr("src", "cordova/android/cordova-2.5.0.js").appendTo("head");
    }
    else if(navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("iPad") > 0 || navigator.userAgent.indexOf("iPod") > 0) {
        $("script").attr("src", "cordova/ios/cordova-2.5.0.js").appendTo("head");
    }
},

// --------------
// onDeviceReady: when 'device ready' event is received load the other event listeners and call checkCredentials()
// --------------
onDeviceReady: function() {
    console.log('device ready');

    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;

    document.addEventListener('pause', app.onPause, false);
    document.addEventListener('resume', app.onResume, false);
    document.addEventListener('online', app.onOnline, false);
    document.addEventListener('offline', app.onOffline, false);
    document.addEventListener('backbutton', app.onBackButton, false);
    document.addEventListener('menubutton', app.onMenuButton, false);

    app.checkCredentials();
},

// --------
// onPause: triggered when app is 'paused', ie: pressed home button or screen turns off etc.
// --------
onPause: function() {
    console.log('pause');
},

// ---------
// onResume: triggered when app is resumed from 'paused' state.
// ---------
onResume: function() {
    console.log('resume');
},

// ---------
// onOnline: triggered when internet connection is established
// ---------
onOnline: function() {
    console.log('online');
},

// ----------
// onOffline: triggered when the internet connection is lost
// ----------
onOffline: function() {
    console.log('offline');
},

// -------------
// onBackButton: catches back button calls and redirects users to the correct pages
// -------------
onBackButton: function() {
    // for android, check where the user should go to instead of 'back'
    console.log('back button');

    if($.mobile.activePage.attr('id') == 'menu-page') {
        // if user is in the menu page and presses back -> exit app
        app.exitApp();
    }
    if($.mobile.activePage.attr('id') == 'login-page') {
        // if user is on the 'login' page and presses 'back' -> exit app
        app.exitApp();
    }
    if ($.mobile.activePage.attr('id') == 'photo-succes-page') {
        $.mobile.changePage('#menu-page');
    }
    if ($.mobile.activePage.attr('id') == 'test-page') {
        $.mobile.changePage('#menu-page');
    }
},

// -------------
// onMenuButton: detects menu button trigger for Android devices
// -------------
onMenuButton: function() {
    console.log('menu button');
    // maybe send user to a 'settings' page if/when one is needed/implemented
},

// ----------------
// checkConnection: checks internet connection and returns a boolean (might be better to check for 'unknown' and 'none')
// ----------------
checkConnection: function() {
    console.log('check connection');
    var con = navigator.connection.type;

    if(con == 'wifi' || con == 'ethernet' || con == 'cell_2g' || con == 'cell_3g' || con == 'cell_4g') {
        // return true (there is a connection)
        return true;
    } else {
        // con == 'unknown' || con == 'none'
        // return false (no connection)
        return false;
    }
},

// --------
// exitApp: exits the application (not pause but exit)
// --------
exitApp: function() {
    console.log('exit app');
    navigator.app.exitApp();
},

// -----------------
// checkCredentials:
//
// usage: checks for existing credentials
//        if username and password are stored then submit the credentials to the login() function
//        if only the username is known then the user probably logged out so direct the user to the login page and fill in his/her username
//        if neither username or password is known do nothing/send the user to the login page
// -----------------
checkCredentials: function() {
    console.log('check credentials');
    $.mobile.loading('show');

    if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
        // login automatically, username and password known
        console.log('username and password defined');
        $.mobile.loading('hide');
        app.login('checkCredentials');
    } else if(window.localStorage["username"] != undefined && window.localStorage["password"] == undefined) {
        // fill in username, username known but password undefined (probably logged out)
        console.log('username defined, password undefined');
        $("#login-form-username").val(window.localStorage["username"]);
        $.mobile.loading('hide');
        $.mobile.changePage('#login-page');
    } else {
        $.mobile.loading('hide');
        $.mobile.changePage('#login-page');
    }
},

// ------
// login:
//
// usage: collect the username and password from the login form and submit a POST request to the server
//        if the username + password combination is correct we receive a JSON object with the username/pathnames/session
//        if the credentials are incorrect give a warning message to the user
// ------
login: function(from) {
    console.log('login');

    var u = '';
    var p = '';

    // show loading animation
    $.mobile.loading('show');

    // login was called from login form
    if(from == 'login-form') {
        console.log('from login-form');
        // disable the login button while we check the username and password
        $("#login-form-submit").attr("disabled","disabled");

        // retrieve form values
        var u = $("#login-form-username").val();
        var p = $("#login-form-password").val();
    } else if(from == 'checkCredentials') /* login was called from checkCredentials() */ {
        console.log('from check credentials');

        // retrieve username and password form local storage
        var u = window.localStorage["username"];
        var p = window.localStorage["password"];
    }

    // if username and password not empty
    if(u != '' && p!= '') {
        // try / catch connection
        // should check for internet connection too
        try {
            // console.log('try');
            // submimt post request to the server
            $.post("http://eerstelinks.nl/api/v1/authenticate", {username:u,password:p}, function(res) {
                //console.log(res);

                // if the 'status' in the JSON object is 'succes'
                if(res.status == 'success') {
                    //store user info
                    window.localStorage["username"] = u;
                    window.localStorage["password"] = p;
                    window.localStorage["session"] = res.session;
                    window.localStorage["pathnames"] = res.pathnames;

                    console.log('login succes');
                    console.log('username: ' + window.localStorage["username"]);
                    console.log('password: ' + window.localStorage["password"]);
                    console.log('pathnames: ' + window.localStorage["pathnames"]);
                    console.log('session: ' + window.localStorage["session"]);

                    // stop loading animation
                    $.mobile.loading('hide');

                    // load menu page
                    $.mobile.changePage('#menu-page');
                } else if(res.status == 'error') /* if status is 'error' */ {
                    // stop loading animation
                    $.mobile.loading('hide');

                    // show error message to user
                    navigator.notification.alert(res.message);
                } else /* else (unknown error) show error message to user */ {
                    // hide loading animation
                    $.mobile.loading('hide');

                    // error message to user
                    navigator.notification.alert("Log in mislukt");
                }

                // re-enable the login button
                $("#login-form-submit").removeAttr("disabled");
            },"json");
        } catch (err) /* catch for POST connection */ {
            // catch error
            // should make this a bit prettier (maybe quit app or something)
            navigator.notification.alert('There was an error connecting to the server: ' + err.message);
            console.log('catch error: ' + err.message);
        }
    } else /* if username or password is empty show error message */ {
        // stop loading animation
        $.mobile.loading('hide');

        // show error message
        navigator.notification.alert("E-mail adres en wachtwoord invoeren");

        // re-enable the login button
        $("#login-form-submit").removeAttr("disabled");
    }
    return false;
},

// -------
// logout: destroy the stored password/pathnames/session and empty the password field on the login page and redirect the user to the login page
// -------
logout: function() {
    console.log('logout');

    // show loading animation
    $.mobile.loading('show');

    // delete stored user info
    delete window.localStorage["password"];
    delete window.localStorage["pathnames"];
    delete window.localStorage["session"];
    delete window.localStorage["pathnames"]

    // send post to server to destroy session
    // this is why the loading animation is needed

    // reset the login form
    $("#login-form-password").val('');
    $("#login-form-username").val(window.localStorage["username"]);

    // go to login page
    $.mobile.loading('hide');
    $.mobile.changePage('#login-page');
},

// ----------------------------------------------------------------------
//
// Camera functions section
//
// ----------------------------------------------------------------------
onPhotoDataSuccess: function(imageData) {
    // Uncomment to view the base64 encoded image data
    // console.log(imageData);

    // Get image handle
    //
    var smallImage = document.getElementById('smallImage');

    // Unhide image elements
    //
    smallImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    var largeImage = document.getElementById('largeImage');
    largeImage.style.display = 'none';

    smallImage.src = "data:image/jpeg;base64," + imageData;
    $.mobile.changePage('#photo-succes-page');
},

// Called when a photo is successfully retrieved
//
onPhotoURISuccess: function(imageURI) {
    // Uncomment to view the image file URI
    // console.log(imageURI);

    // Get image handle
    //
    var largeImage = document.getElementById('largeImage');

    // Unhide image elements
    //
    largeImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    var smallImage = document.getElementById('smallImage');
    smallImage.style.display = 'none';
    //
    largeImage.src = imageURI;
    $.mobile.changePage('#photo-succes-page');
},

// A button will call this function
//
capturePhoto: function() {
    console.log('capture photo');
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(app.onPhotoDataSuccess, app.onFail, { quality: 60,
        destinationType: destinationType.DATA_URL });
},

// A button will call this function
//
capturePhotoEdit: function() {
    console.log('capture photo edit');
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(app.onPhotoDataSuccess, app.onFail, { quality: 20, allowEdit: true,
        destinationType: destinationType.DATA_URL });
},

// A button will call this function
//
getPhoto: function(source) {
    console.log('get photo, source: ' + source);
    // Retrieve image file location from specified source
    navigator.camera.getPicture(app.onPhotoURISuccess, app.onFail, { quality: 60,
        destinationType: destinationType.FILE_URI,
        sourceType: source });
},

// Called if something bad happens.
//
onFail: function(message) {
    console.log('fail: ' + message);
    alert('Failed because: ' + message);
},

uploadText: function() {
    console.log('upload text');
},

settings: function() {
    console.log('settings');
},

info: function() {
    console.log('info');
    //test = 'test';
    //test2 = 'test2';
    app.test3 = 'uhweiughweiughweiuhgewg';

    console.log('test: ' + app.test);
    console.log('test2: ' + app.test2);
    console.log('test3: ' + app.test3);
    var x = screen.width;
    var y = screen.height;
    console.log('x: ' + x);
    console.log('y: ' + y);
},

toTest: function() {
    console.log('to test');
    $.mobile.changePage('#test-page');
},

toMenu: function(from) {
    console.log('to menu, from: ' + from);
    $.mobile.changePage('#menu-page');
},
// ------------------[ test functions ]--------------------

testConn: function() {
    console.log('test connection');
    if(app.checkConnection()) {
        console.log('there is a connection');
    } else {
        console.log('there is no connection');
    }
}
};
