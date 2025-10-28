export const ContractAddress = "0x7042E3a521000f363863E4406f6Cb1F03237Baff";
export const pinataJWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MzgwY2JkNC01MzFiLTQwMjUtODI4OC02MzZjMjNkMjNkMDQiLCJlbWFpbCI6InNwYWNlcGFuZGE3MDc3QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJiNGQyMzZkZWE4MDY3MTRlMzcwNiIsInNjb3BlZEtleVNlY3JldCI6ImY3NGEwMWJiNzM5NWMyMjU1YTlhY2JhNjZjYWViYTEzNzFhNWI1ZTRmNTYwNGQ1NzExODg0ODVhNTAzY2NmMWQiLCJleHAiOjE3OTMwNTA3NzZ9.uVwMdciZ5cTceQKx-8Gt5WiJsEjqo7yY8TvhLYTRoEM";
export const pinataSecret =
    "f74a01bb7395c2255a9acba66caeba1371a5b5e4f5604d571188485a503ccf1d";

export const pinataAPIKey = "b4d236dea806714e3706";

export const pinataGateway = "plum-total-louse-876.mypinata.cloud";
export const Abi = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_to",
                type: "address",
            },
            {
                internalType: "uint128",
                name: "_id",
                type: "uint128",
            },
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
                name: "_sender",
                type: "address",
            },
            {
                internalType: "string",
                name: "_uri",
                type: "string",
            },
            {
                internalType: "uint8",
                name: "_damage",
                type: "uint8",
            },
            {
                internalType: "uint16",
                name: "_fireRate",
                type: "uint16",
            },
            {
                internalType: "uint8",
                name: "_maxAmmo",
                type: "uint8",
            },
        ],
        name: "craft_weapon",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_sender",
                type: "address",
            },
            {
                internalType: "string",
                name: "_uri",
                type: "string",
            },
        ],
        name: "default_weapon_mint",
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
                internalType: "address",
                name: "_sender",
                type: "address",
            },
        ],
        name: "get_all_weapons",
        outputs: [
            {
                components: [
                    {
                        internalType: "string",
                        name: "uri",
                        type: "string",
                    },
                    {
                        internalType: "uint8",
                        name: "damage",
                        type: "uint8",
                    },
                    {
                        internalType: "uint16",
                        name: "fireRate",
                        type: "uint16",
                    },
                    {
                        internalType: "uint8",
                        name: "maxAmmo",
                        type: "uint8",
                    },
                    {
                        internalType: "uint64",
                        name: "id",
                        type: "uint64",
                    },
                ],
                internalType: "struct RogueWorld.weapon_stats[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_sender",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_index",
                type: "uint256",
            },
        ],
        name: "get_weapon_stat",
        outputs: [
            {
                internalType: "uint8",
                name: "",
                type: "uint8",
            },
            {
                internalType: "uint16",
                name: "",
                type: "uint16",
            },
            {
                internalType: "uint8",
                name: "",
                type: "uint8",
            },
            {
                internalType: "string",
                name: "",
                type: "string",
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

