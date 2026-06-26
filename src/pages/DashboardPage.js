import { useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import UserDashboard from '../components/UserDashboard';
import OrientationWarning from '../components/OrientationWarning';

function DashboardPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <OrientationWarning />
      <Navbar />
      <UserDashboard />
      <Footer />
    </>
  );
}

export default DashboardPage;
