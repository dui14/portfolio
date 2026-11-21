---
title: Getting started with SUI Network through the SUI CLI
date: 2026-11-19
summary: Install the SUI CLI, create a wallet, get test SUI and publish your first Move smart contract to testnet. Notes from the dui14/sui repo.
tags: [sui, move, web3]
cover: banner.png
---

I started learning SUI while working on my Web3 thesis and kept every command in one repo: [dui14/sui](https://github.com/dui14/sui). This post puts those commands in the order I actually use them: install the CLI, create a wallet, get test SUI, then build and publish a Move package.

## What SUI is

SUI is a Layer-1 blockchain secured by Proof of Stake. The biggest difference from Ethereum is the **object model**: everything on chain (coins, NFTs, packages) is an object with its own ID and owner. A transaction that only touches objects you own does not have to wait for the whole network to order it, so it confirms fast and costs little.

Smart contracts on SUI are written in **Move**. Move was born at Meta for the Diem project; SUI uses its own object-centric version. Resources in Move cannot be copied or silently dropped, so a whole class of familiar Solidity bugs is stopped at compile time.

## Install the SUI CLI

Pick one of three ways:

**1. `suiup` (recommended).** The official installer, which keeps several versions side by side, one per network:

```bash
curl -sSfL https://raw.githubusercontent.com/MystenLabs/suiup/main/install.sh | sh
suiup install sui@testnet
```

On Windows you can use `choco install sui`, on macOS `brew install sui`. Details in the [official install guide](https://docs.sui.io/guides/developer/getting-started/sui-install).

**2. Build from source with Cargo.** Slower, but you pick the exact network branch:

```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

Swap `testnet` for `devnet` or `mainnet` as needed.

**3. Download a release.** Open the [Releases page](https://github.com/MystenLabs/sui/releases), download the file for your OS, unpack it and add the folder to your `PATH`.

Check the install:

```bash
sui --version
```

## Wallets and addresses

The first time you run `sui client`, the CLI asks which network to connect to and creates an address for you. Everyday commands:

```bash
sui client addresses
sui client active-address
sui client switch --address <address>
```

Create more wallets with a different key scheme or phrase length:

```bash
sui client new-address ed25519
sui client new-address secp256k1
sui client new-address ed25519 word24
sui client new-address ed25519 word12 "m/44'/784'/0'/0'/0'"
```

| Option | Values | Default |
|---|---|---|
| Scheme | `ed25519`, `secp256k1`, `secp256r1` | `ed25519` |
| Phrase length | `word12`, `word15`, `word18`, `word21`, `word24` | `word12` |

> `sui keytool export --key-identity <address>` prints your **private key**. Never run it while sharing your screen, and never paste the output anywhere.

## Networks

The CLI calls each network an *env*. List them and add new ones:

```bash
sui client envs
sui client new-env --alias devnet --rpc https://fullnode.devnet.sui.io:443
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client new-env --alias mainnet --rpc https://fullnode.mainnet.sui.io:443
sui client switch --env testnet
```

Double-check that each alias matches its URL. An alias called `testnet` that points at the mainnet RPC makes every later transaction spend real money.

## Get test SUI

Publishing needs gas, so first grab some free SUI on a test network:

```bash
sui client faucet
```

On devnet this sends coins straight to your wallet. On testnet the faucet has moved to the web: the CLI prints a link to [faucet.sui.io](https://faucet.sui.io), where you paste your address. Then check your balance and objects:

```bash
sui client balance
sui client objects
```

## Build and publish a Move package

Create a sample package, build it and run the tests:

```bash
sui move new hello_sui
cd hello_sui
sui move build
sui move test
```

Publish to testnet:

```bash
sui client switch --env testnet
sui client publish --gas-budget 100000000
```

Recent CLI versions estimate gas on their own; `--gas-budget` only sets a ceiling (in MIST, 1 SUI = 10<sup>9</sup> MIST). The output includes a **Package ID**: keep it, every later call into your contract needs it.

Inspect any transaction:

```bash
sui client tx-block <digest>
```

## The order I recommend

1. Install the CLI with `suiup` and run `sui --version`.
2. Run `sui client`, choose testnet, store the recovery phrase somewhere safe.
3. Get test SUI and check `sui client balance`.
4. `sui move new`, `build`, `test`, then `publish`.
5. Open the Package ID on [Suiscan](https://suiscan.xyz/testnet) to see your contract on chain.

All the original notes are still at [github.com/dui14/sui](https://github.com/dui14/sui). Next post: objects in Move, and how owned, shared and immutable objects change the way you write a contract.
