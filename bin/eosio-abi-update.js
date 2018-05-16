#!/usr/bin/env node

const fs = require('fs')

const account = process.argv[2]
const abiFileName = `${account}.abi`
const jsonFileName = process.argv[3]

console.log('reading ' + abiFileName)

let abi = JSON.parse(fs.readFileSync(abiFileName, 'utf8'));

let actions = {};
for ({ name, type } of abi.actions)
    actions[type] = name;

let gen = {};
for (let type of abi.types)
    gen[type.new_type_name] = type.type;

for (let { name, fields, ...rest } of abi.structs) {
    let genFields = {};
    for (let { name, type } of fields)
        genFields[name] = type;

    if (actions[name])
        rest.action = {name: actions[name], account}

    gen[name] = { ...rest, fields: genFields };
}

let sorted = {};
for (let key of Object.keys(gen).sort())
    sorted[key] = gen[key];

console.log('writing ' + jsonFileName)
fs.writeFileSync(jsonFileName, JSON.stringify(sorted, null, 2), 'utf8');
