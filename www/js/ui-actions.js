$( function () {

    // Changed onclicks to vmousedown/vmouseup for 2 reasons.

    // 1) Smoother animations (can trigger on down, up or complete sequence).

    // 2) Speed. Classic onclick has a built in +-300ms delay to capture double-click events which 'tap' does not have.

    // see jquerymobile api docs for differences between the events (tap/vmouse/...)
    // http://api.jquerymobile.com/category/events/

    // This file will only contain ui-events (animations, page transitions, etc), all the application logic will be kept in app.js

    // update: changed events to use google fastbutton events to stop ghost clicks registering

    // update2: removed google fastbutton because it breaks the 'glow' animation of the icons and instead used:
    //          stopImmediatePropagation and preventDefault to stop events after registering the jquery mobile 'tap' event

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                               Menu icon animations
    //
    // ----------------------------------------------------------------------------------------------------------

    $('.menu_icon').on('vmousedown', function() {
        $(this).addClass('menu_icon_glow_effect');
    });
    $('.menu_icon').on('vmouseup', function() {
        $(this).removeClass('menu_icon_glow_effect');
    });

    $('.collapsible-content-column-block').on('tap', function() {
        $(this).addClass('collapsible-content-column-block-effect');
    });

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                               Tap events
    //
    // ----------------------------------------------------------------------------------------------------------

    $('#login-form-submit').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        app.login('login-form');
    });

    // Back buttons that return to menu page
    $('.back_to_menu_button').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        $.mobile.changePage('#menu-page');
    });

    // If user hits 'upload' button on menu page
    $('#upload_photo_icon').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        app.getPhoto();
    });

    // If user hits 'take photo' button on menu page
    $('#capture_photo_icon').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        app.capturePhoto();
    });

    // If user hits 'upload' button on preview page
    $('#upload-photo-submit').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        var el_id = $('.collapsible-content-column-block-effect').attr('id');
        app.photo_location_id = el_id;

        app.uploadPhoto2();
    });

    // If user hits 'settings' icon on menu page
    $('#settings_icon').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        $('#menu-page-panel').panel('toggle');
    });

    // If user hits 'feedback' icon on menu page
    $('#feedback_icon').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        $.mobile.changePage('#feedback-page');
    });

    // If user hits the 'social media' icon on the menu page -> go to social media page
    $('#feedback-form-submit').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        //navigator.notification.alert('device language: ' + app.device_language);
        app.sendFeedback();
    });

    $('#info_icon').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        $.mobile.changePage('#info-page', {transition: 'flip'});
    });

    // Button to external site on the info page
    $('#link_to_website').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        var ref = window.open('http://eerstelinks.nl','_system','location=yes');
    });

    // Register button on the login page (if user doesn't have an account yet for ex)
    $('#register').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        var ref = window.open('http://eerstelinks.nl/welkom','_system','location=yes');
    });

    // If user hits the 'logout' icon on the menu page
    $('#logout_icon').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        app.logout();
    });

    // If user hits the 'choose active website' icon on the menu page
    $('#pathname_choice_icon').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        $.mobile.changePage('#pathname-choice-page');
    });

    // If user hits the 'social media' icon on the menu page -> go to social media page
    $('#social_media_icon').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        $.mobile.changePage('#social-media-page');
    });

    // If user hits the 'social media' icon on the menu page -> go to social media page
    $('#truck_icon').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        $('#truck_icon_div').animate({'marginLeft': '-5000px'}, 5000);
        window.localStorage['truck_seen'] = 1;
    });

    $('#server_message_remove_icon').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        app.dismissServerMessage();
    });

    $('#stats_icon').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        $.mobile.changePage('#stats-page');
    });

    $('#choose-section-column-button').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        $.mobile.changePage('#choose-section-and-column-page');
    });

    $('#social-media-page-picture').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        app.socialMediaGetPhoto();
    });

    $('#social-media-page-camera').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        app.socialMediaCapturePhoto();
    });

    $('#social_media_page_choose_accounts').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        app.checkSocialMediaMessageOrPicture();
    });

    $('#add_facebook_account').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        app.addFacebookAccount();
    });

    $('#add_twitter_account').on('tap', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();

        app.addTwitterAccount();
    });

    $('#social_media_accounts_publish').on('tap', function(event) {

        app.checkIfAccountsSelected();
        //app.socialMediaUploadPhoto();
    });

    $('#test_icon').on('tap', function(event) {
        console.log('---test---');
        console.log('app.app_lang:');
        console.log(app.app_lang);

        console.log(app.app_lang['error_close']);
    });


    // ----------------------------------------------------------------------------------------------------------
    //
    //                                               PageBeforeShow events
    //
    // ----------------------------------------------------------------------------------------------------------

    // Before the pathname-choice-page is loaded generate the buttons
    $('#pathname-choice-page').on('pagebeforeshow', function(event) {
        app.populatePathnameButtons();
    });

    $('#menu-page').on('pagebeforeshow', function(event) {

        if (window.localStorage['truck_seen'] == 1) {
            $('#truck_icon_div').hide();
        }

        app.setUsernameInPanel();
        app.populatePathnameSelectInPanel();
        app.populateLanguageSelectInPanel();
    });

    $('#choose-section-and-column-page').on('pagebeforeshow', function(event) {
        $('#upload-photo-submit').button('disable');
        app.parseWebsiteStructure();
    });

    $('#stats-page').on('pagebeforeshow', function(event) {
        app.getStats();
    });

    $("#active-pathname-select").change(function() {
        // get 'selected' item and store in local storage
        var tmp = $('#active-pathname-select option:selected').val();
        app.setPathname(tmp);
    });

    $("#language_select").change(function() {
        // get 'selected' item and store in local storage
        var tmp = $('#language_select option:selected').val();
        app.changeLanguage(tmp);

        app.setUiLanguage();
    });

    $("#social-media-page").on('pagebeforeshow', function(e) {
        // get 'selected' item and store in local storage
        app.getFacebookAccounts();
        app.getTwitterAccounts();

        $('#social-media-page-refresh').hide();
        $('#social-media-messsage').val('');
        $('#social-media-picture-container').empty();
        app.social_media_image_url = undefined;

        $('#num_chars').html('140');
        $('#num_chars').removeClass('char_counter_message_too_long');
    });

    $('#social-media-messsage').on('input propertychange', function() {
        app.checkMessageChars();
    });

});