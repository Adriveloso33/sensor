/*eslint-disable */
const CMD_TYPES = {
  LOCAL: 'local',
  SCP: 'scp',
  SSH_SET_OPT: 'ssh-set-options',
  SSH_EXEC: 'ssh-command',
};

async function commandFactory(type, options) {
  switch (type) {
    case CMD_TYPES.LOCAL:
      return local(options);
    case CMD_TYPES.SCP:
      return scp(options);
    case CMD_TYPES.SSH_SET_OPT:
      return sshInit(options);
    case CMD_TYPES.SSH_EXEC:
      return sshCmd(options);
    default:
      throw new Error('Invalid command type: ', +type);
  }
}

function local(options) {
  return new Promise((resolve, reject) => {
    require('child_process').execSync(options.cmd, { ...options.params, stdio: 'inherit' });

    resolve();
  });
}

function scp(config) {
  return new Promise((resolve, reject) => {
    require('scp2').scp(config.file, config.options, function(err) {
      if (err) reject(err);

      resolve();
    });
  });
}

var SSH = require('simple-ssh');
var sshConn = null;
var sshOptions = null;

function sshInit(options) {
  sshOptions = options;

  return Promise.resolve();
}

function sshCmd(options) {
  if (!sshOptions) throw new Error('Not SSH options set');

  sshConn = new SSH(sshOptions);
  return new Promise((resolve, reject) => {
    sshConn
      .exec(options.cmd, {
        out: function(stdout) {},
        err: function(stderr) {
          throw new Error(stderr);
        },
        exit: function() {
          resolve();
        },
      })
      .start();
  });
}

module.exports = {
  commandFactory,
};
