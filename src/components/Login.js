import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { makeRequestCall } from '../api/api';
import { AuthCardShell } from './AuthCardShell';
import { AuthField } from './AuthFields';
import { Button } from './ui/button';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await makeRequestCall('auth_script', 'customerLogin', {
        username: formData.username,
        password: formData.password,
      });

      if (data.success) {
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('googleToken', data.googleToken);
        sessionStorage.setItem('name', data.name);
        sessionStorage.setItem('email', data.email);
        sessionStorage.setItem('avatarurl', data.image_url);
        toast.success('Logged in successfully.');
        navigate('/');
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
      eyebrow="Welcome back"
      title="Login"
      description="Access your Yuranka Games account, reservations, and event registration details."
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
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
        <div className="flex justify-end">
          <Button variant="link" className="h-auto p-0" asChild>
            <Link to="/reset-password">Forgot password?</Link>
          </Button>
        </div>
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? 'Processing...' : 'Login'}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Do not have an account?{' '}
        <Button variant="link" className="h-auto p-0" asChild>
          <Link to="/signup">Sign up</Link>
        </Button>
      </p>
    </AuthCardShell>
  );
};

export default Login;
