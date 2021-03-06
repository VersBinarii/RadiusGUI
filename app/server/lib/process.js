const exec = require('child_process').execFile;

/*
  We will focus on Linux only at least for now
*/
module.exports = {
  isRunning: process_name => {
    const args = ['aux'];
    return new Promise((resolve, reject) => {
      exec('ps', args, (err, stdout) => {
        if (err) reject(err);
        stdout.split('\n').forEach(l => {
          const ll = l.toLowerCase();
          if (ll.indexOf(process_name) > -1) {
            resolve(true);
          }
        });
        resolve(false);
      });
    });
  },
};
