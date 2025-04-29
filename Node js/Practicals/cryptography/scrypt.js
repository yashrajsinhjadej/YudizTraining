const {
    scrypt,
  } = require('node:crypto');
  
  scrypt('Yashraj@123','salt',32,{ N: 1024 }, (err, derivedKey) => {
    if (err) throw err;
    console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
  });

  scrypt('Yashraj@123','salt',32, (err, derivedKey) => {
    if (err) throw err;
    console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
  });

