import { useEffect, useRef } from "react";

// Import Push UI Kit
import { usePushChainClient, usePushWalletContext } from "@pushchain/ui-kit";
import { PushChain } from "@pushchain/core";
import { createPublicClient, http } from "viem";
import { EventBus } from "../game/EventBus";

const ContractAddress = "0x5f692Ae8f4C5D216C8578bf3857C88C35F39De2B";

function Claim() {
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

    const hasClaimed = useRef(false);

    async function claimToken(amount: number) {
        const data = PushChain.utils.helpers.encodeTxData({
            abi: Abi,
            functionName: "setHighScore",
            args: [PushChain.utils.helpers.parseUnits("10", 0)],
        });
        const tx = await pushChainClient?.universal.sendTransaction({
            to: ContractAddress,
            value: BigInt("0"),
            data,
        });
        const reciept = await tx?.wait();
        return reciept;
    }

    useEffect(() => {
        EventBus.on("claim", (amount: number) => {
            if (!hasClaimed.current && pushChainClient) {
                console.log("claimed");
                hasClaimed.current = true;
                const claim = async () => {
                    const receipt = await claimToken(amount);
                    if (receipt) {
                        hasClaimed.current = false;
                        console.log(receipt);
                    }
                };
                claim();
            }
        });
    }, [pushChainClient]);

    return <div></div>;
}

export default Claim;

