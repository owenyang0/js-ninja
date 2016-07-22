
function compress (str) {
  var alphaReg = /^[a-z]+$/
  if (!alphaReg.test(str)) throw Error('invalid input')

  var acc = 1
  return str
    .split('')
    .reduce((pre, curr) => {
      if (curr === pre.slice(pre.length - 1)) {
        acc++
      } else {
        pre += acc + curr
        acc = 1
      }

      return pre
    }) + acc
}

module.exports = {
  compress: compress
}
