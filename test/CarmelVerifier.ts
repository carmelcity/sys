import "@nomicfoundation/hardhat-ignition";
import CarmelVerifier from '../ignition/modules/CarmelVerifierProxyModule'
import { expect } from "chai";
import * as utils from '../src/utils'
import hre from 'hardhat'

const publicKeyBase64 = ['3cjXLJigSRcmgyCIQtTiaTIWfnmwsRLua8RcR0H5iHQ', 'oUKIrUiayLUvEM8sQZPC5jGRiNIVsCkyQDonb0pbMAo']
const r = '0xa64e349d969d596edc2137ffa9314e353638182df082df92adf27afcf1db5ff6'
const s = '0xedb5f2a3ec4950cf545815f4cedd04f992290ca529d056241e2aee42c7aa3429'
const emptyHex = '0x0000000000000000000000000000000000000000000000000000000000000000'
const clientDataJSONBase64 = 'eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiNGtOSkNLT3V1ZExQUVR1Y1B6UHJJNHFwWTVuekdzMklNMjZHTTZid2IzSzMwU3Z3WkxPb3dpR080cVk0a3BxNVlJZEVZQ1hzTFFVSjY5RmVyNjNNLTNUYUxGd1RrWHFaRURYWlhNM0hadFRnRUZGWFdqdFA0SEZHN05uN3paZHdZZ2labV9POHJ4emQ4R1ZORVQtVkZfbjlKazBTVkJYV1FSVlJ0RnJqVmFvIiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ'      
const authenticatorDataBase64 = 'SZYN5YgOjGh0NBcPZHZgW4/krrmihjLHmVzzuoMdl2MdAAAAAA=='
const nplus = "0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551";
const ADDRESS = "0xc0ffee254729296a45a3885639AC7E10F9d54979"

describe("CarmelVerifier", function () {
  let verifier: any

  before(async function () {
    verifier = await hre.ignition.deploy(CarmelVerifier);
  })

  describe("Security", () => {
    it("should be able to verify a fingerprint", async function () {
       const { digest, signature } = utils.makeDigestSignature(authenticatorDataBase64, clientDataJSONBase64, r, s)
       const xy = utils.makeKey(publicKeyBase64)
       expect(await verifier.contract.verify(digest, signature, xy[0], xy[1])).to.equal(true)
    })

    it("should be able to catch an invalid fingerprint", async function () {
      const { digest, signature } = utils.makeDigestSignature(authenticatorDataBase64, clientDataJSONBase64, r, s)
      const xy = utils.makeKey(publicKeyBase64)
      expect(await verifier.contract.verify(digest, signature, xy[0], xy[0])).to.equal(false)
    })

    it("should be able to handle an invalid signature", async function () {
      const { digest, signature } = utils.makeDigestSignature(authenticatorDataBase64, clientDataJSONBase64, r, s)
      const xy = utils.makeKey(publicKeyBase64)
      expect(await verifier.contract.verify(digest, utils.toUtf8Bytes("0x"), xy[0], xy[0])).to.equal(false)
    })

    it("should be able to handle an empty r coefficient", async function () {
      const { digest, signature } = utils.makeDigestSignature(authenticatorDataBase64, clientDataJSONBase64, emptyHex, s)
      const xy = utils.makeKey(publicKeyBase64)
      expect(await verifier.contract.verify(digest, signature, xy[0], xy[1])).to.equal(false)
    })

    it("should be able to handle an empty s coefficient", async function () {
      const { digest, signature } = utils.makeDigestSignature(authenticatorDataBase64, clientDataJSONBase64, r, emptyHex)
      const xy = utils.makeKey(publicKeyBase64)
      expect(await verifier.contract.verify(digest, signature, xy[0], xy[1])).to.equal(false)
    })

    it("should be able to handle an r coefficient over the limit", async function () {
      const { digest, signature } = utils.makeDigestSignature(authenticatorDataBase64, clientDataJSONBase64, nplus, s)
      const xy = utils.makeKey(publicKeyBase64)
      expect(await verifier.contract.verify(digest, signature, xy[0], xy[1])).to.equal(false)
    })

    it("should be able to handle an s coefficient over the limit", async function () {
      const { digest, signature } = utils.makeDigestSignature(authenticatorDataBase64, clientDataJSONBase64, r, nplus)
      const xy = utils.makeKey(publicKeyBase64)
      expect(await verifier.contract.verify(digest, signature, xy[0], xy[1])).to.equal(false)
    })
  })
  
  describe("Maintenance", () => {    
    it("should handle invalid initialization attempts", async function () {
      await expect(verifier.contract.initialize(ADDRESS)).to.be.revertedWithCustomError(verifier.contract, "InvalidInitialization")
    })
  })  
})