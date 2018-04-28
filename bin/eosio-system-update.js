#!/usr/bin/env node

const fs = require('fs')

console.log('reading ./eosio.system.abi')

let abi = JSON.parse(fs.readFileSync('eosio.system.abi', 'utf8'));

let actions = {};
for ({ name, type } of abi.actions)
    if (name === type)
        actions[name] = true;

let gen = {};
for (let type of abi.types)
    gen[type.new_type_name] = type.type;

for (let { name, fields, ...rest } of abi.structs) {
    let genFields = {};
    for (let { name, type } of fields)
        genFields[name] = type;
    if (actions[name])
        rest.type = "action";

    gen[name] = { ...rest, fields: genFields };
}

let sorted = {};
for (let key of Object.keys(gen).sort())
    sorted[key] = gen[key];

console.log('writing ./eosio_system.json')
fs.writeFileSync('eosio_system.json', JSON.stringify(sorted, null, 2), 'utf8');
