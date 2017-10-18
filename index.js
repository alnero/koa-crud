let R = require("ramda")
let uid = require("uid-safe")

let Koa = require("koa")
let logger = require("koa-logger")
let KoaRouter = require("koa-router")
let bodyParser = require("koa-bodyparser")

let db = require("./db")

let app = new Koa()

app.use(logger())
app.use(bodyParser())


// -- ALBUMS --

let albumsRouter = new KoaRouter({ prefix: "/albums" })
app.use(albumsRouter.routes())

// -- READ ALBUMS --

// GET /albums
albumsRouter.get("/", async (ctx, next) => {
  ctx.response.body = db.albums
  await next()
})

// GET /albums/:albumId
albumsRouter.get("/:albumId", async (ctx, next) => {
  let {albumId} = ctx.params
  let album = db.albums[albumId]
  
  if (!album) return send404(ctx, next)
  
  ctx.response.body = album
  await next()
})

// GET /albums/by-title/:str
albumsRouter.get("/by-title/:str", async (ctx, next) => {
  let {str} = ctx.params
  let albums = R.filter(album => {
    return includesCaseInsensitive(album.title, str)
  }, db.albums)

  if (R.isEmpty(albums)) return send404(ctx, next)

  ctx.response.body = albums
  await next()  
})

// GET /albums/by-date/:month/:year
albumsRouter.get("/by-date/:month/:year", async (ctx, next) => {
  let {month, year} = ctx.params
  let albums = R.filter(R.whereEq({month, year}), db.albums)
  
  if (R.isEmpty(albums)) return send404(ctx, next)

  ctx.response.body = albums
  await next()
})

// GET /albums/by-artist/:artistId
albumsRouter.get("/by-artist/:artistId", async (ctx, next) => {
  let {artistId} = ctx.params
  let albums = R.filter(R.whereEq({artistId: artistId}), db.albums)
  
  if (R.isEmpty(albums)) return send404(ctx, next)

  ctx.response.body = albums
  await next()
})

// -- CREATE ALBUMS --

// POST /albums
albumsRouter.post("/", async (ctx, next) => {
  let {title, month, year} = ctx.request.body
  
  if (!title || !month || !year) return send400(ctx, next)

  let albumId = uid.sync(3)
  db.albums[albumId] = { title: title, month: month, year: year }
  
  ctx.response.body = db.albums
  await next()
})

// -- UPDATE ALBUMS --

// PUT /albums/:albumId
albumsRouter.put("/:albumId", async (ctx, next) => {
  let {title, month, year} = ctx.request.body
 
  if (!title || !month || !year) return send400(ctx, next)

  let {albumId} = ctx.params
  let album = db.albums[albumId]
  
  if (!album) return send404(ctx, next)

  db.albums[albumId] = R.merge(album, { title: title, month: month, year: year })
  
  ctx.response.body = db.albums
  await next()
})

// -- DELETE ALBUMS --

// DELETE /albums/:albumId
albumsRouter.delete("/:albumId", async (ctx, next) => {
  let {albumId} = ctx.params
  let album = db.albums[albumId]
  
  if (!album) return send404(ctx, next)
  
  db.albums = R.omit(albumId, db.albums)
  
  ctx.response.body = db.albums
  await next()
})


// -- ARTISTS --

let artistsRouter = new KoaRouter({ prefix: "/artists" })
app.use(artistsRouter.routes())

// GET /artists
artistsRouter.get("/", async (ctx, next) => {
  ctx.response.body = db.artists
  await next()
})

// GET /artists/:artistId
artistsRouter.get("/:artistId", async (ctx, next) => {
  let {artistId} = ctx.params
  let artist = db.artists[artistId]
  
  if (!artist) return send404(ctx, next)
  
  ctx.response.body = artist
  await next()
})

// GET /artists/by-name/:str
artistsRouter.get("/by-name/:str", async (ctx, next) => {
  let {str} = ctx.params
  let artists = R.filter(artist => {
    return includesCaseInsensitive(artist.name, str)
  }, db.artists)

  if (R.isEmpty(artists)) return send404(ctx, next)

  ctx.response.body = artists
  await next()  
})


// -- TRACKS --

let tracksRouter = new KoaRouter({ prefix: "/tracks"})
app.use(tracksRouter.routes())

// GET /tracks
tracksRouter.get("/", async (ctx, next) => {
  ctx.response.body = db.tracks
  await next()
})

// GET /tracks/:trackId
tracksRouter.get("/:trackId", async (ctx, next) => {
  let {trackId} = ctx.params
  let track = db.tracks[trackId]
  
  if (!track) return send404(ctx, next)
  
  ctx.response.body = track
  await next()
})

// GET /tracks/by-title/:str
tracksRouter.get("/by-title/:str", async (ctx, next) => {
  let {str} = ctx.params
  let tracks = R.filter(track => {
    return includesCaseInsensitive(track.title, str)
  }, db.tracks)

  if (R.isEmpty(tracks)) return send404(ctx, next)

  ctx.response.body = tracks
  await next()  
})

// GET /tracks/by-length/:time -> time format for url 3:27 
tracksRouter.get("/by-length/:time", async (ctx, next) => {
  let {time} = ctx.params

  let tracks = R.filter(track => {
    return compareDurations(track.length, time)
  }, db.tracks)

  if (R.isEmpty(tracks)) return send404(ctx, next)

  ctx.response.body = tracks
  await next()  
})

// GET /tracks/by-album/:albumId
tracksRouter.get("/by-album/:albumId", async (ctx, next) => {
  let {albumId} = ctx.params
  let tracks = R.filter(track => {
    return track.albumId == albumId
  }, db.tracks)

  if (R.isEmpty(tracks)) return send404(ctx, next)

  ctx.response.body = tracks
  await next()  
})


// ERRORS
async function send404(ctx, next) {
  ctx.response.status = 404
  ctx.response.body = "Not found"
  await next()
}

async function send400(ctx, next) {
  ctx.response.status = 400
  ctx.response.body = "Bad request"
  await next()
}


// COMMON FUNCTIONS
let compareDurations = (timeStr1, timeStr2) => {
  let [min1, sec1] = timeStr1.split(":")
  let [min2, sec2] = timeStr2.split(":")

  return (+ sec1 + min1 * 60) >= (+ sec2 + min2 * 60)
}

let includesCaseInsensitive = (str, subStr) => {
  return str.toLowerCase().includes(subStr.toLowerCase())
}


app.listen(3000, () => {
  console.log("Server is listening on port 3000")
})