let R = require("ramda")
let uid = require("uid-safe")

let helperFuntions = require("../helpers")
let errorFunctions = require("../errors")

module.exports = (albumsRouter, db) => {

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
  
    if (!album) return errorFunctions.send404(ctx, next)
  
    ctx.response.body = album
    await next()
  })

  // GET /albums/by-title/:str
  albumsRouter.get("/by-title/:str", async (ctx, next) => {
    let {str} = ctx.params
    let albums = R.filter(album => {
      return helperFuntions.includesCaseInsensitive(album.title, str)
    }, db.albums)

    if (R.isEmpty(albums)) return errorFunctions.send404(ctx, next)

    ctx.response.body = albums
    await next()  
  })

  // GET /albums/by-date/:month/:year
  albumsRouter.get("/by-date/:month/:year", async (ctx, next) => {
    let {month, year} = ctx.params
    let albums = R.filter(R.whereEq({month, year}), db.albums)
  
    if (R.isEmpty(albums)) return errorFunctions.send404(ctx, next)

    ctx.response.body = albums
    await next()
  })

  // GET /albums/by-artist/:artistId
  albumsRouter.get("/by-artist/:artistId", async (ctx, next) => {
    let {artistId} = ctx.params
    let albums = R.filter(R.whereEq({artistId: artistId}), db.albums)
  
    if (R.isEmpty(albums)) return errorFunctions.send404(ctx, next)

    ctx.response.body = albums
    await next()
  })

  // -- CREATE ALBUMS --

  // POST /albums
  albumsRouter.post("/", async (ctx, next) => {
    let {title, month, year, artistId} = ctx.request.body
  
    if (!title || !month || !year || !artistId) return errorFunctions.send400(ctx, next)

    // no artist in db -> no creation of album
    if (!R.has(artistId, db.artists)) return errorFunctions.send400(ctx, next)

    let albumId = uid.sync(3)
  
    db.albums[albumId] = { title, month, year, artistId, albumId }
  
    ctx.response.body = db.albums
    await next()
  })

  // -- UPDATE ALBUMS --

  // PUT /albums/:albumId
  albumsRouter.put("/:albumId", async (ctx, next) => {
    let {title, month, year, artistId} = ctx.request.body
 
    if (!title || !month || !year || !artistId) return errorFunctions.send400(ctx, next)

    let {albumId} = ctx.params
    let album = db.albums[albumId]
  
    if (!album) return errorFunctions.send404(ctx, next)

    // no artist in db -> no update of album
    if (!R.has(artistId, db.artists)) return errorFunctions.send400(ctx, next)

    db.albums[albumId] = R.merge(album, { title, month, year, artistId })
  
    ctx.response.body = db.albums
    await next()
  })

  // -- DELETE ALBUMS --

  // DELETE /albums/:albumId
  albumsRouter.delete("/:albumId", async (ctx, next) => {
    let {albumId} = ctx.params
    let album = db.albums[albumId]
  
    if (!album) return errorFunctions.send404(ctx, next)
  
    db.albums = R.dissoc(albumId, db.albums)

    db.tracks = R.filter(track => R.has(track.albumId, db.albums), db.tracks)

    ctx.response.body = db.albums
    await next()
  })
}