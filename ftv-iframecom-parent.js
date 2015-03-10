/*! iframe-crossdomain-communication v1.0.0 | (c) 2015 FranceTelevisions Editions Numeriques */

(function(window, document) {
    "use strict";

    var receiveCallbackList = {};

    var iframeComParent = {

        // Send a message to the iframe. Make sure it can handle it.
        // iframeElement is the domElement of the iframe
        // id can be any string except "width" or "height".
        // payload can be a number, a string, an array, a JSON object.
        sendCustomMessage: function(iframeElement, id, payload) {
            send(iframeElement, id, payload);
        },

        // The callback function is called when the parent window sends a message with the specified id
        // iframeElement is the domElement of the iframe
        onCustomMessageReceived: function(id, callback) {
            receiveCallbackList[id] = callback;
        },

        setFullscreen: function(domElement) {
            enterFullScreen(domElement);
        },

        removeFullscreen: function(domElement) {
            leaveFullScreen(domElement);
        }
    };

    function send(iframeElement, id, payload) {
        if (!iframeElement || !iframeElement.contentWindow || !iframeElement.contentWindow.postMessage) {
            return;
        }

        var stringToSend = JSON.stringify({
            id: id,
            payload: payload
        });

        iframeElement.contentWindow.postMessage(stringToSend, '*');
    }
    
    function onMessageReceived(event) {
        var data = JSON.parse(event.data);

        if (!data.id) {
            return;
        }

        if (data.id === 'width' || data.id === 'height' || data.id === 'autoHeight' || data.id === 'fullscreen') {
            var iframe = findIframeBySrc(data.href);

            if (data.id === 'width') {
                iframe.style.width = data.payload + 'px';
            } else if (data.id === 'height') {
                iframe.style.height = data.payload + 'px';
            } else if (data.id === 'autoHeight') {
                iframe.style.height = 'auto'; // necessary, otherwise a smaller height cannot be detected
                send(iframe, 'whatsYourHeight?');
            } else if (data.id === 'fullscreen') {
                if (data.payload === true) {
                    enterFullScreen(iframe);
                } else {
                    leaveFullScreen(iframe);
                }
            }

        } else {
            
            // Any other message
            var fn = receiveCallbackList[data.id];
            if (typeof fn === 'function') {
                fn(data.payload);
            }
        }
    }

    function enterFullScreen(domElement) {
        if (domElement.requestFullscreen) {
            domElement.requestFullscreen();
        } else if (domElement.mozRequestFullScreen) {
            domElement.mozRequestFullScreen();
        } else if (domElement.webkitRequestFullScreen) {
            domElement.webkitRequestFullScreen();
        } else if (domElement.msRequestFullScreen) {
            domElement.msRequestFullScreen();
        } else {
            // Non compatible browsers (IE 10 and less + mobile browsers)
            alert('Votre navigateur n\'est pas compatible avec le mode "full screen"');
            // TODO one day: enlarge domElement and listen to "Esc" keypress
        }
    }

    function leaveFullScreen(domElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozExitFullscreen) {
            document.mozExitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else {
            // Non compatible browsers (IE 10 and less + mobile browsers)
        }
    }

    function findIframeBySrc(href) {
        var iframes = document.querySelectorAll('iframe');
        for (var i = 0; i < iframes.length; i++) {
            if (iframes[i].src === href) {
                return iframes[i];
            }
        }
    }

    if (window.addEventListener) {
        window.addEventListener('message', onMessageReceived, false);
    } else {
        window.attachEvent('onmessage', onMessageReceived);
    }

    window.FTVEN = window.FTVEN || {};
    window.FTVEN.iframeComParent = iframeComParent;

})(this, this.document);