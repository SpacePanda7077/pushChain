import { useEffect, useState } from "react";
import { EventBus } from "../game/EventBus";
import useGetNfts from "./useGetNfts";
import { usePushChainClient, usePushWalletContext } from "@pushchain/ui-kit";
import { PushChain } from "@pushchain/core";
import { Abi, ContractAddress } from "../blockChain/blockChainInfo";

function MyWeapons() {
    const [isWeaponmodal, setWeaponModal] = useState(false);
    const [d_has_nft, set_d_has_nft] = useState(true);
    const [weapon_images, set_weapon_images] = useState<string[]>([]);
    const { connectionStatus, universalAccount } = usePushWalletContext();
    const { pushChainClient } = usePushChainClient();
    const { checkNft } = useGetNfts();
    const { my_weapons } = useGetNfts();
    async function get_weapon_data(uri: string) {
        const res = await fetch(uri);
        const data = await res.json();
        set_weapon_images((prevItems) => [...prevItems, data.image]);
    }
    async function mintFirstWeapon() {
        if (universalAccount && pushChainClient) {
            const uri =
                "https://plum-total-louse-876.mypinata.cloud/ipfs/bafkreiehd3l55occ3dwfhcb6bm7qbtnzwk3nvl3af7xpfxkszn5ewljb6a";
            const data = PushChain.utils.helpers.encodeTxData({
                abi: Abi,
                functionName: "craft_weapon",
                // Transfer 10 tokens, converted to 18 decimal places
                args: [
                    universalAccount.address,
                    uri,
                    BigInt(10),
                    BigInt(20),
                    BigInt(40),
                ],
            });

            const txHash = await pushChainClient.universal.sendTransaction({
                to: ContractAddress, // The smart contract address on Push Chain
                value: BigInt("0"), // No $PC being sent, just contract interaction
                data: data, // The encoded function call
            });
            const receipt = await txHash.wait();
            console.log(receipt);
            await checkNft();
        }
    }

    useEffect(() => {
        if (my_weapons && my_weapons.length > 0) {
            set_d_has_nft(false);
            my_weapons.forEach((weapon) => {
                get_weapon_data(weapon.uri);
            });
        }
    }, [my_weapons]);

    useEffect(() => {
        EventBus.on("open_weapon_modal", () => {
            setWeaponModal(true);
        });
    }, []);

    useEffect(() => {
        if (my_weapons && my_weapons.length > 0) {
            EventBus.emit("has_nft");
            console.log("have nft");
        }
        EventBus.on("check_for_nft", () => {
            if (my_weapons.length > 0) {
                console.log("starat");
                EventBus.emit("start_game");
            }
        });
    }, [my_weapons]);
    return (
        <>
            {d_has_nft && (
                <div className="mint-text">
                    <button onClick={mintFirstWeapon}>
                        Mint your fist weapon
                    </button>
                </div>
            )}

            {isWeaponmodal && (
                <div className="weapon-modal-container">
                    {my_weapons.map((weapon, index) => (
                        <div key={index}>
                            <img
                                src={weapon_images[index]}
                                alt="weapon image"
                            />
                        </div>
                    ))}

                    <button
                        // onClick={s}
                        style={{
                            backgroundColor: "green",
                            height: "40px",
                            borderColor: "white",
                            borderStyle: "solid",
                            borderRadius: "10px",
                            opacity: "0.7",
                        }}
                    >
                        Craft Weapon
                    </button>
                    <button
                        onClick={() => {
                            setWeaponModal(false);
                            EventBus.emit("open_menu");
                        }}
                        style={{
                            backgroundColor: "red",
                            height: "40px",
                            borderColor: "white",
                            borderStyle: "solid",
                            borderRadius: "10px",
                            opacity: "0.7",
                        }}
                    >
                        Close
                    </button>
                </div>
            )}
        </>
    );
}
export default MyWeapons;

