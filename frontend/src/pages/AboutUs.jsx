import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { contactService } from '../services/contactService';

const AboutUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const teamMembers = [
    {
      name: 'Shivam Keshari',
      role: 'Frontend & Backend (Database)',
      image: '/assets/images/Shivam2.jpeg',
      description: 'Shivam specializes in building robust backend systems and database architectures. With expertise in Node.js and MongoDB, he ensures our quiz platform runs smoothly and efficiently, handling complex data operations and API integrations.',
      skills: ['Node.js', 'MongoDB', 'Express.js', 'Database Design','API Development','n8n','Git','React'],
      contact: {
        phone: '+91 9347804434',
        location: 'Jaipur, India',
        email: 'shivamkeshari2327@gmail.com'
      },
      social: {
        github: 'https://github.com/SHIVAMKESHARI23',
        linkedin: 'https://www.linkedin.com/in/shivam-keshari-092530294/',
        instagram: 'https://instagram.com/shivamkeshari2006'
      }
    },
    {
      name: 'Manish Kumar',
      role: 'Frontend & Backend Developer',
      image: '/assets/images/manish.jpeg',
      description: 'Manish is a versatile full-stack developer who bridges the gap between frontend and backend development. His expertise in React.js and modern web technologies helps create seamless user experiences across our platform.',
      skills: ['React.js', 'Node.js', 'JavaScript','MongoDB', 'Full Stack Development'],
      contact: {
        phone: '+91 9760846762',
        location: 'Uttarakhand, India',
        email: 'singh.manish.rudp@gmail.com'
      },
      social: {
        github: 'https://github.com/Manishsingh863788',
        linkedin: 'https://www.linkedin.com/in/manishsingh82/',
        instagram: 'https://www.instagram.com/manishsingh8172/'
      }
    },
    {
      name: 'Kajal Singh',
      role: 'Team Leader & Frontend Developer',
      image: '/assets/images/kajal.jpeg',
      description: 'Kajal leads our development team with exceptional project management skills and frontend expertise. She coordinates all aspects of development while ensuring our user interface is intuitive, accessible, and visually appealing.',
      skills: ['Team Leadership', 'React.js', 'Project Management', 'Canva','Frontend Development', 'PHP','NODEJS','Tailwindcss'],
      contact: {
        phone: '+91 7572042070',
        location: 'Lucknow, India',
        email: 'kiara2005kajal@gmail.com'
      },
      social: {
        github: 'https://github.com/Kajal-2005',
        linkedin: 'https://www.linkedin.com/in/kajalsingh22/',
        instagram: 'https://www.instagram.com/miss._.kiyara/'
      }
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await contactService.submitContact(formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialClick = (url, platform) => {
    console.log(`Opening ${platform}: ${url}`);
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      toast.info(`${platform} profile coming soon!`);
    }
  };

  return (
    <div className="about-us">
      <h1>About Our Team</h1>
      <p className="about-subtitle">
        Meet the passionate developers behind Quiz Builder - a dedicated team committed to creating 
        innovative learning experiences through technology.
      </p>

      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member">
            <div className="member-image">
              <img 
                src={member.image} 
                alt={member.name}
                onLoad={() => console.log(`✅ Image loaded successfully: ${member.image}`)}
                onError={(e) => {
                  console.log(`❌ Image failed to load: ${member.image}`);
                  e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face';
                }}
              />
            </div>
            <div className="team-member-content">
              <div className="member-info">
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-description">{member.description}</p>
                
                <div className="member-skills">
                  <div className="skills-list">
                    {member.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="member-footer">
                <div className="member-contact">
                  <div className="contact-item">
                    <i className="fas fa-phone"></i>
                    <a href={`tel:${member.contact.phone}`}>{member.contact.phone}</a>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{member.contact.location}</span>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <a href={`mailto:${member.contact.email}`}>{member.contact.email}</a>
                  </div>
                </div>

                <div className="social-links">
                  <a 
                    href={member.social.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSocialClick(member.social.github, 'GitHub');
                    }}
                    title="GitHub Profile"
                  >
                    <i className="fab fa-github"></i>
                  </a>
                  <a 
                    href={member.social.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSocialClick(member.social.linkedin, 'LinkedIn');
                    }}
                    title="LinkedIn Profile"
                  >
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a 
                    href={member.social.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSocialClick(member.social.instagram, 'Instagram');
                    }}
                    title="Instagram Profile"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="contact-section">
        <h2>Get In Touch</h2>
        <p>Have questions about our quiz platform? Want to collaborate? Feel free to reach out!</p>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group full-width">
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group full-width">
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group full-width">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AboutUs;