PushChain — Vampire Survivor + Web3 (Hackathon Entry)

Tagline: Survive longer, craft on-chain tools, and climb the on-chain leaderboard.
Repo: SpacePanda7077/pushChain (Phaser + React + Vite template).
GitHub

Project Summary

PushChain is a browser game inspired by Vampire Survivors, reimagined as a Web3 survival shooter on Push Chain. Players collect in-game tokens while surviving waves, use tokens to craft on-chain consumables (grenades, stims, boosters), and can trade crafted items. A persistent on-chain leaderboard tracks top survivors. The frontend is built with Phaser (game) + React (UI) and Vite.

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

Hackathon Pitch (short)

Problem: Modern Web2 arcade games lack real ownership and persistent on-chain value.
Solution: PushChain combines fast arcade gameplay with meaningful on-chain assets and an immutable leaderboard — players earn tokens, craft items that truly exist onchain, and trade them. Judges can immediately try gameplay, craft an item, and watch the onchain leaderboard update (or in mock demo mode, show full UX offline).
