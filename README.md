<div align="center" >
  <br />
  <p>
    <img src="media/kirb.gif" /><h1 style="font-size:107px;">Kirbe</h1>
  </p>
  <br />
</div>

> A lightweight and fast Node.js HTTP server library

> [GitHub](https://www.github.com/PassTheWessel/Kirbe) **|** [NPM](https://www.npmjs.com/package/kirbe)

## Installing
```sh
$ yarn add kirbe # Install w/ Yarn (the superior package manager)
$ npm i kirbe # Install w/ NPM
```

## Usage
#### Start a HTTP(s) server on port 8080 and add some routes
```js
const kirbe = require( 'kirbe' ); // Define kirbe
const app = new kirbe(); // Make your kirbe client

app.route( '/bear', 'GET' ( req, res ) => res.status( 200 ).body({ 'bear': 'cop' }) );
app.route( ( req, res ) => res.status( 404 ).body( 'Error: Content not found!' ).end() );
app.get( '/kirb', ( req, res ) => {
  res.writeHead( 201, { 'test': 'hi' });
  res.end({ 'key': 'hi' });
});

// HTTP
app.listen( 8080, () => console.log( 'Listening on port 8080!' ) );
// HTTPS
const https = require( 'https' ); // This should be at the top of your code
https.createServer( app.externalHandler ).listen( 8080 );
```

## Default extensions ( [/extensions](extensions) )
#### Static
> Host static files on your website

##### Usage
```js
const path  = require( 'path' ); // Define path
const kirbe = require( 'kirbe' ); // Define kirbe
const app = new kirbe(); // Make your kirbe client

app.use( kirbe.static( path.join( __dirname, 'static' ) ) );
```

### Why use kirbe?
Kirbe is a lightweight and fast HTTP server library, especially comparing to express which is around 1mb. If you want any featuers that aren't inside of Kirbe yet, you can open an issue or pull request.

You can join [https://discord.gg/SV7DAE9](https://discord.gg/SV7DAE9) if you need any support using kirbe!