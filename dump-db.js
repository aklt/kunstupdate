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
  var entries = ['Hold', 'Studerende', 'Ansatte', 'AnsatteHold', 'StuderendeHold']
  ;(function loop (i) {
    var name = entries[i]
    if (!name) {
      conn.close()
      return cb()
    }
    req.execute('Get' + name + 'CampusNord', function (err, set) {
      if (err) return cb(err)
      console.log('----------------- ' + name)
      fs.writeFileSync(path.join(__dirname, name + '.data'), JSON.stringify(set, 0, 2))
      loop(i + 1)
    })
  }(0))
})

function cb (err) {
  if (err) {
    console.log(err.stack)
    throw err
  }
}
