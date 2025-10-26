export const ContractAddress = "0xd5207d84AddA8c375D530f5c0A1475A60eCee9c7";

export const Abi = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "claim",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
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

