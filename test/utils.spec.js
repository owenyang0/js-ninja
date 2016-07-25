const should = require('should')

const utils = require('../src/utils')

describe('utils', () => {
  describe('normalizePath()', function () {
    it('should normalize path for traversal tokens with root', () => {
      const path = '/drill/further/../down/./foo.html'
      const expectedPath = '/drill/down/foo.html'

      utils.normalizePath(path).should.be.exactly(expectedPath)
    })

    it('should normalize path for traversal tokens without slash', () => {
      const path = 'drill/further/../down/./foo.html'
      const expectedPath = 'drill/down/foo.html'

      utils.normalizePath(path).should.be.exactly(expectedPath)
    })
  })

  describe('urlParse', function () {
    it('should parse url into a object', () => {
      const uri = 'http://abc.com/smith/home.html'

      utils.urlParse(uri).href.should.be.exactly(uri)
    })
  })

  describe('urlFormat', function () {
    it('should format a url from a url object', () => {
      const urlObj = {
        auth: null,
        hash: null,
        host: 'abc.com',
        hostname: 'abc.com',
        href: 'http://abc.com/smith/home.html',
        path: '/smith/home.html',
        pathname: '/smith/home.html',
        port: null,
        protocol: 'http:',
        query: null,
        search: null,
        slashes: true
      }
      const expectedUri = 'http://abc.com/smith/home.html'

      utils.urlFormat(urlObj).should.be.exactly(expectedUri)
    })
  })
})
