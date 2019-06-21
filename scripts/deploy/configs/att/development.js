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
        cmd: 'npm run do build-att-development',
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
          host: '192.168.100.29',
          username: 'wdna',
          password: 'wdna',
          path: '/opt/lampp/htdocs/entropy',
        },
      },
    },
    {
      type: 'ssh-set-options',
      options: {
        host: '192.168.100.29',
        user: 'wdna',
        pass: 'wdna',
      },
    },
    {
      type: 'ssh-command',
      options: {
        cmd: 'rm -rf /opt/lampp/htdocs/entropy/dist',
      },
    },
    {
      type: 'ssh-command',
      options: {
        cmd: 'rm -rf /opt/lampp/htdocs/entropy/assets',
      },
    },
    {
      type: 'ssh-command',
      options: {
        cmd: 'rm -rf /opt/lampp/htdocs/entropy/js',
      },
    },
    {
      type: 'ssh-command',
      options: {
        cmd: 'rm -rf /opt/lampp/htdocs/entropy/index.html',
      },
    },
    {
      type: 'ssh-command',
      options: {
        cmd: 'cd /opt/lampp/htdocs/entropy && tar -xvf dist.tar.gz',
      },
    },
    {
      type: 'ssh-command',
      options: {
        cmd: 'mv /opt/lampp/htdocs/entropy/dist/* /opt/lampp/htdocs/entropy',
      },
    },
  ],
};
