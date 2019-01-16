module.exports = class KirbeResponse {
  constructor( res ) {
    this.coreRes = res;
		this.headers = {};

		this.statusCode    = 200;
		this.statusMessage = null;

		this.data = Buffer.alloc( 0 );
  }

  body( body ) {
    if ( typeof body === 'object' && !Buffer.isBuffer( body ) ) {
			if ( !this.headers[ 'content-type' ] ) this.headers[ 'content-type' ] = 'application/json';

			this.data = JSON.stringify( body );
		} else this.data = body;

		return this;
  }

  header( a, b ) {
    if ( typeof a === 'object' ) Object.keys( a ).forEach( ( v ) => this.headers[ v.toLowerCase() ] = a[ v ] );
		else this.headers[ a.toLowerCase() ] = b;

		return this;
  }

  status( code, message ) {
    this.statusCode = code;
		this.statusMessage = message;

		return this;
  }

  writeHead( status, headers ) {
    if ( status ) this.status( status );
		if ( headers ) this.header( headers );
  }

  end( data ) {
    if ( data ) this.body( data );

		if (this.statusMessage) this.coreRes.writeHead( this.statusCode, this.statusMessage, this.headers );
		else this.coreRes.writeHead( this.statusCode, this.headers );
		this.coreRes.end( this.data );

		return this;
  }
};