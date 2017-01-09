#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var mssql = require('mssql')

var mssqlConfig = JSON.parse(fs.readFileSync(process.argv[2]).toString())

console.log(mssqlConfig)

var conn = new mssql.Connection(mssqlConfig.prepare.mssql, function (err) {
  if (err) return cb(err)
  console.log(conn)
  var req = conn.request()
  req.execute('GetHoldCampusNord', function (err, set) {
    if (err) return cb(err)
    console.log('-----------------')
    conn.close()
    fs.writeFileSync(path.join(__dirname, 'data'), set)
  })
})

function cb (err) {
  if (err) console.log(err.stack)
  throw err
}
