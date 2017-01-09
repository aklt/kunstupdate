#!/usr/bin/env node

var fs = require('fs')
var mssql = require('mssql')

var mssqlConfig = JSON.parse(fs.readFileSync(process.argv[2]).toString())

console.warn(mssqlConfig)

var conn = new mssql.Connection(mssqlConfig, function (err) {
  if (err) return cb(err)
  console.warn(conn)
  var req = conn.request()
  req.execute('GetHoldCampusNord', function (err, set) {
    if (err) return cb(err)
    console.warn(set)
  })
})

function cb (err) {
  if (err) console.warn(err.stack)
  throw err
}
