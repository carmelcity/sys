import "@nomicfoundation/hardhat-ignition";
import { expect } from "chai";
import CarmelRegistry from '../ignition/modules/CarmelRegistryProxyModule'
import CarmelRegistryV2 from '../ignition/modules/CarmelRegistryUpgradeModule'
import CarmelVerifier from '../ignition/modules/CarmelVerifierProxyModule'
import { b32enc, b32dec, makeDigestSignature, makeKey, hashToBytes32} from '../src/utils'
import hre from "hardhat";

const USERNAME = "user"
const GROUP = "users"

const HASH1 = "bafkreiamyeqz7wcdjoi6pf4w5346nqb7hi474l2t54k77fllnw2hfheyli"
const HASH2 = "bafkreih7mqaitsxaeby2g5nps3gktsqc7tiej4i4446s4yfwkthbzhigxa"
const ADDRESS = "0xc0ffee254729296a45a3885639AC7E10F9d54979"
const ADDRESS2 = "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E"
const clientDataJSONBase64 = 'eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiNGtOSkNLT3V1ZExQUVR1Y1B6UHJJNHFwWTVuekdzMklNMjZHTTZid2IzSzMwU3Z3WkxPb3dpR080cVk0a3BxNVlJZEVZQ1hzTFFVSjY5RmVyNjNNLTNUYUxGd1RrWHFaRURYWlhNM0hadFRnRUZGWFdqdFA0SEZHN05uN3paZHdZZ2labV9POHJ4emQ4R1ZORVQtVkZfbjlKazBTVkJYV1FSVlJ0RnJqVmFvIiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ'      
const authenticatorDataBase64 = 'SZYN5YgOjGh0NBcPZHZgW4/krrmihjLHmVzzuoMdl2MdAAAAAA=='
const publicKeyBase64 = ['3cjXLJigSRcmgyCIQtTiaTIWfnmwsRLua8RcR0H5iHQ', 'oUKIrUiayLUvEM8sQZPC5jGRiNIVsCkyQDonb0pbMAo']
const r = '0xa64e349d969d596edc2137ffa9314e353638182df082df92adf27afcf1db5ff6'
const s = '0xedb5f2a3ec4950cf545815f4cedd04f992290ca529d056241e2aee42c7aa3429'
const s2 = '0xedb5f2a3ec4950cf545815f4cedd04f992290ca529d056241e2aee42c7aa3420'

const xy = makeKey(publicKeyBase64)
const { digest, signature } = makeDigestSignature(authenticatorDataBase64, clientDataJSONBase64, r, s)
const fingerprint = [0, b32enc(USERNAME), digest, signature]
const { signature: signature2 } = makeDigestSignature(authenticatorDataBase64, clientDataJSONBase64, r, s2)
const fingerprintError = [0, b32enc(USERNAME), digest, signature2]

describe("CarmelRegistry", function () {
  let registry: any
  let registryV2: any
  let signers: any 
  let verifier: any
  let verifierAddress: any

  beforeEach(async function () {
    signers = await hre.ethers.getSigners();

    verifier = await hre.ignition.deploy(CarmelVerifier);
    verifierAddress = await verifier.contract.getAddress()

    registry = await hre.ignition.deploy(CarmelRegistry, {
        parameters: {
          CarmelRegistryProxyModule: {
            verifierAddress
          }
        }
    })

    registryV2 = await hre.ignition.deploy(CarmelRegistryV2, {
      parameters: {
        CarmelRegistryProxyModule: {
          verifierAddress
        }
      }
    })
  })

  describe("Account Registration", () => {
    it("should not register if not a sentinel", async function () {
      await expect(registry.contract.connect(signers[1]).register(b32enc(USERNAME), b32enc(GROUP), ADDRESS, xy[0], xy[1])).to.be.revertedWithCustomError(registry.contract, "CarmelErrorPermissionsSentinelLevelRequired");          
    })

    it("should not register if the account already exists", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS, xy[0], xy[1])
      await expect(registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS, xy[0], xy[1])).to.be.revertedWithCustomError(registry.contract, "CarmelErrorAccountAlreadyExists");          
   })

   it("should be able to register a new account", async function () {
       expect(await registry.contract.getTotalAccounts()).to.be.equal(0)
       
       await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS, xy[0], xy[1])

       const acct = await registry.contract.getAccount(b32enc(USERNAME))
       const group = await registry.contract.getAccounts(b32enc(GROUP))

       expect(await registry.contract.getTotalAccounts()).to.be.equal(1)
       expect(acct.id).to.equal(0)
       expect(b32dec(acct.username)).to.equal(USERNAME)
       
       expect(b32dec(acct.group)).to.equal(GROUP)
       expect(group.length).to.equal(1)
       expect(group[0].id).to.equal(0)
       expect(b32dec(group[0].username)).to.equal(USERNAME)
       expect(b32dec(group[0].group)).to.equal("users")
    })
  })

  describe("Secure Fingerprinting", () => {
    it("should reject fingerprints with invalid key ids", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      let fingerprint2 = [...fingerprint]
      fingerprint2[0] = 1
      await expect(registry.contract.verify(fingerprint2)).to.be.revertedWithCustomError(registry.contract, "CarmelErrorAccountInvalidKeyId")
    })

    it("should be able to verify a fingerprint", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])

      expect(await registry.contract.verify(fingerprint)).to.equal(true)
    })
  })

  describe("Admin Operations", () => {    
    it("should not update a system hash for non existent accounts", async function () {
      await expect(registry.contract.updateSystemHash(b32enc(USERNAME), hashToBytes32(HASH2)[0], hashToBytes32(HASH2)[1])).to.be.revertedWithCustomError(registry.contract, "CarmelErrorAccountDoesNotExist");          
    })

    it("should not update a system hash if not a sentinel", async function () {
      await expect(registry.contract.connect(signers[1]).updateSystemHash(b32enc(USERNAME), hashToBytes32(HASH2)[0], hashToBytes32(HASH2)[1])).to.be.revertedWithCustomError(registry.contract, "CarmelErrorPermissionsSentinelLevelRequired");          
    })

    it("should be able to update system hash", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])

      expect(await registry.contract.getAccountHashes(b32enc(USERNAME))).to.deep.equal([b32enc(''), b32enc(''), b32enc(''), b32enc('')])
      await registry.contract.updateSystemHash (b32enc(USERNAME), hashToBytes32(HASH2)[0], hashToBytes32(HASH2)[1])

      const hashes = await registry.contract.getAccountHashes(b32enc(USERNAME))
      const systemHash = b32dec(hashes[0]) + b32dec(hashes[1])

      expect(systemHash).to.equal(HASH2)
    })

    it("should not update perms if not an admin", async function () {
      await expect(registry.contract.connect(signers[1]).updatePerms(ADDRESS, 50)).to.be.revertedWithCustomError(registry.contract, "CarmelErrorPermissionsAdminLevelRequired");          
    })

    it("should be able to update perms", async function () {
      expect(await registry.contract.getPerms(ADDRESS)).to.be.equal(0);
      await registry.contract.updatePerms(ADDRESS, 50);
      expect(await registry.contract.getPerms(ADDRESS)).to.be.equal(50);
    })
  })

  describe("Self-Sovereign Federated Account Management", () => {    
    it("should not add a key if not a sentinel", async function () {
      await expect(registry.contract.connect(signers[1]).accountAddKey(xy[0], xy[1], fingerprintError)).to.be.revertedWithCustomError(registry.contract, "CarmelErrorPermissionsSentinelLevelRequired");          
    })

    it("should not add an address if not a sentinel", async function () {
      await expect(registry.contract.connect(signers[1]).accountAddAddress(ADDRESS2, fingerprintError)).to.be.revertedWithCustomError(registry.contract, "CarmelErrorPermissionsSentinelLevelRequired");          
    })

    it("should not update an account hash if not a sentinel", async function () {
      await expect(registry.contract.connect(signers[1]).accountUpdateHash(hashToBytes32(HASH2)[0], hashToBytes32(HASH2)[1], fingerprintError)).to.be.revertedWithCustomError(registry.contract, "CarmelErrorPermissionsSentinelLevelRequired");          
    })

    it("should be not add a key if the account does not exist", async function () {
      await expect(registry.contract.accountAddKey(xy[0], xy[1], fingerprintError)).to.be.revertedWithCustomError(registry.contract, "CarmelErrorAccountDoesNotExist");          
    })

    it("should not retrieve keys for non existent accounts", async function () {
      await expect(registry.contract.accountGetKeys(fingerprint)).to.be.revertedWithCustomError(registry.contract, "CarmelErrorAccountDoesNotExist");          
    })
  
    it("should not retrieve keys for an unauthorized account", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await expect(registry.contract.accountGetKeys(fingerprintError)).to.be.revertedWithCustomError(registry.contract, "CarmelErrorUnauthorizedAccount");          
    })

    it("should retrieve keys for an authorized account", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      expect(await registry.contract.accountGetKeys(fingerprint)).to.deep.equal([[xy[0]], [xy[1]]])    
    })
    
    it("should be not add a key for inexistent accounts", async function () {
      await expect(registry.contract.accountAddKey(xy[0], xy[1], fingerprint)).to.be.revertedWithCustomError(registry.contract, "CarmelErrorAccountDoesNotExist");
    })

    it("should be not add a key if the account is not authorized", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await expect(registry.contract.accountAddKey(xy[0], xy[1], fingerprintError)).to.be.revertedWithCustomError(registry.contract, "CarmelErrorUnauthorizedAccount");
    })

    it("should be able to add a key", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await registry.contract.accountAddKey(xy[0], xy[1], fingerprint)

      const acct = await registry.contract.getAccount(b32enc(USERNAME))

      expect(acct.total_keys).to.equal(1)
    })

    it("should be able to fetch addresses for inexistent accounts", async function () {
      await expect(registry.contract.getAddresses(b32enc(USERNAME))).to.be.revertedWithCustomError(registry.contract, "CarmelErrorAccountDoesNotExist")
    })

    it("should be not add an address if the account is not authorized", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await expect(registry.contract.accountAddAddress(ADDRESS2, fingerprintError)).to.be.revertedWithCustomError(registry.contract, "CarmelErrorUnauthorizedAccount");          
    })

    it("should be able to add an address", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      expect(await registry.contract.getAddresses(b32enc(USERNAME))).to.deep.equal([ADDRESS])

      await registry.contract.accountAddAddress(ADDRESS2, fingerprint);
      expect(await registry.contract.getAddresses(b32enc(USERNAME))).to.deep.equal([ADDRESS, ADDRESS2])
    })

    it("should not update an account hash with an unauthorized account", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await expect(registry.contract.accountUpdateHash(hashToBytes32(HASH2)[0], hashToBytes32(HASH2)[1], fingerprintError)).to.be.revertedWithCustomError(registry.contract, "CarmelErrorUnauthorizedAccount");          
    })

    it("should be able to update an account hash", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])

      expect(await registry.contract.getAccountHashes(b32enc(USERNAME))).to.deep.equal([b32enc(''), b32enc(''), b32enc(''), b32enc('')])

      await registry.contract.accountUpdateHash (hashToBytes32(HASH1)[0], hashToBytes32(HASH1)[1], fingerprint)

      const hashes = await registry.contract.getAccountHashes(b32enc(USERNAME))
      const accountHash = b32dec(hashes[2]) + b32dec(hashes[3])

      expect(accountHash).to.equal(HASH1)
    })
  })

  describe("Maintenance", () => {    
    it("should handle invalid initialization attempts", async function () {
      await expect(registry.contract.initialize(ADDRESS, ADDRESS)).to.be.revertedWithCustomError(registry.contract, "InvalidInitialization")
    })

    it("should be able to upgrade the registry", async function () {
      expect(await registry.contract.version()).to.be.equal(1)
      expect(await registryV2.contract.version()).to.be.equal(2)
    })
  })
})