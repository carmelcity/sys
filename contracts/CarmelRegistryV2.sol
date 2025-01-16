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
 *  CarmelRegistryV2.sol                                                                                        *  
 *                                                                                                           *                                                                                                       *
 *  This code is part of the Carmel City platform (https://carmel.city) and open sourced at:                 *
 *  https://github.com/carmelcity                                                                            *
 *                                                                                                           * 
 \***********************************************************************************************************/                                                                                                          

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @title The Carmel Registry V2
/// @author I. Dan Calinescu
/// @notice This is a secondary version of the registry
/// @custom:oz-upgrades-unsafe-allow external-library-linking
contract CarmelRegistryV2 is Initializable {
    address private _owner;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function version() public pure returns (uint256) {
        return 2;
    }
}