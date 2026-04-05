// export const DeveloperConsoleLandingPage = () => {
    
    
//     return (
//         <>
//                 <div className="developperConsoleLandingPage"></div>

//         </>
//     )
// }


import "../Styles/HashCompanionDeveloperConsoleLanding.css";
import { Link } from "react-router-dom";

const HashCompanionDeveloperConsoleLanding = () => {
 
 
 
    return (
    <div className="dapp-container">
      {/* Header */}
      <header className="dapp-header">
        <div className="logo-section">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                fill="#4c1d95"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="#3730a3"
                strokeWidth="2"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="#312e81"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="logo-text">
            <h1>HCDevelopperConsole</h1>
            <p className="tagline">Your Hedera Web3 Developer Console for HashCompanion</p>
          </div>
        </div>
      </header>

      {/* Wallet Section */}
      <main className="dapp-main">
        <div className="welcome-section">
          <h2>Welcome to HashCompanion Developer Console</h2>
          <p className="welcome-text">
            Connect your Hedera wallet to start managing your apps and interacting with HashCompanionStore Developer Console.
          </p>
        </div>

        <div className="connect-section">
          <button className="connect-btn primary">
            <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 6V10L13 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>
              <Link to="/Console">
                Dive into the console
              </Link>
            </span>
          </button>
          <button className="connect-btn secondary">
            <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="2" fill="currentColor"/>
            </svg>
            <span>
              <strong>
              <Link to="https://chromewebstore.google.com/detail/hashcompanion/jlmffipfjhmnknffhdhpaecelheonach?authuser=0&hl=en">
                    create here!
              </Link>
              </strong>
            </span>
          </button>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h3>Why Use HashCompanion Developer Console?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4>Secure & Transparent</h4>
              <p>Interacts with Hedera's blockchain to ensure complete security and transparency of your app data.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4>Full Control</h4>
              <p>Manage your apps and wallet details from within the console. You are in control.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="3.27 6.96 12 12.01 20.73 6.96"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="12"
                    y1="22.08"
                    x2="12"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4>Anywhere Access</h4>
              <p>Access your apps, manage your wallet, and interact with Hedera from anywhere, on any device.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="dapp-footer">
        <div className="footer-links">
          <Link to="https://github.com/rocker-bell/HashCompanionDevelopperConsole" className="footer-link">
            GitHub
          </Link>
          <Link to="https://github.com/rocker-bell/HashCompanionDevelopperConsole" className="footer-link">
            Documentation
          </Link>
          <Link to="https://github.com/rocker-bell/HashCompanionDevelopperConsole" className="footer-link">
            Support
          </Link>
        </div>
        <p className="copyright">© 2026 HashCompanion. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HashCompanionDeveloperConsoleLanding;