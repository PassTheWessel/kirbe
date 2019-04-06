const { parse } = require('url');

module.exports = class KirbeRequest {
  constructor(req, body) {
	this.url       = req.url;
        this.req       = req;
	this.body      = body;
	this.from      = req.connection.remoteAddress;
	this.method    = req.method;
	this.headers   = req.headers;
	this.parsedUrl = parse(this.url, true);
  }

  json() { return JSON.parse(this.body); }
  query (name) { return this.parsedUrl.query[name]; }
};
