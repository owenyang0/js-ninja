// To use block-scoped declarations
'use strict'

exports.normalizePath = path => path.split('/')
  .reduce((pre, curr) => {
    if (curr === '.') { return pre }
    (curr === '..' && pre.length) ? pre.pop() : pre.push(curr)

    return pre
  }, [])
  .join('/')

function Url () {
  this.protocol = null
  this.slashes = null
  this.auth = null
  this.host = null
  this.port = null
  this.hostname = null
  this.hash = null
  this.search = null
  this.query = null
  this.pathname = null
  this.path = null
  this.href = null
}

const protocolPattern = /^([a-z0-9.+-]+:)/i
const portPattern = /:[0-9]*$/
const nonHostChars = ['%', '/', '?', ';', '#']
const hostEndingChars = ['/', '?', '#']

Url.prototype.parse = function (url) {
  let rest = url.trim()

  let proto = protocolPattern.exec(rest)
  if (proto) {
    proto = proto[0]
    this.protocol = proto.toLowerCase()
    rest = rest.substr(proto.length)
  }

  let slashes
  if (proto) {
    slashes = rest.substr(0, 2) === '//'
    if (slashes) {
      rest = rest.substr(2)
      this.slashes = true
    }
  }

  if (slashes) {
    let hostEnd = -1
    for (let i = 0; i < hostEndingChars.length; i++) {
      const hec = rest.indexOf(hostEndingChars[i])
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec
      }
    }

    const atSign = rest.lastIndexOf('@', hostEnd)
    let auth

    if (atSign !== -1) {
      auth = rest.slice(0, atSign)
      rest = rest.slice(atSign + 1)
      this.auth = decodeURIComponent(auth)
    }

    hostEnd = -1
    for (let i = 0; i < nonHostChars.length; i++) {
      const hec = rest.indexOf(nonHostChars[i])
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec
      }
    }

    this.host = rest.slice(0, hostEnd)
    rest = rest.slice(hostEnd)

    let host = this.host
    let port = portPattern.exec(this.host)
    if (port) {
      port = port[0]
      if (port !== ':') {
        this.port = port.substr(1)
      }
      host = host.substr(0, host.length - port.length)
    }
    if (host) { this.hostname = host }

    this.hostname = this.hostname.toLowerCase() || ''

    const p = this.port ? `:${this.port}` : ''
    const h = this.hostname || ''
    this.host = h + p
    this.href += this.host
  }

  const hash = rest.indexOf('#')
  if (hash !== -1) {
    this.hash = rest.substr(hash)
    rest = rest.slice(0, hash)
  }

  const qm = rest.indexOf('?')
  if (qm !== -1) {
    this.search = rest.substr(qm)
    this.query = rest.substr(qm + 1)

    rest = rest.slice(0, qm)
  }
  if (rest) { this.pathname = rest }

  if (this.pathname || this.search) {
    const p = this.pathname || ''
    const s = this.search || ''
    this.path = p + s
  }

  this.href = this.format()
  return this
}

Url.prototype.format = function () {
  let auth = this.auth || ''
  if (auth) {
    auth = encodeURIComponent(auth)
    auth = auth.replace(/%3A/i, ':')
    auth += '@'
  }

  let protocol = this.protocol || ''
  let pathname = this.pathname || ''
  let hash = this.hash || ''
  let host = false
  const query = ''

  if (this.host) {
    host = auth + this.host
  }
  else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1
      ? this.hostname
      : `[${this.hostname}]`)
    if (this.port) {
      host += ':' + this.port
    }
  }

  let search = this.search || (query && ('?' + query)) || ''

  if (protocol && protocol.substr(-1) !== ':') { protocol += ':' }
  if (this.slashes) { host = '//' + (host || '') }

  if (hash && hash.charAt(0) !== '#') { hash = '#' + hash }
  if (search && search.charAt(0) !== '?') { search = '?' + search }

  pathname = pathname.replace(/[?#]/g, match => encodeURIComponent(match))
  search = search.replace('#', '%23')

  return protocol + host + pathname + search + hash
}

const urlParse = url => {
  if (url && url instanceof Url) { return url }

  return new Url().parse(url)
}

const urlFormat = obj => {
  if (!(obj instanceof Url)) {
    return Url.prototype.format.call(obj)
  }
  return obj.format()
}

exports.urlParse = urlParse
exports.urlFormat = urlFormat
