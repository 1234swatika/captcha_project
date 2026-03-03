// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReputationContract {

    struct Record {
        string behaviorHash;
        uint reputation;
        uint timestamp;
        bool appealed;
    }

    struct UserData {
        uint reputationScore;
        uint stakedAmount;
        uint lastActivityTime;
        uint totalCaptchasSolved;
        uint streak;
        bool isPremium;
    }

    mapping(address => Record[]) private records;
    mapping(address => UserData) public userData;
    mapping(address => mapping(uint => bool)) public appealedRecords;

    uint public constant DECAY_THRESHOLD = 30 days;
    uint public constant DECAY_AMOUNT = 1;
    uint public constant STAKE_MULTIPLIER = 10;

    event ReputationUpdated(
        address indexed user,
        string behaviorHash,
        uint reputation,
        uint timestamp
    );

    event Staked(
        address indexed user,
        uint amount,
        uint newReputation
    );

    event Unstaked(
        address indexed user,
        uint amount
    );

    event AppealSubmitted(
        address indexed user,
        uint recordIndex,
        uint timestamp
    );

    event StreakUpdated(
        address indexed user,
        uint newStreak
    );

    function updateReputation(
        string memory behaviorHash,
        bool suspicious
    ) public {
        UserData storage user = userData[msg.sender];
        
        // Apply decay if inactive
        applyDecay(msg.sender);

        if (suspicious && user.reputationScore > 0) {
            user.reputationScore -= 1;
            user.streak = 0; // Reset streak on suspicious activity
        } else {
            user.reputationScore += 1;
            user.streak += 1;
            
            // Bonus for streaks
            if (user.streak % 10 == 0) {
                user.reputationScore += 2; // Streak bonus
            }
        }

        user.lastActivityTime = block.timestamp;
        user.totalCaptchasSolved += 1;

        records[msg.sender].push(
            Record(behaviorHash, user.reputationScore, block.timestamp, false)
        );

        emit ReputationUpdated(
            msg.sender,
            behaviorHash,
            user.reputationScore,
            block.timestamp
        );

        emit StreakUpdated(msg.sender, user.streak);
    }

    function applyDecay(address user) internal {
        UserData storage data = userData[user];
        
        if (data.lastActivityTime == 0) {
            data.lastActivityTime = block.timestamp;
            return;
        }

        uint timeSinceActive = block.timestamp - data.lastActivityTime;
        
        if (timeSinceActive >= DECAY_THRESHOLD && data.reputationScore > 0) {
            uint decayPeriods = timeSinceActive / DECAY_THRESHOLD;
            uint totalDecay = decayPeriods * DECAY_AMOUNT;
            
            if (totalDecay >= data.reputationScore) {
                data.reputationScore = 0;
            } else {
                data.reputationScore -= totalDecay;
            }
            
            data.streak = 0; // Reset streak after decay
        }
    }

    function stake() public payable {
        require(msg.value > 0, "Must stake some ETH");
        
        UserData storage user = userData[msg.sender];
        user.stakedAmount += msg.value;
        
        // Staking increases reputation
        uint reputationBonus = msg.value / (1 ether / STAKE_MULTIPLIER);
        user.reputationScore += reputationBonus;
        user.isPremium = user.stakedAmount >= 0.1 ether;

        emit Staked(msg.sender, msg.value, user.reputationScore);
    }

    function unstake(uint amount) public {
        UserData storage user = userData[msg.sender];
        require(user.stakedAmount >= amount, "Insufficient staked amount");
        
        user.stakedAmount -= amount;
        user.isPremium = user.stakedAmount >= 0.1 ether;
        
        payable(msg.sender).transfer(amount);

        emit Unstaked(msg.sender, amount);
    }

    function submitAppeal(uint recordIndex) public {
        require(recordIndex < records[msg.sender].length, "Invalid record index");
        require(!appealedRecords[msg.sender][recordIndex], "Already appealed");
        
        appealedRecords[msg.sender][recordIndex] = true;
        records[msg.sender][recordIndex].appealed = true;

        emit AppealSubmitted(msg.sender, recordIndex, block.timestamp);
    }

    function getReputation(address user)
        public
        view
        returns (uint)
    {
        return userData[user].reputationScore;
    }

    function getUserData(address user)
        public
        view
        returns (
            uint reputationScore,
            uint stakedAmount,
            uint lastActivityTime,
            uint totalCaptchasSolved,
            uint streak,
            bool isPremium
        )
    {
        UserData memory data = userData[user];
        return (
            data.reputationScore,
            data.stakedAmount,
            data.lastActivityTime,
            data.totalCaptchasSolved,
            data.streak,
            data.isPremium
        );
    }

    function getHistoryCount(address user)
        public
        view
        returns (uint)
    {
        return records[user].length;
    }

    function getRecord(address user, uint index)
        public
        view
        returns (
            string memory behaviorHash,
            uint reputation,
            uint timestamp,
            bool appealed
        )
    {
        require(index < records[user].length, "Invalid index");
        Record memory record = records[user][index];
        return (record.behaviorHash, record.reputation, record.timestamp, record.appealed);
    }

    function getStreak(address user) public view returns (uint) {
        return userData[user].streak;
    }
}
