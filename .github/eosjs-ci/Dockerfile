### Test:
#### docker build --tag eosjs-ci:test ./.github/eosjs-ci
#### docker run --publish 8888:8888 eosjs-ci:test

FROM eosio/eosio.cdt:develop as contracts
WORKDIR /root
### base
RUN apt-get update \
 && apt-get install -yq curl git

RUN git clone https://github.com/EOSIO/eos \
 && cd eos \
 && git checkout develop

RUN git clone https://github.com/EOSIO/eosio.contracts \
 && cd eosio.contracts \
 && git checkout develop \
 && mkdir build && cd build && mkdir eosio.token && cd .. \
 && eosio-cpp -abigen ./contracts/eosio.token/src/eosio.token.cpp -o ./build/eosio.token/eosio.token.wasm -R ./contracts/eosio.token/ricardian/ -I ./contracts/eosio.token/include/

RUN git clone https://github.com/EOSIO/key-value-example-app.git \
 && cd key-value-example-app \
 && eosio-cpp -abigen ./contracts/kv_todo/src/kv_todo.cpp -o ./contracts/kv_todo/build/kv_todo.wasm -R ./contracts/kv_todo/ricardian/ -I ./contracts/kv_todo/include/

RUN git clone https://github.com/EOSIO/return-values-example-app.git \
 && cd return-values-example-app \
 && eosio-cpp -abigen ./contracts/action_return_value/src/action_return_value.cpp -o ./contracts/action_return_value/build/action_return_value.wasm -R ./contracts/action_return_value/ricardian/

RUN mkdir cfhello
COPY ./contracts/cfhello.cpp /root/cfhello
RUN cd cfhello \
 && mkdir build \
 && eosio-cpp -abigen ./cfhello.cpp -o ./build/cfhello.wasm


FROM eosio/eos:develop
ENTRYPOINT ["nodeos", "--data-dir", "/root/.local/share", "-e", "-p", "eosio", "--replay-blockchain", "--plugin", "eosio::producer_plugin", "--plugin", "eosio::chain_api_plugin", "--plugin", "eosio::trace_api_plugin", "--trace-no-abis", "--plugin", "eosio::db_size_api_plugin", "--plugin", "eosio::http_plugin", "--http-server-address=0.0.0.0:8888", "--access-control-allow-origin=*", "--contracts-console", "--http-validate-host=false", "--enable-account-queries=true", "--verbose-http-errors", "--max-transaction-time=100"]
WORKDIR /root
RUN mkdir -p "/opt/eosio/bin/contracts"
COPY --from=contracts /root/eos/contracts/contracts/eosio.bios/bin/* /opt/eosio/bin/contracts/eosio.bios/
COPY --from=contracts /root/eos/contracts/contracts/eosio.boot/bin/* /opt/eosio/bin/contracts/eosio.boot/
COPY --from=contracts /root/eosio.contracts/build/ /opt/eosio/bin/contracts
COPY --from=contracts /root/key-value-example-app/contracts/kv_todo/build/* /opt/eosio/bin/contracts/kv_todo/
COPY --from=contracts /root/return-values-example-app/contracts/action_return_value/build/* /opt/eosio/bin/contracts/action_return_value/
COPY --from=contracts /root/cfhello/build/* /opt/eosio/bin/contracts/cfhello/
COPY ./ /opt/eosio/bin/

RUN mkdir -p "/opt/eosio/bin/config-dir"
RUN /bin/bash /opt/eosio/bin/scripts/deploy_contracts.sh
