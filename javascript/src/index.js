
const utils = require('./utils')

exports.compress = str => {
  if (!(/^[a-z]+$/).test(str)) { throw Error('invalid input') }

  return str
    .match(/([a-z])\1*/g)
    .reduce((pre, curr) => pre + curr[0] + curr.length, '')
}

exports.checkURIs = (uri1, uri2) => {
  const uriReg = /^https?:\/\/[^\s\/$.?#].[^\s]*$/i
  if (!uriReg.test(uri1) || !uriReg.test(uri2)) { throw Error('invalid uri') }

  const uri1Obj = utils.urlParse(uri1)
  const uri2Obj = utils.urlParse(uri2)

  const convertedUri = [uri1Obj, uri2Obj].map(uri => {
    if (uri.port === '80') {
      uri.port = null
      uri.host = null
    }

    uri.pathname = utils.normalizePath(uri.pathname)

    uri.search = uri.query
      ? uri.query.split('&').sort().join('&')
      : null

    return decodeURIComponent(utils.urlFormat(uri))
  })

  const isSame = convertedUri.every((curr, idx, arr) => curr === arr[0])

  return isSame
}
