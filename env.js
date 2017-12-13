let {env} = process

let abort = (field) => { throw Error("process.env." + field + " is not set") }

env.NODE_ENV || abort("NODE_ENV")