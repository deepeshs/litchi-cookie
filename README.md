# litchi-cookie
A simple cookie management utility for NodeJs web applications

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]

## how to use?

```
npm install litchi-cookie
```

```javascript
'use strict';

var PORT = 8082;
var http = require('http');
var Cookie = require('litchi-cookie');

http.createServer(function (req, res) {
  
  req.on('end', function() {
    try	{
      var objCookie = new Cookie(req, res);

      //set cookie with name and value 
      objCookie.set('abc', 'def');
      res.write("\nCookie set abc");

      var strCookieValue = objCookie.get('abc');
      res.write('\nCookie get abc, value: ' + strCookieValue);
    } catch(e) {
      console.log(e);
    }

    res.statusCode = 200;
    res.end("\nHello World");
  });
}).listen(process.env.PORT || PORT);

console.log('Server running at http://localhost:' + (process.env.PORT || PORT));
```

## more options

The set function has an optional third parameter as object to set cookie more options as follows:
maxAge : max age of the cookie in seconds
domain : domain for the cookie
path   : cookie path
expires : expiration date for the cookie
secure : true or false
httpOnly : true or false
firstPartyOnly : true or false

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/litchi-cookie.svg
[npm-url]: https://www.npmjs.com/package/litchi-cookie
[node-version-image]: https://img.shields.io/node/v/litchi-cookie.svg
[node-version-url]: https://nodejs.org/en/download
[downloads-image]: https://img.shields.io/npm/dm/litchi-cookie.svg
[downloads-url]: https://npmjs.org/package/litchi-cookie
