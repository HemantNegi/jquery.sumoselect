const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');

pkg.name = '@hemantnegi/jquery.sumoselect';

// Update package.json with the udpated name
fs.writeFileSync(
  path.join(__dirname, './package.json'),
  JSON.stringify(pkg, null, 2),
);