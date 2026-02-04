// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReputationContract {

    struct Record {
        string behaviorHash;
        uint reputation;
    }

    mapping(address => Record[]) private records;
    mapping(address => uint) public reputationScore;

    event ReputationUpdated(
        address indexed user,
        string behaviorHash,
        uint reputation
    );

    function updateReputation(
        string memory behaviorHash,
        bool suspicious
    ) public {

        if (suspicious && reputationScore[msg.sender] > 0) {
            reputationScore[msg.sender] -= 1;
        } else {
            reputationScore[msg.sender] += 1;
        }

        records[msg.sender].push(
            Record(behaviorHash, reputationScore[msg.sender])
        );

        emit ReputationUpdated(
            msg.sender,
            behaviorHash,
            reputationScore[msg.sender]
        );
    }

    function getReputation(address user)
        public
        view
        returns (uint)
    {
        return reputationScore[user];
    }

    function getHistoryCount(address user)
        public
        view
        returns (uint)
    {
        return records[user].length;
    }
}
