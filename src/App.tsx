import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
// Import Push UI Kit
import {
    PushUI,
    PushUniversalAccountButton,
    PushUniversalWalletProvider,
} from "@pushchain/ui-kit";

import Balance from "./components/Balance";

import Claim from "./components/Claim";

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

