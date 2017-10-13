let R = require("ramda")
let uid = require("uid-safe")

let Koa = require("koa")
let logger = require("koa-logger")
let KoaRouter = require("koa-router")
let bodyParser = require("koa-bodyparser")

let db = require("./db")

let app = new Koa()
let router = new KoaRouter()

app.use(logger())
app.use(bodyParser())


// READ

// -- ALBUMS --

// GET /albums
router.get("/albums", async (ctx, next) => {
  ctx.response.body = db.albums
  await next()
})

// GET /albums/:id
router.get("/albums/:id", async (ctx, next) => {
  let {id} = ctx.params
  let album = db.albums[id]
  
  if (!album) return send404(ctx, next)
  
  ctx.response.body = album
  await next()
})

// GET /albums/by-title/:str
router.get("/albums/by-title/:str", async (ctx, next) => {
  let {str} = ctx.params
  let albums = R.filter(album => {
    return checkSubstringInLowerCase(album.title, str)
  }, db.albums)

  if (R.isEmpty(albums)) return send404(ctx, next)

  ctx.response.body = albums
  await next()  
})

// GET /albums/by-date/:month/:year
router.get("/albums/by-date/:month/:year", async (ctx, next) => {
  let {month, year} = ctx.params
  let albums = R.filter(R.whereEq({month, year}), db.albums)
  
  if (R.isEmpty(albums)) return send404(ctx, next)

  ctx.response.body = albums
  await next()
})

// GET /albums/by-artistId/:id
router.get("/albums/by-artistId/:id", async (ctx, next) => {
  let {id} = ctx.params
  let albums = R.filter(R.whereEq({artistId: id}), db.albums)
  
  if (R.isEmpty(albums)) return send404(ctx, next)

  ctx.response.body = albums
  await next()
})


// -- ARTISTS --

// GET /artists
router.get("/artists", async (ctx, next) => {
  ctx.response.body = db.artists
  await next()
})

// GET /artists/:id
router.get("/artists/:id", async (ctx, next) => {
  let {id} = ctx.params
  let artist = db.artists[id]
  
  if (!artist) return send404(ctx, next)
  
  ctx.response.body = artist
  await next()
})

// GET /artists/by-name/:str
router.get("/artists/by-name/:str", async (ctx, next) => {
  let {str} = ctx.params
  let artists = R.filter(artist => {
    return checkSubstringInLowerCase(artist.name, str)
  }, db.artists)

  if (R.isEmpty(artists)) return send404(ctx, next)

  ctx.response.body = artists
  await next()  
})


// -- TRACKS --

// GET /tracks
router.get("/tracks", async (ctx, next) => {
  ctx.response.body = db.tracks
  await next()
})

// GET /tracks/:id
router.get("/tracks/:id", async (ctx, next) => {
  let {id} = ctx.params
  let track = db.tracks[id]
  
  if (!track) return send404(ctx, next)
  
  ctx.response.body = track
  await next()
})

// GET /tracks/by-title/:str
router.get("/tracks/by-title/:str", async (ctx, next) => {
  let {str} = ctx.params
  let tracks = R.filter(track => {
    return checkSubstringInLowerCase(track.title, str)
  }, db.tracks)

  if (R.isEmpty(tracks)) return send404(ctx, next)

  ctx.response.body = tracks
  await next()  
})

// GET /tracks/by-length/:time -> time format for url 3:27 
router.get("/tracks/by-length/:time", async (ctx, next) => {
  let {time} = ctx.params

  let tracks = R.filter(track => {
    return compareDurations(track.length, time)
  }, db.tracks)

  if (R.isEmpty(tracks)) return send404(ctx, next)

  ctx.response.body = tracks
  await next()  
})

// GET /tracks/by-albumId/:id
router.get("/tracks/by-albumId/:id", async (ctx, next) => {
  let {id} = ctx.params
  let tracks = R.filter(track => {
    return track.albumId == id
  }, db.tracks)

  if (R.isEmpty(albums)) return send404(ctx, next)

  ctx.response.body = tracks
  await next()  
})


// CREATE
router.post("/", async (ctx, next) => {
  let {title, month, year} = ctx.request.body
  
  if (!title || !month || !year) return send400(ctx, next)

  let id = uid.sync(3)
  db.albums[id] = { title: title, month: month, year: year }
  
  ctx.response.body = db.albums
  await next()
})


// UPDATE
router.put("/:id", async (ctx, next) => {
  let {title, month, year} = ctx.request.body
 
  if (!title || !month || !year) return send400(ctx, next)

  let {id} = ctx.params
  let album = db.albums[id]
  
  if (!album) return send404(ctx, next)

  db.albums[id] = R.merge(album, { title: title, month: month, year: year })
  
  ctx.response.body = db.albums
  await next()
})


// DELETE
router.delete("/:id", async (ctx, next) => {
  let {id} = ctx.params
  let album = db.albums[id]
  
  if (!album) return send404(ctx, next)
  
  db.albums = R.omit(id, db.albums)
  
  ctx.response.body = db.albums
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


let compareDurations = (timeStr1, timeStr2) => {
  let [min1, sec1] = timeStr1.split(":")
  let [min2, sec2] = timeStr2.split(":")

  return (+ sec1 + min1 * 60) >= (+ sec2 + min2 * 60)
}

let checkSubstringInLowerCase = (str, subStr) => {
  return str.toLowerCase().includes(subStr.toLowerCase())
}

app.use(router.routes())

app.listen(3000, () => {
  console.log("Server is listening on port 3000")
})