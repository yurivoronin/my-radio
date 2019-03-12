const liteDevServer = require('lite-dev-server');

liteDevServer({
    folder: 'src',
    watchFolders: ['src'],
    listen: 3000,
    liveReload: true,
    reloadDelay: 200,
    autoInjectClientJS: true,
    historyApiFallback: false,
    reloadDelayOnClient: 1000,
    giveDefaultPage: true,
    defaultPageFirst: 'index.html',
    defaultPageSecond: 'index.htm',
    serverName: 'liteDevServer',
    pathRewrite: {
      pattern: /\/.+\/(\.*)/g,
      replacement: '/$1',
    }
});