#!/usr/bin/env node

var fs = require('fs')

function readConfig (filename) {
  var json
  try {
    json = JSON.parse(fs.readFileSync(filename).toString())
  } catch (e) {
    console.warn(e.stack)
  }
  return json
}
