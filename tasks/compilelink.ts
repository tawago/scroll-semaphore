import { task, types } from "hardhat/config";

const VerifierAddress = "0x76C994dA048f14F4153Ac550cA6f6b327fCE9180";
const PoseidonT3Address = "0x5A7242de32803bC5329Ca287167eE726E53b219A"


function linkBytecode(bytecode, linkReferences, libraries) {
  for (const [fileName, fileReferences] of Object.entries(
    linkReferences
  )) {
    console.log('fileReferences', fileReferences)
    for (const [libName, fixups] of Object.entries(fileReferences)) {
      const addr = libraries[libName];
      console.log(libName, 'addr', addr)
      if (addr === undefined) {
        continue;
      }

      for (const fixup of fixups) {
        bytecode =
          bytecode.substr(0, 2 + fixup.start * 2) +
          addr.substr(2) +
          bytecode.substr(2 + (fixup.start + fixup.length) * 2);
      }
    }
  }
  
  return bytecode;
}

task("compilelink", "Compiles the contracts and links libraries")
  .addOptionalParam<string>("poseidon", "Poseidon library address", undefined, types.string)
  .setAction(async ({ poseidon: poseidonT3Address }, { ethers, run, hardhatArguments, config, artifacts }) => {
    const [deployer] = await ethers.getSigners();

    // Step 1: Deploy the PoseidonT3 library if address not provided
    if (!PoseidonT3Address || !poseidonT3Address) {
      console.log("Deploying PoseidonT3 library...");
      const PoseidonT3Factory = await ethers.getContractFactory("PoseidonT3");
      const poseidonT3 = await PoseidonT3Factory.deploy();
      await poseidonT3.deployed();
      poseidonT3Address = poseidonT3.address;
      console.log(`PoseidonT3 library deployed at: ${poseidonT3Address}`);
    } else {
      console.log(`Using provided PoseidonT3 library address: ${poseidonT3Address}`);
    }

    // Step 2: Compile the contracts
    console.log("Compiling contracts...");
    await run("compile", { force: true });
    console.log("Contracts compiled successfully.");

    // Step 3: Link the libraries to the compiled bytecode
    console.log("Linking libraries...");
    const artifact = await artifacts.readArtifact("TestSemaphore");
    const libraries = {
      "PoseidonT3": PoseidonT3Address,
    };

    // Link the constructor bytecode
    const linkedBytecode = linkBytecode(artifact.bytecode, artifact.linkReferences, libraries);

    // Link the deployed bytecode
    const linkedDeployedBytecode = linkBytecode(
      artifact.deployedBytecode,
      artifact.deployedLinkReferences,
      libraries
    );

    // Optionally, you can write back the linked bytecode to the artifact for future use
    artifact.bytecode = linkedBytecode;
    artifact.deployedBytecode = linkedDeployedBytecode;

    // Save the updated artifact
    const fs = require("fs");
    const path = require("path");
    const artifactPath = artifacts.readArtifactSync("TestSemaphore").sourceName;
    const artifactFullPath = path.join(
      config.paths.artifacts,
      artifactPath,
      "TestSemaphore.json"
    );
    console.log(`Updating artifact at: ${artifactFullPath}`);
    fs.writeFileSync(artifactFullPath, JSON.stringify(artifact, null, 2));

    console.log("Libraries linked and artifacts updated.");
  });