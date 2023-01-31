//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "hardhat/console.sol";

contract wavePortal {
    uint totWaves;
    uint private seed;

    event NewWave(address indexed from, string message, uint timestamp);

    struct Wave {
        address visitor;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("Welcome to ETH dApp");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );
        lastWavedAt[msg.sender] = block.timestamp;

        totWaves++;
        console.log(
            "We got a wave from %s and with a message %s:  ",
            msg.sender,
            _message
        );
        waves.push(Wave(msg.sender, _message, block.timestamp));
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("random # generated: ", seed);

        if (seed <= 50) {
            console.log("The winner is %s", msg.sender);
        }

        uint256 prizeAmount = 0.0001 ether;
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has."
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
        emit NewWave(msg.sender, _message, block.timestamp);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotWaves() public view returns (uint) {
        console.log("we have a %d waves:", totWaves);
        return totWaves;
    }
}
