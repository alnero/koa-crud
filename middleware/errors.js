// ERRORS

async function send400(ctx, next) {
  ctx.response.status = 400
  ctx.response.body = "Bad request"
  await next()
}

async function send404(ctx, next) {
  ctx.response.status = 404
  ctx.response.body = "Not found"
  await next()
}


exports.send400 = send400
exports.send404 = send404