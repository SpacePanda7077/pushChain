import { createPublicClient, http } from "viem";
import { Abi, ContractAddress } from "../blockChain/blockChainInfo";
import { useEffect, useState } from "react";
import { usePushWalletContext } from "@pushchain/ui-kit";
import { EventBus } from "../game/EventBus";

function useGetNfts() {
    const { universalAccount, connectionStatus } = usePushWalletContext();
    const [my_weapons, set_my_weapons] = useState<
        {
            uri: string;
            damage: number;
            fireRate: number;
            maxAmmo: number;
            id: number;
        }[]
    >([]);

    const viemClient = createPublicClient({
        transport: http("https://evm.rpc-testnet-donut-node1.push.org/"),
    });

    async function checkNft() {
        const weapons = await viemClient.readContract({
            abi: Abi,
            functionName: "get_all_weapons",
            address: ContractAddress,
            args: [universalAccount?.address],
        });
        set_my_weapons(
            weapons as {
                uri: string;
                damage: number;
                fireRate: number;
                maxAmmo: number;
                id: number;
            }[]
        );
    }

    useEffect(() => {
        if (universalAccount && connectionStatus === "connected") {
            const check = async () => {
                await checkNft();
            };
            check();
        }
    }, [universalAccount]);

    return { my_weapons, checkNft };
}
export default useGetNfts;

