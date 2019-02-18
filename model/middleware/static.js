const { join, extname }                                  = require('path');
const { createReadStream, readFileSync, readFile, stat } = require('fs');

const mimes = JSON.parse(readFileSync(join(__dirname, 'mimes.json')));

module.exports = (baseDir, indexFile) => {
  if (!baseDir) throw new Error('The argument "baseDir" is required for the extension "kirbe:static"');
  
  indexFile = typeof indexFile === 'string' ? indexFile : 'index.html';
  return(req, res, next) => {
    if (req.method !== 'GET') { next(); return; }

    let requestedPath = req.parsedUrl.pathname.replace(/\/.\.\//g, '');
    let requestedExt  = extname(requestedPath);
    
    const filePath = join(baseDir, requestedPath ;

    stat(filePath, (err, stats) => {
      if (err) { next(); return; }

      if (stats.isFile()) {
        stats.mtime.setMilliseconds(0);
	if (stats.mtime <= new Date(req.headers['if-modified-since'])) res.status(304).end();
	else createReadStream(filePath).pipe(res.status(200).coreRes);
      } else {
        if (req.parsedUrl.pathname.charAt(req.parsedUrl.pathname.length -1 ) !== '/') {
	   res.status(302).header({'Location': `${req.parsedUrl.pathname}/`}).end();
	   return;
        }
        
        requestedPath = join(filePath, indexFile);
	requestedExt  = extname(requestedPath);

	readFile(requestedPath, (err, data) => {
		if (err) next();
		else {
		 res.body(data).status(200).header({
		    'Content-Type': (mimes.hasOwnProperty(requestedExt) ? mimes[requestedExt] : 'application/octet-stream'),
		    'Last-Modified': stats.mtime.toString()
		 }).end();
		}
	});
      }
    });
  };
};
