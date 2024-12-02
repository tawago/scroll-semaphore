# Proof of Membership Using Semaphore on Scroll

Welcome to the `scroll-semaphore` repository! This project demonstrates how to use Semaphore on the Scroll network to prove membership in a group without revealing your identity. You'll learn how to deploy key contracts, interact with them, and connect a frontend app to create a privacy-preserving voting system.

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [1. Bridge Scroll Sepolia ETH](#1-bridge-scroll-sepolia-eth)
  - [2. Use MultiBaas by Curvegrid](#2-use-multibaas-by-curvegrid)
- [Deploying Key Contracts](#deploying-key-contracts)
  - [1. Deploy Semaphore Contracts](#1-deploy-semaphore-contracts)
  - [2. Deploy the `SimpleVoting` Contract](#2-deploy-the-simplevoting-contract)
- [Running the Frontend App](#running-the-frontend-app)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Configure Environment Variables](#2-configure-environment-variables)
  - [3. Install Dependencies](#3-install-dependencies)
  - [4. Start the Development Server](#4-start-the-development-server)
- [Interacting with the App](#interacting-with-the-app)
  - [1. Create Semaphore Identity](#1-create-semaphore-identity)
  - [2. Join the Group](#2-join-the-group)
  - [3. Cast a Vote](#3-cast-a-vote)
- [Understanding the Code](#understanding-the-code)
  - [1. Generating Semaphore Proof](#1-generating-semaphore-proof)
  - [2. Fetching Commitments](#2-fetching-commitments)
- [Conclusion](#conclusion)
- [Resources](#resources)

## Introduction

In the rapidly evolving landscape of blockchain technology, privacy and scalability remain two critical challenges. **Semaphore** is a zero-knowledge protocol that enables users to prove membership in a group without revealing their identity. **Scroll** is a zkEVM-based zkRollup on Ethereum that enhances scalability without compromising security or decentralization.

Combining Semaphore with Scroll opens up new possibilities for building scalable and privacy-preserving applications on Ethereum. This project demonstrates how to integrate Semaphore with Scroll to create a system where users can authenticate and interact anonymously.

## Prerequisites

- Node.js and npm installed
- Metamask or another Ethereum-compatible wallet
- Basic knowledge of Solidity and smart contract deployment
- Access to the Scroll Sepolia Testnet

## Setup

### 1. Bridge Scroll Sepolia ETH

First, get Scroll Sepolia ETH by bridging your Ethereum Sepolia ETH:

- Visit the [Scroll Sepolia Bridge](https://sepolia.scroll.io/bridge).
- Bridge your Ethereum Sepolia ETH to Scroll Sepolia ETH.
- The process may take up to 20 minutes (typically around 12 minutes).

### 2. Use MultiBaas by Curvegrid

For deployment and RPC node-related tasks, we'll use [MultiBaas by Curvegrid](https://console.curvegrid.com/):

- Sign up for a free account.
- Create up to two deployments on Scroll Mainnet and Testnet (or other EVM chains).

## Deploying Key Contracts

### 1. Deploy Semaphore Contracts

Semaphore requires three key contracts:

- `Semaphore`
- `SemaphoreVerifier`
- `PoseidonT3`

At the time of writing, these contracts might not be available on the Scroll Testnet. You may need to deploy them manually.

#### Deployed Addresses (Temporary)

- `SemaphoreVerifier`: `0x76C994dA048f14F4153Ac550cA6f6b327fCE9180`
- `PoseidonT3`: `0x5A7242de32803bC5329Ca287167eE726E53b219A`
- `Semaphore`: `0x0303e10025D7578aC8e4fcCD0249622ac1D17B82`

#### Steps to Deploy `Semaphore` Contract

1. **Access Deployment Dashboard**:

   - Log in to your MultiBaas dashboard.
   - Navigate to your deployment.

2. **Deploy Contract**:

   - Go to `Contracts` > `On-Chain`.
   - Click the `+` (plus) button.
   - Choose `Deploy Contract`.
   - Select `Contract from Compilation Artifact`.
   - Upload `artifacts/contracts/TestSemaphore.json` from this repository.
   - Label the contract (e.g., `semaphore`) and assign a version number.
   - Ensure `Sync Events` is checked.
   - Set the `_verifier` constructor argument to the `SemaphoreVerifier` address (`0x76C994...`).
   - Click `Deploy`.
   - Confirm the transaction in Metamask when prompted.

3. **Alternative Method**:

   - Instead of uploading the contract artifact, you can fetch the contract's bytecode and ABI if the contract is verified.
   - Use the official `Semaphore` contract address to link it in MultiBaas.

### 2. Deploy the `SimpleVoting` Contract

We'll deploy the `SimpleVoting` contract, which integrates with Semaphore.

#### Steps:

1. **Prepare Constructor Arguments**:

   - `_numChoices`: `4`
   - `semaphoreAddress`: Address of your deployed `Semaphore` contract (e.g., `0x0303e1...`).
   - `_secretCodeHash`: Keccak256 hash of the secret code `"GM!"` (`0xc87a2838ff5cbcb7515eef22d409b3271b26f101f3b1a51873086460417c4454`).

2. **Deploy Contract**:

   - Use MultiBaas to deploy the `SimpleVoting` contract with the above arguments.
   - Ensure `Sync Events` is checked.
   - Confirm the transaction in Metamask.

3. **Obtain API Key and Configure CORS**:

   - Navigate to `Admin` > `API Keys`.
   - Click `+ New Key`.
   - Label the key and select `DApp User`, then click `Create`.
   - Go to `Admin` > `CORS Origins`.
   - Click `+ Add Origin`.
   - Input `http://localhost:3000` for local development.

## Running the Frontend App

### 1. Clone the Repository

```bash
git clone https://github.com/tawago/scroll-semaphore.git
```

### 2. Configure Environment Variables

```bash
cd scroll-semaphore/frontend
cp .env.template .env.development
```

- Open `.env.development` and update the following variables:

  - `NEXT_PUBLIC_API_KEY`: Your MultiBaas API key.
  - `NEXT_PUBLIC_DEPLOYMENT_URL`: Your MultiBaas deployment URL.

### 3. Install Dependencies

```bash
yarn install
```

### 4. Start the Development Server

```bash
yarn dev
```

- Open [http://localhost:3000](http://localhost:3000) in your browser.

## Interacting with the App

### 1. Create Semaphore Identity

- Click the `Create` button to generate your Semaphore Identity.
- This creates a unique identity commitment stored locally.

### 2. Join the Group

- Ensure your wallet (e.g., Metamask) is connected to the Scroll Sepolia network.
- Enter the secret code `GM!` in the text field.
- Click `Join` and confirm the transaction in your wallet.

### 3. Cast a Vote

- Once you're a group member, you can cast a vote anonymously.
- Select an option and click `Vote`.
- The app generates a Semaphore proof to verify your membership without revealing your identity.

## Understanding the Code

### 1. Generating Semaphore Proof

To generate a Semaphore proof, you need:

- Your identity.
- The Merkle tree proof of your commitment.
- A message (can be empty).
- A scope (used to prevent double-signaling).

#### Code Snippet: Generating Merkle Proof

```typescript
import { poseidon2 } from "poseidon-lite";
import { LeanIMT } from "@zk-kit/lean-imt";

export async function generateMerkleProof(
  commitmentsArray: bigint[],
  index: number
) {
  const hash = (a, b) => poseidon2([a, b]);

  // Initialize the Merkle tree
  const tree = new LeanIMT<bigint>(hash);

  // Insert the commitments into the tree
  for (const commitment of commitmentsArray) {
    tree.insert(commitment);
  }

  // Generate the proof for the leaf at the given index
  const proof = tree.generateProof(index);

  // The proof object already has the structure we need
  const merkleProof = {
    root: proof.root,
    leaf: proof.leaf,
    index: proof.index,
    siblings: proof.siblings,
  };

  return merkleProof;
}
```

### 2. Fetching Commitments

You need all group commitments to generate the Merkle proof. There are two methods:

#### Method 1: Using List Events Endpoint

```typescript
const getCommitmentsFromMemberAddedEvents = async (): Promise<Array<bigint> | null> => {
  try {
    const eventSignature = "MemberAdded(uint256,uint256,uint256,uint256)";
    const response = await eventsApi.listEvents(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      false,
      chain,
      semaphoreAddressLabel,
      semaphoreContractLabel,
      eventSignature,
      50
    );
    const events: Event[] = response.data.result.filter(
      (event) => event.transaction.contract.addressLabel === votingAddressLabel
    );
    const commitments = events
      .sort(
        (a, b) =>
          new Date(a.triggeredAt).getTime() - new Date(b.triggeredAt).getTime()
      )
      .map((item) => item.event.inputs[2].value);
    return commitments;
  } catch (err) {
    console.error("Error getting member added events:", err);
    return null;
  }
};
```

#### Method 2: Using Execute Query Endpoint

- Set up an event query in MultiBaas UI:

  1. Go to `Blockchain` > `Event Queries`.
  2. Click the `+` button to create a new query.
  3. Name the query `commitments`.
  4. Add the event `MemberAdded(uint256,uint256,uint256,uint256)`.
  5. Add event fields: `groupId`, `identityCommitment`, `triggered_at`.
  6. Add a filter where `groupId` equals your group's ID.
  7. Save the query.

- Fetch commitments using the query:

```typescript
const queryLabel = "commitments";
const response = await eventQueriesApi.executeEventQuery(queryLabel);
const commitments = response.data.result.rows.map(
  (row: any) => row.identitycommitment
);
return commitments;
```

#### Casting a Vote with the Proof

```typescript
const castVote = useCallback(async (choice: string): Promise<SendTransactionParameters> => {
  if (!identity) throw Error("No identity");
  const scope = groupId;

  // Fetch commitments using one of the methods
  const commitments = await _getCommitmentsFromQuery();

  if (!commitments?.length) throw Error("No members in this group");

  const index = await callContractFunction(
    "indexOf",
    [groupId, identity?.commitment.toString()],
    true
  );
  const merkleProof = await generateMerkleProof(commitments, Number(index));

  const proof = await generateSemaphoreProof(identity, merkleProof, choice, scope);

  console.log("generateSemaphoreProof", proof);

  return await callContractFunction("vote", [
    proof.merkleTreeDepth,
    proof.merkleTreeRoot,
    proof.nullifier,
    proof.message,
    proof.points,
  ]);
}, [callContractFunction, groupId, identity]);
```

## Conclusion

Interacting with the Semaphore contract and creating a smart contract for a membership application is intuitive. The main challenge may be deploying the key contracts if they're not available on your target network.

Future enhancements could include:

- Implementing the secret code in a zero-knowledge proof manner.
- Adding features to open new ballots with unique scopes.
- Using MACI to create a more robust anonymous voting system.
- Adding delegation mechanisms.

## Resources

- **Getting Started with Semaphore**: [Semaphore Documentation](https://docs.semaphore.pse.dev/getting-started)
- **Semaphore Repository**: [Semaphore GitHub](https://github.com/semaphore-protocol/semaphore)
- **Official Boilerplate**: [Semaphore Boilerplate](https://github.com/semaphore-protocol/boilerplate)
- **Sample Voting App Repository**: [scroll-semaphore GitHub](https://github.com/tawago/scroll-semaphore)
- **The Graph Endpoint for Scroll Semaphore**: [GraphQL API](https://api.studio.thegraph.com/query/14377/semaphore-sepolia/v4.1.0/graphql)
- **Scroll Sepolia Bridge**: [Scroll Bridge](https://sepolia.scroll.io/bridge)
- **Curvegrid Console**: [MultiBaas Console](https://console.curvegrid.com/)
