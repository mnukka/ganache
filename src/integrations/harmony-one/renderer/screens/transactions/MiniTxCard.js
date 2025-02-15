import React, { Component } from "react";

import { Link } from "react-router-dom";

import TransactionTypeBadge from "./TransactionTypeBadge";
import DestinationAddress from "./DestinationAddress";

import OnlyIf from "../../../../../renderer/components/only-if/OnlyIf";

import { toBech32, fromBech32 } from "@harmony-js/crypto";
import FormattedEtherValue from "../../components/formatted-ether-value/FormattedEtherValue";

export default class MiniTxCard extends Component {
  render() {
    let { tx, receipt, contractName } = this.props;

    let hasReceipt = !!receipt;

    if (!receipt) {
      receipt = {
        gasUsed: "...",
      };
    }

    return (
      <Link to={`/harmony-one/transactions/${tx.hash}`} className="Link">
        <div className="MiniTxCard">
          <div className="Row Top">
            <div className="RowItem">
              <div className="TxHash">
                <div className="Label">TX HASH</div>
                <div className="Value">{tx.hash}</div>
              </div>
            </div>

            <div className="RowItem">
              <OnlyIf test={hasReceipt}>
                <TransactionTypeBadge tx={tx} receipt={receipt} />
              </OnlyIf>
            </div>
          </div>

          <div className="SecondaryItems">
            <div className="Row">
              <div className="RowItem">
                <div className="From">
                  <div className="Label">FROM ADDRESS</div>
                  <div className="Value">{toBech32(tx.from)}</div>
                </div>
              </div>

              <div className="RowItem">
                <OnlyIf test={hasReceipt}>
                  <DestinationAddress
                    tx={tx}
                    contractName={contractName}
                    receipt={receipt}
                  />
                </OnlyIf>
              </div>

              <div className="RowItem">
                <div className="GasUsed">
                  <div className="Label">GAS USED</div>
                  <div className="Value">{receipt.gasUsed}</div>
                </div>
              </div>

              <div className="RowItem">
                <div className="Value">
                  <div className="Label">VALUE</div>
                  <div className="Value"><FormattedEtherValue value={tx.value} /></div>
                </div>
              </div>

              {/* <div className="RowItem">
                <div className="MinedOn">
                  <div className="Label">MINED ON</div>
                  <div className="Value">
                    <Moment unix format="YYYY-MM-DD HH:mm:ss">
                      {EtherUtil.bufferToInt(tx.block.header.timestamp)}
                    </Moment>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </Link>
    );
  }
}
