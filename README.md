
# NFT_Backend

## API Reference

#### Register User

```http
  POST /nfts/login
```

| Body  | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. |
| `password` | `string` | **Required**. |

- **For Testing** 
- id = abc123
- password = password

- All Routes are Protected (Must Provide Bearer Token)

#### Get AllNfts (Protected)

```http
  GET /nfts/
```

- Response - List Of ALL Token IDs

#### Get NftByID (Protected)

```http
  GET /nfts/:id
```
- Response - TokenURI of nft with tokenID [id]
#### Create NFT (Protected)

```http
  POST /nfts
```
| Body  | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `tokenURI` | `string` | **Required**. |

- example - "tokenURI":"https://gateway.pinata.cloud/ipfs/QmX3VGYeCgTwwErVBtwGBLxGWDo5DCv1W3V4R2T6j6ftuD"

- Response - returns the TransactionHash 
- Can Verify the response transactionHash on https://sepolia.etherscan.io/

#### Update NFT (Protected)
```http
  PUT /nfts/:id
```
| Body  | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `tokenURI` | `string` | **Required**. |

- example - "tokenURI":"https://gateway.pinata.cloud/ipfs/QmSk5UmCJJoTnps6DyewPbukDaLVCmt1JYgb5MB4mhmsDy"
- Can Verify the response transactionHash on https://sepolia.etherscan.io/

- Response - returns the TransactionHash 
#### DELETE NFT (Protected)
```http
  DELETE /nfts/:id
```
- Response - returns the TransactionHash 
- Can Verify the response transactionHash on https://sepolia.etherscan.io/


## NOTE
- NFT metadata is stored on cloud platform pinata
- Update the nft-metadata.json and upload it on pinata Cloud and provide the URI (like in example) for **Creating and Updating NFT**.
### nft-metadata.json
```json
{
  "attributes": [
    {
      "color": "Blue",
      "value": "ABC"
    }
  ],
  "description": "This is a new testing URI.",
  "image": "https://gateway.pinata.cloud/ipfs/QmX73xZm5rDgK7G4ZdnKLhjYL6kxATVAV5fGT2NkyhtMrw",
  "name": "Image"
}

```
