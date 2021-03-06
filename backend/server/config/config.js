const env = process.env.NODE_ENV || 'development'

if (env === 'development') {
    const config = require('./config.json')

    Object.keys(config).forEach(cur => process.env[cur] = config[cur])
}