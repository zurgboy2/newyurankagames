import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { makeRequestCall } from '../api/api';
import { Button } from './ui/button';
import { AuthCardShell } from './AuthCardShell';
import { AuthField } from './AuthFields';
import OrientationWarning from './OrientationWarning';
import Navbar from './Navbar';
import Footer from './Footer';
import { toast } from 'sonner';

/**
 * ResetPassword component styled to match the Login/Sign Up page.
 * - mode "request": enter email or username to request a reset link
 * - mode "reset": token present -> verify token then allow setting new password
 */
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [mode, setMode] = useState(token ? 'reset' : 'request');
  const [identifier, setIdentifier] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [loadingMode, setLoadingMode] = useState('');
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (token) {
      (async () => {
        setLoadingMode('verify');
        try {
          const res = await makeRequestCall('auth_script', 'verifyResetToken', {
            token,
          });
          setVerifyStatus(res);
        } catch (err) {
          console.error(err);
          setVerifyStatus({ success: false, message: 'Verification failed' });
        } finally {
          setLoadingMode('');
        }
      })();
    }
  }, [token]);

  const handleRequest = async (e) => {
    e && e.preventDefault();
    if (!identifier) {
      toast.error('Please enter your email or username');
      return;
    }
    setRequestLoading(true);
    try {
      const res = await makeRequestCall('auth_script', 'requestPasswordReset', {
        emailOrUsername: identifier,
      });
      toast.success(
        res.message || 'If an account exists, an email will be sent.',
      );
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Request failed');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleReset = async (e) => {
    e && e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill both password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoadingMode('save');
    try {
      const res = await makeRequestCall('auth_script', 'resetPassword', {
        token,
        newPassword,
      });
      if (res.success) {
        toast.success('Password updated. Please log in.');
        navigate('/login');
      } else {
        toast.error(res.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to reset password');
    } finally {
      setLoadingMode('');
    }
  };

  return (
    <>
      <OrientationWarning />
      <Navbar />
      <AuthCardShell
        eyebrow="Account access"
        title={mode === 'request' ? 'Forgot Password' : 'Reset Password'}
        description={
          mode === 'request'
            ? 'Enter your email or username and we will send a password reset link if an account exists.'
            : 'Choose a new password for your Yuranka Games account.'
        }
      >
        {mode === 'request' && (
          <>
            <form className="grid gap-4" onSubmit={handleRequest}>
              <AuthField
                icon="email"
                label="Email or Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email or username"
              />

              <Button type="submit" size="lg" disabled={requestLoading}>
                {requestLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <Button
              variant="link"
              className="mt-4 h-auto w-full p-0"
              onClick={() => navigate('/login')}
            >
              Back to login
            </Button>
          </>
        )}

        {mode === 'reset' && (
          <>
            {loadingMode === 'verify' && (
              <p className="text-sm text-muted-foreground">Loading...</p>
            )}
            {loadingMode === 'save' && (
              <p className="text-sm text-muted-foreground">
                Confirming new password...
              </p>
            )}

            {!loadingMode && verifyStatus && !verifyStatus.success && (
              <div className="grid gap-4">
                <p className="text-sm text-destructive">
                  {verifyStatus.message || 'Token invalid or expired.'}
                </p>
                <Button
                  size="lg"
                  onClick={() => {
                    setMode('request');
                    setVerifyStatus(null);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                >
                  Request a new reset link
                </Button>
              </div>
            )}

            {!loadingMode && verifyStatus && verifyStatus.success && (
              <form className="grid gap-4" onSubmit={handleReset}>
                <AuthField
                  icon="lock"
                  label="New password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  showPassword={showNewPassword}
                  onTogglePassword={() => setShowNewPassword(!showNewPassword)}
                  required
                />

                <AuthField
                  icon="lock"
                  label="Confirm password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  showPassword={showConfirmPassword}
                  onTogglePassword={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  required
                />

                <Button
                  type="submit"
                  size="lg"
                  disabled={loadingMode === 'save'}
                >
                  {loadingMode === 'save' ? 'Saving...' : 'Save New Password'}
                </Button>

                <Button
                  variant="link"
                  className="h-auto p-0"
                  onClick={() => navigate('/login')}
                >
                  Back to login
                </Button>
              </form>
            )}
          </>
        )}
      </AuthCardShell>
      <Footer />
    </>
  );
};

export default ResetPassword;
