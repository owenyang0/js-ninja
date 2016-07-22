const should = require('should')
const compress = require('../src').compress

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
