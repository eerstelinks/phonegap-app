
var app = {

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                          Variables
    //
    // ----------------------------------------------------------------------------------------------------------

    cordova_version : 'cordova-2.5.0.js',
    authenticate_url : 'https://eerstelinks.nl/api/v1/authenticate',
    image_upload_url : 'https://eerstelinks.nl/api/v1/post/image-ajax.php',
    //image_upload_url : 'https://eerstelinks.nl/api/v1/post/app/image-ajax.php',
    create_block_url : 'https://eerstelinks.nl/api/v1/post/block-data',
    feedback_url : 'https://eerstelinks.nl/api/v1/post/app-feedback',
    server_message_url : 'https://eerstelinks.nl/api/v1/get/server-message',
    all_data_url : 'https://eerstelinks.nl/api/v1/get/all-data',
    delete_block_url : 'https://eerstelinks.nl/api/v1/post/delete-element',
    add_facebook_account_url : 'https://eerstelinks.nl/connect/facebook/login.php',
    send_error_message_url : 'https://eerstelinks.nl/api/v1/post/app/error-message',
    device_language : undefined,
    attempts : 0,
    URI : undefined,
    device_width : undefined,
    device_height : undefined,
    pathnames : undefined,
    version : '2.3',
    server_message_id : undefined,
    server_message : undefined,
    active_pathname_structure : undefined,
    column_offset : 0,
    photo_location_id: undefined,
    in_app_browser: undefined,

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                          Functions
    //
    // ----------------------------------------------------------------------------------------------------------

    // -----------
    // initialize: Application Constructor
    // -----------
    init : function() {
        this.checkOS();
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // --------
    // checkOS: checks whether the OS is iOS or Android and loads the correct cordova version
    // --------
    checkOS : function() {
        if(navigator.userAgent.indexOf('Android') > 0) {
            $('script').attr('src', 'cordova/android/' + app.cordova_version).appendTo('head');
        }
        else if(navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPod') > 0) {
            $('script').attr('src', 'cordova/ios/' + app.cordova_version).appendTo('head');
        }
    },

    // --------------
    // onDeviceReady: when 'device ready' event is received load the other event listeners and call checkCredentials()
    // --------------
    onDeviceReady : function() {
        document.addEventListener('pause', app.onPause, false);
        document.addEventListener('resume', app.onResume, false);
        document.addEventListener('online', app.onOnline, false);
        document.addEventListener('offline', app.onOffline, false);
        document.addEventListener('backbutton', app.onBackButton, false);
        document.addEventListener('menubutton', app.onMenuButton, false);

        app.setDeviceResolution();
        app.setDeviceLanguage();
        app.checkCredentials();
        app.getServerMessage();
    },

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                   Event Listener functions section
    //
    // ----------------------------------------------------------------------------------------------------------

    // --------
    // onPause: triggered when app is 'paused', ie: pressed home button or screen turns off etc.
    // --------
    onPause : function() {
    },

    // ---------
    // onResume: triggered when app is resumed from 'paused' state.
    // ---------
    onResume : function() {
        //console.log('resume');
    },

    // ---------
    // onOnline: triggered when internet connection is established
    // ---------
    onOnline : function() {
        //console.log('online');
    },

    // ----------
    // onOffline: triggered when the internet connection is lost
    // ----------
    onOffline : function() {
        //console.log('offline');
    },

    // -------------
    // onBackButton: Catches back button calls and redirects users to the correct pages.
    //               Necessary for android back button usage.
    //               Warning: By using the onBackButton to capture back button events the back button
    //               will no longer work on the device unless the even is handled here !
    // -------------
    onBackButton : function() {
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
        if ($.mobile.activePage.attr('id') == 'feedback-page') {
            // if the user is on the 'settings' page and presses back -> go to menu page
            $.mobile.changePage('#menu-page');
        }
        if ($.mobile.activePage.attr('id') == 'pathname-choice-page') {
            // if the user is on the 'pathname choice' page and presses back -> go to menu page
            $.mobile.changePage('#menu-page');
        }
        if ($.mobile.activePage.attr('id') == 'social-media-page') {
            // if the user is on the 'settings' page and presses back -> go to menu page
            $.mobile.changePage('#menu-page');
        }
        if ($.mobile.activePage.attr('id') == 'choose-page-and-column-page') {
            // if the user is on the 'choose page and column' page and presses back -> go to menu page
            // acts as a 'cancel'
            $.mobile.changePage('#menu-page');
        }
        if ($.mobile.activePage.attr('id') == 'choose-section-and-column-page') {
            $.mobile.changePage('#menu-page');
        }
    },

    // -------------
    // onMenuButton: detects menu button trigger for Android devices
    // -------------
    onMenuButton : function() {
        // not implemented yet, may not be necessary
        // update: menu button deprecated since jan 2012 by Google
    },

    // ------------
    // isConnected: checks internet connection and returns a boolean (might be better to check for 'unknown' and 'none')
    // ------------
    isConnected : function() {
        var con = navigator.connection.type;

        if(con == 'wifi' || con == 'ethernet' || con == '2g' || con == '3g' || con == '4g' || con == 'cell') {
            return true;
        } else {
            // con == 'unknown' || con == 'none'
            return false;
        }
    },

    // --------
    // exitApp: exits the application (not pause but exit, kills the app)
    // --------
    exitApp : function() {
        navigator.app.exitApp();
    },

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                      Getters and setters
    //
    // ----------------------------------------------------------------------------------------------------------

    // ------------------
    // getConnectionType: returns the type of connection ('wifi', '3g', ...)
    // ------------------
    getConnectionType : function() {
        return navigator.connection.type;
    },

    // -------------------
    // setDeviceResoltion: gets the devide width and height and stores them in variables
    // -------------------
    setDeviceResolution : function() {
        app.device_width = screen.width;
        app.device_height = screen.height;
    },

    // ------------------
    // setDeviceLanguage: gets the language of the device
    // ------------------
    setDeviceLanguage : function() {
        var lang = navigator.language.split("-");
        app.device_language = lang[0];
    },

    // -----------------
    // getServerMessage: connects to the server and retrieves a message/update if there is one
    // -----------------
    getServerMessage: function() {
        // console.log('get server message');

        // return value, set to false as default to simplify and shorten the code
        var ret = false;

        // page not used yet
        $.mobile.loading('show');

        // if connected to internet then try / catch
        if (app.isConnected()) {
            try {
                var params = {'type': 'getservermessage',
                                'session': window.localStorage['session'],
                                'pathname': window.localStorage['active-pathname'],
                                'username': window.localStorage['username'],
                                'version': app.version,
                                'device_name' : device.name,
                                'device_cordova' : device.cordova,
                                'device_platform' : device.platform,
                                'device_version' : device.version,
                                'device_model' : device.model};

                $.ajax({
                    type: 'GET',
                    dataType: 'JSON',
                    url: app.server_message_url,
                    data: params,
                    async: true
                }).done(function(res) {
                    if (res.status == 'success') {
                        ret = true;
                        // console.log('ajax get server message success');

                        // check if message has already been seen (in local storage) and if message has been seen do NOT show it.
                        app.server_message_id = res.id;
                        app.server_message = res.message;

                        //if (window.localStorage[app.server_message_id] == undefined ) {
                        if (!app.isServerMessageDismissed(res.id)) {
                            app.showServerMessage(res);
                        } else {
                            app.hideServerMessage();
                        }
                    } else {
                        // console.log('ajax get server message error');
                        app.hideServerMessage();
                    }
                });
            } catch (err) {
                console.log(err);
            }
        } else /* NOT connected to internet */ {
            //console.log('create block ELSE');
            app.showAlert('Fout', 'Geen internet verbinding!');
        }

        $.mobile.loading('hide');

        return ret;
    },

    // ------------------
    // showServerMessage: sets and shows the message from the server
    // ------------------
    showServerMessage: function(res) {
        // console.log(res);

        $('#server_message_p').append(res.message);

        // show server message
        $('#server_message_div').show();
    },

    // ------------------
    // hideServerMessage: hides the message from the server
    // ------------------
    hideServerMessage: function() {
        $('#server_message_div').hide();
    },

    // ---------------------
    // dismissServerMessage: triggered when user closes the server message
    //                       stores the message in the local storage so that it isn't shown again
    // ---------------------
    dismissServerMessage: function() {
        // set message as seen in local storage
        window.localStorage[app.server_message_id] = app.server_message;

        $('#server_message_div').empty();
        $('#server_message_div').hide();
    },

    // -------------------------
    // isServerMessageDismissed: checks if a message with the given ID has been dismissed
    // -------------------------
    isServerMessageDismissed: function(server_message_id) {
        var ret = false;

        // check if server message has already been dismissed or not
        if (window.localStorage[server_message_id] != undefined && window.localStorage[server_message_id] != '') {
            ret = true;
        }

        return ret;
    },

    // ----------
    // showAlert: generic method for showing alerts
    // ----------
    showAlert: function(title, server, custom) {
        if (typeof title == 'undefined' || title == '') {
            title = 'Melding';
        }

        var message;

        if (typeof server != 'undefined' && server != '') {
            message = server;
        } else if (typeof custom != 'undefined' && custom != '') {
            message = custom;
        } else {
            message = 'Oeps, er is iets mis gegaan. Probeer het opnieuw. Laat het a.u.b. weten via de feedback functie.';
        }

        navigator.notification.alert(message, false, title, 'Sluit bericht');
    },

    // whenever a user encounters an error send an error message to the server if possible
    sendErrorMessage: function() {
        console.log('send error message');

        // if connected to internet, send message to server
        if (app.isConnected()) {
            var params = {'type': 'send_error_message',
                            'session': window.localStorage['session'],
                            'pathname': window.localStorage['active-pathname'],
                            'username': window.localStorage['username'],
                            'version': app.version,
                            'device_name' : device.name,
                            'device_cordova' : device.cordova,
                            'device_platform' : device.platform,
                            'device_version' : device.version,
                            'device_model' : device.model};

            $.ajax({
                type: 'POST',
                dataType: 'JSON',
                url: app.send_error_message_url,
                data: params,
                async: true
            }).done(function(res) {
                //
            });
        } else /* NOT connected to internet -> store error message in local storage and send later */ {
            // do some stuff
        }
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
    checkCredentials : function() {
        // show loading animation whilst checking creds
        $.mobile.loading('show');

        // if the user is connected to internet
        if (app.isConnected()) {
            // both username and password exist -> go to login() function
            if(window.localStorage['username'] != undefined && window.localStorage['password'] != undefined) {
                // hide loading animation
                $.mobile.loading('hide');

                // go to login() function
                app.login('checkCredentials');
            } else if(window.localStorage['username'] != undefined && window.localStorage['password'] == undefined) {
                // username exists but password does not -> send to login() function

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
            //navigator.notification.alert('Geen internet verbinding!');
            app.showAlert('Fout', 'Geen internet verbinding');

            // go to login page
            $.mobile.changePage('#login-page');
        }
    },

    // ------
    // login: collect the username and password from the login form and submit a POST request to the server
    //        if the username + password combination is correct we receive a JSON object with the username/pathnames/session
    //        if the credentials are incorrect give a warning message to the user
    // ------
    login : function(from) {
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
                    var params = {'username' : username,
                                    'password' : password,
                                    'isapp' : 'true',
                                    'version' : app.version};

                    $.post(app.authenticate_url, params, function(res) {
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
                            if(app.pathnames.length > 1) {
                                // stop loading animation
                                $.mobile.loading('hide');

                                // show choose-pathname-icon (necessary in case hide() was previously cached)
                                // $('#pathname_choice_icon_div').show();

                                // if active pathname already set go straight to menu page
                                if (window.localStorage['active-pathname'] == undefined) {
                                    // load pathname choice page
                                    $.mobile.changePage('#pathname-choice-page');
                                } else {
                                    // load menu page
                                    $.mobile.changePage('#menu-page');
                                }

                            } else /* if only 1 pathname go directly to menu page */ {
                                //console.log('just 1 pathname!');
                                // stop loading animation
                                $.mobile.loading('hide');

                                // set active pathname
                                window.localStorage['active-pathname'] = app.pathnames[0];

                                // hide choose-pathname-icon
                                // $('#pathname_choice_icon_div').hide();

                                // load menu page
                                $.mobile.changePage('#menu-page');
                            }

                        } else if(res.status == 'error') /* if status is 'error' */ {
                            // stop loading animation
                            $.mobile.loading('hide');

                            // show error message to user
                            //navigator.notification.alert(res.message);
                            app.showAlert('Fout', res.message);
                            $.mobile.changePage('#menu-page');
                        } else /* else (unknown error) show error message to user */ {
                            // hide loading animation
                            $.mobile.loading('hide');

                            // error message to user
                            // navigator.notification.alert('Log in mislukt');
                            app.showAlert('Fout', 'Log in mislukt');
                            $.mobile.changePage('#menu-page');
                        }

                        // re-enable the login button
                        $('#login-form-submit').removeAttr("disabled");
                    },'json');
                } catch (err) /* catch for POST connection */ {
                    // should make this a bit prettier (maybe quit app or something)
                    //navigator.notification.alert('Er is een probleem opgetreden, neem contact op met eerstelinks');
                    app.showAlert('Fout');
                }
            } else /* if username or password is empty show error message */ {
                // stop loading animation
                $.mobile.loading('hide');

                // show error message
                //navigator.notification.alert('E-mail adres en wachtwoord invoeren');
                app.showAlert('Fout', 'E-mail en wachtwoord invoeren');

                // re-enable the login button
                $('#login-form-submit').removeAttr("disabled");
            }
        } else /* NOT connected to internet */ {
            //navigator.notification.alert('Geen internet verbinding!');
            app.showAlert('Fout', 'Geen internet verbinding');
        }
    },

    // -------
    // logout: destroy the stored password/pathnames/session and empty the password field on the login page and redirect the user to the login page
    // -------
    logout : function() {
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
        // update: not sure whether this is needed, keeping placeholder just in case

        // reset the login form
        $('#login-form-password').val('');
        $('#login-form-username').val(window.localStorage['username']);

        // go to login page
        $.mobile.loading('hide');
        $.mobile.changePage('#login-page');
    },

    // ---------------
    // isValidSession: Checks if session corresponds to session stored in database and returns a boolean
    // ---------------
    isValidSession : function() {
        var session = window.localStorage['session'];
        var action = 'checksession';

        // set return value on false by default to simplify and shorten the code
        var ret = false;

        // should check for connection first ofc
        var params = {'session' : session,
                        'action' : action,
                        'isapp' : 'true',
                        'version' : app.version}

        $.post(app.authenticate_url, params, function(res) {
            if (res.status == 'success') {
                ret = true;
            }
        },'json');

        return ret;
    },

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                          Camera functions section
    //
    // ----------------------------------------------------------------------------------------------------------

    // -------------
    // capturePhoto: Triggered by a button. Brings up the camera interface
    // -------------
    capturePhoto : function() {
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
        navigator.camera.getPicture(app.onCaptureOrGetSuccess, app.onCaptureOrGetFail, options);
    },

    // ---------
    // getPhoto: Triggered by a button. Brings up the device library to select a photo
    // ---------
    getPhoto : function(source) {
        // need to look into the, if any, differences between PHOTOLIBRARY and SAVEDPHOTOALBUM, suspect there is no diff for
        // iOS and Android. Might be diff for other device/OS. Should at least check for WP7.5+ for future support

        // update: PHOTOLIBRARY source is bugged in iOS 5, use SAVEDPHOTOALBUM instead

        // console.log('get photo');

        // set options for getting photo's from library (takes less options than CAMERA)
        var options = {quality: 80,
                       destinationType: Camera.DestinationType.FILE_URI,
                       sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                       targetWidth: 1280,
                       targetHeight: 1280};

        // select photo with specified options
        navigator.camera.getPicture(app.onCaptureOrGetSuccess, app.onCaptureOrGetFail, options);
    },

    // ------------------
    // onPhotoURISuccess: Called when a photo is successfully retrieved from library or camera
    // ------------------
    onCaptureOrGetSuccess : function(imageURI) {
        // console.log('on capture or get success: ' + imageURI);

        // set class variable URI so that we can use it in case we need to retry an attempt (android glitch)
        app.URI = imageURI;

        var preview_image = document.getElementById('preview_image');

        preview_image.style.display = 'block';

        preview_image.src = imageURI;

        // Change page to the photo view page
        $.mobile.changePage('#photo-success-page');
    },

    // -------------------
    // onCaptureOrGetFail: Called when error occurs during camera launch or library launch
    // -------------------
    onCaptureOrGetFail : function(message) {
        // console.log('on capture or get fail: ' + message);
        // Notify user with alert [or] leave as is?
        //navigator.notification.alert('Fout: ' + message);
    },

    // ------------
    // uploadPhoto: Attemps to upload the photo
    // ------------
    uploadPhoto : function() {
        $('#upload-photo-submit').button('disable');


        console.log('app.photo_location_id from uploadPhoto: ' + app.photo_location_id);

        var imageURI = app.URI;

        // set loading animation options for uploading photo
        var loadingAnimationOptions = {text: '',
                                        textVisible: true,
                                        theme: 'b',
                                        html: '<p style="text-align: center;"><i class="icon-refresh icon-spin icon-4x"></i><br />uploaden...</p><p id="photo_upload_progress_bar"></p>'};

        $.mobile.loading('show', loadingAnimationOptions);

        // set options for upload
        var options = new FileUploadOptions();
        options.fileKey = "files";
        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
        options.mimeType=app.getMimeType(imageURI);
        options.chunkedMode = false;

        // sets upload parameters
        var params = {};
        params.session = window.localStorage['session'];
        params.pathname = window.localStorage['active-pathname'];
        params['file-type'] = 'image';
        params.isapp = 'true';
        params.version = app.version;
        params.noblock = 'true';

        var headers = {'Connection':'close', 'Cache-Control':'no-cache'};

        options.params = params;
        options.headers = headers;

        // try / catch file upload
        if (app.isConnected()) {
            try {
                // don't hide loading animation here but in uploadPhotoSuccess() or uploadPhotoFail()
                var ft = new FileTransfer();

                ft.onprogress = function(progressEvent) {
                    if (progressEvent.lengthComputable) {
                        console.log('loaded / total: ' + progressEvent.loaded + ' / ' + progressEvent.total);
                        var percent = Math.floor((progressEvent.loaded / progressEvent.total) * 100) + '%';
                        console.log('percent: ' + percent);

                        // change <p> width
                        $('#photo_upload_progress_bar').css({'width' : percent});
                    } else {
                        console.log('length not computable');
                    }

                }

                console.log('imageURI: ' + imageURI);
                console.log('app.image_upload_url: ' + app.image_upload_url);
                console.log('options: ');
                console.log(options);

                ft.upload(imageURI, encodeURI(app.image_upload_url), app.uploadPhotoSuccess, app.uploadPhotoError, options);

            } catch (err) {
                // hide loading animation and show error
                $.mobile.loading('hide');
                //navigator.notification.alert('Probleem met uploaden foto, neem contact op met eerstelinks.');
                app.showAlert('Oeps', 'Probleem met uploaden foto, neem contact op met eerstelinks');
                console.log(err);
            }
        } else /* NOT connected to internet */ {
            //navigator.notification.alert('U bent niet verbonden met internet!');
            app.showAlert('Oeps', 'Geen internet verbinding');
        }
    },

    // ------------
    // getMimeType: returns a string with the mime type of the image
    //              if unable to get valid extension then return 'jpeg' as guestimate
    //              on android and ios .gif is not supported in photo library but left it for future use
    // ------------
    getMimeType : function(imageURI) {
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
    uploadPhotoSuccess : function(res) {

        console.log('uploadPhotoSuccess res:');
        console.log(res);

        // convert response string to JSON object
        var responseJSON = jQuery.parseJSON(res.response);

        console.log('app.photo_location_id from uploadPhotoSuccess: ' + app.photo_location_id);

        // if status = error
        if (responseJSON.status == 'error') {
            // send on to fail() function to handle error
            app.uploadPhotoError();
            console.log('1');
        } else {
            console.log('2');
            // create a block container for the image
            // will be changed later to get user input for the container placement

            $.mobile.loading('hide');

            // if app.photo_location_id = new_block then create a new block in the given column
            // else if photo_location_id = art then replace the art in the given column
            // else if photo_location_id = some block id then replace the image in that block with the new image
            // app.photo_location_id has the following structure:

            // {type_sexyID_columnID_[blockID_order]}
            //
            // type = new (for new block)
            //        art (for media element)
            //        replace (to replace an existing block)
            //
            // blockID and order are optional

            var tmp_ar = app.photo_location_id.split('_');

            for (var item in tmp_ar) {
                console.log('array item: ' + tmp_ar[item]);
            }

            if (tmp_ar[0] == 'new') {

                if (app.createBlock(tmp_ar[1], tmp_ar[2], responseJSON.files.url, 0, false) == true) {
                    //navigator.notification.alert('Upload succes',false,'Succes','ok');
                    app.showAlert('Success', 'Upload success');
                    console.log('upload success!');

                    // reset the attempt counter
                    app.attempts = 0;
                } else /* createBlock returned false */ {
                    navigator.notification.alert('Fout, neem contact op met eerstelinks',false,'Fout','ok');

                    console.log('upload error')
                }
            } else if (tmp_ar[0] == 'art') {
                // user selected art element -> art photo must be replaced by new photo
                if (app.createBlock(tmp_ar[1], tmp_ar[2], responseJSON.files.url, 1, false)) {
                    //navigator.notification.alert('Upload succes',false,'Succes','ok');
                    app.showAlert('Success', 'Upload success');
                    console.log('upload success!');

                    // reset the attempt counter
                    app.attempts = 0;
                } else /* createBlock returned false */ {
                    navigator.notification.alert('Fout, neem contact op met eerstelinks',false,'Fout','ok');

                    console.log('upload error!');
                }

            } else if (tmp_ar[0] == 'replace') {
                // user selected existing block

                console.log('3: replace');

                // delete existing block
                app.deleteBlock(tmp_ar[3]);

                // create new block with the order of the old block
                if (app.createBlock(tmp_ar[1], tmp_ar[2], responseJSON.files.url, 0, tmp_ar[4])) {
                    //navigator.notification.alert('Upload succes',false,'Succes','ok');
                    app.showAlert('Success', 'Upload success');
                    console.log('upload success!');

                    // reset the attempt counter
                    app.attempts = 0;
                } else /* createBlock returned false */ {
                    //navigator.notification.alert('Fout, neem contact op met eerstelinks',false,'Fout','ok');
                    app.showAlert('Er ging iets mis, neem contact op met eerstelinks.');
                    console.log('replace else');
                }

            }

            // redirect to menu page
            $.mobile.changePage('#menu-page');
        }

        // re-enable upload button
        $('#upload-photo-submit').button('enable');

        // iOS specific, cleanup temp file
        // update: DO NOT USE after each successful upload because it screws up the cache in iOS
        //
        // navigator.camera.cleanup( app.cleanupSuccess, app.cleanupError );
    },

    // -----------------
    // uploadPhotoError: Called when file upload fails
    // -----------------
    uploadPhotoError : function(error) {
        console.log('uploadPhotoError');
        // for android quirk -> in case first upload fails attempt the upload again

        // first fail -> try again
        if (app.attempts == 0) {
            // try upload again
            app.attempts = 1;
            app.uploadPhoto();
        } else if (app.attempts <= 3) /* less than 3 fails -> try again */ {
            //try upload again
            app.attempts += 1;
            app.uploadPhoto();
        } else /* more than 3 failed attempts -> send error message and stop attempts */ {
            // reset attempts
            app.attempts = 0;

            // stop loading animation from uploadPhoto()
            $.mobile.loading('hide');

            // show error message to user
            //navigator.notification.alert('Er is een fout opgetreden, neem contact op met eerstelinks',false,'Error','ok');
            app.showAlert('Fout', 'Fout met uploaden foto, neem contact op met eerstelinks');
            console.log('upload error');
            console.log(error);

            // redirect to menu page
            $.mobile.changePage('#menu-page');
        }

        // re-enable upload button
        $('#upload-photo-submit').button('enable');
    },

    // ------------
    // createBlock: After a succesful image upload a block needs to be create for the image.
    //              A JSON object is returned as result for the image upload; in this object is
    //              'url' that we need create the block.
    //              A block takes 3 arguments; a page, a column and an url of the image on the server
    // ------------
    createBlock : function(sexy, column, url, isArt, order) {
        // return value, set to false as default to simplify and shorten the code
        console.log('order: ' + order);
        console.log('column: ' + column);
        console.log('url: ' + url);
        console.log('isArt: ' + isArt);
        console.log('order: ' + order);

        var ret = false;

        // page not used yet
        $.mobile.loading('show');

        // if connected to internet then try / catch
        if (app.isConnected()) {
            try {
                var params = {'id':'new',
                                'type': 'image',
                                'session': window.localStorage['session'],
                                'pathname': window.localStorage['active-pathname'],
                                'column': column,
                                'is_art': isArt,
                                'image-url': url,
                                'isapp': 'true',
                                'sexy': sexy,
                                'column': column,
                                'order' : order,
                                'version': app.version};

                $.ajax({
                    type: 'POST',
                    dataType: 'JSON',
                    url: app.create_block_url,
                    data: params,
                    async: false
                }).done(function(res) {
                    if (res.status == 'success') {
                        console.log('createBlock ajax success');
                        ret = true;
                    } else {
                        console.log('ajax post error');
                        console.log(res);
                    }
                }).fail(function(err) {
                    console.log('createBlock ajax fail');
                    console.log(err);
                });
            } catch (err) {
                console.log(err);
            }
        } else /* NOT connected to internet */ {
            //console.log('create block ELSE');
            console.log('createBlock not connected to internet');
        }

        $.mobile.loading('hide');

        console.log('createBlock just before ret, ret = ' + ret);
        return ret;
    },

    // ------------
    // deleteBlock: Deletes a block with given ID
    // ------------
    deleteBlock: function(id) {
        console.log('delete block with ID: ' + id);

        try {
            var params = {'type': 'delete-element',
                            'pathname': window.localStorage['active-pathname'],
                            'username': window.localStorage['username'],
                            'version': app.version,
                            'session' : window.localStorage['session'],
                            'id' : id};

            $.ajax({
                type: 'POST',
                dataType: 'JSON',
                url: app.delete_block_url,
                data: params,
                async: true
            }).done(function(res) {
                if (res.status == 'success') {
                    console.log('delete block success');
                } else {
                    console.log('delete block error');
                    console.log(res);
                    navigator.notification.alert('Er is een fout opgetreden, neem contact op met eerstelinks.');
                }
            });
        } catch (err) {
            console.log(err);
        }

    },

    // --------------
    // cleanupSucces: Called after succesfully cleaning up temp files (iOS only)
    // --------------
    cleanupSuccess : function() {
        //console.log('cleanup success');
    },

    // -------------
    // cleanupError: Called after temp file cleanup error (iOS only)
    // -------------
    cleanupError : function() {
        //console.log('cleanup error');
    },

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                          Misc functions section
    //
    // ----------------------------------------------------------------------------------------------------------

    // -------------
    // sendFeedback: triggered when the user clicks on 'verzenden', send feedback to the server
    // -------------
    sendFeedback : function() {
        // console.log('feedback');

        // return value, set to false as default to simplify and shorten the code
        var ret = false;

        // page not used yet
        $.mobile.loading('show');

        // if connected to internet then try / catch
        if (app.isConnected()) {
            try {
                var params = {'type': 'feedback',
                                'feedback': $('#feedback-form-messsage').val(),
                                'session': window.localStorage['session'],
                                'pathname': window.localStorage['active-pathname'],
                                'username': window.localStorage['username'],
                                'version': app.version};

                $.ajax({
                    type: 'POST',
                    dataType: 'JSON',
                    url: app.feedback_url,
                    data: params,
                    async: false
                }).done(function(res) {
                    if (res.status == 'success') {
                        ret = true;
                        //navigator.notification.alert('Bedankt voor je feedback!');
                        app.showAlert('Success', 'Bedankt voor je feedback');
                        $.mobile.changePage('#menu-page');
                    } else {
                        console.log('ajax post error');
                        console.log(res);
                        //navigator.notification.alert('Er ging iets mis, neem contact op met eerstelinks.');
                        app.showAlert('Fout', 'Er ging iets mis, neem console op met eerstelinks');
                        $.mobile.changePage('#menu-page');
                    }
                });
            } catch (err) {
                console.log(err);
            }
        } else /* NOT connected to internet */ {
            //console.log('create block ELSE');
        }

        $.mobile.loading('hide');

        return ret;
    },

    // --------------------
    // elementWithIdExists: Checks whether an element with the provided ID exists
    // --------------------
    elementWithIdExists : function(id) {
        var tmp = document.getElementById(id);

        if (tmp != null || tmp != undefined) {
            console.log('#' + id + ' exists!');
            return true;
        } else {
            console.log('#' + id + ' does NOT exist :(!');
            return false;
        }
    },

    // ------------------------
    // populatePathnameButtons: Generates the pathname choice buttons
    // ------------------------
    populatePathnameButtons : function() {
        // delete all children of #pathname-choice <div> to avoid multiple buttons (cache)
        $('#pathname-choice').empty();

        // for each pathname in pathnames create a button
        for (var i=0; i<app.pathnames.length; i++) {
            var button = $('<button type="button" id="' + app.pathnames[i] + '">' + app.pathnames[i] + '</button>');
            $('#pathname-choice').append(button);
            button.button();

            // append on 'tap' event listener
            var script = '<script type="text/javascript">$("#' + app.pathnames[i] + '").on("tap", function(event) { event.stopImmediatePropagation(); event.preventDefault(); app.setPathname("' + app.pathnames[i] + '"); $.mobile.changePage("#menu-page"); });</script>';
            $('body').append(script);
        }
    },

    // ------------
    // setPathname: Sets the active pathname
    // ------------
    setPathname : function(pn) {
        // store selected pathname
        window.localStorage['active-pathname'] = pn;

        // redirect to menu page
        // moved the change page to the on('tap') event to keep the function generic
        //$.mobile.changePage('#menu-page');
    },

    // -------------------
    // setUsernameInPanel: sets the username in the side panel of the menu page
    // -------------------
    setUsernameInPanel : function() {
        $('#menu-panel-content-user').empty();
        $('#menu-panel-content-user').append(window.localStorage['username']);
    },

    // ------------------------------
    // populatePathnameSelectInPanel: Generates the list of pathnames in the <select> in the side panel of the menu page
    // ------------------------------
    populatePathnameSelectInPanel : function() {
        $('#active-pathname-select').empty();

        for (var i=0; i<app.pathnames.length; i++) {
            var tmp = '<option value="' + app.pathnames[i] + '"';

            // if the pathname equals the pathname stored in local storage then this is the current
            // active website pathname -> pre-select it
            if (app.pathnames[i] == window.localStorage['active-pathname']) {
                tmp += ' selected="selected">';
            } else {
                tmp += '>';
            }

            tmp += app.pathnames[i] + '</option>';

            $('#active-pathname-select').append(tmp);
        }

        $('#active-pathname-select').selectmenu( "option", "icon", "star" );
        $('#active-pathname-select').selectmenu('refresh', true);
    },

    // should change code ->

    // retrieve web structure (return boolean true or false) and set the res.sexies (or whatever) as global variable

    // then if (retrieveWebStructure()) { parseWebStructure } else { generate some kind of error }

    // ----------------------
    // parseWebsiteStructure: retrieves the website structure from the API
    // ----------------------
    parseWebsiteStructure : function() {
        console.log('parse website structure');

        $.mobile.loading('show');

        // page not used yet
        $.mobile.loading('show');

        // if connected to internet then try / catch
        if (app.isConnected()) {
            try {
                var params = {'type': 'getwebsitestructure',
                                'pathname': window.localStorage['active-pathname'],
                                'username': window.localStorage['username'],
                                'version': app.version};

                $.ajax({
                    type: 'GET',
                    dataType: 'JSON',
                    url: app.all_data_url,
                    data: params,
                    async: false
                }).done(function(res) {
                    if (res.status == 'success') {
                        console.log('ajax get all data success');
                        //console.log(res);

                        // empty the div before rendering to clear previous content
                        $('#choose-section-and-column-content-collapsible-set').empty();

                        // the whole structure will be stored in a string which will then be appended to the div
                        // after that we will call the jqm refresh method to style the elements
                        var tmp = '';

                        // each collapsible has the following structure:
                        //
                        // <div data-role="collapsible">
                        //      <h3>name of collapsible</h3>
                        //      <div>
                        //          collapsible content which will be columns with 0 or more blocks each
                        //      </div>
                        // </div>

                        // search for sexies
                        var sexies = res.sexies;
                        for (var sexy in sexies) {
                            console.log('sexy' + sexies[sexy].sexy_id);

                            // create the collapsible group
                            // set the title -> name of the sexy
                            // open the div where the collapsible stuff goes

                            // specifies the offset of the colums, to be used when calculating the width (%) of the columns
                            app.column_offset = sexies[sexy].column_offset;

                            tmp += '<div class="ui-icon-alt" data-role="collapsible">';
                            tmp += '<h3>' + sexies[sexy].sexy_name + '</h3><div class="collapsible-content">';

                            // search for columns
                            var columns = sexies[sexy].columns;
                            for (var column in columns) {
                                console.log('column' + columns[column].meta.column_id);

                                // inside the collapsible area ->

                                var col_width = columns[column].meta.width;

                                // calculate the width of 1 column depending on whether there are 12 or less columns (decided by the offset)
                                // if there is no offest this would look like:
                                // 100 / 12 = 8.33% (of which we later subtract the proper amount according to the number of columns)

                                // if the offset is 1 then the calculation would be:
                                // 100 / (12 - (2*1)) = 10%

                                var col_width_percentage = (100 / (12 - (2 * app.column_offset)));
                                var div_col_width = (col_width * col_width_percentage);

                                // if the column is 'is_art' then add some way of notifiying the user and do not create the
                                // sub block elements
                                if (columns[column].meta.is_art == "1") {
                                    //tmp += '<div id="art_column_' + columns[column].meta.column_id + '_sexy_' + sexies[sexy].sexy_id + '" class="collapsible-content-column art" style="width: ' + div_col_width + '%;">';
                                    tmp += '<div id="art_' + sexies[sexy].sexy_id + '_' + columns[column].meta.column_id + '" class="collapsible-content-column art" style="width: ' + div_col_width + '%;">';
                                    tmp += '<div style="background-color: transparent;"><p style="margin: 0; color: #ffffff; padding: 10px; text-align: center;"><i class="icon-film icon-2x"></i></p></div>';


                                } else {
                                    tmp += '<div class="collapsible-content-column" style="width: ' + div_col_width + '%;">';
                                    // if the column does not contain a media element then generate the block elements
                                    // search for blocks
                                    var blocks = columns[column].blocks;
                                    for (var block in blocks) {
                                        console.log('block' + blocks[block].block_id);
                                        //tmp += '<div class="collapsible-content-column-block">';
                                        //tmp += '<div id="block_' + blocks[block].block_id + '_column_' + columns[column].meta.column_id + '_sexy_' + sexies[sexy].sexy_id + '_order_' + blocks[block].order + '" class="collapsible-content-column-block';
                                        tmp += '<div id="replace_' + sexies[sexy].sexy_id + '_' + columns[column].meta.column_id + '_' + blocks[block].block_id + '_' + blocks[block].order + '" class="collapsible-content-column-block';

                                        // per block type, show a different icon to represent the content

                                        if (blocks[block].type == 'image') {
                                            tmp += ' image"><p><i class="icon-picture icon-2x"></i></p>';
                                        } else if (blocks[block].type == 'plaintext') {
                                            tmp += '"><p><i class="icon-align-left icon-2x"></i></p>';
                                        } else if (blocks[block].type == 'video') {
                                            tmp += '"><p><i class="icon-play-circle icon-2x"></i></p>';
                                        } else if (blocks[block].type == 'hours') {
                                            tmp += '"><p><i class="icon-time icon-2x"></i></p>';
                                        } else if (blocks[block].type == 'form') {
                                            tmp += '"><p><i class="icon-list-alt icon-2x"></i></p>';
                                        } else if (blocks[block].type == 'location') {
                                            tmp += '"><p><i class="icon-map-marker icon-2x"></i></p>';
                                        } else {
                                            // in case of unknown type show a question mark icon
                                            tmp += '<p><i class="icon-question-sign"></i></p>';
                                        }

                                        tmp += '</div>';
                                    }

                                    // add 'new block' block (when user selects this a new block will be created for the content)
                                    //tmp += '<div id="new_block_column_' + columns[column].meta.column_id + '_sexy_' + sexies[sexy].sexy_id + '" class="collapsible-content-column-block new">';
                                    tmp += '<div id="new_' + sexies[sexy].sexy_id + '_' + columns[column].meta.column_id + '" class="collapsible-content-column-block new">';
                                    tmp += '<p><i class="icon-plus-sign icon-2x"></i></p>';
                                    tmp += '</div>';
                                }

                                tmp += '</div>';
                            }

                            tmp += '</div><div style="clear:both;"></div></div>';
                        }

                        $('#choose-section-and-column-content-collapsible-set').append(tmp);
                        // refresh collapsible set to fix styling
                        $('#choose-section-and-column-content-collapsible-set').collapsibleset( "refresh" );

                        // make only the blocks we wish selectable
                        $('.collapsible-content-column.art').on('tap', function () {
                            $('.collapsible-content-column-block-effect').removeClass('collapsible-content-column-block-effect');
                            $(this).addClass('collapsible-content-column-block-effect');

                            navigator.notification.alert('Deze foto zal vervangen worden door de geüploadde foto');

                            $('#upload-photo-submit').button('enable');
                        });
                        $('.collapsible-content-column-block.image').on('tap', function () {
                            $('.collapsible-content-column-block-effect').removeClass('collapsible-content-column-block-effect');
                            $(this).addClass('collapsible-content-column-block-effect');

                            navigator.notification.alert('Deze foto zal vervangen worden door de geüploadde foto');

                            $('#upload-photo-submit').button('enable');
                        });
                        $('.collapsible-content-column-block.new').on('tap', function () {
                            $('.collapsible-content-column-block-effect').removeClass('collapsible-content-column-block-effect');
                            $(this).addClass('collapsible-content-column-block-effect');
                            $('#upload-photo-submit').button('enable');
                        });

                        // debug: check to see what jquerymobile makes of the markup
                        //console.log($('#choose-section-and-column-content-collapsible-set').html());
                    } else {
                        console.log('ajax get all data error');
                    }
                });
            } catch (err) {
                console.log('test: ' + err);
            }
        } else /* NOT connected to internet */ {
            //console.log('create block ELSE');
            app.showAlert('Fout', 'Geen internet verbinding!');
        }

        $.mobile.loading('hide');
    },

    // ---------
    // getStats: retrieves statistics via the API
    // ---------
    getStats: function() {
        console.log('get stats');
    },

    addFacebookAccount: function() {
        console.log('add facebook account');

        var url = app.add_facebook_account_url + '?username=' + window.localStorage['username'];

        app.in_app_browser = window.open(url, '_blank', 'location=no');
        app.in_app_browser.addEventListener('loadstart', app.addFacebookAccountLoadStart);
        app.in_app_browser.addEventListener('loadstop', app.addFacebookAccountLoadStop);
        app.in_app_browser.addEventListener('exit', app.addFacebookAccountExit);
    },

    addFacebookAccountLoadStart: function(ref) {
        console.log('load start');
        console.log(ref);
    },

    addFacebookAccountLoadStop: function(ref) {
        console.log('load stop');
        console.log(ref);
        console.log('ref.url: ' + ref.url);

        if (ref.url == 'http://eerstelinks.nl/connect/facebook/done.php') {
            console.log('true');
            app.in_app_browser.close();
        }
    },

    addFacebookAccountExit: function(ref) {
        console.log('ref exit');
        console.log(ref);
        app.in_app_browser = null;
    }
};