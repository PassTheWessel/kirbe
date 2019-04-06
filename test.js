const w     = require('wumpfetch');
const Kirbe = require('./index');

const app = new Kirbe.Server();

app.use((req, res, next) => req.url === '/middleware' ? res.status(200).end() : next());

app.post('/parse', (req, res) => res.body({'sent': req.json()}).end());
app.route('GET', '/statusMsg', (req, res) => res.status(200, 'kirbe won').end());
app.route('POST', (req, res) => res.body('Gotta catch em all!').end());
app.route('/compatibility', (req, res) => {
  res.writeHead(201, {'test': 'hi'});
  res.end({'key': 'hi'});
});
app.route((req, res) => res.status(404).body('Error: Content not found!').end());

;(async() => {
  const res = [];
  res.push(await w('http://127.0.0.1:4040/bear').send());
  res.push(await w('http://127.0.0.1:4040/statusMsg').send());
  res.push(await w('http://127.0.0.1:4040/compatibility').send());
  res.push(await w('http://127.0.0.1:4040/testExtension').send());
  res.push(await w('http://127.0.0.1:4040/parse', 'POST').body({'hello': 123}).send());

  res.forEach((v, i) => console.log( `${i}: ${v.statusCode}`));
})();

app.listen(4040);