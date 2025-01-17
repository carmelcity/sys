import "@nomicfoundation/hardhat-ignition";
import hre from 'hardhat'
import { expect } from "chai";
import { parseEther, formatEther } from 'ethers'
import CarmelRegistry from '../ignition/modules/CarmelRegistryProxyModule'
import CarmelVerifier from '../ignition/modules/CarmelVerifierProxyModule'
import CarmelCollection from '../ignition/modules/CarmelCollectionProxyModule'
import { b32enc, makeDigestSignature, makeKey, b32ienc, b32idec, hashToBytes32 } from '../src/utils'

const USERNAME = "user"
const GROUP = "users"
const ADDRESS = "0xc0ffee254729296a45a3885639AC7E10F9d54979"

const clientDataJSONBase64 = 'eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiNGtOSkNLT3V1ZExQUVR1Y1B6UHJJNHFwWTVuekdzMklNMjZHTTZid2IzSzMwU3Z3WkxPb3dpR080cVk0a3BxNVlJZEVZQ1hzTFFVSjY5RmVyNjNNLTNUYUxGd1RrWHFaRURYWlhNM0hadFRnRUZGWFdqdFA0SEZHN05uN3paZHdZZ2labV9POHJ4emQ4R1ZORVQtVkZfbjlKazBTVkJYV1FSVlJ0RnJqVmFvIiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ'      
const authenticatorDataBase64 = 'SZYN5YgOjGh0NBcPZHZgW4/krrmihjLHmVzzuoMdl2MdAAAAAA=='
const r = '0xa64e349d969d596edc2137ffa9314e353638182df082df92adf27afcf1db5ff6'
const s = '0xedb5f2a3ec4950cf545815f4cedd04f992290ca529d056241e2aee42c7aa3429'
const s2 = '0xedb5f2a3ec4950cf545815f4cedd04f992290ca529d056241e2aee42c7aa3420'
const publicKeyBase64 = ['3cjXLJigSRcmgyCIQtTiaTIWfnmwsRLua8RcR0H5iHQ', 'oUKIrUiayLUvEM8sQZPC5jGRiNIVsCkyQDonb0pbMAo']
const HASH1 = "bafkreiamyeqz7wcdjoi6pf4w5346nqb7hi474l2t54k77fllnw2hfheyli"
const HASH2 = "bafkreih7mqaitsxaeby2g5nps3gktsqc7tiej4i4446s4yfwkthbzhigxa"

const xy = makeKey(publicKeyBase64)
const { digest, signature } = makeDigestSignature(authenticatorDataBase64, clientDataJSONBase64, r, s)
const fingerprint = [0, b32enc(USERNAME), digest, signature]
const { signature: signature2 } = makeDigestSignature(authenticatorDataBase64, clientDataJSONBase64, r, s2)
const fingerprintError = [0, b32enc(USERNAME), digest, signature2]

const COLLECTION_ID = "testcollection"
const COLLECTION_NAME = "The Test Collection"
const COLLECTION_SYMBOL = "CarmelTestCol"
const COLLECTION_SUPPLY = 1000
const COLLECTION_PRICE = parseEther("0.1")
const COLLECTION_PRICE2 = parseEther("0.02")
const COLLECTION_BATCH = 5

describe("CarmelCollection", function () {
  let collection: any
  let signers: any 
  let registry: any

  beforeEach(async function () {
    signers = await hre.ethers.getSigners();

    const verifier = await hre.ignition.deploy(CarmelVerifier);
    const verifierAddress = await verifier.contract.getAddress()

    registry = await hre.ignition.deploy(CarmelRegistry, {
        parameters: {
          CarmelRegistryProxyModule: {
            verifierAddress
          }
        }
    })

    const registryAddress = await registry.contract.getAddress()

    collection = await hre.ignition.deploy(CarmelCollection,{
      parameters: {
        CarmelCollectionProxyModule: {
            username: b32enc(USERNAME),
            registryAddress,
            tokenAddress: registryAddress,
            collectionId: b32enc(COLLECTION_ID),
            defaultHash0: hashToBytes32(HASH1)[0],
            defaultHash1: hashToBytes32(HASH1)[1],
            name: COLLECTION_NAME,
            symbol: COLLECTION_SYMBOL,
            supply: b32ienc(COLLECTION_SUPPLY),
            price: b32ienc(COLLECTION_PRICE),
            batch: b32ienc(COLLECTION_BATCH)
        }
      }
    })
  })

  describe("Administration", () => {
    it("should be able to edit the max supply", async function () {
        await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])

        let maxSupply = await collection.contract.getConfig(b32enc("maxSupply"))
        expect(b32ienc(COLLECTION_SUPPLY)).to.equal(maxSupply);
        expect(COLLECTION_SUPPLY).to.equal(b32idec(maxSupply));
  
        await collection.contract.updateConfig(b32enc("maxSupply"), b32ienc(2999000), fingerprint)
        maxSupply = await collection.contract.getConfig(b32enc("maxSupply"))
        expect(2999000).to.equal(b32idec(maxSupply));
    });

    it("should not update a hash with a fingerprint from an nonexisting carmel account", async function () {
      await expect(collection.contract.updateHash(0, hashToBytes32(HASH2)[0], hashToBytes32(HASH2)[1], fingerprint)).to.be.revertedWithCustomError(collection.contract, "CarmelErrorAccountDoesNotExist")
    });

    it("should not update a hash with an invalid fingerprint", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await expect(collection.contract.updateHash(0, hashToBytes32(HASH2)[0], hashToBytes32(HASH2)[1], fingerprintError)).to.be.revertedWithCustomError(collection.contract, "CarmelErrorUnauthorizedAccount")
    });

    it("should not update a hash for a nonexistent token", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await expect(collection.contract.updateHash(0, hashToBytes32(HASH2)[0], hashToBytes32(HASH2)[1], fingerprint)).to.be.revertedWithCustomError(collection.contract, "CarmelErrorAssetNotMinted")
    });

    it("should not update the config with a fingerprint from an nonexisting carmel account", async function () {
      await expect(collection.contract.updateConfig(b32enc("maxSupply"), b32ienc(2999000), fingerprint)).to.be.revertedWithCustomError(collection.contract, "CarmelErrorAccountDoesNotExist")
    });

    it("should not update the config with an invalid fingerprint", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await expect(collection.contract.updateConfig(b32enc("maxSupply"), b32ienc(2999000), fingerprintError)).to.be.revertedWithCustomError(collection.contract, "CarmelErrorUnauthorizedAccount")
    });

    it("should not update a level with a fingerprint from an nonexisting carmel account", async function () {
      await expect(collection.contract.updateLevel(signers[1], 20, fingerprint)).to.be.revertedWithCustomError(collection.contract, "CarmelErrorAccountDoesNotExist")
    });

    it("should not update a level with an invalid fingerprint", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await expect(collection.contract.updateLevel(signers[1], 20, fingerprintError)).to.be.revertedWithCustomError(collection.contract, "CarmelErrorUnauthorizedAccount")
    });

    it("should be able to update a hash", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await collection.contract.updateLevel(signers[1], 20, fingerprint)
      await collection.contract.connect(signers[1]).safeMintBatch(1)

      expect(await collection.contract.tokenURI(0)).to.equal(`ipfs://${HASH1}`)
      await collection.contract.updateHash(0, hashToBytes32(HASH2)[0], hashToBytes32(HASH2)[1], fingerprint)
      expect(await collection.contract.tokenURI(0)).to.equal(`ipfs://${HASH2}`)
    });

    it("should not update hash if not a sentinel", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await expect(collection.contract.connect(signers[1]).updateHash(0, hashToBytes32(HASH2)[0], hashToBytes32(HASH2)[1], fingerprint)).to.be.revertedWithCustomError(registry.contract, "CarmelErrorPermissionsSentinelLevelRequired");          
    })

    it("should not update a level if not a sentinel", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await expect(collection.contract.connect(signers[1]).updateLevel(signers[1], 20, fingerprint)).to.be.revertedWithCustomError(registry.contract, "CarmelErrorPermissionsSentinelLevelRequired");          
    })

    it("should not update the config if not a sentinel", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await expect(collection.contract.connect(signers[1]).updateConfig(b32enc("maxSupply"), b32ienc(2999000), fingerprint)).to.be.revertedWithCustomError(registry.contract, "CarmelErrorPermissionsSentinelLevelRequired");          
    })
  })

  describe("Minting", () => {
    it("should not mint 1 if not on the whitelist", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await expect(collection.contract.connect(signers[1]).safeMintBatch(1)).to.be.revertedWithCustomError(collection.contract, "CarmelErrorAssetMintingUnauthorized()")
    })

    it("should be able to mint 1 asset for free if the whitelist is disabled", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await collection.contract.updateConfig(b32enc("whitelist"), b32ienc(0), fingerprint)
      await collection.contract.updateLevel(signers[1], 20, fingerprint)
      await (await collection.contract.connect(signers[1]).safeMintBatch(1)).wait()
    })

    it("should not to mint more assets than the batch size, without priviledged access", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await collection.contract.updateConfig(b32enc("whitelist"), b32ienc(0), fingerprint)
      await collection.contract.updateLevel(signers[1], 20, fingerprint)
      await expect(collection.contract.connect(signers[1]).safeMintBatch(COLLECTION_BATCH + 1)).to.be.revertedWithCustomError(collection.contract, "CarmelErrorAssetMintingInvalidQuantity")
    })
    
    it("should not to mint more assets than the max supply", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await collection.contract.updateConfig(b32enc("whitelist"), b32ienc(0), fingerprint)
      await collection.contract.updateLevel(signers[1], 20, fingerprint)
      await expect(collection.contract.connect(signers[1]).safeMintBatch(COLLECTION_BATCH + COLLECTION_SUPPLY)).to.be.revertedWithCustomError(collection.contract, "CarmelErrorAssetMintingMaxSupplyReached")
    })

    it("should not to mint if paid and the price is wrong", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await collection.contract.updateLevel(signers[1], 10, fingerprint)
      await expect(collection.contract.connect(signers[1]).safeMintBatch(1, { value: COLLECTION_PRICE2 })).to.be.revertedWithCustomError(collection.contract, "CarmelErrorAssetMintingInvalidPrice")
    })

    it("should be able to mint 1 asset for free if on the free whitelist", async function () {
        await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])

        expect(await collection.contract.getLevel(signers[1])).to.equal(0);
        await collection.contract.updateLevel(signers[1], 20, fingerprint)
        expect(await collection.contract.getLevel(signers[1])).to.equal(20);

        expect(await collection.contract.totalSupply()).to.equal(0)
        expect(await collection.contract.balanceOf(signers[1])).to.equal(0)
        
        await collection.contract.connect(signers[1]).safeMintBatch(1)
        expect(await collection.contract.tokenURI(0)).to.equal(`ipfs://${HASH1}`)

        expect(await collection.contract.totalSupply()).to.equal(1)  
        expect(await collection.contract.balanceOf(signers[1])).to.equal(1)
        expect(await collection.contract.ownerOf(0)).to.equal(signers[1])
        expect(await collection.contract.tokenURI(0)).to.equal(`ipfs://${HASH1}`)
     });

     it("should be able to mint many assets if on the priviledge whitelist", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])

      expect(await collection.contract.getLevel(signers[1])).to.equal(0);
      await collection.contract.updateLevel(signers[1], 30, fingerprint)
      expect(await collection.contract.getLevel(signers[1])).to.equal(30);

      expect(await collection.contract.totalSupply()).to.equal(0)
      expect(await collection.contract.balanceOf(signers[1])).to.equal(0)
      
      await collection.contract.connect(signers[1]).safeMintBatch(6)
      expect(await collection.contract.tokenURI(0)).to.equal(`ipfs://${HASH1}`)

      expect(await collection.contract.totalSupply()).to.equal(6)  
      expect(await collection.contract.balanceOf(signers[1])).to.equal(6)
      expect(await collection.contract.ownerOf(0)).to.equal(signers[1])
      expect(await collection.contract.tokenURI(0)).to.equal(`ipfs://${HASH1}`)
   });

    it("should be able to mint 1 asset for a price if on the paid whitelist", async function () {
        await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
        await collection.contract.updateLevel(signers[1], 10, fingerprint)
        expect(await collection.contract.balanceOf(signers[1])).to.equal(0)
        const balanceBefore = await hre.ethers.provider.getBalance(signers[1].address);
        const balanceBeforeOwner = await hre.ethers.provider.getBalance(signers[0].address);

        await collection.contract.connect(signers[1]).safeMintBatch(1, { value: COLLECTION_PRICE })
        const balanceAfterOwner = await hre.ethers.provider.getBalance(signers[0].address);
        const balanceAfter = await hre.ethers.provider.getBalance(signers[1].address);

        expect(balanceAfterOwner - balanceBeforeOwner).to.be.equal(COLLECTION_PRICE)
        expect(balanceBefore - balanceAfter).to.be.greaterThanOrEqual(COLLECTION_PRICE)

    });
  })

  describe("Helpers", () => {    
    it("should not retrieve a hash for a nonexistent token", async function () {
       await expect(collection.contract.tokenURI(0)).to.revertedWithCustomError(collection.contract, "CarmelErrorAssetNotMinted")
    });
  })

  describe("Maintenance", () => {    
    it("should be able to check the version", async function () {
      expect(await collection.contract.version()).to.be.equal(1)
    })

    it("should handle invalid initialization attempts", async function () {
        await expect(collection.contract.initialize(
            b32enc(USERNAME),
            ADDRESS,
            ADDRESS,
            b32enc(COLLECTION_ID),
            hashToBytes32(HASH1)[0],
            hashToBytes32(HASH1)[1],
            COLLECTION_NAME,
            COLLECTION_SYMBOL,
            b32ienc(COLLECTION_SUPPLY),
            b32ienc(COLLECTION_PRICE),
            b32ienc(COLLECTION_BATCH)
        )).to.be.revertedWithCustomError(collection.contract, "InvalidInitialization")
      })
  })  
})