// pages/index.tsx
import { useState, ChangeEvent, FormEvent } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';

interface FormData {
  genre: string;
  age: string;
  name: string;
  gender: string;
}

const Home: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    genre: '',
    age: '',
    name: '',
    gender: '',
  });
  const [story, setStory] = useState<string>('');
  const [paid, setPaid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('paypal');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/generate-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setStory(data.story);
    setLoading(false);
  };

  const downloadPDF = async () => {
    const res = await fetch('/api/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ story }),
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'story.pdf');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  const handleKlarnaPayment = async () => {
    const res = await fetch('/api/klarna', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 5.0 }),
    });
    const data = await res.json();
    if (data.success) {
      setPaid(true);
      alert('Klarna payment successful!');
    } else {
      alert('Klarna payment failed!');
    }
  };

  const initialOptions = {
    'client-id': 'YOUR_PAYPAL_CLIENT_ID', // Replace with your PayPal client ID
    currency: 'USD',
    intent: 'capture',
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Create Your Story</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Genre:</label>
            <select name="genre" onChange={handleChange} required className={styles.select}>
              <option value="">Select Genre</option>
              <option value="action">Action</option>
              <option value="comedy">Comedy</option>
              <option value="drama">Drama</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Age:</label>
            <input type="number" name="age" onChange={handleChange} required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input type="text" name="name" onChange={handleChange} required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label>Gender:</label>
            <select name="gender" onChange={handleChange} required className={styles.select}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Generating...' : 'Generate Story'}
          </button>
        </form>
        {story && (
          <div className={styles.storySection}>
            <h2>Your Generated Story</h2>
            <p>{story}</p>
            {!paid && (
              <div className={styles.paymentSection}>
                <h3>Select Payment Method</h3>
                <div className={styles.paymentMethod}>
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                    />
                    PayPal
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="klarna"
                      checked={paymentMethod === 'klarna'}
                      onChange={() => setPaymentMethod('klarna')}
                    />
                    Klarna
                  </label>
                </div>
                {paymentMethod === 'paypal' && (
                  <PayPalScriptProvider options={initialOptions}>
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: { value: '5.00' },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order.capture().then(() => {
                          setPaid(true);
                          alert('PayPal payment successful!');
                        });
                      }}
                    />
                  </PayPalScriptProvider>
                )}
                {paymentMethod === 'klarna' && (
                  <button onClick={handleKlarnaPayment} className={styles.button}>
                    Pay with Klarna
                  </button>
                )}
              </div>
            )}
            {paid && (
              <div className={styles.downloadSection}>
                <button onClick={downloadPDF} className={styles.button}>
                  Download PDF
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
