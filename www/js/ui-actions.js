$( function () {

    // changed onclicks to vmousedown/vmouseup for 2 reasons. 1) the animation and 2) speed (much faster transitions)
    // when using onclick there is a delay of about 300ms in case the user decides to 'double-click' for example
    // whereas the jquerymobile events DO NOT cause a delay

    // each button on the menu page needs it's own ID because it needs to call the correct function in app.js after the animation
    // (once an icon has been linked to a jquerymobile event (tap/vmouse/...) onclick no longer works on that element)

    // should probably move to a different file or into the app.js file

    // see jquerymobile api docs for differences between the events (tap/vmouse/...)
    // http://api.jquerymobile.com/category/events/


    // trying to keep this section for animations and events only and putting the app logic in app.js to keep things seperated

    // menu icon animation
    // -------------------
    //
    $('.menu_icon').on('vmousedown', function() {
        $(this).addClass('menu_icon_glow_effect');
    });
    $('.menu_icon').on('vmouseup', function() {
        $(this).removeClass('menu_icon_glow_effect');
    });

    // tap events
    // ----------
    //
    // login page
    $('#login-form-submit').on('tap', function() {
        app.login('login-form');
    });

    // back to menu button
    $('.back_to_menu_button').on('tap', function() {
        $.mobile.changePage('#menu-page');
    });

    // upload photo
    $('#upload_photo_icon').on('tap', function() {
        app.getPhoto();
    });

    // capture photo
    $('#capture_photo_icon').on('tap', function() {
        app.capturePhoto();
    });

    // upload photo
    $('#upload-photo-submit').on('tap', function() {
        app.uploadPhoto();
    });

    // settings icon
    $('#settings_icon').on('tap', function() {
        $.mobile.changePage('#settings-page');
    });

    // feedback icon
    $('#feedback_icon').on('tap', function() {
        $.mobile.changePage('#feedback-page');
    });

    // info icon
    $('#info_icon').on('tap', function() {
        $.mobile.changePage('#info-page');
    });

    // link to eerstelinks.nl website in external browser
    $('#link_to_website').on('tap', function() {
        window.open('http://eerstelinks.nl','_system','location=yes');
    });

    // logout icon
    $('#logout_icon').on('tap', function() {
        app.logout();
    });

    // pathname choice icon
    $('#pathname_choice_icon').on('tap', function() {
        $.mobile.changePage('#pathname-choice-page');
    });

    $('#pathname-choice-page').on('pagebeforeshow', function(event) {
        app.populatePathnameButtons();
    });
});