
![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat&logo=react)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Performance](https://img.shields.io/badge/Performance-Optimized-orange)

> A high-performance cryptocurrency dashboard built with React, featuring real-time market data, comprehensive analytics, and lightning-fast loading optimized for the best user experience.

## 🌟 **Features**

### 📊 **Market Data & Analytics**
- **Real-time data** for top 50 cryptocurrencies
- **Market highlights** with top gainers, losers, and trending coins
- **Comprehensive statistics** with 25+ market metrics
- **Individual coin details** with market data and social links
- **Advanced sorting & filtering** capabilities

### ⚡ **Performance Optimizations**
- **Lightning-fast loading** with intelligent caching
- **Optimized API calls** with rate limit protection
- **Progressive loading** with smooth skeleton states
- **Offline detection** and graceful fallbacks
- **Smart retry logic** with exponential backoff

### 🎨 **Modern UI/UX**
- **Responsive design** that works on all devices
- **Beautiful gradients** and smooth animations
- **Mobile-first** approach with touch-friendly interactions
- **Professional styling** with Tailwind CSS
- **Accessible components** with proper ARIA labels

## 🚀 **Quick Start**

### Prerequisites
- Node.js 16+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository** git clone https://github.com/yourusername/crypto-dashboard.git
cd crypto-dashboard

2. **Install dependencies**
3. **Start development server**

4. **Open in browser**
(http://localhost:3000)](http://localhost:3000)


### 🏗️ **Build for Production**

## 📱 **Screenshots**

### Dashboard View
<img width="1916" height="951" alt="image" src="https://github.com/user-attachments/assets/68591040-018c-43b0-bf61-be222ec864d9" />

### Market Highlights
<img width="1910" height="931" alt="image" src="https://github.com/user-attachments/assets/ea8c059b-9060-4242-83ee-39ce87da3843" />


### Statistics Page
<img width="1902" height="924" alt="image" src="https://github.com/user-attachments/assets/60b9909c-f27d-4600-a48d-616d6fb75b77" />


## 🛠️ **Tech Stack**

| Technology       | Version | Purpose                          |
|------------------|---------|----------------------------------|
| **React**        | 18.2.0  | Frontend framework               |
| **React Router** | 6.8.0   | Client-side routing              |
| **React Query**  | 3.39.3  | Data fetching & caching          |
| **Tailwind CSS** | 3.3.5   | Styling & responsive design      |
| **Axios**        | 1.6.0   | HTTP client for API calls        |
| **Lucide React** | 0.288.0 | Beautiful icons                  |
| **Hot Toast**    | 2.4.1   | Elegant notifications            |

## 📁 **Project Structure**

crypto-dashboard/
├── public/
├── src/
│ ├── components/
│ ├── pages/
│ ├── hooks/
│ ├── services/
│ ├── utils/
│ └── styles/
├── package.json
└── README.md

## 🔧 **Configuration**

### Environment Variables (Optional)
Create a `.env` file in the root directory:
CoinGecko API (Optional)
REACT_APP_COINGECKO_API_KEY=your_api_key_here

Performance Settings
REACT_APP_REFRESH_INTERVAL=300000
REACT_APP_CACHE_TIME=600000
REACT_APP_PAGE_SIZE=50

## 📊 **Performance Metrics**

| Metric          | Score | Description                       |
|-----------------|-------|-----------------------------------|
| **First Load**  | ~15s  | Initial API data fetch            |
| **Navigation**  | <100ms| Cached page transitions           |
| **Refresh**     | ~3s   | Smart data updates                |
| **Mobile Score**| 95/100| Lighthouse mobile performance     |
| **Bundle Size** | <2MB  | Optimized build size              |

## 🤝 **Contributing**

1. Fork the repo
2. Create a branch: `git checkout -b feature-name`
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature-name`
5. Open a Pull Request

## 🐛 **Known Issues & Troubleshooting**

- **Slow first load**: Normal initial API setup.
- **Rate limit errors**: Wait 1-2 minutes for retry.
- **Offline**: Shows offline status; reconnect to continue.

## 📄 **License**

MIT License

...



---

**Made with ❤️ for Mediplus Assignment**


