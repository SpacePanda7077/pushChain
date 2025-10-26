PushChain — Vampire Survivor + Web3 (Hackathon Entry)

Tagline: Survive longer, craft on-chain tools, and climb the on-chain leaderboard.
Repo: SpacePanda7077/pushChain (Phaser + React + Vite template).
GitHub

Project Summary

PushChain is a browser game inspired by Vampire Survivors, reimagined as a Web3 survival shooter on Push Chain. Players collect in-game tokens while surviving waves, use tokens to craft on-chain consumables (grenades, stims, boosters), and can trade crafted items. A persistent on-chain leaderboard tracks top survivors. The frontend is built with Phaser (game) + React (UI) and Vite.

Why it’s hackathon-ready:

Combines addictive arcade gameplay with tangible on-chain assets.

Demonstrates an end-to-end Web3 UX: play → earn tokens → craft on-chain → trade / leaderboard.

Small, demonstrable vertical for judges: play demo, show token flow, show leaderboard.

Demo / Screenshot

(Replace with a short GIF of gameplay if you have one.)

Key Features

Fast arcade survival gameplay (Phaser).

Token collection while playing (in-game currency).

Crafting system that mints/upgrades items on-chain (grenades, stims, etc).

On-chain leaderboard: survival time / score recorded immutably.

Marketplace: players can list/sell crafted items (player economy).

React UI for menus, inventory, and leaderboard.

Tech Stack

Frontend: React + Phaser 3 + TypeScript + Vite.
GitHub

Chain: Push Chain (smart contracts for tokens, items, leaderboard).

Wallet: Web3 provider for the user wallet (e.g., MetaMask or Push Chain compatible wallet).

Optional: IPFS for item metadata, TheGraph-style indexing or lightweight offchain indexer for richer leaderboards.

Architecture (high level)

Client (React + Phaser) — gameplay, input, local token accounting, UI.

Onchain Contracts — ERC-20 style token (game currency) + ERC-1155 / ERC-721 or custom item contract for crafted items + Leaderboard contract (records top scores/addresses).

Backend / Indexer (optional) — optional offchain indexer for efficient leaderboard queries and marketplace search.

Wallet & Sign — players sign mint/craft/submit transactions from the client.

What’s included in this repo

This repo currently contains the Phaser + React frontend template (game code, UI, assets, scripts). See the project structure in the repo for the entry points and scene structure.
GitHub

Note: If your smart contracts live in a different repo or aren’t added yet, explicitly link them from here (recommended). If you do not have on-chain contracts here yet, the README below includes example smart contract interfaces and sample scripts you can add.

Quickstart (Local dev)

# clone

git clone https://github.com/SpacePanda7077/pushChain.git
cd pushChain

# install

npm install

# run dev server

npm run dev

# build for production

npm run build

Default dev server: http://localhost:8080 (or the port Vite chooses).

Environment / Config

Create a .env (or .env.local) and set typical variables:

VITE_RPC_URL=https://rpc.pushchain.example # Push Chain RPC
VITE_CONTRACT_ADDRESS_ITEM=0x... # deployed item contract
VITE_CONTRACT_ADDRESS_TOKEN=0x... # deployed token contract
VITE_CONTRACT_ADDRESS_LEADERBOARD=0x...

The game will check for a connected wallet and call contract functions for craft/mint/leaderboard.

On-chain Contracts — suggested interfaces

You can implement contracts in Solidity (or Push Chain supported language). Here are compact interfaces to include in your repo or link to a contracts folder:

GameToken (ERC-20-like)

mint(address to, uint256 amount) — (owner/minter role) or mint via gameplay bridge.

transfer/approve standard ERC-20.

Item (ERC-1155 or ERC-721)

craftItem(address player, uint256 itemId, bytes data) — mints item when player crafts.

listItem(uint256 itemId, uint256 price) — optional marketplace hooks.

Leaderboard

submitScore(address player, uint256 score, uint256 timestamp) — store best score; only allow updates if new score > previous.

Implementation notes:

Keep submitScore cheap — store minimal data onchain (address, score, timestamp). Do verification client-side (server/indexer can validate legitimacy if needed).

For hackathon demo, you can accept signed client submissions or restrict to owner/testers to avoid spam.

Local Demo Mode (no chain)

For a quick hackathon demo without deploying contracts, include a local mock mode:

VITE_MOCK_CHAIN=true

Mock API endpoints simulate mint/craft/leaderboard calls locally (in memory).
This lets judges play the full UX without requiring wallet setup.

How gameplay → chain flow works (example)

Player picks up tokens while playing (client increments ephemeral token count).

When player crafts, the client calls the craftItem contract (wallet prompt → on-chain mint).

Crafted item appears in the player's on-chain inventory (and in UI via contract events).

When the run ends, player can submit their run to the Leaderboard contract (transaction or signed message).

Marketplace allows listing minted items for sale (on-chain or via simple offchain orderbook signed messages).

Testing & Deploy

Unit test contracts with Hardhat/Foundry (recommended). Add test scripts under contracts/test.

Use local chain (Hardhat, Anvil) for dev. For Push Chain integration, use the testnet RPC and a test wallet.

Provide one-click deploy scripts (npm scripts) to compile and deploy contracts and output addresses into .env.

Hackathon Pitch (short)

Problem: Modern Web2 arcade games lack real ownership and persistent on-chain value.
Solution: PushChain combines fast arcade gameplay with meaningful on-chain assets and an immutable leaderboard — players earn tokens, craft items that truly exist onchain, and trade them. Judges can immediately try gameplay, craft an item, and watch the onchain leaderboard update (or in mock demo mode, show full UX offline).

Why it wins:

Clear, demoable vertical (play → mint → trade → leaderboard).

Player-first UX: immediate gratification + long-term ownership.

Extensible: add more item types, rarities, and tournaments.

Roadmap (post-hackathon)

Add full Push Chain smart contract suite (token, items, leaderboard).

Add marketplace with escrow and royalties.

Add tournaments & seasonal leaderboards.

Add analytics + TheGraph indexing for fast queries.

Contributing

Fork the repo.

Create a branch feature/<name>.

Implement and open a PR.

Use issues for bug reports / small feature ideas.

Credits & License

Built using Phaser + React + Vite template.
GitHub

License: MIT.

Contact / Demo

Owner: SpacePanda7077 on GitHub.

For a live demo link (if available) add it here so judges can play immediately.

Notes I left for you (quick checklist you can paste into README or use while presenting)

Add link to deployed demo or short gameplay GIF (very helpful).

Add contracts/ folder and link compiled addresses in .env.

Add mock-mode startup script for offline demos (npm run dev:mock).

Add short 1-minute pitch (video or README header) describing novelty.

If you want, I can:

Produce a short 45–60 second pitch script for judges.

Add a contracts/ folder and example Solidity interfaces and deploy scripts (Hardhat).

Generate a small GIF workflow and README badges.

Which of those should I do next? (I can just add them directly into the README/ repo content you want — tell me which bit and I’ll create the markdown/contract skeleton right here.)
