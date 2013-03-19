document.addEventListener("deviceready", test.deviceReady, false);

var test = {

    deviceReady: function() {
        console.log('deviceReady');
        this.testFunction();
    },

    testFunction: function() {
        console.log('this is a test');
    }
};