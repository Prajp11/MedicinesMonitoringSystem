import React, { useState } from "react";
import { 
  FaCheckCircle, 
  FaHospital, 
  FaEnvelope, 
  FaCommentDots,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaHeadset
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    hospitalName: "",
    hospitalEmail: "",
    remark: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log("Form submitted:", formData);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="contact-title">
            <FaHeadset className="title-icon" />
            Get In Touch
          </h1>
          <p className="contact-subtitle">
            Ready to transform your hospital's quality monitoring? Let's connect and discuss how we can help.
          </p>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-content">
          {/* Contact Information Section */}
          <div className="contact-info-section">
            <div className="info-card professional-contact-card">
              <div className="info-header professional-header">
                <h3 className="contact-main-title">Contact Information</h3>
                <p className="contact-main-subtitle">We're here to help you 24/7</p>
              </div>
              
              <div className="contact-details professional-contact-details">
                <div className="contact-item professional-contact-item">
                  <div className="contact-icon professional-contact-icon phone-icon">
                    <FaPhone />
                  </div>
                  <div className="contact-text professional-contact-text">
                    <h4 className="contact-support-title">Phone Support</h4>
                    <p className="contact-support-value">+91 8856866124</p>
                    <span className="contact-support-meta">Available 24/7</span>
                  </div>
                </div>

                <div className="contact-item professional-contact-item">
                  <div className="contact-icon professional-contact-icon email-icon">
                    <FaEnvelope />
                  </div>
                  <div className="contact-text professional-contact-text">
                    <h4 className="contact-support-title">Email Support</h4>
                    <p className="contact-support-value">support@qualitymonitor.com</p>
                    <span className="contact-support-meta">Response within 2 hours</span>
                  </div>
                </div>

                {/* <div className="contact-item">
                  <div className="contact-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="contact-text">
                    <h4>Our Location</h4>
                    <p>Healthcare Innovation Center</p>
                    <span>New York, NY 10001</span>
                  </div>
                </div> */}

                {/* <div className="contact-item">
                  <div className="contact-icon">
                    <FaClock />
                  </div>
                  <div className="contact-text">
                    <h4>Business Hours</h4>
                    <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <span>Emergency support available 24/7</span>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="contact-form-section">
            {submitted ? (
              <div className="success-container">
                <div className="success-animation">
                  <FaCheckCircle className="success-icon" />
                </div>
                <h3 className="success-title">Message Sent Successfully!</h3>
                <p className="success-message">
                  Thank you for reaching out to us. Our team has received your message and will get back to you within 24 hours.
                </p>
                <div className="success-details">
                  <div className="next-steps">
                    <h4>What happens next?</h4>
                    <ul>
                      <li>Our team will review your inquiry</li>
                      <li>A specialist will contact you within 24 hours</li>
                      <li>We'll schedule a personalized demo if requested</li>
                    </ul>
                  </div>
                </div>
                <button 
                  className="new-message-btn"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="form-container">
                <div className="form-header">
                  <h3>Send us a Message</h3>
                  <p>Fill out the form below and we'll get back to you as soon as possible</p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="hospitalName">
                        <FaHospital className="label-icon" />
                        Hospital Name *
                      </label>
                      <input
                        type="text"
                        id="hospitalName"
                        name="hospitalName"
                        value={formData.hospitalName}
                        onChange={handleChange}
                        placeholder="Enter your hospital name"
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="hospitalEmail">
                        <FaEnvelope className="label-icon" />
                        Hospital Email *
                      </label>
                      <input
                        type="email"
                        id="hospitalEmail"
                        name="hospitalEmail"
                        value={formData.hospitalEmail}
                        onChange={handleChange}
                        placeholder="Enter your hospital email address"
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="remark">
                        <FaCommentDots className="label-icon" />
                        Message
                      </label>
                      <textarea
                        id="remark"
                        name="remark"
                        value={formData.remark}
                        onChange={handleChange}
                        placeholder="Tell us about your requirements, questions, or how we can help you..."
                        rows="5"
                        className="form-textarea"
                      />
                    </div>
                  </div>

                  <button type="submit" className="submit-btn">
                    <span>Send Message</span>
                    <FaCheckCircle className="btn-icon" />
                  </button>
                </form>

                <div className="form-footer">
                  <p>
                    <FaCheckCircle className="footer-icon" />
                    Your information is secure and will never be shared with third parties
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="features-highlight">
          <h3>Why Choose Our Quality Monitoring System?</h3>
          <div className="feature-grid">
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <h4>Real-time Analytics</h4>
              <p>Monitor your hospital's quality metrics in real-time</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h4>HIPAA Compliant</h4>
              <p>Fully secure and compliant with healthcare regulations</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h4>Easy Integration</h4>
              <p>Seamlessly integrate with your existing systems</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <h4>Custom Solutions</h4>
              <p>Tailored to meet your specific hospital needs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;