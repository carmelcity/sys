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
 *  CarmelCollection.sol                                                                                     *  
 *                                                                                                           *                                                                                                       *
 *  This code is part of the Carmel City platform (https://carmel.city) and open sourced at:                 *
 *  https://github.com/carmelcity                                                                            *
 *                                                                                                           * 
 \***********************************************************************************************************/                                                                                                          

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./CarmelRegistry.sol";

/// @title A Carmel Asset Collection
/// @author I. Dan Calinescu
/// @notice This represents an asset collection of NFTs
/// @custom:oz-upgrades-unsafe-allow external-library-linking
contract CarmelCollection is Initializable, ERC721Upgradeable, CarmelBase {

    uint8 constant internal LEVEL_BASIC = 10;
    uint8 constant internal LEVEL_HIGH = 20;
    uint8 constant internal LEVEL_ADVANCED = 30;

    /// @dev
    event CarmelAssetMinted(bytes32 collectionId, address owner, uint256 tokenId);
    event CarmelAssetStateUpdated(uint8 kind, bytes32 collectionId, uint256 tokenId, uint256 rev, bytes32 key, bytes32 val);
    event CarmelAssetDataUpdated(uint256 tokenId);

    /// @dev
    CarmelRegistry private _registry;

    /// @dev
    // ERC20 private _token;

    /// @dev Keep track of the main account that owns this collection
    bytes32 private _account;

    /// @dev
    bytes32 private _collectionId;

    /// @dev
    uint256 _totalTokens;

    /// @dev
    mapping(uint256 => bytes32[2]) private _hashes;

    /// @dev
    mapping(bytes32 => bytes32) private _config;

    /// @dev
    mapping(address => uint8) private _level;

    /// @dev Keep track of the main owner of this registry
    address private _owner;

    /// @dev
    mapping(address => uint256[]) private _tokens;

    /// @dev
    mapping(uint256 => uint256) private _revisions;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @dev called only once at deployment
    function initialize(
        bytes32 user,
        address reg,
        address token,
        bytes32 collectionId,
        bytes32 defaultHash0,
        bytes32 defaultHash1,
        string memory name,
        string memory symbol,
        bytes32 supply,
        bytes32 price,
        bytes32 batch
    ) initializer public {
        _account = user;
        _owner = msg.sender;
        _collectionId = collectionId;
        // _token = ERC20(token);
        _perms[msg.sender] = ADMIN_PERM;
        _level[msg.sender] = 3;
        _registry = CarmelRegistry(reg);
        __ERC721_init(name, symbol);

        _config["defaultHash0"] = defaultHash0;
        _config["defaultHash1"] = defaultHash1;
        _config["mintPrice"] = price;
        _config["maxBatch"] = batch;
        _config["maxSupply"] = supply;
        _config["whitelist"] = bytes32("0x1");
    }

    /************************************************************************\
    *                     _    _               _                             *
    *   ___   ___  _ __  | |_ (_) _ __    ___ | |   __ _  _ __  ___   __ _   *
    *  / __| / _ \| '_ \ | __|| || '_ \  / _ \| |  / _` || '__|/ _ \ / _` |  *
    *  \__ \|  __/| | | || |_ | || | | ||  __/| | | (_| || |  |  __/| (_| |  *
    *  |___/ \___||_| |_| \__||_||_| |_| \___||_|  \__,_||_|   \___| \__,_|  *
    \************************************************************************/

    /// @notice Update an asset's hash
    /// @dev This can only be ran by a sentinel
    function updateHash(uint256 tokenId, bytes32 h0, bytes32 h1, CarmelFingerprint calldata fingerprint) public requireSentinel {       
        if (!_registry.verify(fingerprint)) revert CarmelErrorUnauthorizedAccount();
        if(tokenId >= _totalTokens) revert CarmelErrorAssetNotMinted();

        _hashes[tokenId][0] = h0;
        _hashes[tokenId][1] = h1;
        _revisions[tokenId] = _revisions[tokenId] + 1;

        emit CarmelAssetDataUpdated(tokenId);
    }

    /// @notice Update a configuration setting
    function updateConfig(bytes32 key, bytes32 val, CarmelFingerprint calldata fingerprint) public requireSentinel {       
        if (!_registry.verify(fingerprint)) revert CarmelErrorUnauthorizedAccount();

        _config[key] = val;
    }

    /// @notice Update the whitelist
    function updateLevel(address addr, uint8 level, CarmelFingerprint calldata fingerprint) public requireSentinel {       
        if (!_registry.verify(fingerprint)) revert CarmelErrorUnauthorizedAccount();

        _level[addr] = level;
    }

    /*********************************************************************\
    *                    _      _  _                                      *
    *      _ __   _   _ | |__  | |(_)  ___    __ _  _ __  ___   __ _      *
    *     | '_ \ | | | || '_ \ | || | / __|  / _` || '__|/ _ \ / _` |     *
    *     | |_) || |_| || |_) || || || (__  | (_| || |  |  __/| (_| |     *
    *     | .__/  \__,_||_.__/ |_||_| \___|  \__,_||_|   \___| \__,_|     *
    *     |_|                                                             *
    \*********************************************************************/

    /// @notice Mints one or more assets all at once
    /// @param quantity The number of assets to mint at once
    /// @dev This assumes the sender is whitelisted or the whitelist is turned off
    function safeMintBatch(uint256 quantity) public payable {
        uint256 tokenId = _totalTokens;
        bool notOnList = _level[msg.sender] < LEVEL_BASIC;
        bool isPaid = _level[msg.sender] == LEVEL_BASIC;
        bool isPriviledged = _level[msg.sender] == LEVEL_ADVANCED;
        uint256 price = uint256(_config["mintPrice"]) * quantity;

        if(uint256(_config["maxSupply"]) <= tokenId + quantity) revert CarmelErrorAssetMintingMaxSupplyReached();
        if(_config["whitelist"] > 0 && notOnList) revert CarmelErrorAssetMintingUnauthorized();
        if(!isPriviledged && uint256(_config["maxBatch"]) < quantity + _tokens[msg.sender].length) revert CarmelErrorAssetMintingInvalidQuantity();
        if (isPaid && msg.value != price) revert CarmelErrorAssetMintingInvalidPrice();

        if (isPaid) {
            payable(_owner).transfer(price);
        }

        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(msg.sender, tokenId);
            _tokens[msg.sender].push(tokenId);
            _revisions[tokenId] = 0;
            _hashes[tokenId][0] = _config["defaultHash0"];
            _hashes[tokenId][1] = _config["defaultHash1"];
            emit CarmelAssetMinted(_config["collectionId"], msg.sender, tokenId);     
            emit CarmelAssetDataUpdated(tokenId);
            _totalTokens = _totalTokens + 1;       
            tokenId = _totalTokens;
        }
    }

    /// @dev
    function getConfig(bytes32 key) public view returns (bytes32) {
        return _config[key];
    }

    /// @dev
    function getLevel(address addr) public view returns (uint8) {
        return _level[addr];
    }

    /// @dev
    function version() public pure returns (uint256) {
        return 1;
    }

    /// @dev
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if(tokenId >= _totalTokens) revert CarmelErrorAssetNotMinted();

        return string(abi.encodePacked("ipfs://", bytes32ToString(_hashes[tokenId][0]), bytes32ToString(_hashes[tokenId][1])));
    }

    /// @dev
    function totalSupply() public view returns (uint256) {
        return _totalTokens;
    }

    /*******************************************************************************\
    *      _         _                             _                                *
    *     (_) _ __  | |_  ___  _ __  _ __    __ _ | |   __ _  _ __  ___   __ _      *
    *     | || '_ \ | __|/ _ \| '__|| '_ \  / _` || |  / _` || '__|/ _ \ / _` |     *
    *     | || | | || |_|  __/| |   | | | || (_| || | | (_| || |  |  __/| (_| |     *
    *     |_||_| |_| \__|\___||_|   |_| |_| \__,_||_|  \__,_||_|   \___| \__,_|     *
    \*******************************************************************************/

    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) i++;

        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) bytesArray[i] = _bytes32[i];

        return string(bytesArray);
    }
}