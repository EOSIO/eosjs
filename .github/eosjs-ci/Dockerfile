### Test:
#### docker build --tag eosjs-ci:test ./.github/eosjs-ci
#### docker run --publish 8888:8888 eosjs-ci:test

ARG EOSBRANCH=develop
ARG CDTBRANCH=develop
FROM eosio/eosio.cdt:${CDTBRANCH} as contracts
ARG CDTBRANCH
WORKDIR /root
RUN apt-get update \
 && apt-get install -yq curl git

RUN if [ "$CDTBRANCH" = "release_1.7.x" ]; then \
 git clone https://github.com/EOSIO/tropical-example-web-app \
 && mkdir -p /root/contracts/eosio.bios_v1.8.3 && mv ./tropical-example-web-app/eosio/contracts/eosio.bios-v1.8.3/* /root/contracts/eosio.bios_v1.8.3/ \

 && git clone https://github.com/EOSIO/eos \
 && cd eos \
 && git checkout v2.0.12 \
 && mkdir -p /root/contracts/eosio.bios/ && mv ./unittests/contracts/eosio.bios/* /root/contracts/eosio.bios/ \
 && mkdir -p /root/contracts/eosio.system/ && mv ./unittests/contracts/eosio.system/* /root/contracts/eosio.system/ \
 && mkdir -p /root/contracts/eosio.msig/ && mv ./unittests/contracts/eosio.msig/* /root/contracts/eosio.msig/ \
 && mkdir -p /root/contracts/eosio.token/ && mv ./unittests/contracts/eosio.token/* /root/contracts/eosio.token/ \
 ; fi

RUN if [ "$CDTBRANCH" = "release_1.8.x" ] || [ "$CDTBRANCH" = "develop" ]; then \
 git clone https://github.com/EOSIO/eos \
 && cd eos \
 && git checkout develop \
 && mkdir -p /root/contracts/eosio.bios/ && mv ./contracts/contracts/eosio.bios/bin/* /root/contracts/eosio.bios/ \
 && mkdir -p /root/contracts/eosio.boot/ && mv ./contracts/contracts/eosio.boot/bin/* /root/contracts/eosio.boot/ \
 && mkdir -p /root/contracts/eosio.system/ && mv ./unittests/contracts/eosio.system/* /root/contracts/eosio.system/ \
 && mkdir -p /root/contracts/eosio.msig/ && mv ./unittests/contracts/eosio.msig/* /root/contracts/eosio.msig/ \
 && mkdir -p /root/contracts/eosio.token/ && mv ./unittests/contracts/eosio.token/* /root/contracts/eosio.token/ \
 ; fi

RUN if [ "$CDTBRANCH" = "release_1.8.x" ] || [ "$CDTBRANCH" = "develop" ]; then \
 git clone https://github.com/EOSIO/eosio.cdt \
 && cd eosio.cdt \
 && git checkout develop \
 && mkdir -p build/read_only_query_tests/ \
 && eosio-cpp -abigen ./tests/unit/test_contracts/read_only_query_tests.cpp -o ./build/read_only_query_tests/read_only_query_tests.wasm \
 && mkdir -p /root/contracts/read_only_query_tests/ && mv ./build/read_only_query_tests/* /root/contracts/read_only_query_tests/ \
 ; fi

RUN if [ "$CDTBRANCH" = "release_1.8.x" ] || [ "$CDTBRANCH" = "develop" ]; then \
 git clone https://github.com/EOSIO/key-value-example-app.git \
 && cd key-value-example-app \
 && eosio-cpp -abigen ./contracts/kv_todo/src/kv_todo.cpp -o ./contracts/kv_todo/build/kv_todo.wasm -R ./contracts/kv_todo/ricardian/ -I ./contracts/kv_todo/include/ \
 && mkdir -p /root/contracts/kv_todo/ && mv ./contracts/kv_todo/build/* /root/contracts/kv_todo/ \
 ; fi

RUN if [ "$CDTBRANCH" = "release_1.8.x" ] || [ "$CDTBRANCH" = "develop" ]; then \
 git clone https://github.com/EOSIO/return-values-example-app.git \
 && cd return-values-example-app \
 && eosio-cpp -abigen ./contracts/action_return_value/src/action_return_value.cpp -o ./contracts/action_return_value/build/action_return_value.wasm -R ./contracts/action_return_value/ricardian/ \
 && mkdir -p /root/contracts/action_return_value/ && mv ./contracts/action_return_value/build/* /root/contracts/action_return_value/ \
 ; fi

RUN mkdir cfhello
COPY ./contracts/cfhello.cpp /root/cfhello
RUN cd cfhello \
 && mkdir build \
 && eosio-cpp -abigen ./cfhello.cpp -o ./build/cfhello.wasm \
 && mkdir -p /root/contracts/cfhello/ && mv ./build/* /root/contracts/cfhello/

FROM eosio/eosio:${EOSBRANCH}
ARG EOSBRANCH
ENTRYPOINT ["nodeos", "--data-dir", "/root/.local/share", "-e", "-p", "eosio", "--replay-blockchain", "--plugin", "eosio::producer_plugin", "--plugin", "eosio::producer_api_plugin", "--plugin", "eosio::chain_api_plugin", "--plugin", "eosio::trace_api_plugin", "--trace-no-abis", "--plugin", "eosio::db_size_api_plugin", "--plugin", "eosio::http_plugin", "--http-server-address=0.0.0.0:8888", "--access-control-allow-origin=*", "--contracts-console", "--http-validate-host=false", "--enable-account-queries=true", "--verbose-http-errors", "--max-transaction-time=100"]
WORKDIR /root
RUN mkdir -p "/opt/eosio/bin/contracts"
COPY --from=contracts /root/contracts /opt/eosio/bin/contracts/
COPY ./ /opt/eosio/bin/

RUN mkdir -p "/opt/eosio/bin/config-dir"
RUN /bin/bash /opt/eosio/bin/scripts/deploy_contracts.sh "$EOSBRANCH"
