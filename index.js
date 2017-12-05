let Koa = require("koa")
let logger = require("koa-pino-logger")
let KoaRouter = require("koa-router")
let bodyParser = require("koa-bodyparser")

let db = require("./db")

let apiAlbums = require("./api/albums")
let apiArtists = require("./api/artists")
let apiTracks = require("./api/tracks")

let app = new Koa()

let devEnv = false

app.use(logger({
  prettyPrint: {
    formatter: function(logData, options) {
      let logString = ""
      
      logString += `${options.prefix} (${logData.pid} on ${logData.hostname}) ${logData.msg}\n` 

      if(logData.err) {
        // log error
        logString += `${logData.err.msg}\n`
        logString += devEnv ? `${JSON.stringify(logData.err, null, 2)}\n` : ""  
      }

      if(logData.req && logData.res) {
        // log request
        logString += `<-- ${logData.req.method} ${logData.req.url} `
        logString += `${logData.req.remoteAddress} ${logData.req.headers.host} ${logData.req.headers["user-agent"]}\n`
        logString += devEnv ? `${JSON.stringify(logData.req, null, 2)}\n` : ""

        // log response
        logString += `--> ${logData.res.statusCode} ${logData.res.header.split("\r\n")[0]}\n`
        logData.res.header = logData.res.header.replace(/\r/g, "")
        logString += devEnv ? `${JSON.stringify(logData.res, null, 2)}\n` : ""
      } 

      return logString 
    }
  }
}))

app.use(bodyParser())


// -- ALBUMS --
let albumsRouter = new KoaRouter({ prefix: "/albums" })
app.use(albumsRouter.routes())
apiAlbums(albumsRouter, db)

// -- ARTISTS --
let artistsRouter = new KoaRouter({ prefix: "/artists" })
app.use(artistsRouter.routes())
apiArtists(artistsRouter, db)

// -- TRACKS --
let tracksRouter = new KoaRouter({ prefix: "/tracks" })
app.use(tracksRouter.routes())
apiTracks(tracksRouter, db)


app.listen(3000, () => {
  console.log("Server is listening on port 3000")
})