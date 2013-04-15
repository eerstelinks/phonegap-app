
var app = {

    // ---------
    // variables
    //----------
    authenticate_url: "http://eerstelinks.nl/api/v1/authenticate",
    image_upload_url: "http://eerstelinks.nl/api/v1/post/image-ajax",
    attempts: 0,
    URI: undefined,
    device_width: undefined,
    device_height: undefined,
    pathnames: undefined,

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

        document.addEventListener('pause', app.onPause, false);
        document.addEventListener('resume', app.onResume, false);
        document.addEventListener('online', app.onOnline, false);
        document.addEventListener('offline', app.onOffline, false);
        document.addEventListener('backbutton', app.onBackButton, false);
        document.addEventListener('menubutton', app.onMenuButton, false);

        app.getDeviceResolution();
        app.checkCredentials();
    },


    getDeviceResolution: function() {
        app.device_width = screen.width;
        app.device_height = screen.height;
    },

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                   Event Listener functions section
    //
    // ----------------------------------------------------------------------------------------------------------

    // --------
    // onPause: triggered when app is 'paused', ie: pressed home button or screen turns off etc.
    // --------
    onPause: function() {
        //console.log('pause');
    },

    // ---------
    // onResume: triggered when app is resumed from 'paused' state.
    // ---------
    onResume: function() {
        //console.log('resume');
    },

    // ---------
    // onOnline: triggered when internet connection is established
    // ---------
    onOnline: function() {
        //console.log('online');
    },

    // ----------
    // onOffline: triggered when the internet connection is lost
    // ----------
    onOffline: function() {
        //console.log('offline');
    },

    // -------------
    // onBackButton: Catches back button calls and redirects users to the correct pages.
    //               Necessary for android back button usage.
    //               Warning: By using the onBackButton to capture back button events the back button
    //               will no longer work on the device unless the even is handled here !
    // -------------
    onBackButton: function() {
        //console.log('back button');

        if ($.mobile.activePage.attr('id') == 'loading-page') {
            // if for some reason the user gets stuck on the loading page let the user exit the app
            app.exitApp();
        }
        if ($.mobile.activePage.attr('id') == 'menu-page') {
            // if user is in the menu page and presses back -> exit app
            app.exitApp();
        }
        if ($.mobile.activePage.attr('id') == 'login-page') {
            // if user is on the 'login' page and presses 'back' -> exit app
            app.exitApp();
        }
        if ($.mobile.activePage.attr('id') == 'photo-succes-page') {
            // if the user is on the 'photo succes' page and presses back -> go to menu page
            $.mobile.changePage('#menu-page');
        }
        if ($.mobile.activePage.attr('id') == 'info-page') {
            // if the user is on the 'info' page and presses back -> go to menu page
            $.mobile.changePage('#menu-page');
        }
        if ($.mobile.activePage.attr('id') == 'settings-page') {
            // if the user is on the 'settings' page and presses back -> go to menu page
            $.mobile.changePage('#menu-page');
        }
        if ($.mobile.activePage.attr('id') == 'feedback-page-page') {
            // if the user is on the 'settings' page and presses back -> go to menu page
            $.mobile.changePage('#menu-page');
        }
    },

    // -------------
    // onMenuButton: detects menu button trigger for Android devices
    // -------------
    onMenuButton: function() {
        //console.log('menu button');
        // not implemented yet, may not be necessary
        // update: menu button deprecated since jan 2012 by Google
    },

    // ------------
    // isConnected: checks internet connection and returns a boolean (might be better to check for 'unknown' and 'none')
    // ------------
    isConnected: function() {
        //console.log('check connection');

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
    // exitApp: exits the application (not pause but exit, kills the app)
    // --------
    exitApp: function() {
        //console.log('exit app');
        navigator.app.exitApp();
    },

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                      Authentication functions section
    //
    // ----------------------------------------------------------------------------------------------------------

    // -----------------
    // checkCredentials:
    //
    // usage: checks for existing credentials
    //        if username and password are stored then submit the credentials to the login() function
    //        if only the username is known then the user probably logged out so direct the user to the login page and fill in his/her username
    //        if neither username or password is known do nothing/send the user to the login page
    // -----------------
    checkCredentials: function() {
        //console.log('check credentials');

        // show loading animation whilst checking creds
        $.mobile.loading('show');

        // if the user is connected to internet
        if (app.isConnected()) {
            // both username and password exist -> go to login() function
            if(window.localStorage['username'] != undefined && window.localStorage['password'] != undefined) {
                //console.log('username and password defined');

                // hide loading animation
                $.mobile.loading('hide');

                // go to login() function
                app.login('checkCredentials');
            } else if(window.localStorage['username'] != undefined && window.localStorage['password'] == undefined) {
                // username exists but password does not -> send to login() function
                //console.log('username defined, password undefined');

                // fill in the username in the login form
                $('#login-form-username').val(window.localStorage['username']);

                // hide loading animation
                $.mobile.loading('hide');

                // go to login page
                $.mobile.changePage('#login-page');
            } else /* NEITHER username or password exist, first time use -> send to login page */{
                // hide loading animation
                $.mobile.loading('hide');

                // go to login page
                $.mobile.changePage('#login-page');
            }
        } else /* the user is NOT connected to internet */ {
            // hide loading animation
            $.mobile.loading('hide');

            // send an alert to notify the user
            navigator.notification.alert('Geen internet verbinding!');

            // go to login page
            $.mobile.changePage('#login-page');
        }
    },

    // ------
    // login: collect the username and password from the login form and submit a POST request to the server
    //        if the username + password combination is correct we receive a JSON object with the username/pathnames/session
    //        if the credentials are incorrect give a warning message to the user
    // ------
    login: function(from) {
        //console.log('login');

        // check internet connection
        if (app.isConnected()) {
            var username = '';
            var password = '';

            // show loading animation
            $.mobile.loading('show');

            // login was called from login form
            if(from == 'login-form') {
                // disable the login button while we check the username and password
                $('#login-form-submit').attr("disabled","disabled");

                // retrieve form values
                var username = $('#login-form-username').val();
                var password = $('#login-form-password').val();
            } else if(from == 'checkCredentials') /* login was called from checkCredentials() */ {
                // retrieve username and password form local storage
                var username = window.localStorage['username'];
                var password = window.localStorage['password'];
            }

            // if username and password not empty
            if(username != '' && password!= '') {
                // try / catch connection
                try {
                    $.post(app.authenticate_url, {'username':username,'password':password}, function(res) {
                        // if the 'status' in the JSON object is 'succes'
                        if(res.status == 'success') {
                            //store user info
                            window.localStorage['username'] = username;
                            window.localStorage['password'] = password;
                            window.localStorage['session'] = res.session;
                            window.localStorage['pathnames'] = res.pathnames;

                            // localStorage stores only String key/value pairs
                            // store the pathnames in an array
                            var pns = window.localStorage['pathnames'];
                            app.pathnames = pns.split(',');

                            // if user has more than 1 pathname let him/her choose active pathname/website
                            //
                            if(app.pathnames.length > 1) {
                                console.log('more than 1 pathname!');

                                // stop loading animation
                                $.mobile.loading('hide');

                                // hide choose-pathname-icon
                                $('#pathname_choice_icon_div').show();

                                // if active pathname already set go straight to menu page
                                if (window.localStorage['active-pathname'] == undefined) {
                                    // load menu page
                                    $.mobile.changePage('#pathname-choice-page');
                                } else {
                                    // load menu page
                                    $.mobile.changePage('#menu-page');
                                }

                            } else /* if only 1 pathname go directly to menu page */ {
                                console.log('just 1 pathname!');
                                // stop loading animation
                                $.mobile.loading('hide');

                                // set active pathname
                                window.localStorage['active-pathname'] = app.pathnames[0];

                                // hide choose-pathname-icon
                                $('#pathname_choice_icon_div').hide();

                                // load menu page
                                $.mobile.changePage('#menu-page');
                            }

                        } else if(res.status == 'error') /* if status is 'error' */ {
                            // stop loading animation
                            $.mobile.loading('hide');

                            // show error message to user
                            navigator.notification.alert(res.message);
                        } else /* else (unknown error) show error message to user */ {
                            // hide loading animation
                            $.mobile.loading('hide');

                            // error message to user
                            navigator.notification.alert('Log in mislukt');
                        }

                        // re-enable the login button
                        $('#login-form-submit').removeAttr("disabled");
                    },'json');
                } catch (err) /* catch for POST connection */ {
                    // should make this a bit prettier (maybe quit app or something)
                    navigator.notification.alert('There was an error connecting to the server: ' + err.message);
                    //console.log('catch error: ' + err.message);
                }
            } else /* if username or password is empty show error message */ {
                // stop loading animation
                $.mobile.loading('hide');

                // show error message
                navigator.notification.alert('E-mail adres en wachtwoord invoeren');

                // re-enable the login button
                $('#login-form-submit').removeAttr("disabled");
            }
        } else /* NOT connected to internet */ {
            navigator.notification.alert('Geen internet verbinding!');
        }
    },

    // -------
    // logout: destroy the stored password/pathnames/session and empty the password field on the login page and redirect the user to the login page
    // -------
    logout: function() {
        //console.log('logout');

        // show loading animation
        $.mobile.loading('show');

        // delete stored user info
        delete window.localStorage['password'];
        delete window.localStorage['pathnames'];
        delete window.localStorage['session'];
        delete window.localStorage['active-pathname'];


        // send post to server to destroy session
        // this is why the loading animation is needed
        // still needs to be implemented

        // reset the login form
        $('#login-form-password').val('');
        $('#login-form-username').val(window.localStorage['username']);

        // go to login page
        $.mobile.loading('hide');
        $.mobile.changePage('#login-page');
    },

    checkSession: function() {
        //console.log('check session');

        var session = window.localStorage['session'];
        var action = 'checksession';
        var return_val;

        // should check for connection first ofc
        $.post(app.authenticate_url, {'session':session,'action':action}, function(res) {
            if (res.status == 'success') {
                console.log('res.status: ' + res.status);
                console.log(res.debug);
                console.log(typeof(res));
                return_val = true;
            } else if (res.status == 'error') {
                console.log('res.status: ' + res.status);
                console.log(res);
                console.log('check session error: ' + res.message);
                return_val = false;
            } else {
                console.log('check session else');
            }
        },'json');

        return return_val;
    },

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                          Camera functions section
    //
    // ----------------------------------------------------------------------------------------------------------

    // -------------
    // capturePhoto: Triggered by a button. Brings up the camera interface
    // -------------
    capturePhoto: function() {
        //console.log('capture photo');

        // needs some more work
        // check docs for 'CameraPopoverOptions' for iOS quirks
        //http://docs.phonegap.com/en/2.5.0/cordova_camera_camera.md.html#Camera

        // set the options for taking photos
        var options = {quality: 80,
                       destinationType: Camera.DestinationType.FILE_URI,
                       sourceType: Camera.PictureSourceType.CAMERA,
                       allowEdit: false,
                       encodingType: Camera.EncodingType.JPEG,
                       targetWidth: 1280,
                       targetHeight: 1280,
                       popoverOptions: CameraPopoverOptions,
                       correctOrientation: true,
                       saveToPhotoAlbum: true};

        // capture photo with specified options
        navigator.camera.getPicture(app.onPhotoURISuccess, app.onCaptureOrGetFail, options);
    },

    // ---------
    // getPhoto: Triggered by a button. Brings up the device library to select a photo
    // ---------
    getPhoto: function(source) {
        //console.log('get photo');

        // set options for getting photo's from library
        var options = {quality: 80,
                       destinationType: Camera.DestinationType.FILE_URI,
                       sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                       targetWidth: 1280,
                       targetHeight: 1280};

        navigator.camera.getPicture(app.onPhotoURISuccess, app.onCaptureOrGetFail, options);
    },

    // ------------------
    // onPhotoURISuccess: Called when a photo is successfully retrieved from library or camera
    // ------------------
    onPhotoURISuccess: function(imageURI) {
        // set class variable URI so that we can use it in case we need to retry an attempt (android glitch)
        app.URI = imageURI;

        $('#checkImage').removeAttr('src');

        //  get the checkImage <img> from the photo-success-page and set the source of the img
        //var checkImage = document.getElementById('checkImage');
        //checkImage.src = imageURI;
        $('#checkImage').attr('src', imageURI);

        // Change page to the photo view page
        $.mobile.changePage('#photo-success-page');
    },

    // -------
    // onFail: Called when error occurs during camera launch or library launch
    // -------
    onCaptureOrGetFail: function(message) {
        console.log('fail: ' + message);
        //navigator.notification.alert('Fout: ' + message);
    },

    // ------------
    // uploadPhoto: Attemps to upload the photo
    // ------------
    uploadPhoto: function() {
        // disable upload button while uploading
        $('#upload-photo-submit').attr("disabled","disabled");

        imageURI = app.URI;

        console.log('upload photo');
        console.log('imageURI: ' + imageURI);

        // show loading animation while trying to upload
        //$.mobile.loading('show');

        // alternate loading animation with text, needs new theme though
        $.mobile.loading('show',{text: 'uploading', textVisible: true, theme: 'a'});

        // set options for upload
        var options = new FileUploadOptions();
        options.fileKey = "files";
        options['file-type']='image';
        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);

        //options.mimeType="image/jpeg";
        options.mimeType=app.getMimeType(imageURI);

        // chunked mode on false because of android bug/weird behaviour
        options.chunkedMode = false;

        // gets session variable from local storage
        var session = window.localStorage['session'];

        // sets upload parameters
        var params = {};
        params.session = session
        //params.pathname = "sander";
        params.pathname = window.localStorage['active-pathname'];
        params['file-type'] = 'image';

        options.params = params;

        // try / catch file upload
        if (app.isConnected()) {
            try {
                // don't hide loading animation here but in win() or fail()
                var ft = new FileTransfer();
                ft.upload(imageURI, encodeURI(app.image_upload_url), app.uploadPhotoSuccess, app.uploadPhotoError, options);
            } catch (err) {
                // hide loading animation and show error
                $.mobile.loading('hide');
                //navigator.notification.alert('Probleem met uploaden foto, neem contact op met eerstelinks.');
                //console.log('catch upload photo error');
            }
        } else /* NOT connected to internet */ {
            navigator.notification.alert('U bent niet verbonden met internet!');
        }

        // re-enable upload button
        $('#upload-photo-submit').removeAttr("disabled");
    },

    // ------------
    // getMimeType: returns a string with the mime type of the image
    //              if unable to get valid extension then return 'jpeg' as guestimate
    //              on android and ios .gif is not supported in photo library but left it for future use
    // ------------
    getMimeType: function(imageURI) {
        var extension = imageURI.split('.').pop();

        if(extension == 'jpg' || extension == 'jpeg') {
            return 'image/jpeg';
        } else if(extension == 'png') {
            return 'image/png';
        } else if(extension == 'gif') {
            return 'image/gif';
        } else {
            return 'image/jpeg';
        }
    },

    // -------------------
    // uploadPhotoSuccess: Is triggered when status code 200 is received from server.
    //                     Warning: this means an error message will be considered a succes too because of the 200 code.
    // -------------------
    uploadPhotoSuccess: function(res) {
        //console.log('upload photo success');

        // convert response string to JSON object
        var responseJSON = jQuery.parseJSON(res.response);

        // if status = error
        if (responseJSON.status == 'error') {
            // send on to fail() function to handle error
            app.uploadPhotoError('win but status=error');
        } else {
            // stop loading animation from uploadPhoto()
            $.mobile.loading('hide');

            //navigator.notification.alert('Photo upload succes');
            navigator.notification.alert('Upload succes',false,'Succes','ok');

            // reset the attempt counter
            app.attempts = 0;

            // redirect to menu page
            $.mobile.changePage('#menu-page');
        }

        // iOS specific, cleanup temp file
        navigator.camera.cleanup( app.cleanupSuccess, app.cleanupError );
    },

    // -----------------
    // uploadPhotoError: Called when file upload fails
    // -----------------
    uploadPhotoError: function(error) {
        //console.log('upload photo error');

        // for android quirk -> in case first upload fails attempt the upload again
        // first fail -> try again
        if (app.attempts == 0) {
            console.log('attempts: ' + app.attempts);

            // try upload again
            app.attempts = 1;
            app.uploadPhoto(app.URI);

        } else if (app.attempts <= 3) /* less than 3 fails -> try again */ {
            console.log('attempts: ' + app.attempts);

            //try upload again
            app.attempts += 1;
            app.uploadPhoto(app.URI);
        } else /* more than 3 failed attempts -> send error message and stop attempts */ {
            console.log('attempts: ' + app.attempts);

            // reset attempts
            app.attempts = 0;

            // stop loading animation from uploadPhoto()
            $.mobile.loading('hide');

            // show error message to user
            navigator.notification.alert('Er is een fout opgetreden, neem contact op met eerstelinks',false,'Error','ok');

            // redirect to menu page
            $.mobile.changePage('#menu-page');
        }
    },

    // --------------
    // cleanupSucces: Called after succesfully cleaning up temp files (iOS only)
    // --------------
    cleanupSuccess: function() {
        //console.log('cleanup success');
    },

    // --------------
    // cleanupError: Called after temp file cleanup error (iOS only)
    // --------------
    cleanupError: function() {
        //console.log('cleanup error');
    },

    settings: function() {
        //console.log('settings');
        //$.mobile.changePage('#settings-page');
    },

    info: function() {
        //console.log('info');
        //$.mobile.changePage('#info-page');
    },

    feedback: function() {
        //console.log('feedback');
        //$.mobile.changePage('#feedback-page');
    },

    elementWithIdExists: function(el) {
        console.log('element with ID exists');

        var tmp = document.getElementById(el);

        if (tmp != null || tmp != undefined) {
            console.log('#' + el + ' exists!');
            return true;
        } else {
            console.log('#' + el + ' does NOT exist :(!');
            return false;
        }
    },

    populatePathnameButtons: function() {
        console.log('pop buttons');

        $('#pathname-choice').empty();

        for (var i=0; i<app.pathnames.length; i++) {
            var button = $('<button id="' + app.pathnames[i] + '">' + app.pathnames[i] + '</button>');
            $('#pathname-choice').append(button);
            button.button();

            var script = '<script type="text/javascript">$("#' + app.pathnames[i] + '").on("tap", function() { app.choosePathname("' + app.pathnames[i] + '"); });</script>';
            $('body').append(script);
        }
    },

    choosePathname: function(pn) {
        console.log('chose pathname: ' + pn);
        window.localStorage['active-pathname'] = pn;

        $.mobile.changePage('#menu-page');
    }
};
