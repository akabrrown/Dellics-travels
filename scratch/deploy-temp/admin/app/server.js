// cPanel Entry Point
// We MUST change the working directory so Next.js finds the .next folder inside apps/admin
process.chdir(__dirname + '/apps/admin');
require('./server.js');
