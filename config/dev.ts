import path from "path";

module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  alias: {
    "@": path.resolve(__dirname, '..', 'src'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/components': path.resolve(__dirname, '..', 'src/components'),
  },
  mini: {},
  h5: {
    devServer: {
      allowedHosts: 'all',
      proxy: {
        '/': 'https://xp.bangnikanzhe.com',
        // '/': 'http://w000m.com:8889',
        // '/': 'http://47.109.94.69:8188'
      },
    },
  }
}
