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
require("./api/albums")(albumsRouter, db)

// -- ARTISTS --
let artistsRouter = new KoaRouter({ prefix: "/artists" })
app.use(artistsRouter.routes())
require("./api/artists")(artistsRouter, db)

// -- TRACKS --
let tracksRouter = new KoaRouter({ prefix: "/tracks"})
app.use(tracksRouter.routes())
require("./api/tracks")(tracksRouter, db)


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


app.listen(3000, () => {
  console.log("Server is listening on port 3000")
})