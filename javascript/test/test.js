const should = require('should')
const compress = require('../src').compress
const checkURIs = require('../src').checkURIs

describe('compress', () => {
  it('should throw an error for invalid input', () => {
    ;(() => compress('123')).should.throw(/invalid input/)
    ;(() => compress('')).should.throw(/invalid input/)
    ;(() => compress('123@xxxx3333')).should.throw(/invalid input/)
  })

  it('should return a4b2a4b1a1b3c12 for aaaabbaaaababbbcccccccccccc', () => {
    compress('aaaabbaaaababbbcccccccccccc').should.be.equal('a4b2a4b1a1b3c12')
  })
})

describe('checkURIs', () => {
  const baseUri = 'http://abc.com/~smith/home.html'

  it('should pass two valid params', () => {
    ;(() => checkURIs(baseUri, 'invalid input')).should.throw(/invalid uri/)
    ;(() => checkURIs('invalid input', baseUri)).should.throw(/invalid uri/)
  })

  it('should be equivalent for absoulutely same uris', () => {
    checkURIs(baseUri, baseUri).should.be.a.Boolean();
    checkURIs(baseUri, baseUri).should.be.true();
  })

  it('should not be equivalent for different uris', () => {
    const uri2 = 'http://abc.com/smith/home.html'
    checkURIs(baseUri, uri2).should.be.false();
  })

  it('should be equivalent for uri of port 80', () => {
    const uri2 = 'http://abc.com:80/~smith/home.html'
    const uri3 = 'http://abc.com:81/~smith/home.html'

    checkURIs(baseUri, uri2).should.be.true();
    checkURIs(baseUri, uri3).should.be.false();
  })

  it('should return true for case-insensitive scheme names', () => {
    const uri2 = 'hTtP://abc.com/~smith/home.html'

    checkURIs(baseUri, uri2).should.be.true();
  })

  it('should return true for case-insensitive hostname', () => {
    const uri2 = 'hTtP://aBc.cOm/~smith/home.html'

    checkURIs(baseUri, uri2).should.be.true();
  })

  it('should return false for case-sensitive path, hash, and querystring', () => {
    const currUri = 'http://abc.com/foo.html?a=1&b=2#hash'
    const uriForPath = 'http://abc.com/Foo.html?a=1&b=2#hash'
    const uriForHash = 'http://abc.com/foo.html?a=1&b=2#hAsh'
    const uriForQuery = 'http://abc.com/foo.html?A=1&b=2#hash'

    checkURIs(currUri, uriForPath).should.be.false();
    checkURIs(currUri, uriForHash).should.be.false();
    checkURIs(currUri, uriForQuery).should.be.false();
  })

  it('should return true for appropriate traversal tokens', () => {
    const currUri = 'http://abc.com/drill/down/foo.html'
    const uriForToken = 'http://abc.com/drill/further/../down/./foo.html'

    checkURIs(currUri, uriForToken).should.be.true();
  })

  it('should be equivalent for their % HEX HEX encodings', () => {
    const currUri = 'http://abc.com:80/~smith/home.html'
    const uriForToken = 'http://ABC.com/%7Esmith/home.html'

    checkURIs(currUri, uriForToken).should.be.true();
  })

  it('should be equivalent for arbitrary order of querystring', () => {
    const currUri = 'http://abc.com/foo.html?a=1&b=2'
    const uriForToken = 'http://abc.com/foo.html?b=2&a=1'

    checkURIs(currUri, uriForToken).should.be.true();
  })

  it('should be equivalent for arbitrary order of querystring for same key', () => {
    const currUri = 'http://abc.com/foo.html?a=1&b=2&a=2'
    const uriForToken = 'http://abc.com/foo.html?b=2&a=1&a=2'

    checkURIs(currUri, uriForToken).should.be.true();
  })

  it('should not be equivalent for different value of querystring key', () => {
    const currUri = 'http://abc.com/foo.html?a=1&b=1&a=2'
    const uriForToken = 'http://abc.com/foo.html?b=2&a=1&a=2'

    checkURIs(currUri, uriForToken).should.be.false();
  })

  it('should be case-sensitive for auth uri', () => {
    const currUri = 'http://uname:passwd@host.com/foo/bar.html'
    const uriForAuth = 'http://uName:passwd@host.com/foo/bar.html'

    checkURIs(currUri, uriForAuth).should.be.false();
  })
})
