import { useEffect, useRef } from "react";

// Import Push UI Kit
import { usePushChainClient, usePushWalletContext } from "@pushchain/ui-kit";
import { PushChain } from "@pushchain/core";
import { createPublicClient, http } from "viem";
import { ContractAddress, Abi } from "../blockChain/blockChainInfo";

function Balance() {
    // create wallet config to pass to Provider
    const { universalAccount } = usePushWalletContext();

    // const { connectWallet, disconnectWallet, walletAddress } =
    //     usePushWalletContext();
    const { pushChainClient } = usePushChainClient();

    useEffect(() => {
        if (universalAccount && pushChainClient) {
            const viemClient = createPublicClient({
                transport: http(
                    "https://evm.rpc-testnet-donut-node1.push.org/"
                ),
            });

            console.log();
            const getBal = async () => {
                const acc = await pushChainClient.universal.account;
                const bal = await viemClient.readContract({
                    abi: Abi,
                    functionName: "getHighScore",
                    address: ContractAddress,
                    args: [acc],
                });
                console.log(bal, acc);
            };
            getBal();
        }
    }, [universalAccount, pushChainClient]);

    return <div></div>;
}

export default Balance;

