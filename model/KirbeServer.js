const { createServer } = require('http');

const KirbeRequest  = require('./KirbeRequest.js');
const KirbeResponse = require('./KirbeResponse.js');

const Collection = require('../fake_node_modules/Collection');

const methods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'];
const isUrl   = (c) => (typeof c === 'string' && !methods.includes(c)) || c instanceof RegExp;

module.exports = class KirbeServer {
  constructor() {
    this.internalServer  = createServer(( req, res) => this.handler.apply(this, [req, res]));
    this.externalHandler = (req, res) => this.handler(req, res);

    this.stack      = new Collection();
    this.routes     = [];
    this.extensions = [];

    methods.forEach((v) => this[v.toLowerCase()] = (a, b) => this.route(v, a, b ));
  }

  use(middleware) {
    const o = typeof middleware === 'object';
    const m = {
      name       : this.stack.size,
      args       : o && typeof Array.isArray(o.args) ? o.args : [],
      function   : o && typeof o.function === 'function' ? o.function : middleware,
      constructor: !!(o && o.constructor)
    };

    this.stack.set(m.name, m);
  }

  route(a, b, c) {
    this.routes.push({
      'target': {
        'path'  : isUrl(a) ? a : (isUrl(b) ? b : null),
        'method': methods.includes(a) ? a : null
      },
      'handler': c || b || a
    });
  }

  handler(req, res) {
    let body = Buffer.alloc(0);

    req.on('data', (c) => body = Buffer.concat([body, c]));
    req.on('end', () => {
      const request  = new KirbeRequest(req, body);
      const response = new KirbeResponse(res);

      const start = () => {
        for(let i = 0; i < this.routes.length; i++) {
          const current = this.routes[i];
          
          if (current.target.method && request.method !== current.target.method) continue;
          if (current.target.path) {
            if (current.target.path instanceof RegExp && !request.parsedUrl.pathname.match(current.target.path)) continue;
            else if (current.target.path !== request.parsedUrl.pathname) continue;
          }

          current.handler( request, response );
	        break;
        }
      };

      let currentMiddleware  = 0;
      const renderMiddleware = () => {
        if (this.stack.size >= currentMiddleware +1) {
          currentMiddleware++;
          const middleware = this.stack.get(currentMiddleware - 1);
          if (middleware.constructor) new middleware.function(request, response, renderMiddleware);
          else middleware.function(request, response, renderMiddleware);
        } else start();
      };
      renderMiddleware(); 
     });
  }

  listen(a, b, c) {
    this.internalServer.listen(typeof a === 'number' ? a : 80, typeof b === 'string' ? b : null, typeof b === 'function' ? b : null);
  }
};
