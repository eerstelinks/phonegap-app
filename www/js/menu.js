var deviceReadyDeferred = $.Deferred();
var jqmReadyDeferred = $.Deferred();

document.addEventListener("deviceReady", deviceReady, false);

function deviceReady() {
    deviceReadyDeferred.resolve();
}

$(document).bind("mobileinit", function(){
    jqmReadyDeferred.resolve();
});

$.when(deviceReadyDeferred, jqmReadyDeferred).then(doWhenBothFrameworksLoaded);

function doWhenBothFrameworksLoaded() {
    //checkCredentials();
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