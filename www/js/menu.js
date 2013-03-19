/*function logout() {
    //
    console.log('logout');
    delete window.localStorage["password"];
    window.location.replace("index.html");
    //$.mobile.changePage('index.html');
}*/

function takePhoto() {
    console.log('take picture');
}

// --------------
// test functions
// --------------

function removeCredentials() {
    console.log("removeCredentials");
    delete window.localStorage["username"];
    delete window.localStorage["password"];
    window.location.replace("index.html");
}

function testOn() {
    $.mobile.loading('show');
}

function testOff() {
    $.mobile.loading('hide');
}

function test45() {
    console.log('test45');
}