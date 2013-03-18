function init() {
    document.addEventListener("deviceready", deviceReady, true);
    document.addEventListener("online", onOnline, false);
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
}

function deviceReady() {
    test3();
    console.log('deviceReady');
}

function onOnline() {
    console.log('onOnline');
}

function onOffline() {
    console.log('onOffline');
}

function onPause() {
    console.log('onPause');
}

function onResume() {
    console.log('onResume');
}

function logout() {
    //
    console.log("logout");
    delete window.localStorage["password"];
    window.location.replace("index.html");
}

function removeCredentials() {
    console.log("removeCredentials");
    delete window.localStorage["username"];
    delete window.localStorage["password"];
    window.location.replace("index.html");
}

function test3() {
    console.log('test3');
}

function test() {
    console.log('test');
    $.mobile.loading('show');
}

function test2() {
    console.log('iets');
    $.mobile.loading('hide');
}