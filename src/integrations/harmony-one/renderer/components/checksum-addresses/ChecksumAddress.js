import React, { Component } from "react";
import Web3 from "web3";

export default class ChecksumAddress extends Component {
  toChecksumAddress = address => {
    address = address.replace("0x", "").toLowerCase();
    const hash = Web3.utils.sha3(address).replace("0x", "");
    let ret = "0x";

    for (let i = 0; i < address.length; i++) {
      if (parseInt(hash[i], 16) >= 8) {
        ret += address[i].toUpperCase();
      } else {
        ret += address[i];
      }
    }

    return ret;
  };

  toBech32AddressFormat = address => {
    const bech32 = {
      '0xe99fe572b3fff9412925d51bd803fc77610252cc' : 'one1ax072u4nllu5z2f965dasqluwassy5kvjc36zr',
      '0x24ec3d6232c7955baff25f6b7d95cce18283139f' : 'one1ynkr6c3jc724htljta4hm9wvuxpgxyulf3mg2j',
      '0x39bfa626a00e125f9a71cbe54d16a6c0d858c9df' : 'one18xl6vf4qpcf9lxn3e0j5694xcrv93jwl93j74u',
      '0x1c381a9a03b96da668321aa5be2c323de63c214a' : 'one1rsup4xsrh9k6v6pjr2jmutpj8hnrcg22dxvgpt',
      '0xf3e82e01ead90a640dd8c9faf53c8cc952891e3b' : 'one1705zuq02my9xgrwce8a020yve9fgj83m56wxpq',
      '0xe15245b7729aabd3f5690fd7d84393480b26f319' : 'one1u9fytdmjn24a8atfpltassunfq9jducedmxam2',
      '0x4ea3e8cdb526cc81c05712b7fe76c8ba277df907' : 'one1f6373nd4ymxgrszhz2mluakghgnhm7g8ltq2w8',
      '0x9f09459c1b13ed0b7fbf2a7b48f0628cb0a209cd' : 'one1nuy5t8qmz0ksklal9fa53urz3jc2yzwdp6xaks',
      '0x5fe4aa29fcf8bdd8549324bc3ba57f734ee926e1' : 'one1tlj2520ulz7as4ynyj7rhftlwd8wjfhpnxh8l6',
      '0x50c481fdc307125f5b075acc5e37109576e7b4bd' : 'one12rzgrlwrquf97kc8ttx9udcsj4mw0d9an4c7a9',
    }
    
    // TODO: Put the list of addresses in a map.
    return bech32[address] || address;
  }

  render() {
    return <span>{this.toBech32AddressFormat(this.props.address)}</span>;
  }
}
