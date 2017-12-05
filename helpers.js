// COMMON FUNCTIONS

let compareDurations = (timeStr1, timeStr2) => {
  let [min1, sec1] = timeStr1.split(":")
  let [min2, sec2] = timeStr2.split(":")

  return (+ sec1 + min1 * 60) >= (+ sec2 + min2 * 60)
}

let includesCaseInsensitive = (str, subStr) => {
  return str.toLowerCase().includes(subStr.toLowerCase())
}


exports.compareDurations = compareDurations
exports.includesCaseInsensitive = includesCaseInsensitive