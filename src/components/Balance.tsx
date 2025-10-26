import { useEffect, useRef } from "react";

// Import Push UI Kit
import { usePushChainClient, usePushWalletContext } from "@pushchain/ui-kit";
import { PushChain } from "@pushchain/core";
import { createPublicClient, http } from "viem";

const ContractAddress = "0x5f692Ae8f4C5D216C8578bf3857C88C35F39De2B";

function Balance() {
    const Abi = [
        {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "player",
                    type: "address",
                },
            ],
            name: "getHighScore",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "score",
                    type: "uint256",
                },
            ],
            name: "setHighScore",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
    ];

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

