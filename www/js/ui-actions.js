$( function () {

    // Changed onclicks to vmousedown/vmouseup for 2 reasons.

    // 1) Smoother animations (can trigger on down, up or complete sequence).

    // 2) Speed. Classic onclick has a built in +-300ms delay to capture double-click events which 'tap' does not have.

    // see jquerymobile api docs for differences between the events (tap/vmouse/...)
    // http://api.jquerymobile.com/category/events/

    // This file will only contain ui-events (animations, page transitions, etc), all the application logic will be kept in app.js

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

    // ----------------------------------------------------------------------------------------------------------
    //
    //                                               Tap events
    //
    // ----------------------------------------------------------------------------------------------------------

    // If user hits login button process login information
    $('#login-form-submit').on('tap', function() {
        app.login('login-form');
    });

    // Back buttons that return to menu page
    $('.back_to_menu_button').on('tap', function() {
        $.mobile.changePage('#menu-page');
    });

    // If user hits 'upload' button on menu page
    $('#upload_photo_icon').on('tap', function() {
        app.getPhoto();
    });

    // If user hits 'take photo' button on menu page
    $('#capture_photo_icon').on('tap', function() {
        app.capturePhoto();
    });

    // If user hits 'upload' button on preview page
    $('#upload-photo-submit').on('tap', function() {
        app.uploadPhoto();
    });

    // If user hits 'settings' icon on menu page
    $('#settings_icon').on('tap', function() {
        $.mobile.changePage('#settings-page');
    });

    // If user hits 'feedback' icon on menu page
    $('#feedback_icon').on('tap', function() {
        //$.mobile.changePage('#feedback-page');
        navigator.notification.alert('device language: ' + app.device_language);
    });

    // If user hits 'info' icon on menu page
    $('#info_icon').on('tap', function() {
        $.mobile.changePage('#info-page');
    });

    // Button to external site on the info page
    $('#link_to_website').on('tap', function() {
        var ref = window.open('http://eerstelinks.nl','_system','location=yes');
    });

    // Register button on the login page (if user doesn't have an account yet for ex)
    $('#register').on('tap', function() {
        var ref = window.open('http://eerstelinks.nl/welkom','_system','location=yes');
    });

    // If user hits the 'logout' icon on the menu page
    $('#logout_icon').on('tap', function() {
        app.logout();
    });

    // If user hits the 'choose active website' icon on the menu page
    $('#pathname_choice_icon').on('tap', function() {
        $.mobile.changePage('#pathname-choice-page');
    });

    // If user hits the 'social media' icon on the menu page -> go to social media page
    $('#social_media_icon').on('tap', function() {
        $.mobile.changePage('#social-media-page');
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
});