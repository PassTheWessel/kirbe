const { join }         = require( 'path' );
const { createServer } = require( 'http' );

const KirbeRequest  = require( join( __dirname, 'KirbeRequest.js' ) );
const KirbeResponse = require( join( __dirname, 'KirbeResponse.js' ) );

const methods = [ 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH' ];
const isUrl   = ( c ) => (typeof c === 'string' && !methods.includes( c ) ) || c instanceof RegExp;

module.exports = class KirbeServer {
  constructor() {
    this.internalServer  = createServer( ( req, res ) => this.handler.apply( this, [ req, res ] ) );
    this.externalHandler = ( req, res ) => this.handler( req, res );

    this.routes     = [];
    this.extensions = [];

    methods.forEach( ( v ) => this[ v.toLowerCase() ] = ( a, b ) => this.route( v, a, b ) );
  }

  use( extension ) { this.extensions.push( extension ); }

  route( a, b, c ) {
    this.routes.push({
      'target': {
        'path'  : isUrl( a ) ? a : ( isUrl( b ) ? b : null ),
        'method': methods.includes( a ) ? a : null
      },
      'handler': c || b || a
    });
  }

  handler( req, res ) {
    let body = Buffer.alloc( 0 );

    req.on( 'data', ( c ) => body = Buffer.concat([ body, c ]) );
    req.on( 'end', () => {
      const request  = new KirbeRequest( req, body );
      const response = new KirbeResponse( res );

      const start = () => {
        for( let i = 0; i < this.routes.length; i++ ) {
          const current = this.routes[ i ];
          
          if ( current.target.method && request.method !== current.target.method ) continue;
          if ( current.target.path ) {
            if ( current.target.path instanceof RegExp && !request.parsedUrl.pathname.match( current.target.path ) ) continue;
            else if ( current.target.path !== request.parsedUrl.pathname ) continue;
          }

          current.handler( request, response );
					break;
        }
      };

      let currentExt = 0;
      const nextExt = () => {
        if ( this.extensions.length >= currentExt + 1 ) {
          currentExt++;
					this.extensions[ currentExt -1 ]( request, response, nextExt );
        } else start();
      };

      nextExt();
    });
  }

  listen( a, b, c ) {
    this.internalServer.listen( typeof a === 'number' ? a : 80, typeof b === 'string' ? b : null, typeof b === 'function' ? b : null );
  }
};