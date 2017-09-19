let R = require("ramda")
let uid = require("uid-safe")

let Koa = require("koa")
let logger = require("koa-logger")
let KoaRouter = require("koa-router")
let bodyParser = require("koa-bodyparser")

let db = require("./db")

let app = new Koa()
let router = new KoaRouter({ prefix: "/albums" })

app.use(logger())
app.use(bodyParser())


// READ
router.get("/", async (ctx, next) => {
  ctx.response.body = db.albums
  await next()
})

router.get("/:id", async (ctx, next) => {
  let {id} = ctx.params
  let album = db.albums[id]
  
  if (!album) return send404(ctx, next)
  
  ctx.response.body = album
  await next()
})

router.get("/:month/:year", async (ctx, next) => {
  let {month, year} = ctx.params
  let albums = R.filter(R.whereEq({month, year}), db.albums)
  
  if (!albums) return send404(ctx, next)

  ctx.response.body = albums
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


app.use(router.routes())

app.listen(3000, () => {
  console.log("Server is listening on port 3000")
})