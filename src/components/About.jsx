import React, { useState, useEffect } from 'react';
import '../App.css'; // Import your CSS file for styles
import { 
  FaHospital, 
  FaFlask, 
  FaMedkit, 
  FaUsers, 
  FaShieldAlt,
  FaChartLine,
  FaCogs,
  FaAward,
  FaCheckCircle,
  FaLightbulb
} from 'react-icons/fa'; // Importing icons from react-icons
import automatedImg from '../Images/AboutImages/automatedcheck.jpg';
import efficientImg from '../Images/AboutImages/efficientteam.jpg';
import hospitalImg from '../Images/AboutImages/hospitalfocus.jpg';
import safeImg from '../Images/AboutImages/safeconsume.jpg';

const About = () => {
  const [isVisible, setIsVisible] = useState({});
  const [counters, setCounters] = useState({
    hospitals: 0,
    tests: 0,
    accuracy: 0,
    satisfaction: 0
  });

  useEffect(() => {
    // Animate counters
    const animateCounters = () => {
      const targets = {
        hospitals: 150,
        tests: 50000,
        accuracy: 99,
        satisfaction: 98
      };

      const duration = 2000;
      const increment = 50;
      
      Object.keys(targets).forEach(key => {
        let current = 0;
        const target = targets[key];
        const step = target / (duration / increment);
        
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
        }, increment);
      });
    };

    const timer = setTimeout(animateCounters, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCardVisible = (index) => {
    setIsVisible(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="hero-background-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <FaShieldAlt className="badge-icon" />
            <span>Trusted Healthcare Partner</span>
          </div>
          <h1 className="about-title">
            Revolutionizing Healthcare 
            <span className="highlight-text"> Quality Control</span>
          </h1>
          <p className="about-subtitle">
            Our advanced platform ensures hospitals receive the highest quality medicines and consumables 
            through automated testing, intelligent monitoring, and comprehensive quality assurance.
          </p>
          <div className="hero-features">
            <div className="hero-feature">
              <FaCheckCircle className="feature-check" />
              <span>FDA Compliant</span>
            </div>
            <div className="hero-feature">
              <FaCheckCircle className="feature-check" />
              <span>Real-time Monitoring</span>
            </div>
            <div className="hero-feature">
              <FaCheckCircle className="feature-check" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="about-container">
        {/* Mission Section */}
        <div className="mission-section">
          <div className="section-header">
            <div className="section-badge">
              <FaLightbulb className="badge-icon" />
              <span>Our Mission</span>
            </div>
            <h2>Transforming Healthcare Through Innovation</h2>
            <p>
              We're dedicated to eliminating human errors, improving operational efficiency, 
              and ensuring unwavering compliance with safety regulations in healthcare facilities worldwide.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="section-header">
            <h2>Why Choose Our Platform?</h2>
            <p>Discover the key features that make us the preferred choice for healthcare quality management</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card modern-card" 
                 onMouseEnter={() => handleCardVisible(0)}
                 style={{animationDelay: '0.1s'}}>
              <div className="card-image-container">
                <img src={automatedImg} alt="Automated Testing" className="feature-img" />
                <div className="image-overlay">
                  <FaFlask className="overlay-icon" />
                </div>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <FaFlask className="card-icon" />
                  <h3>Automated Management</h3>
                </div>
                <p>
                  Advanced automated systems ensure that only the best quality products are approved, 
                  reducing human error and increasing efficiency by 85%.
                </p>
                <div className="card-features">
                  <span className="feature-tag">AI-Powered</span>
                  <span className="feature-tag">Real-time</span>
                </div>
              </div>
            </div>

            <div className="feature-card modern-card" 
                 onMouseEnter={() => handleCardVisible(1)}
                 style={{animationDelay: '0.2s'}}>
              <div className="card-image-container">
                <img src={hospitalImg} alt="Hospital Focus" className="feature-img" />
                <div className="image-overlay">
                  <FaHospital className="overlay-icon" />
                </div>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <FaHospital className="card-icon" />
                  <h3>Hospital Focused</h3>
                </div>
                <p>
                  Specifically designed to meet the unique needs of hospitals for comprehensive 
                  quality control in medical supplies and pharmaceuticals.
                </p>
                <div className="card-features">
                  <span className="feature-tag">Specialized</span>
                  <span className="feature-tag">Compliant</span>
                </div>
              </div>
            </div>

            <div className="feature-card modern-card" 
                 onMouseEnter={() => handleCardVisible(2)}
                 style={{animationDelay: '0.3s'}}>
              <div className="card-image-container">
                <img src={safeImg} alt="Safe Consumables" className="feature-img" />
                <div className="image-overlay">
                  <FaMedkit className="overlay-icon" />
                </div>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <FaMedkit className="card-icon" />
                  <h3>Safe Consumables</h3>
                </div>
                <p>
                  All consumables undergo rigorous inspection processes to meet and exceed 
                  international safety and health standards for patient protection.
                </p>
                <div className="card-features">
                  <span className="feature-tag">Certified</span>
                  <span className="feature-tag">Validated</span>
                </div>
              </div>
            </div>

            <div className="feature-card modern-card" 
                 onMouseEnter={() => handleCardVisible(3)}
                 style={{animationDelay: '0.4s'}}>
              <div className="card-image-container">
                <img src={efficientImg} alt="Efficient Team" className="feature-img" />
                <div className="image-overlay">
                  <FaUsers className="overlay-icon" />
                </div>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <FaUsers className="card-icon" />
                  <h3>Expert Team</h3>
                </div>
                <p>
                  Our dedicated team of healthcare professionals and technical experts monitors 
                  the system 24/7 to ensure seamless operations and optimal performance.
                </p>
                <div className="card-features">
                  <span className="feature-tag">24/7 Support</span>
                  <span className="feature-tag">Expert Care</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="technology-section">
          <div className="tech-content">
            <div className="tech-text">
              <div className="section-badge">
                <FaCogs className="badge-icon" />
                <span>Advanced Technology</span>
              </div>
              <h2>Powered by Cutting-Edge Innovation</h2>
              <p>
                Our platform leverages the latest in AI, machine learning, and IoT technologies 
                to provide unparalleled quality assurance and monitoring capabilities.
              </p>
              <div className="tech-features">
                <div className="tech-item">
                  <FaShieldAlt className="tech-icon" />
                  <div>
                    <h4>Advanced Security</h4>
                    <p>Enterprise-grade security with end-to-end encryption</p>
                  </div>
                </div>
                <div className="tech-item">
                  <FaChartLine className="tech-icon" />
                  <div>
                    <h4>Predictive Analytics</h4>
                    <p>AI-powered insights for proactive quality management</p>
                  </div>
                </div>
                <div className="tech-item">
                  <FaCogs className="tech-icon" />
                  <div>
                    <h4>Seamless Integration</h4>
                    <p>Easy integration with existing hospital management systems</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="tech-visual">
              <div className="tech-circle">
                <div className="inner-circle">
                  <FaCogs className="center-icon" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Section */}
        <div className="closing-section">
          <div className="closing-content">
            <FaAward className="closing-icon" />
            <h2>Your Trusted Healthcare Partner</h2>
            <p className="closing-statement">
              Our unwavering commitment to quality, safety, and innovation makes us the trusted 
              partner for healthcare institutions worldwide. Join us in our mission to ensure 
              the highest standards of patient care through superior quality management.
            </p>
            <div className="commitment-badges">
              <div className="badge">
                <FaShieldAlt />
                <span>Quality Assured</span>
              </div>
              <div className="badge">
                <FaAward />
                <span>Industry Leader</span>
              </div>
              <div className="badge">
                <FaCheckCircle />
                <span>Certified Solutions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;