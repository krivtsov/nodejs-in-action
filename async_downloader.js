const async = require('async');
const { exec } = require('child_process');

function downloadNodeVersion(version, destination, callback) {
  const url = `http://nodejs.org/dist/v${version}/node-v${version}.tar.gz`;
  const filepath = `${destination}/${version}.tgz`;
  exec(`curl ${url} > ${filepath}`, callback);
}

async.series([
  (callback) => {
    async.parallel([
      (callback2) => {
        console.log('Dowloading Node v4.4.7...');
        downloadNodeVersion('4.4.7', `${__dirname}/tmp`, callback2);
      },
      (callback3) => {
        console.log('Dowloading Node v6.3.0...');
        downloadNodeVersion('6.3.0', `${__dirname}/tmp`, callback3);
      },
    ], callback);
  },
  (callback) => {
    console.log('Creating archive of downloaded files....');
    exec(`tar cvf ${__dirname}/tmp/node_distros.tar ${__dirname}/tmp/4.4.7.tgz ${__dirname}/tmp/6.3.0.tgz`,
      (err) => {
        if (err) throw err;
        console.log('All done');
        callback();
      });
  },
]);
