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
 *  CarmelBase.sol                                                                                          *  
 *                                                                                                           *                                                                                                       *
 *  This code is part of the Carmel City platform (https://carmel.city) and open sourced at:                 *
 *  https://github.com/carmelcity                                                                            *
 *                                                                                                           * 
 \***********************************************************************************************************/                                                                                                          

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title The starting point for all Carmel contracts
/// @author I. Dan Calinescu
/// @notice This sets the base for all Carmel contracts
abstract contract CarmelBase {

    /// @notice Carmel errors
    error CarmelErrorPermissionsAdminLevelRequired();
    error CarmelErrorPermissionsSentinelLevelRequired();
    error CarmelErrorAccountDoesNotExist();
    error CarmelErrorAccountAlreadyExists();
    error CarmelErrorAccountInvalidKeyId();
    error CarmelErrorUnauthorizedAccount();
    error CarmelErrorCannotWithdrawZeroAmount();
    error CarmelErrorCannotWithdrawInsufficientFunds();

    /// @notice This represents an individual Carmel Fingerprint
    struct CarmelFingerprint {
        uint256 keyId;
        bytes32 username; 
        bytes32 message;
        bytes signature;
    }

    /// @notice This represents an individual Carmel Account
    struct CarmelAccount {
        uint256 id;
        bytes32 username;
        bytes32 group;
        uint32 total_keys;
        uint32 total_addresses;
    }
}