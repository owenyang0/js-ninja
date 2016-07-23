'use strict'

const url = require('url')
const path = require('path')

function compress (str) {
  if (!/^[a-z]+$/.test(str)) throw Error('invalid input')

  return str
    .match(/([a-z])\1*/g)
    .reduce((pre, curr) => pre + curr[0] + curr.length, '')
}

function checkURIs (uri1, uri2) {
  const uriReg = /^https?:\/\/[^\s\/$.?#].[^\s]*$/i
  if (!uriReg.test(uri1) || !uriReg.test(uri2)) throw Error('invalid uri')

  let uri1Obj = url.parse(uri1)
  let uri2Obj = url.parse(uri2)

  const convertedUri = [uri1Obj, uri2Obj].map(uri => {
    if (uri.port === '80') {
      uri.port = null
      uri.host = null
    }

    uri.pathname = path.normalize(uri.pathname)

    uri.search = uri.query
      ? uri.query.split('&').sort().join('&')
      : null

    return decodeURIComponent(url.format(uri))
  })

  const isSame = convertedUri.every((curr, idx, arr) => curr === arr[0])

  return isSame
}

module.exports = {
  compress: compress,
  checkURIs: checkURIs
}
