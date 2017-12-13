let Pino = require("pino")

module.exports = function LogMiddleware(app) {
  let logger = Pino({
    serializers: {
      req: reqSerializer,
      res: resSerializer,
      err: Pino.stdSerializers.err,
    },
    prettyPrint: {
      formatter: function(logData, options) {
        let logString = `${options.prefix} (${logData.pid} on ${logData.hostname}) ${logData.msg}\n`

        if(logData.err) {
          logString += `${logData.err.message}\n`
          logData.err.stack = logData.err.stack.split("\n")
          logString += ["development", "testing"].includes(process.env.NODE_ENV) ? `${JSON.stringify(logData.err, null, 2)}\n` : ""  
        }
  

        if(logData.req && logData.res) {
          logString += `<-- ${logData.req.method} ${logData.req.url} `
          logString += `${logData.req.remoteAddress} ${logData.req.headers.host} ${logData.req.headers["user-agent"]}\n`
          logString += ["development", "testing"].includes(process.env.NODE_ENV) ? `${JSON.stringify(logData.req, null, 2)}\n` : ""

          logString += `--> ${logData.res.statusCode} ${logData.res.statusMessage}\n`
          logString += ["development", "testing"].includes(process.env.NODE_ENV) ? `${JSON.stringify(logData.res, null, 2)}\n` : ""
        } 

        return logString 
      }
    }
  })

  return async function (ctx, next) {
    ctx.log = logger

    app.on("error", function(err) {
      logger.error({ err: err }, "runtime error")
    })

    await next()

    logger.info({
      req: ctx.req,
      res: ctx.res
    }, "request completed")

  }
}

function reqSerializer(req) {
  return {
    method: req.method,
    url: req.url,
    headers: req.headers,
    remoteAddress: req.connection && req.connection.remoteAddress,
    remotePort: req.connection && req.connection.remotePort
  }
}

function resSerializer(res) {
  return {
    statusCode: res.statusCode,
    statusMessage: res.statusMessage,
    header: res._headers
  }
}