import { web3ActionCreator } from "../../../common/redux/web3/helpers/Web3ActionCreator";

const prefix = "ACCOUNTS";

export const GET_ACCOUNTS = `${prefix}/GET_ACCOUNTS`;
export const getAccounts = function() {
  return async function(dispatch, getState) {
    console.log("GET ACCOUNTS HARMONY");
    //let addresses = await web3ActionCreator(dispatch, getState, "getAccounts");
    let addresses = [
      '0xe99fe572b3fff9412925d51bd803fc77610252cc',
      '0x24ec3d6232c7955baff25f6b7d95cce18283139f',
      '0x39bfa626a00e125f9a71cbe54d16a6c0d858c9df',
      '0x1c381a9a03b96da668321aa5be2c323de63c214a',
      '0xf3e82e01ead90a640dd8c9faf53c8cc952891e3b',
      '0xe15245b7729aabd3f5690fd7d84393480b26f319',
      '0x4ea3e8cdb526cc81c05712b7fe76c8ba277df907',
      '0x9f09459c1b13ed0b7fbf2a7b48f0628cb0a209cd',
      '0x5fe4aa29fcf8bdd8549324bc3ba57f734ee926e1',
      '0x50c481fdc307125f5b075acc5e37109576e7b4bd'
    ];
    var currentAddresses = getState().accounts.addresses;

    // Only save accounts if they've changed
    if (addresses && currentAddresses && addresses.length > currentAddresses.length) {
      dispatch({ type: GET_ACCOUNTS, addresses });
    }
    if (addresses) {
      addresses.forEach(address => {
        dispatch(getAccountBalance(address));
        dispatch(getAccountNonce(address));
      });
    }
  };
};

export const GET_ACCOUNT_BALANCE = `${prefix}/GET_ACCOUNT_BALANCE`;
export const getAccountBalance = function(address) {
  return async function(dispatch, getState) {
    let balance = await web3ActionCreator(dispatch, getState, "getBalance", [
      address,
    ]);
    var currentBalance = getState().accounts.balances[address];

    // Remember, these are BigNumber objects
    if (balance === undefined || currentBalance === undefined || balance.toString(10) !== currentBalance.toString(10)) {
      dispatch({ type: GET_ACCOUNT_BALANCE, address, balance });
    }
  };
};

export const GET_ACCOUNT_NONCE = `${prefix}/GET_ACCOUNT_NONCE`;
export const getAccountNonce = function(address) {
  return async function(dispatch, getState) {
    let nonce = await web3ActionCreator(
      dispatch,
      getState,
      "getTransactionCount",
      [address],
    );
    var currentNonce = getState().accounts.nonces[address];

    if (nonce != currentNonce) {
      dispatch({ type: GET_ACCOUNT_NONCE, address, nonce });
    }
  };
};
