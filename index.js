let Koa = require("koa")
let logger = require("koa-logger")
let KoaRouter = require("koa-router")
let bodyParser = require("koa-bodyparser")

let db = require("./db")

let apiAlbums = require("./api/albums")
let apiArtists = require("./api/artists")
let apiTracks = require("./api/tracks")

let app = new Koa()

app.use(logger())
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