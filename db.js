let uid = require("uid-safe")
let R = require("ramda")

let albums = [
  {title: "Emika", month: "October", year: "2011", musicianId: "em86", albumId: "eo11"},
  {title: "Skyline", month: "October", year: "2011", musicianId: "yt70", albumId: "so11"},
  {title: "The quiet hype", month: "March", year: "2009", musicianId: "jr05", albumId: "tm09"},
  {title: "Insides", month: "May", year: "2009", musicianId: "jh79", albumId: "im09"},
  {title: "Human after all", month: "March", year: "2005", musicianId: "dp93", albumId: "hm05"}
]

let tracks = [
  {number: 1, title: "3 Hours", length: "4:39", albumId: "eo11", trackId: uid.sync(3)},
  {number: 2, title: "Common Exchange", length: "3:33", albumId: "eo11", trackId: uid.sync(3)},
  {number: 3, title: "Professional Loving", length: "3:47", albumId: "eo11", trackId: uid.sync(3)},
  {number: 4, title: "Be My Guest", length: "4:27", albumId: "eo11", trackId: uid.sync(3)},
  {number: 5, title: "Count Backwards", length: "4:00", albumId: "eo11", trackId: uid.sync(3)},
  {number: 6, title: "Double Edge", length: "4:39", albumId: "eo11", trackId: uid.sync(3)},
  {number: 7, title: "Pretend", length: "4:14", albumId: "eo11", trackId: uid.sync(3)},
  {number: 8, title: "The Long Goodbye", length: "4:44", albumId: "eo11", trackId: uid.sync(3)},
  {number: 9, title: "FM Attention", length: "3:34", albumId: "eo11", trackId: uid.sync(3)},
  {number: 10, title: "Drop the Other", length: "3:28", albumId: "eo11", trackId: uid.sync(3)},
  {number: 11, title: "Come Catch Me", length: "4:06", albumId: "eo11", trackId: uid.sync(3)},
  {number: 12, title: "Credit Theme", length: "2:16", albumId: "eo11", trackId: uid.sync(3)},

  {number: 1, title: "Another Shore", length: "4:54", albumId: "so11", trackId: uid.sync(3)},
  {number: 2, title: "I'm Gonna Live Anyhow", length: "3:48", albumId: "so11", trackId: uid.sync(3)},
  {number: 3, title: "Monuments", length: "3:53", albumId: "so11", trackId: uid.sync(3)},
  {number: 4, title: "The Gutter", length: "4:03", albumId: "so11", trackId: uid.sync(3)},
  {number: 5, title: "Exit 25 Block 20", length: "3:28", albumId: "so11", trackId: uid.sync(3)},
  {number: 6, title: "Hesitation Wound", length: "4:11", albumId: "so11", trackId: uid.sync(3)},
  {number: 7, title: "Forgive Me", length: "5:56", albumId: "so11", trackId: uid.sync(3)},
  {number: 8, title: "The Trial", length: "5:53", albumId: "so11", trackId: uid.sync(3)},
  {number: 9, title: "Vanishing Point", length: "4:09", albumId: "so11", trackId: uid.sync(3)},

  {number: 1, title: "Falling Away", length: "3:58", albumId: "tm09", trackId: uid.sync(3)},
  {number: 2, title: "Très Cool", length: "3:34", albumId: "tm09", trackId: uid.sync(3)},
  {number: 3, title: "Guarded", length: "3:49", albumId: "tm09", trackId: uid.sync(3)},
  {number: 4, title: "Flip My Switch", length: "3:35", albumId: "tm09", trackId: uid.sync(3)},
  {number: 5, title: "The Quiet Hype", length: "4:41", albumId: "tm09", trackId: uid.sync(3)},
  {number: 6, title: "Over Again", length: "3:31", albumId: "tm09", trackId: uid.sync(3)},
  {number: 7, title: "Follow Me", length: "4:42", albumId: "tm09", trackId: uid.sync(3)},
  {number: 8, title: "Quicksand", length: "3:52", albumId: "tm09", trackId: uid.sync(3)},
  {number: 9, title: "L.A. Girls", length: "3:26", albumId: "tm09", trackId: uid.sync(3)},
  {number: 10, title: "Snakeskin", length: "3:38", albumId: "tm09", trackId: uid.sync(3)},
  {number: 11, title: "When The Bass Drops", length: "3:16", albumId: "tm09", trackId: uid.sync(3)},
  
  {number: 1, title: "The Wider Sun", length: "2:37", albumId: "im09", trackId: uid.sync(3)},
  {number: 2, title: "Vessel", length: "4:44", albumId: "im09", trackId: uid.sync(3)},
  {number: 3, title: "Insides", length: "4:40", albumId: "im09", trackId: uid.sync(3)},
  {number: 4, title: "Wire", length: "4:43", albumId: "im09", trackId: uid.sync(3)},
  {number: 5, title: "Colour Eye", length: "5:13", albumId: "im09", trackId: uid.sync(3)},
  {number: 6, title: "Light Through the Veins", length: "9:21", albumId: "im09", trackId: uid.sync(3)},
  {number: 7, title: "The Low Places", length: "6:37", albumId: "im09", trackId: uid.sync(3)},
  {number: 8, title: "Small Memory", length: "1:43", albumId: "im09", trackId: uid.sync(3)},
  {number: 9, title: "A Drifting Up", length: "6:29", albumId: "im09", trackId: uid.sync(3)},
  {number: 10, title: "Autumn Hill", length: "2:40", albumId: "im09", trackId: uid.sync(3)},

  {number: 1, title: "Human After All", length: "5:20", albumId: "hm05", trackId: uid.sync(3)},
  {number: 2, title: "The Prime Time of Your Life", length: "4:23", albumId: "hm05", trackId: uid.sync(3)},
  {number: 3, title: "Robot Rock", length: "4:48", albumId: "hm05", trackId: uid.sync(3)},
  {number: 4, title: "Steam Machine", length: "5:21", albumId: "hm05", trackId: uid.sync(3)},
  {number: 5, title: "Make Love", length: "4:50", albumId: "hm05", trackId: uid.sync(3)},
  {number: 6, title: "The Brainwasher", length: "4:08", albumId: "hm05", trackId: uid.sync(3)},
  {number: 7, title: "On/Off", length: "0:19", albumId: "hm05", trackId: uid.sync(3)},
  {number: 8, title: "Television Rules the Nation", length: "4:50", albumId: "hm05", trackId: uid.sync(3)},
  {number: 9, title: "Technologic", length: "4:44", albumId: "hm05", trackId: uid.sync(3)},
  {number: 10, title: "Emotion", length: "6:57", albumId: "hm05", trackId: uid.sync(3)}
]

let musicians = [
  {name: "Emika", musicianId: "em86"},
  {name: "Yann Tiersen", musicianId: "yt70"},
  {name: "Jupiter Rising", musicianId: "jr05"},
  {name: "Jon Hopkins", musicianId: "jh79"},
  {name: "Daft Punk", musicianId: "dp93"}
]


let db = {}

let collectionGenerator = function(title, arr) {
  let collection = R.reduce((accum, item) => {
    let id = R.prop(title + "Id", item)
  
    accum[id] = item
    return accum
  }, {}, arr)
  
  return collection
}

db.musicians = collectionGenerator("musician", musicians) 
db.albums = collectionGenerator("album", albums)
db.tracks = collectionGenerator("track", tracks)

module.exports = db
