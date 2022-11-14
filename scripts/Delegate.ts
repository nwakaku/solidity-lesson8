import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();


async function main() {
    const provider = ethers.getDefaultProvider("goerli");
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    console.log(`Connected to the account of the address ${signer.address}`);
    console.log(`The balance of this account is ${balanceBN.toString()} Wei`);

    const args = process.argv;
    const params = args.slice(2);
    const contractAddress = params[0];
    const delegate = params[1]

    if (params.length <= 0) throw new Error("Not enough parameters")
    console.log("Deploying Ballot contract");
    console.log("params: ");

    let ballotContract: Ballot;
    const ballotFactory = new Ballot__factory(signer);
    ballotContract = ballotFactory.attach(contractAddress)
    const tx = await ballotContract.delegate(delegate);
    const receipt = await tx.wait()
    console.log({ receipt });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
