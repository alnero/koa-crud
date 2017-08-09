let uid = require("uid-safe")
let R = require("ramda")

let collection = [
  {title: "Emika", month: "October", year: "2011", id: uid.sync(3)},
  {title: "Skyline", month: "October", year: "2011", id: uid.sync(3)},
  {title: "The quiet hype", month: "March", year: "2009", id: uid.sync(3)},
  {title: "Insides", month: "May", year: "2009", id: uid.sync(3)},
  {title: "Human after all", month: "March", year: "2005", id: uid.sync(3)},
]

let db = {}

db.albums = R.reduce((accum, item) => {
  let id = R.prop("id", item)
  let itemWithoutId = R.omit("id", item)
  
  accum[id] = itemWithoutId
  return accum
}, {}, collection) 

module.exports = db 

// R.reduce((accum, item) => {
//   let id = R.prop("id", item)
//   let itemWithoutId = R.omit("id", item)
  
//   accum.albums[id] = itemWithoutId
//   return accum
// }, { albums: {} }, collection)