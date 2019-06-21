/*eslint-disable */
const workingDirectory = '/tmp';

module.exports = {
  commands: [
    {
      type: 'local',
      options: {
        cmd: 'rm -rf __temp__',
        params: { cwd: workingDirectory },
      },
    },
    {
      type: 'local',
      options: {
        cmd: 'mkdir __temp__',
        params: { cwd: workingDirectory },
      },
    },
    {
      type: 'local',
      options: {
        cmd: 'git clone http://gitlab.wdna.com/entropy-web/telecom/entropy-v7/frontend/entropy-front.git -b develop',
        params: { cwd: workingDirectory + '/__temp__' },
      },
    },
    {
      type: 'local',
      options: {
        cmd: 'npm i',
        params: { cwd: workingDirectory + '/__temp__/entropy-front' },
      },
    },
    {
      type: 'local',
      options: {
        cmd: 'npm run do build-altan-production',
        params: { cwd: workingDirectory + '/__temp__/entropy-front' },
      },
    },
    {
      type: 'local',
      options: {
        cmd: 'tar -zcvf dist.tar.gz dist',
        params: { cwd: workingDirectory + '/__temp__/entropy-front' },
      },
    },
    {
      type: 'scp',
      options: {
        file: workingDirectory + '/__temp__/entropy-front/dist.tar.gz',
        options: {
          host: '35.153.190.219',
          username: 'wdna',
          privateKey: require('fs').readFileSync('/home/wdna/.ssh/wdna_rsa.pem'),
          path: '/var/www/html/entropy',
        },
      },
    },
    {
      type: 'ssh-set-options',
      options: {
        host: '35.153.190.219',
        user: 'wdna',
        key: require('fs').readFileSync('/home/wdna/.ssh/wdna_rsa.pem'),
      },
    },
    {
      type: 'ssh-command',
      options: {
        cmd: 'rm -rf /var/www/html/entropy/dist',
      },
    },
    {
      type: 'ssh-command',
      options: {
        cmd: 'rm -rf /var/www/html/entropy/assets',
      },
    },
    {
      type: 'ssh-command',
      options: {
        cmd: 'rm -rf /var/www/html/entropy/js',
      },
    },
    {
      type: 'ssh-command',
      options: {
        cmd: 'rm -rf /var/www/html/entropy/index.html',
      },
    },
    {
      type: 'ssh-command',
      options: {
        cmd: 'cd /var/www/html/entropy && tar -xvf dist.tar.gz',
      },
    },
    {
      type: 'ssh-command',
      options: {
        cmd: 'mv /var/www/html/entropy/dist/* /var/www/html/entropy',
      },
    },
  ],
};
