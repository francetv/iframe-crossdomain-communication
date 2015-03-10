/*! iframe-crossdomain-communication v1.0.0 | (c) 2015 FranceTelevisions Editions Numeriques */

(function(window, document) {
    "use strict";

    var receiveCallbackList = {};

    var iframeComIframe = {

        // Ask the parent window to resize the iframe's width (value in px)
        setWidth: function(width) {
            sendNewWidth(width);
        },

        // Ask the parent window to resize the iframe's height (value in px)
        setHeight: function(height) {
            sendNewHeight(height);
        },

        // Send every heigh change in the iframe to the parent
        autoresizeHeight: function() {
            initAutoresize();
        },

        // Takes the iframe and set it in full screen (or maximum size for non compatible browsers)
        enterFullScreen: function() {
            send('fullscreen', true);
        },

        // Back to normal iframe size
        leaveFullScreen: function() {
            send('fullscreen', false);
        },

        // Send a message to the parent. Make sure it can handle it.
        // Id can be any string except "width" or "height".
        // Payload can be a number, a string, an array, a JSON object.
        sendCustomMessage: function(id, payload) {
            send(id, payload);
        },

        // The callback function is called when the parent window sends a message with the specified id
        onCustomMessageReceived: function(id, callback) {
            receiveCallbackList[id] = callback;
        }
    };

    function sendNewWidth(width) {
        send('width', width);
    }

    function sendNewHeight(height) {
        send('height', height);
    }

    function send(id, payload) {
        if (!inIframe() || !window.parent.postMessage) {
            return;
        }

        var stringToSend = JSON.stringify({
            id: id,
            href: window.location.href,
            payload: payload
        });

        window.parent.postMessage(stringToSend, '*');
    }

    function onMessageReceived(event) {
        var data = JSON.parse(event.data);

        if (data.id) {

            if (data.id === 'whatsYourHeight?') {

                var body = document.body;
                var html = document.documentElement;
                sendNewHeight(Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight));

            } else {

                var fn = receiveCallbackList[data.id];
                if (typeof fn === 'function') {
                    fn(data.payload);
                }

            }
        }
    }

    function initAutoresize() {
        if (!inIframe()) {
            return;
        }

        // Init size
        checkResize();

        // Watch window height
        if (window.MutationObserver) {
            var target = document.querySelector('body');
            
            var observer = new window.MutationObserver(checkResize);

            var config = {
                attributes            : true,
                attributeOldValue     : false,
                characterData         : true,
                characterDataOldValue : false,
                childList             : true,
                subtree               : true
            };

            observer.observe(target, config);
        } else {
            setInterval(checkResize, 500);
        }
    }


    function checkResize() {
        send('autoHeight');
    }

    function inIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    if (window.addEventListener) {
        window.addEventListener('message', onMessageReceived, false);
    } else {
        window.attachEvent('onmessage', onMessageReceived);
    }
    
    window.FTVEN = window.FTVEN || {};
    window.FTVEN.iframeComIframe = iframeComIframe;

})(this, this.document);