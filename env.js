const isProd = process.env.NODE_ENV === 'production'

// 例如生产环境可以换成你的阿里云地址
const host = isProd? '0.0.0.0' : 'localhost'
const port = isProd? '8888' : '8081'

module.exports = {
    host,
    port
}