 /***********************************************************************************************************\
 *   ______     ___      .______      .___  ___.  _______  __          ______  __  .___________.____    ____ *
 *  /      |   /   \     |   _  \     |   \/   | |   ____||  |        /      ||  | |           |\   \  /   / *
 * |  ,----'  /  ^  \    |  |_)  |    |  \  /  | |  |__   |  |       |  ,----'|  | `---|  |----` \   \/   /  *
 * |  |      /  /_\  \   |      /     |  |\/|  | |   __|  |  |       |  |     |  |     |  |       \_    _/   *
 * |  `----./  _____  \  |  |\  \----.|  |  |  | |  |____ |  `----.__|  `----.|  |     |  |         |  |     *
 *  \______/__/     \__\ | _| `._____||__|  |__| |_______||_______(__)\______||__|     |__|         |__|     *
 *                                                                                                           *
 *  Copyright (C) 2025 - I. Dan Calinescu                                                                    *
 *  License: This code is licensed under MIT License (see LICENSE for details)                               *
 *                                                                                                           *
 *  CarmelVerifier.sol                                                                                       *  
 *                                                                                                           *
 *  This code is part of the Carmel City platform (https://carmel.city) and open sourced at:                 *
 *  https://github.com/carmelcity                                                                            *  
 *                                                                                                           *
 *  This file uses code from the following library, written by Renaud Dubois under MIT license:              *
 *  https://github.com/get-smooth/crypto-lib                                                                 *
 *                                                                                                           * 
 \***********************************************************************************************************/                                                                                                          

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ec_isOnCurve} from "../lib/crypto-lib/src/elliptic/SCL_ecOncurve.sol";
import{ MODEXP_PRECOMPILE} from "../lib/crypto-lib/src/include/SCL_mask.h.sol";
import {_ModInvError} from "../lib/crypto-lib/src/include/SCL_errcodes.sol";
import "../lib/crypto-lib/src/elliptic/SCL_mulmuladdX_fullgenW.sol";

/// @title The Carmel Verifier
/// @author I. Dan Calinescu
/// @notice In charge of verifying Secp256r1 WebAuthn signatures
/// @custom:oz-upgrades-unsafe-allow external-library-linking
contract CarmelVerifier is Initializable {

    // weierstrass coefficients
    uint constant a = 0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC;
    uint constant b = 0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B;

    // coordinates for a point on the curve
    uint constant gx = 0x6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296;
    uint constant gy = 0x4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5;
    
    // the prime field modulus
    uint constant p = 0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF;
    
    // the points on the curve
    uint constant n = 0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551;

    // -2 mod(n)
    uint256 constant nMINUS_2 = 0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC63254F;

    /// @dev Keep track of the main owner of this registry
    address private _owner;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @dev Only called once at deployment
    function initialize(
        address sen
    ) initializer public {
        _owner = sen;
    }

    /// @dev inversion mod nusing little Fermat theorem via a^(n-2), use of precompiled
    function nModInv(uint256 u) internal view returns (uint256 result) {
        assembly {
            let pointer := mload(0x40)
            // Define length of base, exponent and modulus. 0x20 == 32 bytes
            mstore(pointer, 0x20)
            mstore(add(pointer, 0x20), 0x20)
            mstore(add(pointer, 0x40), 0x20)
            // Define variables base, exponent and modulus
            mstore(add(pointer, 0x60), u)
            mstore(add(pointer, 0x80), nMINUS_2)
            mstore(add(pointer, 0xa0), n)

            // Call the precompiled contract 0x05 = ModExp
            if iszero(staticcall(not(0), MODEXP_PRECOMPILE, pointer, 0xc0, pointer, 0x20)) {  
                mstore(0x40, _ModInvError)
                revert(0x40, 0x20) } 
            result := mload(pointer)
        }
    }

    /// @notice Verifies a WebAuthn Secp256r1 signature
    /// @param message The digest payload
    /// @param signature The rs components of the Secp256r1 signature
    /// @param qx The x coordinate of the public key
    /// @param qy The y coordinate of the public key
    /// @return True if the signature is valid, false otherwise
    function verify(bytes32 message, bytes calldata signature, bytes32 qx, bytes32 qy) public view returns (bool) {
         if (signature.length < 0x40) return false;
         
         uint256 r = uint256(bytes32(signature[0x00:0x20]));
         uint256 s = uint256(bytes32(signature[0x20:0x40]));
         uint256 digest = uint256(message);
         uint256 x = uint256(qx);
         uint256 y = uint256(qy);

        if (r == 0 || r >= n || s == 0 || s >= n) {
            return false;
        }

        // check the public key validity (rejecting not on curve and weak keys)
       if(ec_isOnCurve(p,a,b,x,y)==false){
        return false;
       }

        // calculate the scalars used for the multiplication of the point
        uint256 sInv = nModInv(s);
        uint256 scalar_u = mulmod(digest, sInv, n);
        uint256 scalar_v = mulmod(r, sInv, n);
        uint256[6] memory Qpa=[x,y,p,a,gx,gy];

        uint256 x1;
        (x1,) = ecGenMulmuladdB4W(Qpa, scalar_u, scalar_v);

        assembly {
            x1 := addmod(x1, sub(n, r), n)
        }

        return x1 == 0;
    }
}