import { useEffect, useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
// Import Push UI Kit
import {
    PushUI,
    PushUniversalAccountButton,
    PushUniversalWalletProvider,
    usePushChainClient,
    usePushWalletContext,
} from "@pushchain/ui-kit";
import { PushChain } from "@pushchain/core";
import Balance from "./components/Balance";
import { EventBus } from "./game/EventBus";
import Claim from "./components/Claim";

const ContractAddress = "0x5f692Ae8f4C5D216C8578bf3857C88C35F39De2B";

function App() {
    const walletConfig = {
        network: PushUI.CONSTANTS.PUSH_NETWORK.TESTNET,
    };

    // create wallet config to pass to Provider

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div id="app">
            <PushUniversalWalletProvider config={walletConfig}>
                <div className="pushBtn">
                    <PushUniversalAccountButton />
                </div>
                <Balance />
                <Claim />
            </PushUniversalWalletProvider>
            <PhaserGame ref={phaserRef} />
        </div>
    );
}

export default App;

