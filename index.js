
var fs = require('fs')
var path = require('path')

// FIXME Which ical parser lib?
// var ical = require('ical')
// res[key] = ical.convert(body)
// var ical = require('ical2json')

var ical = require('ical.js')
var request = require('request')
var stableStringify = require('json-stable-stringify')

/**
 * fetchTimeEditIcalData
 *
 * Retrieve ICal data from values in icalUrlObject
 *
 * @param {Object{string:url}} icalUrlObject
 * @param {Array[String]} dir The dir to save files to
 * @param {Function(Error)} cb called on success
 */
function fetchTimeEditIcalData (icalUrlObject, dir, cb) {
  var res = {}
  var icalKeys = Object.keys(icalUrlObject)
  var date = new Date().toISOString().slice(0, -2).replace(/:/g, '-')

  ;(function loop (i) {
    var icalKey = icalKeys[i]
    if (!icalKey) return cb(null, res)
    request(icalUrlObject[icalKey], (err, response, body) => {
      if (err) return cb(err)
      if (response.statusCode !== 200) {
        return cb(new Error(JSON.stringify(response)))
      }
      var dest = path.join.apply(null,
                                 dir.concat(icalKey + '-' + date + '.ical'))
      fs.writeFile(dest, body, (err) => {
        if (err) return cb(err)
        loop()
      })
    })
  }(0))
}

/**
 * convertTimeEditIcalDataToWebuntisCompatible
 *
 * @param {String} icalData
 * @returns {Object}
 */
function convertTimeEditIcalDataToWebuntisCompatible (icalData) {
  return stableStringify(ical.parse(icalData), {space: '  '})
}

module.exports = {
  fetchTimeEditIcalData: fetchTimeEditIcalData,
  convertTimeEditIcalDataToWebuntisCompatible: convertTimeEditIcalDataToWebuntisCompatible
}
