// pages/about.tsx
import { useState, ChangeEvent, FormEvent } from 'react';
import Layout from '../components/Layout';
import styles from '../styles/About.module.css';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const About: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setStatus('Message sent!');
      setFormData({ name: '', email: '', message: '' });
    } else {
      setStatus('Error sending message.');
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>About Us</h1>
        <p>
          We are a company that creates interactive storytelling experiences using cutting-edge technology.
        </p>
        <p>
          <strong>What we do:</strong> We generate personalized stories for you based on your preferences and character details.
        </p>
        <h2>Contact Us</h2>
        {status && <p className={styles.status}>{status}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Message:</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className={styles.textarea}
            ></textarea>
          </div>
          <button type="submit" className={styles.button}>
            Send Message
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default About;
