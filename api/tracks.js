let R = require("ramda")
let uid = require("uid-safe")

let helperFuntions = require("../helpers")
let errorFunctions = require("../errors")

module.exports = (tracksRouter, db) => {
  
  // -- READ TRACKS --

  // GET /tracks
  tracksRouter.get("/", async (ctx, next) => {
    ctx.response.body = db.tracks
    await next()
  })
  
  // GET /tracks/:trackId
  tracksRouter.get("/:trackId", async (ctx, next) => {
    let {trackId} = ctx.params
    let track = db.tracks[trackId]
    
    if (!track) return errorFunctions.send404(ctx, next)
    
    ctx.response.body = track
    await next()
  })
  
  // GET /tracks/by-title/:str
  tracksRouter.get("/by-title/:str", async (ctx, next) => {
    let {str} = ctx.params
    let tracks = R.filter(track => {
      return helperFuntions.includesCaseInsensitive(track.title, str)
    }, db.tracks)
  
    if (R.isEmpty(tracks)) return errorFunctions.send404(ctx, next)
  
    ctx.response.body = tracks
    await next()  
  })

  // GET /tracks/by-length/:time -> time format for url 3:27 
  tracksRouter.get("/by-length/:time", async (ctx, next) => {
    let {time} = ctx.params
  
    let tracks = R.filter(track => {
      return helperFuntions.compareDurations(track.length, time)
    }, db.tracks)
  
    if (R.isEmpty(tracks)) return errorFunctions.send404(ctx, next)
  
    ctx.response.body = tracks
    await next()  
  })
  
  // GET /tracks/by-album/:albumId
  tracksRouter.get("/by-album/:albumId", async (ctx, next) => {
    let {albumId} = ctx.params
    let tracks = R.filter(track => {
      return track.albumId == albumId
    }, db.tracks)
  
    if (R.isEmpty(tracks)) return errorFunctions.send404(ctx, next)
  
    ctx.response.body = tracks
    await next()  
  })
  
  // -- CREATE TRACKS --

  // POST /tracks
  tracksRouter.post("/", async (ctx, next) => {
    let {number, title, length, albumId} = ctx.request.body
  
    if (!number || !title || !length || !albumId) return errorFunctions.send400(ctx, next)
  
    // no album in db -> no creation of track
    if (!R.has(albumId, db.albums)) return errorFunctions.send400(ctx, next)
  
    let trackId = uid.sync(3)
  
    db.tracks[trackId] = {number, title, length, albumId, trackId}
  
    ctx.response.body = db.tracks
    await next()
  })
  
  // -- UPDATE TRACKS --
  
  // PUT /tracks/:trackId
  tracksRouter.put("/:trackId", async (ctx, next) => {
    let {number, title, length, albumId} = ctx.request.body
  
    if (!number || !title || !length || !albumId) return errorFunctions.send400(ctx, next)
  
    let {trackId} = ctx.params
    let track = db.tracks[trackId]
  
    if (!track) return errorFunctions.send404(ctx, next)
  
    // no album in db -> no update of track
    if (!R.has(albumId, db.albums)) return errorFunctions.send400(ctx, next)
  
    db.tracks[trackId] = R.merge(track, {number, title, length, albumId})
  
    ctx.response.body = db.tracks
    await next()  
  })

  // -- DELETE TRACKS --
  
  // DELETE /tracks/:trackId
  tracksRouter.delete("/:trackId", async (ctx,next) => {
    let {trackId} = ctx.params
    let track = db.tracks[trackId]
  
    if (!track) return errorFunctions.send404(ctx, next)
  
    db.tracks = R.dissoc(trackId, db.tracks)
  
    ctx.response.body = db.tracks
    await next()
  })
}