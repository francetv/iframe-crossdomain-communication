# Cross-domain iframe communication, the FTVEN way


## Installation

1. Add the "iframe" script in the iframe: `<script src="somepath/ftv-iframecom-iframe.js"></script>`
2. Add the "parent" script in the parent window: `<script src="somepath/ftv-iframecom-parent.js"></script>`

It is best if you use the minified versions, in the `build` directory.


## Auto-resize iframe's height to its content

#### In the iframe

Add this script : `FTVEN.iframeComIframe.autoresizeHeight();`

#### In the parent window

```css
iframe.myIframe {
   width: 300px;
   height: 400px; /* it's important to set an height */
   overflow: hidden; 
}
```

```html
<iframe class="myIframe" scrolling="no" src="..."></iframe>
```

That's all you need to activate auto-resize.

#### Compatibility

Compatibility starts with IE8.

It uses the [MutationObserver API](http://caniuse.com/#feat=mutationobserver) when available and has a fallback with a `setInterval` for older browsers.



## Switch the iframe to fullscreen

#### From inside the iframe

```js
FTVEN.iframeComIframe.enterFullScreen(); // on
FTVEN.iframeComIframe.leaveFullScreen(); // off
```

#### From the parent window

Enter full screen by providing the iframe DOM element to the function.
```js
FTVEN.iframeComParent.setFullscreen(iframeElement);
```

Leave full screen
```js 
FTVEN.iframeComParent.leaveFullScreen(iframeElement);
```

#### Compatibility

Full screen mode is only available for browsers supporting the [FullScreen API](http://caniuse.com/#feat=fullscreen). Other browsers will have an alert() message for the moment (TODO: an overlay mode).



## Communication between iframe and parent

#### Send a message from the iframe to the parent

You need to set a listener in the parent window:
```js 
FTVEN.iframeComParent.onCustomMessageReceived('someId', callbackFunction);
```

Then, inside the iframe:
```js
FTVEN.iframeComIframe.sendCustomMessage('someId', message);
```

The message can be a `string`, a `number`, a `boolean`, an `array` or an `object`, as long as it can be converted into a string with JSON.stringify.


#### Send a message from the parent to the iframe

Same as above, just switch `FTVENiframeComParent` and `FTVEN.iframeComIframe`.




