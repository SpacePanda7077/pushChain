import { useEffect, useState } from "react";
import { EventBus } from "../game/EventBus";
import useGetNfts from "./useGetNfts";
import { usePushWalletContext } from "@pushchain/ui-kit";

function MyWeapons() {
    const [isWeaponmodal, setWeaponModal] = useState(false);
    const [d_has_nft, set_d_has_nft] = useState(true);
    const [weapon_images, set_weapon_images] = useState<string[]>([]);
    const { connectionStatus } = usePushWalletContext();
    const { my_weapons } = useGetNfts();
    async function get_weapon_data(uri: string) {
        const res = await fetch(uri);
        const data = await res.json();
        set_weapon_images((prevItems) => [...prevItems, data.image]);
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
        EventBus.on("check_for_nft", () => {
            if (my_weapons.length > 0) {
                EventBus.emit("start_game");
            }
        });
    }, []);
    useEffect(() => {
        if (my_weapons && my_weapons.length > 0) {
            EventBus.emit("has_nft");
            console.log("have nft");
        }
    }, [my_weapons]);
    return (
        <>
            {d_has_nft && (
                <div className="mint-text">
                    <h1>Mint your fist weapon</h1>
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

