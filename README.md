# legacyify

This is just a proof-of-concept project written in less than an hour.

The idea would be for this server to sit somewhere between caching servers. This server would detect if the user agent is a really old version of IE, if it is it'd fire up headless chrome and generate a nice legacyifed version, otherwise it'd pass the request through to the main servers.

## How it works

It just takes a screenshot and overlays `<area>` tags onto them based on `<a>` positions and href's (that's right, **maps** are back!)

## The future

Obviously images aren't ideal because of their size and lack of text copy/paste. Also forms won't work. If I were to continue this project in the future I'd at least mark forms and buttons as disabled.

## legacyify in action

On GitHub.com using emulated IE5

### Before

![github before](http://tinyimg.io/i/KEEQXv6.png)

### After

![github after](http://tinyimg.io/i/IJpvNO6.png)

**Please note** only the hyperlinks work, the form does nothing, however, all of the content is readable which I'd call an improvement.
