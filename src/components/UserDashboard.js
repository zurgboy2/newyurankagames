import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangleIcon,
  BadgeEuroIcon,
  Edit3Icon,
  KeyRoundIcon,
  LogOutIcon,
  MailIcon,
  ReceiptTextIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TagIcon,
  UserIcon,
  WalletIcon,
  XIcon,
} from 'lucide-react';
import { makeRegistrationRequestCall } from '../api/api';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';

const UserDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [storeCredit, setStoreCredit] = useState('0.00');
  const [salesData, setSalesData] = useState({});
  const [discountAmount, setDiscountAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setName(sessionStorage.getItem('name') || '');
    setEmail(sessionStorage.getItem('email') || '');
    setPassword(sessionStorage.getItem('password') || '');

    const googleToken = sessionStorage.getItem('googleToken');
    const username = sessionStorage.getItem('username');

    fetchUserInfo(username, googleToken);
  }, []);

  async function fetchUserInfo(username, googleToken) {
    try {
      const data = await makeRegistrationRequestCall(
        'auth_script',
        'getUserInfo',
        { username, googleToken },
      );
      setStoreCredit(
        data.Value != null ? parseFloat(data.Value).toFixed(2) : '0.00',
      );
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  const handleSave = () => {
    setUpdateStatus(null);
    setShowPopup(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdateStatus(null);
  };

  async function handleConfirm() {
    const googleToken = sessionStorage.getItem('googleToken');
    const username = sessionStorage.getItem('username');
    const newEmail = email;
    const newName = name;

    try {
      const response = await makeRegistrationRequestCall(
        'auth_script',
        'updateProfile',
        {
          username,
          googleToken,
          newName,
          newEmail,
          password,
        },
      );

      if (response.success) {
        sessionStorage.setItem('name', newName);
        sessionStorage.setItem('email', newEmail);
        setUpdateStatus({
          success: true,
          message: 'Profile updated successfully.',
        });
        setTimeout(() => {
          setShowPopup(false);
          setIsEditing(false);
          setUpdateStatus(null);
        }, 2000);
      } else {
        setUpdateStatus({
          success: false,
          message:
            'Failed to update profile. Please check your password and try again.',
        });
      }
    } catch (e) {
      setUpdateStatus({
        success: false,
        message: 'Failed to update profile. Please try again.',
      });
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('googleToken');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('avatarurl');

    toast.success('Logged out successfully.');
    navigate('/login');
  }

  const salesTotal = Object.values(salesData)
    .reduce((sum, amount) => sum + Number(amount), 0)
    .toFixed(2);

  return (
    <section className="border-t bg-muted/20">
      <div className="container py-10 sm:py-14">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="heading-1">My Account</h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              Manage your profile, store credit, sales overview, and discount
              codes.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleLogout}
          >
            <LogOutIcon />
            Sign out
          </Button>
        </div>

        <div className="mt-8 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="grid gap-5">
            <Card className="p-0">
              <CardHeader className="border-b p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="heading-4 flex items-center gap-2 text-highlight">
                      <UserIcon className="size-5" />
                      Profile
                    </CardTitle>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Your account details used for reservations and checkout.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant={isEditing ? 'outline' : 'default'}
                    className="w-full sm:w-auto"
                    onClick={() => setIsEditing((value) => !value)}
                  >
                    <Edit3Icon />
                    {isEditing ? 'Close' : 'Edit profile'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                {loading ? (
                  <ProfileSkeleton />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    <InfoTile
                      icon={UserIcon}
                      label="Name"
                      value={name || 'Not set'}
                    />
                    <InfoTile
                      icon={MailIcon}
                      label="Email"
                      value={email || 'Not set'}
                    />
                    <InfoTile
                      icon={WalletIcon}
                      label="Store credit"
                      value={`$${storeCredit}`}
                      badge="Available"
                    />
                  </div>
                )}

                {isEditing && (
                  <div className="mt-6 rounded-lg border bg-background/50 p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FieldWithIcon
                        id="dashboard-name"
                        label="Name"
                        icon={UserIcon}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                      />
                      <FieldWithIcon
                        id="dashboard-email"
                        label="Email"
                        icon={MailIcon}
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </div>
                    <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleSave}>
                        Save changes
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="p-0">
              <CardHeader className="border-b p-5">
                <CardTitle className="heading-4 flex items-center gap-2 text-highlight">
                  <ReceiptTextIcon className="size-5" />
                  This month's sales
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {loading ? (
                  <SalesSkeleton />
                ) : Object.keys(salesData).length === 0 ? (
                  <EmptyState
                    icon={ReceiptTextIcon}
                    title="No sales data this month"
                    body="Sales linked to your account will appear here once available."
                  />
                ) : (
                  <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/40 text-left">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Date</th>
                          <th className="px-4 py-3 text-right font-semibold">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(salesData).map(([date, amount]) => (
                          <tr key={date} className="border-t">
                            <td className="px-4 py-3 text-muted-foreground">
                              {date}
                            </td>
                            <td className="px-4 py-3 text-right font-medium">
                              € {Number(amount).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t bg-muted/30">
                          <td className="px-4 py-3 font-semibold">Total</td>
                          <td className="px-4 py-3 text-right font-semibold">
                            € {salesTotal}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="p-0">
              <CardHeader className="border-b p-5">
                <CardTitle className="heading-4 flex items-center gap-2 text-highlight">
                  <ShieldCheckIcon className="size-5" />
                  Subscription details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <EmptyState
                  icon={ShieldCheckIcon}
                  title="No subscription details yet"
                  body="Subscription information will appear here when it is available for your account."
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-5">
            <Card className="p-0">
              <CardHeader className="border-b p-5">
                <CardTitle className="heading-4 flex items-center gap-2 text-highlight">
                  <WalletIcon className="size-5" />
                  Store credit
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {loading ? (
                  <Skeleton className="h-16 w-full rounded-lg" />
                ) : (
                  <>
                    <div className="text-4xl font-bold">${storeCredit}</div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Credit available on your account for eligible store
                      purchases.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="p-0">
              <CardHeader className="border-b p-5">
                <CardTitle className="heading-4 flex items-center gap-2 text-highlight">
                  <BadgeEuroIcon className="size-5" />
                  Generate discount code
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-5">
                <div className="flex gap-3 rounded-lg border border-highlight/40 bg-highlight/15 p-3 text-sm leading-relaxed text-white">
                  <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-highlight" />
                  <p>
                    Once a discount code is generated, it becomes a Shopify
                    coupon and cannot be transferred back to in-store credit
                    without contacting the IT admin.
                  </p>
                </div>
                <FieldWithIcon
                  id="discount-amount"
                  label="Amount"
                  icon={BadgeEuroIcon}
                  type="number"
                  placeholder="Enter amount"
                  value={discountAmount}
                  onChange={(event) => setDiscountAmount(event.target.value)}
                />
                <Button type="button" className="w-full">
                  <SparklesIcon />
                  Generate discount code
                </Button>
              </CardContent>
            </Card>

            <Card className="p-0">
              <CardHeader className="border-b p-5">
                <CardTitle className="heading-4 flex items-center gap-2 text-highlight">
                  <TagIcon className="size-5" />
                  Your discount codes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <EmptyState
                  icon={TagIcon}
                  title="No active discount codes"
                  body="Generated codes will appear here."
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {showPopup && (
          <PasswordDialog
            password={password}
            updateStatus={updateStatus}
            onPasswordChange={setPassword}
            onClose={() => setShowPopup(false)}
            onConfirm={handleConfirm}
          />
        )}
      </div>
    </section>
  );
};

const FieldWithIcon = ({
  id,
  label,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-highlight" />
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-10 pl-8"
        />
      </div>
    </div>
  );
};

const InfoTile = ({ icon: Icon, label, value, badge }) => {
  return (
    <div className="rounded-lg border bg-background/50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Icon className="size-4 text-highlight" />
          {label}
        </div>
        {badge && <Badge variant="secondary">{badge}</Badge>}
      </div>
      <div className="mt-2 break-words text-lg font-semibold">{value}</div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, body }) => {
  return (
    <div className="rounded-lg border border-dashed p-5 text-center">
      <Icon className="mx-auto size-5 text-highlight" />
      <div className="mt-3 font-semibold">{title}</div>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
};

const ProfileSkeleton = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-24 rounded-lg" />
      ))}
    </div>
  );
};

const SalesSkeleton = () => {
  return (
    <div className="grid gap-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-10 rounded-md" />
      ))}
    </div>
  );
};

const PasswordDialog = ({
  password,
  updateStatus,
  onPasswordChange,
  onClose,
  onConfirm,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <Card
        className="relative w-full max-w-md p-0 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3"
          aria-label="Close"
          onClick={onClose}
        >
          <XIcon />
        </Button>
        <CardHeader className="border-b p-5">
          <CardTitle className="heading-4 flex items-center gap-2 text-highlight">
            <KeyRoundIcon className="size-5" />
            Verify password
          </CardTitle>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Enter your password to confirm profile changes.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 p-5">
          <FieldWithIcon
            id="confirm-password"
            label="Password"
            icon={KeyRoundIcon}
            type="password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="Enter your password"
          />
          <Button type="button" onClick={onConfirm}>
            Confirm changes
          </Button>
          {updateStatus && (
            <p
              className={`rounded-lg border px-3 py-2 text-sm ${
                updateStatus.success
                  ? 'border-green-500/30 bg-green-500/10 text-green-400'
                  : 'border-destructive/30 bg-destructive/10 text-destructive'
              }`}
            >
              {updateStatus.message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
