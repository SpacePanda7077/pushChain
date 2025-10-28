import { useEffect, useState } from "react";
import { PinataSDK, uploadJson } from "pinata";
import { pinataJWT, pinataGateway } from "../blockChain/blockChainInfo";
import { ContractAddress, Abi } from "../blockChain/blockChainInfo";
import { PushChain } from "@pushchain/core";
import { usePushChainClient, usePushWalletContext } from "@pushchain/ui-kit";
import { EventBus } from "../game/EventBus";
import { fromHex, toHex } from "viem";
import useGetNfts from "./useGetNfts";

function CraftWeapon() {
    const [isCraftmodal, setCraftModal] = useState(false);
    const { pushChainClient } = usePushChainClient();
    const { universalAccount } = usePushWalletContext();
    const { checkNft } = useGetNfts();
    const pinata = new PinataSDK({
        pinataJwt: pinataJWT,
        pinataGateway: pinataGateway,
    });
    const [weaponName, setWeaponName] = useState("");
    const [values, setValues] = useState([33, 33, 34]); // initial values
    const [sliderNames, setSlidernames] = useState([
        "damage",
        "fire rate",
        "max ammo",
    ]);
    const [file, setFile] = useState<File | null>(null);
    const handleChange = (index: number, newValue: number) => {
        let newValues = [...values];
        const totalOther = values.reduce(
            (sum, v, i) => (i === index ? sum : sum + v),
            0
        );
        const maxAllowed = 100 - totalOther;

        // Cap this slider so the total never exceeds 100
        newValues[index] = Math.min(newValue, maxAllowed);
        setValues(newValues);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            console.log(file);
        }
    };
    console.log();
    async function handleSubmit() {
        console.log(file);
        try {
            if (file && weaponName && pushChainClient && universalAccount) {
                if (!file.type.startsWith("image/")) return;
                const img = new Image();
                img.onload = async () => {
                    if (img.width < 64 && img.height < 64) {
                        alert("✅ Image is valid (32x32)");
                        const upload = await pinata.upload.public.file(file);
                        console.log(upload);
                        const jsonData = {
                            name: weaponName,
                            description: "A gun for Rogue city",
                            image:
                                "https://" +
                                pinataGateway +
                                "/ipfs/" +
                                upload.cid,
                            attributes: {
                                damage: (values[0] / 100) * 50,
                                fireRate: ((100 - values[1]) / 100) * 500,
                                maxAmmo: (values[2] / 100) * 60,
                            },
                        };
                        const uploadMetaData = await pinata.upload.public.json(
                            jsonData
                        );
                        console.log(uploadMetaData);
                        const uri =
                            "https://" +
                            pinataGateway +
                            "/ipfs/" +
                            uploadMetaData.cid;
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

                        const txHash =
                            await pushChainClient.universal.sendTransaction({
                                to: ContractAddress, // The smart contract address on Push Chain
                                value: BigInt("0"), // No $PC being sent, just contract interaction
                                data: data, // The encoded function call
                            });
                        const receipt = await txHash.wait();
                        console.log(receipt);
                        await checkNft();
                    } else {
                        alert("invalid file size must be < 64 X 64");
                    }
                    URL.revokeObjectURL(img.src); // clean up memory
                };

                img.onerror = () => {
                    alert("error while uploading file");
                };
                img.src = URL.createObjectURL(file);
            }
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        EventBus.on("open_craft_modal", () => {
            setCraftModal(true);
        });
    }, []);

    return (
        <>
            {isCraftmodal && (
                <>
                    <div className="craftWeapon-container">
                        <input
                            type="text"
                            placeholder="Weapon Name"
                            onChange={(e) => {
                                setWeaponName(e.target.value);
                            }}
                        />
                        <div>
                            {values.map((value, i) => (
                                <div key={i} style={{ margin: "20px 0" }}>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={value}
                                        onChange={(e) =>
                                            handleChange(
                                                i,
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                    <p>
                                        {sliderNames[i]}: {value} %
                                    </p>
                                </div>
                            ))}
                        </div>

                        <input type="file" onChange={handleFileChange} />
                        <button
                            onClick={handleSubmit}
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
                                setCraftModal(false);
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
                </>
            )}
        </>
    );
}
export default CraftWeapon;

