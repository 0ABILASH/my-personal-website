import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
    setSubmitted(true);
  };

  return (
    <div className="contact">
      <section className="contact-header">
        <h1>Let's Connect!</h1>
        <p>I'd love to hear from you</p>
      </section>
      
      <section className="contact-content">
        <div className="contact-info">
          <h2>Hey, Come Say Hi! 👋</h2>
          <p>
            Whether you have a project idea, want to collaborate, or just 
            feel like chatting about tech — I'm all ears! Don't be a stranger.
          </p>
          <div className="contact-details">
            <p>📧 your.email@example.com</p>
            <p>📍 Your City, Country</p>
          </div>
        </div>
        
        {submitted ? (
          <div className="success-message">
            <h3>🎉 Thanks for reaching out!</h3>
            <p>I'll get back to you soon. In the meantime, feel free to explore the rest of the site!</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">What's your name?</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Your email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="hello@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">What's on your mind?</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Tell me what's up!"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Send Message 🚀</button>
          </form>
        )}
      </section>
    </div>
  );
}

export default Contact;
