import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null); // Reset message before sending request

    // Simulate API call to reset password
    setTimeout(() => {
      setLoading(false);
      setMessage('A password reset link has been sent to your email.');
    }, 2000);
  };

  return (
    <div className="form-groupForgotPassword col-md-6">
      <form onSubmit={handleSubmit}>
        <div className="header-textLR mb-4">
          <h1>Forgot Password</h1>
        </div>
        <div className="input-groupLR mb-3">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="form-control form-control-lg bg-light fs-6"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {message && <div className="text-success mb-3">{message}</div>}
        <div className="input-groupLR mb-3 justify-content-center">
          <button className="btn text-white w-50 fs-6" type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
