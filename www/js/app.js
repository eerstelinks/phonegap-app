
/**
* @author Sander van Golen <sander@eertelinks.nl>
* @version 3.1
* @namespace
* @property {string} cordova_version                    - the current cordova version
* @property {string} authenticate_url                   - the url used for authentication
* @property {string} image_upload_url                   - the url used for uploading images
* @property {string} create_block_url                   - the url used for creating 'blocks'
* @property {string} feedback_url                       - the url used for submitting feedback
* @property {string} server_message_url                 - the url used to check for messages from the server
* @property {string} all_data_url                       - the url used to get the structure of the 'active' website
* @property {string} delete_block_url                   - the url used to delete a block
* @property {string} send_error_message_url             - the url used to send an error message to the server
* @property {string} add_facebook_account_url           - the url used when opening an inAppBrowser window to add a Facebook account
* @property {string} get_facebook_accounts_url          - the url used to retrieve all related Facebook accounts from the database
* @property {string} post_to_facebook_url               - the url used to post a message to Facebook via the server API
* @property {string} facebook_exit_inappbrowser_url     - the url used to close the inAppBrowser window
* @property {string} add_twitter_account_url            - the url used when opening an inAppBrowser window to add a Twitter account
* @property {string} get_twitter_accounts_url           - the url used to retrieve all related Twitter accounts from the database
* @property {string} post_to_twitter_url                - the url used to post a message to Twitter via the server API
* @property {string} twitter_exit_inappbrowser_url      - the url used to close the inAppBrowser window
* @property {string} app_language                       - the language setting of the app
* @property {number} attempts                           - the number of attempts at uploading an image
* @property {string} URI                                - the URI of the selected or captured photo
* @property {string} device_width                       - the width of the device's screen (in pixels)
* @property {string} device_height                      - the height of the device's screen (in pixels)
* @property {array} pathnames                           - an array of websites associated with the user account
* @property {string} version                            - the current version of the app
* @property {string} server_message_id                  - the ID of the server message
* @property {string} server_message                     - the server message
* @property {string} column_offset                      - the offset of columns on the active website
* @property {string} photo_location_id                  - the location selected by the user (placement for image)
* @property {string} in_app_browser                     - the inAppBrowser object used to add social media accounts
* @property {string} facebook_accounts                  - JSON object with Facebook accounts associated with the user account returned by the server API
* @property {string} twitter_accounts                   - JSON object with Twitter accounts associated with the user account returned by the server API
* @property {string} social_media_image_url             - url used for social media image
* @property {boolean} post_to_facebook_success          - boolean: set to true on Facebook ajax post success
* @property {boolean} post_to_facebook_complete         - boolean: set to true on Facebook ajax post completion
* @property {string} post_to_twitter_success            - boolean: set to true on Twitter ajax post success
* @property {string} post_to_twitter_complete           - boolean: set to true on Twitter ajax post completion
*/

var app = {

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                          Variables
    //
    // ----------------------------------------------------------------------------------------------------------

    cordova_version                 : 'cordova-2.5.0.js',
    authenticate_url                : 'https://eerstelinks.nl/api/v1/authenticate',
    image_upload_url                : 'https://eerstelinks.nl/api/v1/post/image-ajax',
    create_block_url                : 'https://eerstelinks.nl/api/v1/post/block-data',
    feedback_url                    : 'https://eerstelinks.nl/api/v1/post/app-feedback',
    server_message_url              : 'https://eerstelinks.nl/api/v1/get/server-message',
    all_data_url                    : 'https://eerstelinks.nl/api/v1/get/all-data',
    delete_block_url                : 'https://eerstelinks.nl/api/v1/post/delete-element',
    send_error_message_url          : 'https://eerstelinks.nl/api/v1/post/app/error-message',
    add_facebook_account_url        : 'https://eerstelinks.nl/connect/facebook/login',
    get_facebook_accounts_url       : 'https://eerstelinks.nl/api/v1/facebook/get/accounts',
    post_to_facebook_url            : 'https://eerstelinks.nl/api/v1/facebook/post/publish',
    facebook_exit_inappbrowser_url  : 'https://eerstelinks.nl/connect/facebook/done',
    add_twitter_account_url         : 'https://eerstelinks.nl/connect/twitter/login',
    get_twitter_accounts_url        : 'https://eerstelinks.nl/api/v1/twitter/get/accounts',
    post_to_twitter_url             : 'https://eerstelinks.nl/api/v1/twitter/post/publish',
    twitter_exit_inappbrowser_url   : 'https://eerstelinks.nl/connect/twitter/done',
    app_lang                        : undefined,
    attempts                        : 0,
    URI                             : undefined,
    device_width                    : undefined,
    device_height                   : undefined,
    pathnames                       : undefined,
    version                         : '3.1',
    server_message_id               : undefined,
    server_message                  : undefined,
    column_offset                   : 0,
    photo_location_id               : undefined,
    in_app_browser                  : undefined,
    facebook_accounts               : undefined,
    twitter_accounts                : undefined,
    social_media_image_url          : undefined,
    post_to_facebook_success        : undefined,
    post_to_facebook_complete       : undefined,
    post_to_twitter_success         : undefined,
    post_to_twitter_complete        : undefined,
    message_max_chars               : 140,

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                          Functions
    //
    // ----------------------------------------------------------------------------------------------------------

    /**
    * Initializes the app and sets the 'device ready' event listener
    * @constructor
    */
    init : function () {
        this.checkOS();
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    /**
    * Checks which OS is being used.
    * @function checkOS
    * @memberOf app
    */
    checkOS : function () {
        if(navigator.userAgent.indexOf('Android') > 0) {
            $('script').attr('src', 'cordova/android/' + app.cordova_version).appendTo('head');
        }
        else if(navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPod') > 0) {
            $('script').attr('src', 'cordova/ios/' + app.cordova_version).appendTo('head');
        }
    },

    /**
    * Called once the 'device ready' event has been fired in 'init' and adds additional event listeners.
    * @method onDeviceReady
    * @memberOf app
    */
    onDeviceReady : function () {
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
        app.checkForStoredErrors();
    },

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                   Event Listener functions section
    //
    // ----------------------------------------------------------------------------------------------------------

    /**
    * Triggered when the app is paused.
    * @function onPause
    * @memberOf app
    */
    onPause : function () {
    },

    /**
    * Triggered when the app is resumed from paused state.
    * @function onResume
    * @memberOf app
    */
    onResume : function () {
    },

    /**
    * Triggered when the device establishes an internet connection (2g/3g/wifi/...)
    * @function onOnline
    * @memberOf app
    */
    onOnline : function () {
    },

    /**
    * Triggered when the device loses the internet connection
    * @function onOffline
    * @memberOf app
    */
    onOffline : function () {
    },

    /**
    * Catches back button calls and redirects user to the correct page.<br>
    * Warning: By capturing the back button events the back button will no longer work as expected unless
    * the event is captured for each existing page.
    * @function onBackButton
    * @memberOf app
    */
    onBackButton : function () {
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

    /**
    * Captures the menu button event.<br>
    * Warning: deprecated in Android since january 2012 by Google, as with the back button; by capturing the event it will no
    * longer work as expected (effectively rendering the button useless)
    * @function onMenuButton
    * @memberOf app
    */
    onMenuButton : function () {
    },

    /**
    * Checks whether there is an active internet connection.
    * @function isConnected
    * @returns {boolean}
    * @memberOf app
    */
    isConnected : function () {
        var con = navigator.connection.type;

        if(con == 'wifi' || con == 'ethernet' || con == '2g' || con == '3g' || con == '4g' || con == 'cell') {
            return true;
        } else {
            // con == 'unknown' || con == 'none'
            return false;
        }
    },

    /**
    * Exits the application (not paused state but kills the app)
    * @function exitApp
    * @memberOf app
    */
    exitApp : function () {
        navigator.app.exitApp();
    },

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                      Getters and setters
    //
    // ----------------------------------------------------------------------------------------------------------

    /**
    * Gets the type of the connection
    * @function getConnectionType
    * @returns {string} Type of connection
    * @memberOf app
    */
    getConnectionType : function () {
        return navigator.connection.type;
    },

    /**
    * Sets the width and height of the device
    * @function setDeviceResolution
    * @memberOf app
    */
    setDeviceResolution : function () {
        app.device_width = screen.width;
        app.device_height = screen.height;
    },

    /**
    * Sets the language of the device
    * @function setDeviceLanguage
    * @memberOf app
    */
    setDeviceLanguage : function () {
        var tmp = navigator.language.split("-");
        var device_language = tmp[0];

        // is there already a language stored in the localStorage?
        if (window.localStorage['language'] != undefined) {
            // yes there is -> use that language
            app.app_lang = lang[window.localStorage['language']];
            app.setUiLanguage();
        } else {
            // no there isn't -> get device language
            // if device language is supported set that as language and store in localStorage
            var lang_supported = false;

            if (device_language in lang) {
                app.app_lang = lang[device_language];
                window.localStorage['language'] = device_language;
                app.setUiLanguage();
            } else {
                app.app_lang = lang['nl'];
                window.localStorage['language'] = 'nl';
            }
        }
    },

    /**
    * Saves the language of the app when a user chooses a different language
    * @function changeLanguage
    * @memberOf app
    */
    changeLanguage: function (ln) {
        var tmp = languages[ln];
        app.app_lang = lang[tmp];
        window.localStorage['language'] = tmp;
    },

    /**
    * Changes the language of the app when a user chooses a different language and when starting the app
    * @function setUiLanguage
    * @memberOf app
    */
    setUiLanguage: function () {
        // login page UI elements
        $('#login-form-username').attr('placeholder', app.app_lang.placeholder.username);
        $('#login-form-password').attr('placeholder', app.app_lang.placeholder.password);
        $('#login-form-submit').html(app.app_lang.button.login).button().button("refresh");

        // choose active website page
        $('#choose_active_website').html(app.app_lang.header.choose_active_website);

        // menu page UI elements
        $('#upload_photo_icon_text').html(app.app_lang.menu.item.upload_photo);
        $('#capture_photo_icon_text').html(app.app_lang.menu.item.take_photo);
        $('#social_media_icon_text').html(app.app_lang.menu.item.social_media);
        $('#feedback_icon_text').html(app.app_lang.menu.item.feedback);
        $('#truck_icon_text').html(app.app_lang.menu.item.truck);

        // side panel UI elements
        $('#logout_button_text').html(app.app_lang.panel.logout);
        $('#active-pathname-select-label').html(app.app_lang.panel.active_website);
        $('#language_select_label').html(app.app_lang.panel.active_language);

        // photo preview page
        $('#photo_preview_header').html(app.app_lang.header.photo_preview);
        $('#choose-section-column-button').html(app.app_lang.button.choose_location).button().button("refresh");

        // choose location page
        $('#choose_location_header').html(app.app_lang.header.choose_location);
        $('#upload-photo-submit').html(app.app_lang.button.upload_photo).button().button("refresh");

        // social media page (composition)
        $('#social_media_message_header').html(app.app_lang.header.social_media_message);
        $('#social-media-messsage').attr('placeholder', app.app_lang.placeholder.social_media_message);
        $('#social_media_page_choose_accounts').html(app.app_lang.button.social_media_message).button().button("refresh");

        // social media page (account select + send)
        $('#social_media_accounts_header').html(app.app_lang.header.social_media_accounts);
        $('#add_facebook_account_span').html(app.app_lang.button.add_facebook_account);
        $('#add_twitter_account_span').html(app.app_lang.button.add_facebook_account);
        $('#social_media_accounts_publish').html(app.app_lang.button.social_media_accounts).button().button("refresh");

        // feedback page
        $('#feedback_header').html(app.app_lang.header.feedback);
        $('#feedback-form-messsage').attr('placeholder', app.app_lang.placeholder.feedback);
        $('#feedback-form-submit').html(app.app_lang.button.feedback).button().button("refresh");

        // info page
        $('#version').html(app.app_lang.info_version);
    },

    /**
    * Gets the latest message from the server API (if there is one)
    * @function getServerMessage
    * @returns {boolean} true if there is a server message or false if there is no new server message
    * @memberOf app
    */
    getServerMessage: function () {
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
            // if not connected to internet -> do nothing (otherwise user gets annoying warning for something he/she doesn't understand)
        }

        $.mobile.loading('hide');

        return ret;
    },

    /**
    * Shows the server message (if there is one)
    * @function showServerMessage
    * @memberOf app
    */
    showServerMessage: function (res) {
        // append the message to the <p> element designated for it
        $('#server_message_p').append(res.message);

        // show server message
        $('#server_message_div').show();
    },

    /**
    * Hides the server message if it has been dismissed
    * @function hideServerMessage
    * @memberOf app
    */
    hideServerMessage: function () {
        $('#server_message_div').hide();
    },

    /**
    * Triggered when user closes the server message. Stores the message in local storage so that it isn't displayed again
    * @function dismissServerMessage
    * @memberOf app
    */
    dismissServerMessage: function () {
        // set message as seen in local storage
        window.localStorage[app.server_message_id] = app.server_message;

        // empty the message <div> container and hide the container
        $('#server_message_div').empty();
        $('#server_message_div').hide();
    },

    /**
    * Checks whether the message has already been dismissed
    * @function isServerMessageDismissed
    * @returns {boolean}
    * @memberOf app
    */
    isServerMessageDismissed: function(server_message_id) {
        var ret = false;

        // check if server message has already been dismissed or not
        if (window.localStorage[server_message_id] != undefined && window.localStorage[server_message_id] != '') {
            ret = true;
        }

        return ret;
    },

    /**
    * Sends an error message to the server whenever a user encounter a problem/error.<br>
    * Note: If the user is not connected to internet the error is stored in local storage and sent when an internet connection is established
    * @function sendErrorMessage
    * @param {string} error_message the error message to send back to the server API
    * @memberOf app
    */
    sendErrorMessage: function(error_message) {
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
                            'device_model' : device.model,
                            'error_message' : error_message};

            $.ajax({
                type: 'POST',
                dataType: 'JSON',
                url: app.send_error_message_url,
                data: params,
                async: true,
                success: function(json) {
                    // remove errors stored on localStorage (if any)
                    delete window.localStorage['errors'];
                },
                error: function(xhr, status) {
                    //
                },
                complete: function(xhr, status) {
                    //
                }
            });
        } else /* NOT connected to internet -> store error message in local storage and send later */ {
            // if errors already exists then add a new error to the array
            if (window.localStorage['errors'] == undefined) {
                // create assoc array (object) from the stored errors
                var data = localStorage['errors'];
                var errors = JSON.parse(data);

                // get time in milliseconds to use as key
                var timeInMilliseconds = new Date().getTime();
                errors[timeInMilliseconds] = error_message;

                // convert assoc array (object) to string and insert into localstorage
                var  tmp = JSON.stringify(errors);
                localStorage['errors'] = tmp;
            } else /* errors array doesn't exist yet -> create it */ {
                // create empty associative array (object)
                var errors = {};

                // get time in milliseconds to use as key
                var timeInMilliseconds = new Date().getTime();
                errors[timeInMilliseconds] = error_message;

                // convert assoc array (object) to string and insert into localstorage
                var  tmp = JSON.stringify(errors);
                localStorage['errors'] = tmp;
            }
        }
    },

    /**
    * Checks if there are any stored error messages, loops throught them and sends them using the 'sendErrorMessage' function
    * {@linkcode app.sendErrorMessage}
    * @function checkForStoredErrors
    * @memberOf app
    */
    checkForStoredErrors: function () {
        //
        var data = window.localStorage['errors'];
        var tmp = JSON.parse(data);

        for (error in tmp) {
            app.sendErrorMessage(tmp[error]);
        }
    },

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                      Authentication functions section
    //
    // ----------------------------------------------------------------------------------------------------------

    /**
    * Checks for existing credentials and either submits existing login credentials or sends the user to the login page.
    * @function checkCredentials
    * @memberOf app
    */
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
            navigator.notification.alert(app.app_lang.alert.no_internet_connection, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);

            // go to login page
            $.mobile.changePage('#login-page');
        }
    },

    /**
    * Collects the user credentials and attempts to authenticate the user.
    * @function login
    * @memberOf app
    */
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
                $('#login-form-submit').button("disable");

                // retrieve form values
                username = $('#login-form-username').val();
                password = $('#login-form-password').val();

                console.log('username: ' + username);
                console.log('password: ' + password);
            } else if(from == 'checkCredentials') /* login was called from checkCredentials() */ {
                // retrieve username and password form local storage
                username = window.localStorage['username'];
                password = window.localStorage['password'];
            }

            // if username and password not empty
            if(username != '' && password != '') {
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

                                // if active pathname already set go straight to menu page
                                if (window.localStorage['active-pathname'] == undefined) {
                                    // load pathname choice page
                                    $.mobile.changePage('#pathname-choice-page');
                                } else {
                                    // load menu page
                                    $.mobile.changePage('#menu-page');
                                }

                            } else /* if only 1 pathname go directly to menu page */ {
                                // stop loading animation
                                $.mobile.loading('hide');

                                // set active pathname
                                window.localStorage['active-pathname'] = app.pathnames[0];

                                // load menu page
                                $.mobile.changePage('#menu-page');
                            }

                        } else if(res.status == 'error') /* if status is 'error' */ {
                            // stop loading animation
                            $.mobile.loading('hide');

                            // show error message to user
                            navigator.notification.alert(res.message, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);
                            $.mobile.changePage('#login-page');
                        } else /* else (unknown error) show error message to user */ {
                            // hide loading animation
                            $.mobile.loading('hide');

                            // error message to user
                            navigator.notification.alert(app.app_lang.alert.login_error, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);
                            $.mobile.changePage('#login-page');
                        }

                        // re-enable the login button
                        $('#login-form-submit').button("enable");
                    },'json');
                } catch (err) /* catch for POST connection */ {
                    // should make this a bit prettier (maybe quit app or something)
                    navigator.notification.alert(app.app_lang.alert.general_error, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);
                }
            } else /* if username or password is empty show error message */ {
                console.log('else -> username or password is empty');
                // stop loading animation
                $.mobile.loading('hide');

                // show error message
                navigator.notification.alert(app.app_lang.alert.email_password_error, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);

                // re-enable the login button
                $('#login-form-submit').button("enable");
            }
        } else /* NOT connected to internet */ {
            navigator.notification.alert(app.app_lang.alert.no_internet_connection, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);
        }
    },

    /**
    * Log the user out of the app, destroys stored sessions information and redirects the user to the login page
    * @function logout
    * @memberOf app
    */
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

    /**
    * Checks if the sessions is the same as the sessions stored in the database
    * @function isValidSession
    * @returns {boolean}
    * @memberOf app
    */
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

    /**
    * Triggered by a button, brings up the camera interface
    * @function capturePhoto
    * @memberOf app
    */
    capturePhoto : function() {
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


    /**
    * Triggered by button on 'social media' page, brings up the camera interface
    * @function socialMediaCapturePhoto
    * @memberOf app
    */
    socialMediaCapturePhoto : function() {
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
        navigator.camera.getPicture(app.socialMediaOnCaptureOrGetSuccess, app.socialMediaOnCaptureOrGetFail, options);
    },

    /**
    * Triggered by a button, brings up the image library to select a photo.<br>
    * info: PHOTOLIBRARY source is bugged in iOS 5, use SAVEDPHOTOALBUM instead.
    * @function getPhoto
    * @param {string} source the source of the image
    * @memberOf app
    */
    getPhoto : function(source) {
        // set options for getting photo's from library (takes less options than CAMERA)
        var options = {quality: 80,
                       destinationType: Camera.DestinationType.FILE_URI,
                       sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                       targetWidth: 1280,
                       targetHeight: 1280};

        // select photo with specified options
        navigator.camera.getPicture(app.onCaptureOrGetSuccess, app.onCaptureOrGetFail, options);
    },

    /**
    * Triggered by button on 'social media' page, brings up the library to select a photo
    * @function socialMediaGetPhoto
    * @param {string} source the source of the image
    * @memberOf app
    */
    socialMediaGetPhoto : function(source) {
        // set options for getting photo's from library (takes less options than CAMERA)
        var options = {quality: 80,
                       destinationType: Camera.DestinationType.FILE_URI,
                       sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                       targetWidth: 1280,
                       targetHeight: 1280};

        // select photo with specified options
        navigator.camera.getPicture(app.socialMediaOnCaptureOrGetSuccess, app.socialMediaOnCaptureOrGetFail, options);
    },

    /**
    * Called when a photo is successfully retrieved from the library or created by the camera
    * @function onCaptureOrGetSuccess
    * @param {string} imageURI the URI of the selected or taken photo
    * @memberOf app
    */
    onCaptureOrGetSuccess : function(imageURI) {
        // set class variable URI so that we can use it in case we need to retry an attempt (android glitch)
        app.URI = imageURI;

        var preview_image = document.getElementById('preview_image');

        preview_image.style.display = 'block';

        preview_image.src = imageURI;

        // Change page to the photo view page
        $.mobile.changePage('#photo-success-page');
    },

    /**
    * Called when a photo is successfully retrieved from the library or created by the camera from the social media page
    * @function socialMediaOnCaptureOrGetSuccess
    * @param {string} imageURI the URI of the selected or taken photo
    * @memberOf app
    */
    socialMediaOnCaptureOrGetSuccess : function(imageURI) {
        // set class variable URI so that we can use it in case we need to retry an attempt (android glitch)
        app.URI = imageURI;

        // remove the buttons on the social media page and show a thumbnail of the picture/photo
        $('#social-media-page-refresh').show();
        $('#social-media-picture-container').append('<img src="" id="social_media_preview_image" style="max-width:100%;">');
        $('#social_media_preview_image').attr('src', imageURI);

        // change max chars to 117 (Twitter max)
        //$('#max_chars').html('117');
        app.message_max_chars = 117;
        app.checkMessageChars();

        // hide the loading animation after 1000 ms
        setTimeout(app.hideSocialMediaChangePictureAnimation, 1000);
    },

    /**
    * Called from socialMediaCaptureOrGetSuccess after a 1000ms timeout
    * @function hideSocialMediaChangePictureAnimation
    * @memberOf app
    */
    hideSocialMediaChangePictureAnimation: function() {
        $('#social-media-page-refresh').hide();
    },

    /**
    * Called from 'getPhoto' or 'capturePhoto' in case they fail
    * @function onCaptureOrGetFail
    * @memberOf app
    */
    onCaptureOrGetFail : function(message) {
        // show error msg to user and send error msg to server API
    },

    /**
    * Called from 'socialMediaGetPhoto' or 'socialMediaCapturePhoto' in case they fail
    * @function socialMediaOnCaptureOrGetFail
    * @memberOf app
    */
    socialMediaOnCaptureOrGetFail : function(message) {
        // send error msg to server and show error msg to user
    },

    /**
    * Attempts to upload an image to the server
    * @function uploadPhoto
    * @memberOf app
    */
    uploadPhoto : function() {
        // disable the submit button so users can't submit again
        $('#upload-photo-submit').button('disable');

        // store the image URI in the variable in case we need to retry the upload (each upload is attempted 3x)
        var imageURI = app.URI;

        // set custom loading animation options for uploading photo
        var loadingAnimationOptions = {
            text: '',
            textVisible: true,
            theme: 'b',
            html: '<p style="text-align: center;"><i class="icon-refresh icon-spin icon-4x"></i><br />uploaden...</p><p id="photo_upload_progress_bar"></p>'
        };

        // show custom loading animation
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

        // set headers
        var headers = {'Connection':'close', 'Cache-Control':'no-cache'};

        // include params and headers
        options.params = params;
        options.headers = headers;

        // if app is connected to internet, attempt upload
        if (app.isConnected()) {
            try {
                // don't hide loading animation here but in uploadPhotoSuccess() or uploadPhotoFail()
                var ft = new FileTransfer();

                // track upload progress and animate the progress bar
                ft.onprogress = function(progressEvent) {
                    if (progressEvent.lengthComputable) {
                        var percent = Math.floor((progressEvent.loaded / progressEvent.total) * 100) + '%';

                        // change <p> width
                        $('#photo_upload_progress_bar').css({'width' : percent});
                    } else {
                        // do nothing
                    }
                }

                // upload
                ft.upload(imageURI, encodeURI(app.image_upload_url), app.uploadPhotoSuccess, app.uploadPhotoError, options);

            } catch (err) {
                // hide loading animation and show error
                $.mobile.loading('hide');
                navigator.notification.alert(app.app_lang.alert.photo_upload_error, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);
                // send error msg to server API
            }
        } else /* NOT connected to internet */ {
            navigator.notification.alert(app.app_lang.alert.no_internet_connection, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);
        }
    },

    /**
    * Attempts to upload an image to the server for social media posting
    * @function socialMediaUploadPhoto
    * @memberOf app
    */
    socialMediaUploadPhoto : function() {
        // check if image was selected (if image was successfully selected -> preview image would be set)
        if ( app.elementWithIdExists('social_media_preview_image') ) {

            var imageURI = app.URI;

            // set loading animation options for uploading photo
            var loadingAnimationOptions = {
                text: '',
                textVisible: true,
                theme: 'b',
                html: '<p style="text-align: center;"><i class="icon-refresh icon-spin icon-4x"></i><br />uploaden foto...</p><p id="photo_upload_progress_bar"></p>'
            };

            // show custom loading animation
            $.mobile.loading('show', loadingAnimationOptions);

            // disable the submit button so users can't submit again
            $('#social_media_accounts_publish').button("disable");


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

                    // track upload progress and animate the progress bar
                    ft.onprogress = function(progressEvent) {
                        if (progressEvent.lengthComputable) {
                            // calculate progress percentage
                            var percent = Math.floor((progressEvent.loaded / progressEvent.total) * 100) + '%';

                            // change <p> width
                            $('#photo_upload_progress_bar').css({'width' : percent});
                        } else {
                            // do nothing
                        }
                    }

                    // upload
                    ft.upload(imageURI, encodeURI(app.image_upload_url), app.socialMediaUploadPhotoSuccess, app.socialMediaUploadPhotoError, options);

                } catch (err) {
                    // hide loading animation and show error
                    $.mobile.loading('hide');
                    navigator.notification.alert(app.app_lang.alert.photo_upload_error, false, app.app_lang.alert_error, app.app_lang.alert_close);
                    // send error to server
                }
            } else /* NOT connected to internet */ {
                navigator.notification.alert(app.app_lang.alert.no_internet_connection, false, app.app_lang.alert_error, app.app_lang.alert_close);
            }
        } else /* image does NOT exist so the user did not select or take a photo but still wishes to post a message */ {
            // set loading animation options for uploading photo

            // continue to 'postToSocialMedia' -> maybe change this?
            app.postToSocialMedia();
        }
    },

    /**
    * Called after social media photo upload success
    * @function socialMediaUploadPhotoSuccess
    * @param {string} response_server the server response
    * @memberOf app
    */
    socialMediaUploadPhotoSuccess: function(response_server) {
        // hide loading animation
        $.mobile.loading('hide');

        var responseJSON = jQuery.parseJSON(response_server.response);

        // extract the return URL from the server message and store it in the variable
        app.social_media_image_url = 'http://eerstelinks.nl' + responseJSON.files.url;

        // continue to 'postToSocialMedia'
        app.postToSocialMedia();
    },

    /**
    * Called after social media photo upload error
    * @function socialMediaUploadPhotoError
    * @param {string} error the server error message
    * @memberOf app
    */
    socialMediaUploadPhotoError: function(error) {
        // hide loading animation
        $.mobile.loading('hide');
        // maybe show error msg to user and/or send error msg to server API
    },

    /**
    * Gets the mime type of the image and returns it as string
    * @function getMimeType
    * @param {string} imageURI the URI of the image
    * @returns {string} the mime type of the image
    * @memberOf app
    */
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

    /**
    * Called after photo upload success
    * @function uploadPhotoSuccess
    * @param {string} res the server response
    * @memberOf app
    */
    uploadPhotoSuccess : function(res) {
        // convert response string to JSON object
        var responseJSON = jQuery.parseJSON(res.response);

        // if status = error
        if (responseJSON.status == 'error') {
            // send on to fail() function to handle error
            app.uploadPhotoError();
        } else {
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

                    navigator.notification.alert(app.app_lang.alert.photo_upload_success, false, app.app_lang.alert.success_alert, app.app_lang.alert.success_close);

                    // reset the attempt counter
                    app.attempts = 0;
                } else /* createBlock returned false */ {
                    navigator.notification.alert(app.app_lang.alert.general_error, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);
                    console.log('upload error')
                }
            } else if (tmp_ar[0] == 'art') {
                // user selected art element -> art photo must be replaced by new photo
                if (app.createBlock(tmp_ar[1], tmp_ar[2], responseJSON.files.url, 1, false)) {
                    navigator.notification.alert(app.app_lang.alert.photo_upload_success, false, app.app_lang.alert.success_alert, app.app_lang.alert.success_close);

                    // reset the attempt counter
                    app.attempts = 0;
                } else /* createBlock returned false */ {
                    navigator.notification.alert(app.app_lang.alert.general_error, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);
                }

            } else if (tmp_ar[0] == 'replace') {
                // user selected existing block

                // delete existing block
                app.deleteBlock(tmp_ar[3]);

                // create new block with the order of the old block
                if (app.createBlock(tmp_ar[1], tmp_ar[2], responseJSON.files.url, 0, tmp_ar[4])) {
                    navigator.notification.alert(app.app_lang.alert.photo_upload_success, false, app.app_lang.alert.success_alert, app.app_lang.alert.success_close);

                    // reset the attempt counter
                    app.attempts = 0;
                } else /* createBlock returned false */ {
                    navigator.notification.alert(app.app_lang.alert.general_error, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);
                }

            }

            // redirect to menu page
            $.mobile.changePage('#menu-page');
        }

        // re-enable upload button
        $('#upload-photo-submit').button('enable');
    },

    /**
    * Called after photo upload error.<br>
    * Attempts the upload up to 3 times before giving up and generating an error message<br>
    * info: first introduced for an Android 'bug', might not be necessary anymore since switching to HTTPS
    * @function uploadPhotoError
    * @param {string} error error message from the server
    * @memberOf app
    */
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
            navigator.notification.alert(app.app_lang.alert.photo_upload_error, false, app.app_lang.alert_error, app.app_lang.alert_close);

            // redirect to menu page
            $.mobile.changePage('#menu-page');
        }

        // re-enable upload button
        $('#upload-photo-submit').button('enable');
        $('#upload-photo-submit').button('refresh');
    },

    /**
    * Sends an ajax request to the server to create a block for the new image
    * @function createBlock
    * @param {string} sexy the section that was selected
    * @param {string} column the column that was selected
    * @param {string} url the url of the image that was uploaded
    * @param {string} isArt whether the selected element is an 'art' element (see eerstelinks website structure)
    * @param {string} order the order of the block (see eerstelinks website structure)
    * @returns {boolean} true if block successfully created, otherwise false
    * @memberOf app
    */
    createBlock : function(sexy, column, url, isArt, order) {
        // return value, set to false as default to simplify and shorten the code
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
                        console.log(res.message);
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

    /**
    * Sends an ajax request to the server to delete the block with the given ID
    * @function deleteBlock
    * @param {string} id id of the block to be deleted
    * @memberOf app
    */
    deleteBlock: function(id) {
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
                    //console.log('delete block success');
                } else {
                    navigator.notification.alert(app.app_lang.alert.general_error, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);
                }
            });
        } catch (err) {
            console.log(err);
        }
    },

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                          Misc functions section
    //
    // ----------------------------------------------------------------------------------------------------------

    /**
    * Sends feedback to eerstelinks API
    * @function sendFeedback
    * @returns {boolean} true if feedback was successfully sent
    * @memberOf app
    */
    sendFeedback : function() {
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
                        navigator.notification.alert(app.app_lang.alert.feedback_thanks, false, app.app_lang.alert.success_alert, app.app_lang.alert.success_close);
                        $.mobile.changePage('#menu-page');
                    } else {
                        navigator.notification.alert(app.app_lang.alert.general_error, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);
                        $.mobile.changePage('#menu-page');
                    }
                });
            } catch (err) {
                console.log(err);
            }
        } else /* NOT connected to internet */ {
            navigator.notification.alert(app.app_lang.alert.no_internet_connection, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);
        }

        $.mobile.loading('hide');
        return ret;
    },

    /**
    * Checks whether an element with given ID exists
    * @function elementWithIdExists
    * @returns {boolean}
    * @memberOf app
    */
    elementWithIdExists : function(id) {
        var tmp = document.getElementById(id);

        if (tmp != null || tmp != undefined) {
            return true;
        } else {
            return false;
        }
    },

    /**
    * Populates the list of websites linked to the user account when a user logs in
    * @function populatePathnameButtons
    * @memberOf app
    */
    populatePathnameButtons : function() {
        // delete all children of #pathname-choice <div> to avoid multiple buttons (cache)
        $('#pathname-choice').empty();

        // for each pathname in pathnames create a button
        for (var i=0; i<app.pathnames.length; i++) {
            var button = $('<button type="button" id="' + app.pathnames[i] + '">' + app.pathnames[i] + '</button>');
            $('#pathname-choice').append(button);

            // tell jquerymobile to 'buttonify' the button (jqm changes buttons internally)
            button.button();

            // append on 'tap' event listener
            var script = '<script type="text/javascript">$("#' + app.pathnames[i] + '").on("tap", function(event) { event.stopImmediatePropagation(); event.preventDefault(); app.setPathname("' + app.pathnames[i] + '"); $.mobile.changePage("#menu-page"); });</script>';
            $('body').append(script);
        }
    },

    /**
    * Sets the active website (pathname in eerstelinks terms)
    * @function setPathname
    * @param pn pathname
    * @memberOf app
    */
    setPathname : function(pn) {
        // store selected pathname
        window.localStorage['active-pathname'] = pn;
    },

    /**
    * Sets the users name in the side panel
    * @function setUsernameInPanel
    * @memberOf app
    */
    setUsernameInPanel : function() {
        $('#menu-panel-content-user').empty();
        $('#menu-panel-content-user').append(window.localStorage['username']);
    },

    /**
    * Populates the drop down menu with websites associated with the users account
    * @function populatePathnameSelectInPanel
    * @memberOf app
    */
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

    /**
    * Populates the drop down menu with supported languages for the app
    * @function populateLanguageSelectInPanel
    * @memberOf app
    */
    populateLanguageSelectInPanel: function () {
        $('#language_select').empty();

        for (ln in languages) {
            var tmp = '<option value="' + ln + '"';

            // if the pathname equals the pathname stored in local storage then this is the current
            // active website pathname -> pre-select it
            if (languages[ln] == window.localStorage['language']) {
                tmp += ' selected="selected">';
            } else {
                tmp += '>';
            }

            tmp += ln + '</option>';

            $('#language_select').append(tmp);
        }

        $('#language_select').selectmenu( "option", "icon", "star" );
        $('#language_select').selectmenu('refresh', true);
    },

    /**
    * Retrieves the website structure via an ajax request and creates a set of collapsible element representing the website structure
    * @function parseWebsiteStructure
    * @memberOf app
    */
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
                                    tmp += '<div style="background-color: transparent;"><p style="margin: 0; color: #ffffff; padding: 10px; text-align: center;"><i class="icon-fullscreen icon-2x"></i></p></div>';


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

                            navigator.notification.alert(app.app_lang.alert.photo_replace_warning, false, app.app_lang.alert.warning_alert, app.app_lang.alert.warning_close);

                            $('#upload-photo-submit').button('enable');
                        });
                        $('.collapsible-content-column-block.image').on('tap', function () {
                            $('.collapsible-content-column-block-effect').removeClass('collapsible-content-column-block-effect');
                            $(this).addClass('collapsible-content-column-block-effect');

                            navigator.notification.alert(app.app_lang.alert.photo_replace_warning, false, app.app_lang.alert.warning_alert, app.app_lang.alert.warning_close);

                            $('#upload-photo-submit').button('enable');
                        });
                        $('.collapsible-content-column-block.new').on('tap', function () {
                            $('.collapsible-content-column-block-effect').removeClass('collapsible-content-column-block-effect');
                            $(this).addClass('collapsible-content-column-block-effect');

                            // new block to be created so no 'warning' message necessary

                            $('#upload-photo-submit').button('enable');
                        });

                        // still need to add some logic for photo albums

                    } else {
                        console.log('ajax get all data error');
                    }
                });
            } catch (err) {
                navigator.notification.alert(app.app_lang.alert.general_error, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);
            }
        } else /* NOT connected to internet */ {
            navigator.notification.alert(app.app_lang.alert.no_internet_connection, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);
        }

        $.mobile.loading('hide');
    },

    /**
    * Retrieves statistics from the server via an ajax request
    * @function getStats
    * @memberOf app
    */
    getStats: function() {
        console.log('get stats');
    },

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                          Facebook functions section
    //
    // ----------------------------------------------------------------------------------------------------------

    /**
    * Opens an inAppBrowser window that will be directed to the 'add_facebook_accout_url' on the server
    * @function addFacebookAccount
    * @memberOf app
    */
    addFacebookAccount: function() {
        var url = app.add_facebook_account_url + '?username=' + window.localStorage['username'];

        // add event listeners to the inAppBrowser
        app.in_app_browser = window.open(url, '_blank', 'location=yes');
        app.in_app_browser.addEventListener('loadstart', app.addFacebookAccountLoadStart);
        app.in_app_browser.addEventListener('loadstop', app.addFacebookAccountLoadStop);
        app.in_app_browser.addEventListener('exit', app.addFacebookAccountExit);
    },

    /**
    * Adds loadStart listener to the inAppbrowser for adding a Facebook account
    * @function addFacebookAccountLoadStart
    * @param {object} ref the window reference object
    * @memberOf app
    */
    addFacebookAccountLoadStart: function(ref) {
        // if something goes wrong on Facebook site and it redirects the user to facebook.com/home.php -> close the window
        if (ref.url == 'https://www.facebook.com/home.php') {
            console.log('load "facebook.com/home.php" start');
            app.in_app_browser.close();
            app.getFacebookAccounts();
            app.populateFacebookAccounts();
        }
    },

    /**
    * Adds loadStop listener to the inAppbrowser for adding a Facebook account
    * @function addFacebookAccountLoadStop
    * @param {object} ref the window reference object
    * @memberOf app
    */
    addFacebookAccountLoadStop: function(ref) {
        // if the inAppBrowser load the exit url we specified -> close the window
        if (ref.url == app.facebook_exit_inappbrowser_url) {
            app.in_app_browser.close();

            // fetch all Facebook accounts and repopulate the list
            app.getFacebookAccounts();
            app.populateFacebookAccounts();
        }
    },

    /**
    * Adds exit listener to the inAppbrowser for adding a Facebook account
    * @function addFacebookAccountExit
    * @param {object} ref the window reference object
    * @memberOf app
    */
    addFacebookAccountExit: function(ref) {
        // reset the inAppBrowser object
        app.in_app_browser = null;
    },

    /**
    * Gets all the Facebook account linked to the user via an ajax request
    * @function getFacbookAccounts
    * @memberOf app
    */
    getFacebookAccounts: function() {
        // retrieve facebook accounts linked to this eerstelinks account (check persmissions server side before returning)
        var params = {
            'type': 'get_facebook_accounts',
            'session': window.localStorage['session'],
            'pathname': window.localStorage['active-pathname'],
            'username': window.localStorage['username'],
            'version': app.version
        };

        $.ajax({
            async: true,
            cache: false,
            data: params,
            dataType: 'json',
            timeout: 30000,
            type: 'GET',
            url: app.get_facebook_accounts_url,
            success: function(json) {
                // store the FB accounts + info in an array so we can use them in 'populateFacebookAccounts'
                app.facebook_accounts = json;
                app.populateFacebookAccounts();
            },
            error: function(xhr, status) {
                // do some other stuff for error
                navigator.notification.alert(app.app_lang.alert.general_error, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);
            },
            complete: function(xhr, status) {
                // when finished, do something
            }
        });
    },

    /**
    * Populate the list of all Facebook accounts linked to the users account
    * @function populateFacebookAccounts
    * @memberOf app
    */
    populateFacebookAccounts: function() {
        // empty the list first
        $('#facebook_accounts').empty();

        // create empty string that will be filled with html markup which will then be injected into the DOM by jQuery
        var html = '';

        for (key in app.facebook_accounts) {
            console.log('key: ' + key);
            console.log('facebook_accounts[key].facebook_name: ' + app.facebook_accounts[key].facebook_name);
            console.log('facebook_accounts[key].facebook_id: ' + app.facebook_accounts[key].facebook_id);

            html += '<div id="facebook_id_' + app.facebook_accounts[key].facebook_id + '">';
            html += '<i class="icon-facebook-sign"></i>&nbsp;'
            html += '<span>' + app.facebook_accounts[key].facebook_name + '</span>';
            html += '&nbsp;<i class="icon-ok"></i>';
            html += '</div>';
        }

        $('#facebook_accounts').append(html);

        // add event listeners to each item in the list
        for (key in app.facebook_accounts) {
            var div_id = '#facebook_id_' + app.facebook_accounts[key].facebook_id;

            $(div_id).on('tap', function (event) {
                event.stopImmediatePropagation();
                event.preventDefault();

                $(this).toggleClass('facebook_account_is_selected');
            });
        }
    },

    /**
    * Send message to server API which then posts to the Facebook accounts
    * @function postToFacebook
    * @memberOf app
    */
    postToFacebook: function() {
        // set loading animation options for uploading photo
        var loadingAnimationOptions = {
            text: '',
            textVisible: true,
            theme: 'b',
            html: '<p style="text-align: center;"><i class="icon-refresh icon-spin icon-4x"></i><br />post naar social media...</p>'
        };

        // show custom loading animation
        $.mobile.loading('show', loadingAnimationOptions);

        var selected_facebook_ids = new Array();

        // send only the ID's without the 'is_selected_' prefix
        $('.facebook_account_is_selected').each(function(index) {
            var tmp = $(this).attr('id').split('_');
            selected_facebook_ids[index] = tmp[2];
        });

        // check if array is not empty -> otherwise skip ajax request!
        if (selected_facebook_ids.length > 0) {
            // retrieve message from the form
            var message = $('#social-media-messsage').val();
            console.log('message: ' + message);

            // retrieve img url
            var image_url = app.social_media_image_url;
            console.log('image url: ' + image_url);

            var params = {
                'session': window.localStorage['session'],
                'username': window.localStorage['username'],
                'message': message,
                'facebook_ids': selected_facebook_ids,
                'image_url': image_url
            };

            $.ajax({
                async: true,
                cache: false,
                data: params,
                dataType: 'json',
                timeout: 30000,
                type: 'POST',
                url: app.post_to_facebook_url,
                success: function(json) {
                    app.post_to_facebook_success = true;
                },
                error: function(xhr, status) {
                    app.post_to_facebook_success = false;
                },
                complete: function(xhr, status) {
                    app.post_to_facebook_complete = true;
                    app.socialMediaPostSuccessOrFail();
                }
            });
        } else { /* else, nothing */
            // set/fake to complete
            app.post_to_facebook_complete = true;
        }
    },

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                          Twitter functions section
    //
    // ----------------------------------------------------------------------------------------------------------

    /**
    * Open an inAppBrowser window which will connect to the 'add_twitter_url' on the server to add a twitter account
    * @function addTwitterAccount
    * @memberOf app
    */
    addTwitterAccount: function() {
        // add the users' username to the url (needed server side)
        var url = app.add_twitter_account_url + '?eerstelinks_username=' + window.localStorage['username'];

        // open inAppBrowser window
        app.in_app_browser = window.open(url, '_blank', 'location=yes');

        // add event listeners
        app.in_app_browser.addEventListener('loadstart', app.addTwitterAccountLoadStart);
        app.in_app_browser.addEventListener('loadstop', app.addTwitterAccountLoadStop);
        app.in_app_browser.addEventListener('exit', app.addTwitterAccountExit);
    },

    /**
    * Adds loadStart listener to the inAppbrowser for adding a Twitter account
    * @function addTwitterAccountLoadStart
    * @param {object} ref the window reference object
    * @memberOf app
    */
    addTwitterAccountLoadStart: function(ref) {
        // do nothing
    },

    /**
    * Adds loadStop listener to the inAppbrowser for adding a Twitter account
    * @function addTwitterAccountLoadStop
    * @param {object} ref the window reference object
    * @memberOf app
    */
    addTwitterAccountLoadStop: function(ref) {
        // if the browser has finished loading the specified url -> close the inAppBrowser window
        if (ref.url == app.twitter_exit_inappbrowser_url ) {
            app.in_app_browser.close();

            // get all accounts (so we get the newly added account) and repopulate the list
            app.getTwitterAccounts();
            app.populateTwitterAccounts();
        }
    },

    /**
    * Adds exit listener to the inAppbrowser for adding a Twitter account
    * @function addTwitterAccountExit
    * @param {object} ref the window reference object
    * @memberOf app
    */
    addTwitterAccountExit: function(ref) {
        // reset the inAppBrowser object
        app.in_app_browser = null;
    },

    /**
    * Gets all the Twitter account linked to the user via an ajax request
    * @function getTwitterAccounts
    * @memberOf app
    */
    getTwitterAccounts: function() {
        // retrieve facebook accounts linked to this eerstelinks account (check persmissions server side before returning)
        var params = {
            'type': 'get_twitter_accounts',
            'session': window.localStorage['session'],
            'pathname': window.localStorage['active-pathname'],
            'username': window.localStorage['username'],
            'version': app.version
        };

        $.ajax({
            async: true,
            cache: false,
            data: params,
            dataType: 'json',
            timeout: 30000,
            type: 'GET',
            url: app.get_twitter_accounts_url,
            success: function(json) {
                // store the FB accounts + info in an array so we can use them in 'populateFacebookAccounts'
                app.twitter_accounts = json;
                app.populateTwitterAccounts();
            },
            error: function(xhr, status) {
                navigator.notification.alert(app.app_lang.alert.general_error, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);
            },
            complete: function(xhr, status) {
                // do nothing
            }
        });
    },

    /**
    * Populate the list of all Twitter accounts linked to the users account
    * @function populateTwitterAccounts
    * @memberOf app
    */
    populateTwitterAccounts: function() {
        // empty list first
        $('#twitter_accounts').empty();

        // string will contain the html markup which will be injected into the DOM by jQuery
        var html = '';

        for (key in app.twitter_accounts) {
            html += '<div id="twitter_id_' + app.twitter_accounts[key].twitter_id + '">';
            html += '<i class="icon-twitter-sign"></i>&nbsp;'
            html += '<span>&#64;' + app.twitter_accounts[key].twitter_screen_name + '</span>';
            html += '&nbsp;<i class="icon-ok"></i>';
            html += '</div>';
        }

        $('#twitter_accounts').append(html);

        // add event listeners to all items in the list
        for (key in app.twitter_accounts) {

            var div_id = '#twitter_id_' + app.twitter_accounts[key].twitter_id;

            $(div_id).on('tap', function (event) {
                event.stopImmediatePropagation();
                event.preventDefault();

                $(this).toggleClass('twitter_account_is_selected');
            });
        }
    },

    /**
    * Send message to server API which then posts to the Twitter accounts
    * @function postToTwitter
    * @memberOf app
    */
    postToTwitter: function() {
        // set loading animation options for uploading photo
        var loadingAnimationOptions = {
            text: '',
            textVisible: true,
            theme: 'b',
            html: '<p style="text-align: center;"><i class="icon-refresh icon-spin icon-4x"></i><br />post naar social media...</p>'
        };

        // show custom loading animation
        $.mobile.loading('show', loadingAnimationOptions);

        var selected_twitter_ids = new Array();

        // add only IDs to the array, without the 'is_selected_' prefix
        $('.twitter_account_is_selected').each(function(index) {
            var tmp = $(this).attr('id').split('_');
            selected_twitter_ids[index] = tmp[2];
        });

        // check if array is not empty -> otherwise skip ajax request!
        if (selected_twitter_ids.length > 0) {
            // get the message from the form
            var message = $('#social-media-messsage').val();
            console.log('message: ' + message);

            // get the image url
            var image_url = app.social_media_image_url;
            console.log('image url: ' + image_url);

            // set the parameters
            var params = {
                'session': window.localStorage['session'],
                'username': window.localStorage['username'],
                'message': message,
                'twitter_ids': selected_twitter_ids,
                'image_url': image_url
            };

            // construct the ajax request
            $.ajax({
                async: true,
                cache: false,
                data: params,
                dataType: 'json',
                timeout: 30000,
                type: 'POST',
                url: app.post_to_twitter_url,
                success: function(json) {
                    // set post to twitter as true (success)
                    app.post_to_twitter_success = true;
                },
                error: function(xhr, status) {
                    // set post to twitter to false (error)
                    app.post_to_twitter_success = false;
                },
                complete: function(xhr, status) {
                    // set complete to true and check if social media posting was successful or not
                    app.post_to_twitter_complete = true;
                    app.socialMediaPostSuccessOrFail();
                }
            });
        } else { /* else, nothing */
            // fake complete
            app.post_to_twitter_complete = true;
        }
    },

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                          Social media functions section
    //
    // ----------------------------------------------------------------------------------------------------------

    /**
    * Checks the number of chars of the message and shows the number in red if max chars has been surpassed
    * @function checkMessageChars
    * @memberOf app
    */
    checkMessageChars: function() {
        var curr_chars = $('#social-media-messsage').val().length;
        var chars_left = app.message_max_chars - curr_chars;
        $('#num_chars').html(chars_left);

        if (chars_left < 0) {
            // if more than max number of chars make chars red
            $('#num_chars').addClass('char_counter_message_too_long');
        } else {
            // if number of chars drops below the max -> remove error class
            $('#num_chars').removeClass('char_counter_message_too_long');
        }
    },

    /**
    * Checks if any accounts were selected before attempting to post
    * @function checkIfAccountsSelected
    * @memberOf app
    */
    checkIfAccountsSelected: function() {
        console.log('checkIfAccountsSelected');
        // if non accounts selected show warning else go ahead and attempt post
        //app.socialMediaUploadPhoto();

        if ($('.twitter_account_is_selected').length == 0 && $('.facebook_account_is_selected').length == 0) {
            navigator.notification.alert('pannekoek, kies wel een account');
        } else {
            navigator.notification.alert('minstens een account geselecteerd!');
        }
    },

    /**
    * Post to the supported social media platforms
    * @function postToSocialMedia
    * @memberOf app
    */
    postToSocialMedia: function() {
        // disable submit button until finished
        $('#social_media_accounts_publish').button('disable');

        // post to the supported social media (can be extended)
        app.postToFacebook();
        app.postToTwitter();

        // re-enable the submit button and refresh (jqm 'feature')
        // note: don't reanable the button here because the ajax requests are asynchronous
        //$('#social_media_accounts_publish').button('enable');
        //$('#social_media_accounts_publish').button('refresh');
    },

    /**
    * Checks whether social media posting was succesful or not
    * @function socialMediaPostSuccessOrFail
    * @memberOf app
    */
    socialMediaPostSuccessOrFail: function() {
        // check if posting successfull
        // if both posts have been finished then do stuff (both requests are async)
        if (app.post_to_facebook_complete == true && app.post_to_twitter_complete == true) {

            // both async requests are complete -> check if both were successful
            if (app.post_to_facebook_success == true || app.post_to_twitter_success == true) {
                // congratulate user, posting ok
                navigator.notification.alert(app.app_lang.alert.message_sent_success, false, app.app_lang.alert.success_alert, app.app_lang.alert.success_close);

                // reset the success checkers
                app.post_to_facebook_success = undefined;
                app.post_to_twitter_success = undefined;
            }

            if (app.post_to_facebook_success == false || app.post_to_twitter_success == false) {
                // if either request failed (false) then send error message to user
                navigator.notification.alert(app.app_lang.alert.general_error, false, app.app_lang.alert.error_alert, app.app_lang.alert.error_close);
            }

            $('#social_media_accounts_publish').button('enable');

            // hide loading animation and change page to menu page
            $.mobile.loading('hide');
            $.mobile.changePage('#menu-page');
        }
    },

    /**
    * Checks whether the user selected or took a photo and/or wrote something
    * @function checkSocialMediaMessageOrPicture
    * @memberOf app
    */
    checkSocialMediaMessageOrPicture: function() {
        // if either photo selected/taken -or- message written -> go to next page
        if (app.elementWithIdExists('social_media_preview_image') || $('#social-media-messsage').val() != '') {
            $.mobile.changePage('#social-media-accounts');
        } else /* give error message */ {
            navigator.notification.alert(app.app_lang.alert.image_or_message_warning, false, app.app_lang.alert.warning_alert, app.app_lang.alert.warning_close);
        }
    }
};