let R = require("ramda")
let uid = require("uid-safe")

let helperFuntions = require("../helpers")
let errorFunctions = require("../errors")

module.exports = (artistsRouter, db) => {
  
  // -- READ ARTISTS --

  // GET /artists
  artistsRouter.get("/", async (ctx, next) => {
    ctx.response.body = db.artists
    await next()
  })

  // GET /artists/:artistId
  artistsRouter.get("/:artistId", async (ctx, next) => {
    let {artistId} = ctx.params
    let artist = db.artists[artistId]
    
    if (!artist) return errorFunctions.send404(ctx, next)
    
    ctx.response.body = artist
    await next()
  })

  // GET /artists/by-name/:str
  artistsRouter.get("/by-name/:str", async (ctx, next) => {
    let {str} = ctx.params
    let artists = R.filter(artist => {
      return helperFuntions.includesCaseInsensitive(artist.name, str)
    }, db.artists)
  
    if (R.isEmpty(artists)) return errorFunctions.send404(ctx, next)
  
    ctx.response.body = artists
    await next()  
  })

  // -- CREATE ARTISTS --

  // POST /artists
  artistsRouter.post("/", async (ctx, next) => {
    let {name} = ctx.request.body
    
    if (!name) return errorFunctions.send400(ctx, next)
  
    let artistId = uid.sync(3)
    db.artists[artistId] = { name: name, artistId: artistId }
    
    ctx.response.body = db.artists
    await next()
  })

  // -- UPDATE ARTISTS --

  // PUT /artists/:artistId
  artistsRouter.put("/:artistId", async (ctx, next) => {
    let {name} = ctx.request.body
   
    if (!name) return errorFunctions.send400(ctx, next)
  
    let {artistId} = ctx.params
    let artist = db.artists[artistId]
    
    if (!artist) return errorFunctions.send404(ctx, next)
  
    db.artists[artistId] = R.merge(artist, { name: name })
    
    ctx.response.body = db.artists
    await next()
  })

  // -- DELETE ARTISTS --

  // DELETE /artists/:artistId
  artistsRouter.delete("/:artistId", async (ctx, next) => {
    let {artistId} = ctx.params
    let artist = db.artists[artistId]
    
    if (!artist) return errorFunctions.send404(ctx, next)
    
    db.artists = R.dissoc(artistId, db.artists)
  
    db.albums = R.filter(album => R.has(album.artistId, db.artists), db.albums)
    
    db.tracks = R.filter(track => R.has(track.albumId, db.albums), db.tracks)
  
    ctx.response.body = db.artists
    await next()
  })
}