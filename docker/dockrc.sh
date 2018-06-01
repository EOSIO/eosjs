# Root key need not be imported
# 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

# Root public key (EOS..5CV)
export owner_pubkey=EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
export active_pubkey=EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV

function nodeosd() {
  docker exec docker_nodeosd_1 "$@"
}

function cleos() {
  nodeosd cleos -u http://nodeosd:8888 "$@"
}

function newaccount() {
  cleos system newaccount\
    --stake-net "10 SYS" --stake-cpu "100 SYS" --buy-ram-bytes 256\
    "$@"
}
