function precise_round(num, decimals) {
  var sign = num >= 0 ? 1 : -1
  return parseFloat(
    (
      Math.round(num * Math.pow(10, decimals) + sign * 0.001) /
      Math.pow(10, decimals)
    ).toFixed(decimals),
  )
}

module.exports = { precise_round }
