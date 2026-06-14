import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Alert from '../components/Alert';

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, formData);
      setSuccess(response.data.message);
      setTimeout(() => router.push('/signin'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
        {success && <Alert type="success" message={success} />}
        {error && <Alert type="error" message={error} />}
        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={formData.email && !/^\S+@\S+\.\S+$/.test(formData.email) ? 'Invalid email address' : ''}
          />
          <InputField
            label="OTP"
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            placeholder="Enter the OTP"
            error={formData.otp && !/^\d{6}$/.test(formData.otp) ? 'OTP must be 6 digits' : ''}
          />
          <InputField
            label="New Password"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            error={formData.newPassword && formData.newPassword.length < 6 ? 'Password must be at least 6 characters' : ''}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Back to{' '}
          <Link href="/signin" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}