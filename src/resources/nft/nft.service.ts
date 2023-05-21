import * as token from "../../utils/token";
const contract = require("../../../artifacts/contracts/MyNFT.sol/MyNFT.json");

const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTACT_ADDRESS;

// const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
// const web3 = createAlchemyWeb3(API_URL);
const Web3 = require("web3");
const web3 = new Web3(API_URL);
web3.eth.defaultAccount = PUBLIC_KEY;

const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

class NftService {
  public async login(id: string, password: string): Promise<string | Error> {
    try {
      if (id != "abc123") {
        throw new Error("Invalid User ID");
      }
      if (password != "password") {
        throw new Error("Invalid Password");
      } else {
        return token.createToken(id);
      }
    } catch (error) {
      throw new Error("Unable to Login User");
    }
  }

  public async getAllNfts(): Promise<Error | any> {
    try {
      const allNFTs = await nftContract.methods.getAllNFTs().call();
      return allNFTs;
    } catch (error) {
      console.error("Error retrieving all NFTs:", error);
    }
  }
  public async getNftById(id: string) {
    console.log(id);

    try {
      const tokenURI = await nftContract.methods.getNFTById(id).call();
      return tokenURI;
    } catch (error) {
      throw new Error("Nft not found or deleted!!");
      // console.error("Error retrieving NFT:", error);
    }
  }
  public async createNft(tokenURI: string): Promise<any | Error> {
    try {
      const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce

      //the transaction
      const tx = {
        from: PUBLIC_KEY,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
      };
      const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
      const hash = await new Promise((resolve, reject) => {
        web3.eth
          .sendSignedTransaction(signedTx.rawTransaction)
          .on("transactionHash", (txHash: any) => resolve(txHash))
          .on("error", (error: any) => reject(error));
      });
      return hash;
    } catch (error) {
      throw new Error("Unable to create NFT");
    }
  }
  public async updateNft(tokenId: number, newTokenURI: string) {
    try {
      const owner = PUBLIC_KEY; // Replace with the correct contract owner address

      const txCount = await web3.eth.getTransactionCount(owner);

      const txObject = await nftContract.methods.updateNFT(
        tokenId,
        newTokenURI
      );

      const gas = await txObject.estimateGas({ from: owner });

      const txParams = {
        from: owner,
        to: contractAddress,
        nonce: web3.utils.toHex(txCount),
        gas: web3.utils.toHex(gas),
        gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
        data: txObject.encodeABI(),
      };

      const signedTx = await web3.eth.accounts.signTransaction(
        txParams,
        PRIVATE_KEY
      );

      const txReceipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      // console.log(txReceipt);

      // Wait for the transaction to be mined
      const receipt = await web3.eth.getTransactionReceipt(
        txReceipt.transactionHash
      );

      return receipt.transactionHash;
    } catch (error: any) {
      throw new Error("Unable to update NFT");
    }
  }
  public async deleteNft(id: number) {
    try {
      const owner = PUBLIC_KEY; // Replace with the correct contract owner address

      // Get the current transaction count of the owner's address
      const txCount = await web3.eth.getTransactionCount(owner);

      // Create the transaction object
      const txObject = await nftContract.methods.deleteNFT(id);

      // Estimate the gas required for the transaction
      const gas = await txObject.estimateGas({ from: owner });

      // Build the transaction parameters
      const txParams = {
        from: owner,
        to: contractAddress,
        nonce: web3.utils.toHex(txCount),
        gas: web3.utils.toHex(gas),
        gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
        data: txObject.encodeABI(),
      };

      // Sign the transaction
      const signedTx = await web3.eth.accounts.signTransaction(
        txParams,
        PRIVATE_KEY
      );

      // Send the signed transaction
      const receipt = await web3.eth.getTransactionReceipt(
        signedTx.transactionHash
      );

      return receipt.transactionHash;

    } catch (error:any) {
      throw new Error(error.message);
    }
  }
}

export default NftService;
