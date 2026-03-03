# 🔐 Advanced CAPTCHA System with Blockchain & AI

A next-generation CAPTCHA system featuring blockchain-based reputation tracking, AI-powered bot detection, gamification, and multiple CAPTCHA types for enhanced security and user experience.

## 🌟 Unique Features

### 1. **Multiple CAPTCHA Types**
- **Math CAPTCHA**: Arithmetic challenges with adaptive difficulty
- **Puzzle CAPTCHA**: Interactive sliding puzzles (3x3, 4x4, 5x5 grids)
- **Audio CAPTCHA**: Accessibility-first spoken character recognition
- **Image CAPTCHA**: Visual pattern recognition challenges

### 2. **AI-Powered Bot Detection** 🤖
Advanced behavioral analysis that tracks:
- **Mouse Movement Patterns**: Analyzes movement entropy and naturalness
- **Keystroke Dynamics**: Monitors typing rhythm and intervals
- **Focus Events**: Tracks tab/window switching behavior
- **Composite Scoring**: Multi-factor bot probability assessment

### 3. **Blockchain Reputation System** ⛓️
Enhanced smart contract features:
- **Reputation Scoring**: Dynamic scoring based on performance
- **Streak Tracking**: Consecutive success bonuses
- **Reputation Decay**: Automatic decay for inactive users
- **Staking Mechanism**: Stake ETH to boost reputation
- **Appeal System**: Challenge suspicious activity flags
- **Premium Status**: Unlock benefits with staking

### 4. **Gamification System** 🏆
Engage users with:
- **7 Unique Achievements**:
  - 🎯 First Victory
  - ⚡ Speed Demon
  - 🔥 Perfect Streak
  - 💯 Centurion
  - 👑 Master Solver
  - 🌈 Variety Seeker
  - ⭐ Reputation Master
- **Leaderboard**: Global ranking system
- **Performance Tracking**: Solve times, accuracy, streaks
- **Score Calculation**: Composite scoring algorithm

### 5. **Real-Time Analytics Dashboard** 📊
Comprehensive insights including:
- Personal performance metrics
- Global statistics
- Bot detection rates
- CAPTCHA type breakdown
- Achievement tracking
- Live leaderboard

## 🏗️ Architecture

```
├── Frontend (React)
│   ├── Multiple CAPTCHA components
│   ├── Analytics Dashboard
│   ├── Behavior tracking integration
│   └── Gamification UI
│
├── Backend (Node.js/Express)
│   ├── CAPTCHA generators (Math, Puzzle, Audio, Image)
│   ├── Bot detection algorithms
│   ├── Gamification engine
│   ├── Analytics aggregation
│   └── Blockchain service integration
│
└── Blockchain (Solidity/Hardhat)
    ├── Enhanced ReputationContract
    ├── Staking mechanism
    ├── Decay system
    └── Appeal functionality
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Hardhat for blockchain development

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd info-sec-project
```

2. **Install Blockchain Dependencies**
```bash
cd blockchain
npm install
```

3. **Compile and Deploy Smart Contract**
```bash
npx hardhat compile
npx hardhat node  # In a separate terminal
npx hardhat run scripts/deploy.js --network localhost
```

4. **Install Backend Dependencies**
```bash
cd ../backend
npm install
```

5. **Update Contract Address**
- Copy the deployed contract address
- Update `backend/services/blockchainService.js` with the new address
- Copy `blockchain/artifacts/contracts/ReputationContract.sol/ReputationContract.json` to `backend/blockchain/`

6. **Start Backend Server**
```bash
node server.js
```

7. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

8. **Start Frontend Development Server**
```bash
npm start
```

## 📡 API Endpoints

### Math CAPTCHA
- `GET /captcha/new` - Generate new math CAPTCHA
- `POST /captcha/verify` - Verify math solution

### Puzzle CAPTCHA
- `GET /captcha/puzzle/new` - Generate puzzle CAPTCHA
- `POST /captcha/puzzle/verify` - Verify puzzle solution

### Audio CAPTCHA
- `GET /captcha/audio/new` - Generate audio CAPTCHA
- `POST /captcha/audio/verify` - Verify audio solution

### Analytics & Gamification
- `GET /captcha/analytics` - Get system analytics
- `GET /captcha/leaderboard` - Get leaderboard and user stats

## 🎮 Gamification Details

### Achievement System
Users earn achievements by completing specific challenges:

| Achievement | Requirement | Icon |
|------------|-------------|------|
| First Victory | Complete 1 CAPTCHA | 🎯 |
| Speed Demon | Solve in <3 seconds | ⚡ |
| Perfect Streak | 10 consecutive correct | 🔥 |
| Centurion | Complete 100 CAPTCHAs | 💯 |
| Master Solver | 95% accuracy over 50 | 👑 |
| Variety Seeker | Try all CAPTCHA types | 🌈 |
| Reputation Master | Reach reputation of 50 | ⭐ |

### Score Calculation
```javascript
Score = (TotalSolved × 10) 
      + (LongestStreak × 50) 
      + (Achievements × 100) 
      + (SpeedBonus × 5) 
      + (Accuracy × 2)
```

## 🔒 Bot Detection Algorithm

The system analyzes three key behavior categories:

### 1. Mouse Movement (40% weight)
- Movement entropy
- Angle variations
- Natural irregularity patterns

### 2. Keystroke Dynamics (40% weight)
- Typing intervals
- Pattern variance
- Human-like timing

### 3. Focus Events (20% weight)
- Tab switches
- Window focus changes
- Session duration

**Threshold**: 60+ score = Human, <60 = Suspicious

## ⛓️ Smart Contract Features

### Core Functions
```solidity
updateReputation(behaviorHash, suspicious) - Update user reputation
stake() - Stake ETH for reputation boost
unstake(amount) - Withdraw staked ETH
submitAppeal(recordIndex) - Appeal suspicious flag
getUserData(address) - Get complete user data
getStreak(address) - Get current streak
```

### Automatic Systems
- **Decay**: -1 reputation per 30 days of inactivity
- **Streak Bonuses**: +2 reputation every 10 consecutive solves
- **Premium Status**: Unlocked at 0.1 ETH staked

## 📊 Frontend Components

### New Components
- `PuzzleCaptcha.js` - Interactive puzzle interface
- `AudioCaptcha.js` - Web Speech API integration
- `AnalyticsDashboard.js` - Comprehensive stats display

### Enhanced Components
- `MathCaptcha.js` - Now with behavior tracking
- `DemoPage.js` - Multi-type selector with feature showcase

### Utility Classes
- `BehaviorTracker` - Client-side behavior monitoring
- Real-time event listeners for mouse, keyboard, and focus

## 🎨 Styling

All components feature:
- Modern gradient designs
- Smooth animations
- Responsive layouts
- Accessibility considerations
- Dark mode compatible color schemes

## 🔧 Configuration

### Difficulty Mapping
```javascript
Reputation < 3:  Hard difficulty
Reputation 3-7:  Medium difficulty  
Reputation > 7:  Easy difficulty
```

### Bot Detection Thresholds
```javascript
Suspicious if:
- Solve time < 2-5 seconds (varies by type)
- Bot score < 60
- Zero mouse movements
- Perfectly uniform keystroke timing
```

## 🚦 Running Tests

### Backend Tests
```bash
cd backend
npm test
```

### Smart Contract Tests
```bash
cd blockchain
npx hardhat test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📈 Performance Metrics

The system tracks:
- Average solve times per CAPTCHA type
- Success rates
- Bot detection accuracy
- User engagement metrics
- Blockchain transaction costs

## 🔐 Security Features

1. **SHA-256 Hashing**: All behavior data is hashed before blockchain storage
2. **Immutable Records**: Blockchain ensures tamper-proof history
3. **Multi-Factor Bot Detection**: Reduces false positives
4. **Appeal Mechanism**: Users can challenge flags
5. **Rate Limiting**: Prevents spam and abuse (implement in production)

## 🌐 Browser Compatibility

- Chrome/Edge (Recommended)
- Firefox
- Safari (Web Speech API may vary)
- Mobile browsers (responsive design)

## 📝 Future Enhancements

- [ ] Machine learning model for bot detection
- [ ] NFT achievement badges
- [ ] Cross-platform reputation syncing
- [ ] Real audio file generation for Audio CAPTCHA
- [ ] Image-based puzzle CAPTCHAs with real photos
- [ ] Multi-language support
- [ ] Advanced analytics with charts
- [ ] Social features (share achievements)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

MIT License - See LICENSE file for details

## 👥 Authors

Your Team Name

## 🙏 Acknowledgments

- OpenZeppelin for smart contract standards
- React community for excellent documentation
- Web Speech API for accessibility features
- Hardhat for blockchain development tools

---

**Made with ❤️ for enhanced web security and user experience**
