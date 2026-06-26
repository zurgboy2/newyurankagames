import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { makeRequestCall } from '../api/api';
import { AuthCardShell } from './AuthCardShell';
import { AuthField } from './AuthFields';
import { Button } from './ui/button';
import { toast } from 'sonner';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (formData.username.length <= 2) {
      setUsernameAvailable(null);
      return;
    }

    const timeout = setTimeout(async () => {
      setCheckingUsername(true);
      try {
        const data = await makeRequestCall('auth_script', 'check_username', {
          username: formData.username,
        });
        setUsernameAvailable(Boolean(data.available));
      } catch (error) {
        console.error('Error checking username:', error);
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.username]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const data = await makeRequestCall('auth_script', 'signUp', formData);

      if (data.success) {
        toast.success('Sign up successful! Please log in.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Request failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCardShell
      eyebrow="Create account"
      title="Sign Up"
      description="Join the Yuranka Games community for faster event registration and account access."
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <AuthField
          icon="user"
          label="Name"
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <div className="grid gap-2">
          <AuthField
            icon="user"
            label="Username"
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {formData.username.length > 2 && (
            <p
              className={
                checkingUsername
                  ? 'text-sm text-muted-foreground'
                  : usernameAvailable
                    ? 'text-sm text-green-500'
                    : 'text-sm text-destructive'
              }
            >
              {checkingUsername
                ? 'Checking availability...'
                : usernameAvailable
                  ? 'Username is available'
                  : 'Username is already taken'}
            </p>
          )}
        </div>
        <AuthField
          icon="email"
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <AuthField
          icon="lock"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          required
        />
        <AuthField
          icon="lock"
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          required
        />
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? 'Processing...' : 'Sign Up'}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Button variant="link" className="h-auto p-0" asChild>
          <Link to="/login">Login</Link>
        </Button>
      </p>
    </AuthCardShell>
  );
};

export default Signup;
