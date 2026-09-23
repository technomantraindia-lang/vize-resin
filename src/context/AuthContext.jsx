import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY = 'vize_user_auth_v1';
const ORDERS_STORAGE_KEY = 'vize_user_orders_v1';

// Initial mock orders to provide a rich experience out of the box
const DEFAULT_ORDERS = [
  {
    id: 'VZ-98241',
    date: '20 Sep 2026',
    status: 'In Transit',
    statusStep: 3, // 1: Confirmed, 2: Packed, 3: In Transit, 4: Delivered
    estimatedDelivery: '25 Sep 2026',
    carrier: 'BlueDart Express (AWB: BLU99824108)',
    total: '₹14,990',
    itemCount: 3,
    items: [
      {
        name: 'Vize Cast (50mm Deep Pour)',
        size: '10kg Kit (7.5kg A + 2.5kg B)',
        color: 'Water-Clear Crystal',
        qty: 1,
        price: '₹7,999',
        image: '/logos/Vize Cast Max.png'
      },
      {
        name: 'Vize Metallic Pigment Trio',
        size: '3x 50g Jars',
        color: 'Petrol Teal, Liquid Gold, Copper',
        qty: 2,
        price: '₹1,998',
        image: '/colors/Petrol Teal.png'
      },
      {
        name: 'Vize TopCoat Ultra Gloss',
        size: '4kg Table-top Scratch Resistant Kit',
        color: 'Super Clear',
        qty: 1,
        price: '₹4,993',
        image: '/logos/Vize Art Max.png'
      }
    ],
    shippingAddress: {
      fullName: 'Vikram Mehta',
      addressLine: 'Plot 42, Industrial Area Phase II, Near Express Highway',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      phone: '+91 98765 43210'
    }
  },
  {
    id: 'VZ-92410',
    date: '12 Aug 2026',
    status: 'Delivered',
    statusStep: 4,
    estimatedDelivery: '16 Aug 2026',
    carrier: 'Delhivery Surface (AWB: DLV44102981)',
    total: '₹28,500',
    itemCount: 4,
    items: [
      {
        name: 'Vize Prime 100 Epoxy Primer',
        size: '20kg Industrial Drum',
        color: 'Clear Penetrating',
        qty: 1,
        price: '₹12,400',
        image: '/bucket.png'
      },
      {
        name: 'Vize Flake Elite Metallic Flakes',
        size: '5kg Bag',
        color: 'Bronze & Graphite Blend',
        qty: 2,
        price: '₹9,800',
        image: '/colors/Bronze Vein.png'
      },
      {
        name: 'Heavy Duty Notched Squeegee & Roller Kit',
        size: 'Professional Kit',
        color: 'Standard',
        qty: 1,
        price: '₹6,300',
        image: '/logos/Vize Cast Max.png'
      }
    ],
    shippingAddress: {
      fullName: 'Vikram Mehta (Studio Workshop)',
      addressLine: 'Shed 18, Timber & Resin Craft Hub, Sector 58',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      phone: '+91 98765 43210'
    }
  }
];

export function AuthProvider({ children }) {
  // Current user state (null if logged out)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // User orders
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  });

  // Saved Addresses
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 'addr-1',
      isDefault: true,
      tag: 'Workshop & Studio',
      fullName: 'Vikram Mehta',
      phone: '+91 98765 43210',
      addressLine1: 'Plot 42, Phase II, Industrial Area',
      addressLine2: 'Near Express Highway Toll',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      gstin: '06AAAAA0000A1Z5'
    },
    {
      id: 'addr-2',
      isDefault: false,
      tag: 'Site / Client Delivery',
      fullName: 'Vikram Mehta (Site Office)',
      phone: '+91 98765 43210',
      addressLine1: 'Villa 14, Palm Meadows Estate',
      addressLine2: 'Off Golf Course Extension Road',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122018',
      gstin: '06AAAAA0000A1Z5'
    }
  ]);

  // Account Modal open state
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup' | 'orders' | 'profile' | 'addresses' | 'pro'

  // Persist user
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync auth with localStorage', e);
    }
  }, [user]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isAccountModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAccountModalOpen]);

  // Login handler
  const login = ({ emailOrPhone, password }) => {
    // If empty demo credentials or valid input, synthesize user
    const email = emailOrPhone?.trim() || 'contractor@vizeresin.com';
    const isPro = email.includes('contractor') || email.includes('pro') || email.includes('trade');
    
    const newUser = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Vize Artisan',
      email: email,
      phone: '+91 98765 43210',
      role: isPro ? 'Pro Contractor' : 'Verified Member',
      accountType: isPro ? 'contractor' : 'retail',
      company: isPro ? 'Apex Resin Flooring & Design' : 'Custom Woodcraft Studio',
      gstin: '06AAAAA0000A1Z5',
      tier: isPro ? 'Tier 1 Pro Tier (15% Trade Discount)' : 'Silver Member (5% Loyalty)',
      joinedDate: 'March 2026',
      points: 1250
    };

    setUser(newUser);
    setActiveTab('profile');
    return { success: true, user: newUser };
  };

  // Quick 1-click Preset Demo Accounts
  const quickLogin = (type = 'contractor') => {
    let presetUser;
    if (type === 'contractor') {
      presetUser = {
        id: 'usr_pro_contractor',
        name: 'Arjun Sharma',
        email: 'arjun.floors@vizeresin.pro',
        phone: '+91 98230 11223',
        role: 'Pro Epoxy Contractor',
        accountType: 'contractor',
        company: 'Apex Polymer Surfaces & Flooring LLP',
        gstin: '07AAACA4928P1Z8',
        tier: 'Platinum Trade Tier (15% Trade Off + Direct Tech Line)',
        joinedDate: 'January 2025',
        points: 4800,
        assignedTechSpecialist: 'Rakesh Verma (Head Polymer Chemist)'
      };
    } else if (type === 'architect') {
      presetUser = {
        id: 'usr_architect',
        name: 'Pooja Singhal',
        email: 'pooja.studio@architects.in',
        phone: '+91 97110 44556',
        role: 'Interior Designer / Architect',
        accountType: 'designer',
        company: 'Studio Vista Architectural Interiors',
        gstin: '06ABCDE1234F1Z5',
        tier: 'Design Partner (Sample Kits & Priority Custom RAL)',
        joinedDate: 'February 2026',
        points: 2150
      };
    } else {
      presetUser = {
        id: 'usr_retail',
        name: 'Rohan Deshmukh',
        email: 'rohan.woodcraft@gmail.com',
        phone: '+91 99887 66554',
        role: 'River Table & Art Resin Maker',
        accountType: 'retail',
        company: 'Deshmukh Wood Artistry',
        tier: 'Vize Club Artisan',
        joinedDate: 'August 2026',
        points: 850
      };
    }

    setUser(presetUser);
    setActiveTab('profile');
    return { success: true, user: presetUser };
  };

  // Sign up handler
  const signup = ({ name, email, phone, role, company, gstin }) => {
    const isPro = role === 'contractor' || role === 'designer';
    const newUser = {
      id: 'usr_' + Date.now(),
      name: name || 'Valued Customer',
      email: email,
      phone: phone || '+91 98765 43210',
      role: role === 'contractor' ? 'Pro Epoxy Contractor' : role === 'designer' ? 'Interior Designer' : 'Artisan Member',
      accountType: role || 'retail',
      company: company || '',
      gstin: gstin || '',
      tier: isPro ? 'Pro Verified (15% Trade Pricing)' : 'Vize Member',
      joinedDate: 'September 2026',
      points: 200
    };

    setUser(newUser);
    setActiveTab('profile');
    return { success: true, user: newUser };
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setActiveTab('login');
  };

  // Profile update handler
  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...updatedFields };
    });
  };

  // Modal open helper
  const openAccountModal = (tab = null) => {
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab(user ? 'profile' : 'login');
    }
    setIsAccountModalOpen(true);
  };

  const closeAccountModal = () => {
    setIsAccountModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        orders,
        savedAddresses,
        isAccountModalOpen,
        activeTab,
        setActiveTab,
        openAccountModal,
        closeAccountModal,
        login,
        quickLogin,
        signup,
        logout,
        updateProfile,
        setSavedAddresses
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
