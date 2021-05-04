#!/usr/bin/env node

const { spawn } = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

//var ganacheLib = require("../../../../ganache-core"); // for easy testing
//const ganacheLib = require("ganache-core");
const logging = require("./logging");

if (!process.send) {
  console.log("Not running as child process. Throwing.");
  throw new Error("Must be run as a child process!");
}

// remove the uncaughtException listener added by ganache-cli
process.removeAllListeners("uncaughtException");

process.on("unhandledRejection", err => {
  //console.log('unhandled rejection:', err.stack || err)
  process.send({ type: "error", data: copyErrorFields(err) });
});

process.on("uncaughtException", err => {
  //console.log('uncaught exception:', err.stack || err)
  process.send({ type: "error", data: copyErrorFields(err) });
});

//let server;
let blockInterval;
let dbLocation;

async function stopServer() {
  clearInterval(blockInterval);

  /*if (server) {
    return new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          if (err.code === "ERR_SERVER_NOT_RUNNING"){
            process.send({ type: "server-stopped" });
            resolve();
          } else {
            reject(err);
          }
        }
        else resolve();
      });
    })
  } else {*/
    process.send({ type: "server-stopped" });
  //}
}

async function stopContainer() {
  console.log('Stopping docker container...');
  await exec('docker rm -f harmony-localnet-ganache');
}

async function startContainer() {
  await stopContainer();
  console.log('Starting docker container');
  //return exec('docker run -d --rm --name child-test child/test');
  return exec('docker run --name harmony-localnet-ganache --rm -d  -p 9500:9500 -p 9800:9800 -p 9801:9801 -p 9501:9501 harmonyone/localnet-ganache');
}

async function startServer(options) {
  await stopServer();

  await startContainer();

  let sanitizedOptions = Object.assign({}, options);
  delete sanitizedOptions.mnemonic;

  const logToFile =
    options.logDirectory !== null && typeof options.logDirectory === "string";

  if (typeof options.logger === "undefined") {
    if (logToFile) {
      logging.generateLogFilePath(options.logDirectory);

      options.logger = {
        log: message => {
          if (typeof message === "string") {
            logging.logToFile(message);
          }
        },
      };
    } else {
      // The TestRPC's logging system is archaic. We'd like more control
      // over what's logged. For now, the really important stuff all has
      // a space on the front of it. So let's only log the stuff with a
      // space on the front. ¯\_(ツ)_/¯

      options.logger = {
        log: message => {
          if (
            typeof message === "string" &&
            (options.verbose || message.indexOf(" ") == 0)
          ) {
            console.log(message);
          }
        },
      };
    }
  }

  // log startup options without logging user's mnemonic
  const startingMessage = `Starting server with initial configuration: ${JSON.stringify(sanitizedOptions)}`;
  console.log(startingMessage);
  if (logToFile) {
    logging.logToFile(startingMessage);
  }

  //server = ganacheLib.server(options);

  // We'll also log all methods that aren't marked internal by Ganache
  /*var oldSend = server.provider.send.bind(server.provider);
  server.provider.send = (payload, callback) => {
    if (payload.internal !== true) {
      if (Array.isArray(payload)) {
        payload.forEach(function(item) {
          console.log(item.method);
        });
      } else {
        console.log(payload.method);
      }
    }

    oldSend(payload, callback);
  };*/

  let data = {
    _chainId: 1,
    _chainIdRpc: 1337,
    vmErrorsOnRPCResponse: true,
    verbose: false,
    asyncRequestProcessing: false,
    ws: true,
    keepAliveTimeout: 5000,
    gasLimit: 6721975,
    gasPrice: 20000000000,
    hardfork: 'muirGlacier',
    hostname: '127.0.0.1',
    port: 9800,
    network_id: 1337,
    default_balance_ether: 200,
    total_accounts: 10,
    unlocked_accounts: [],
    locked: false,
    db_path: '/home/developer/.config/Electron/default/chaindata',
    mnemonic: 'quiz allow ability pigeon try wire intact loud shock frown mail retreat',
    seed: '6VeOtd7tb6',
    forkCacheSize: 1073741824,
    hdPath: "m/44'/1023'/0'/0/",
    defaultTransactionGasLimit: '0x15f90',
    time: null,
    debug: false,
    allowUnlimitedContractSize: false,
    privateKeys: {
      '0xe99fe572b3fff9412925d51bd803fc77610252cc':'59f46b7addacb231e75932d384c5c75d5e9a84920609b5d27a57922244efbf90',
      '0x24ec3d6232c7955baff25f6b7d95cce18283139f':'d8ee0370d50f5d32c50704f4a0d01f027ab048d9cdb2f137b7ae852d8590d63f',
      '0x39bfa626a00e125f9a71cbe54d16a6c0d858c9df':'ff356a09310ab648ace558574ca84777f21612f6652867776095a95919a47314',
      '0x1c381a9a03b96da668321aa5be2c323de63c214a':'ed6e49719b1d7c82f364bf843d3d17bb5fd7af8a773cdc18c710c2642566cefa',
      '0xf3e82e01ead90a640dd8c9faf53c8cc952891e3b':'330032b37bdcd8d8f3d9aae0c8403dcbb24915362493e998f7e0b631f20d3f91',
      '0xe15245b7729aabd3f5690fd7d84393480b26f319':'4e856590fc9233cfc215e5bffe4efdb9611d8e2db78d38be24e02b469fddb5a5',
      '0x4ea3e8cdb526cc81c05712b7fe76c8ba277df907':'4d00a5621249165d7fb76bac56cd01786b64a301fffba0137c5fa997c3069163',
      '0x9f09459c1b13ed0b7fbf2a7b48f0628cb0a209cd':'5b2984da0bb75e22208dc3baf8f5a1eb86099418c6b3516d132c70199ce67c65',
      '0x5fe4aa29fcf8bdd8549324bc3ba57f734ee926e1':'86cc025e63f934f80e4377a022df3623abbdb5a5803089fe80ffb86dad76b864',
      '0x50c481fdc307125f5b075acc5e37109576e7b4bd':'5709f12bc34677a96ed3f01898329eedb0d78a499159ad5a541cdce8c77a3de3',
    }
  }

  const proc = spawn('docker', 'logs --follow harmony-localnet-ganache'.split(' '))
  proc.stdout.on('data', function (data) {
      console.log(`Container Log: ${data}`);
      if (data.includes('Initialization of localnet completed')) {
          console.log('Initialization complete!');
          console.log("Waiting for requests...");
          process.send({ type: "server-started", data: data });
      }
  });

  proc.on('close', function () {
      console.log('process terminated');
      process.send({ type: "server-stopped" });
  })

  /*server.on("close", () => {
    server = null;
    process.send({ type: "server-stopped" });
  });*/
}

function getDbLocation() {
  process.send({ type: "db-location", data: dbLocation || null });
}

process.on("message", (message) => {
  //console.log("CHILD RECEIVED", message)
  switch (message.type) {
    case "start-server":
      startServer(message.data);
      break;
    case "stop-server":
      stopServer();
      break;
    case "get-db-location":
      getDbLocation();
      break;
  }
});

function copyErrorFields(e) {
  let err = Object.assign({}, e);

  // I think these properties aren't enumerable on Error objects, so we copy
  // them manually if we don't do this, they aren't passed via IPC back to the
  // main process
  err.message = e.message;
  err.stack = e.stack;
  err.name = e.name;

  return err;
}

process.send({ type: "process-started" });
