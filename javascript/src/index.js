'use strict'

function compress (str) {
  if (!/^[a-z]+$/.test(str)) throw Error('invalid input')

  return str
    .match(/([a-z])\1*/g)
    .reduce((pre, curr) => pre + curr[0] + curr.length, '')
}

module.exports = {
  compress: compress
}
