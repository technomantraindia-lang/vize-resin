import { createContext, useContext, useState, useEffect } from 'react';
import { fetchFromApi } from '../utils/api';

const AuthContext = createContext();

const STORAGE_KEY = 'vize_user_auth_v1';
const ORDERS_STORAGE_KEY = 'vize_user_orders_v1';

// Mock demo orders ONLY loaded when a user tests with a 1-click Demo Profile
const DEMO_ORDERS = [
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
      fullName: 'Arjun Sharma',
      addressLine: 'Plot 42, Industrial Area Phase II, Near Express Highway',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      phone: '+91 98230 11223'
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
      fullName: 'Arjun Sharma (Studio Workshop)',
      addressLine: 'Shed 18, Timber & Resin Craft Hub, Sector 58',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      phone: '+91 98230 11223'
    }
  }
];

const DEMO_ADDRESSES = [
  {
    id: 'addr-1',
    isDefault: true,
    tag: 'Workshop & Studio',
    fullName: 'Arjun Sharma',
    phone: '+91 98230 11223',
    addressLine1: 'Plot 42, Phase II, Industrial Area',
    addressLine2: 'Near Express Highway Toll',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    gstin: '07AAACA4928P1Z8'
  },
  {
    id: 'addr-2',
    isDefault: false,
    tag: 'Site / Client Delivery',
    fullName: 'Arjun Sharma (Site Office)',
    phone: '+91 98230 11223',
    addressLine1: 'Villa 14, Palm Meadows Estate',
    addressLine2: 'Off Golf Course Extension Road',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122018',
    gstin: '07AAACA4928P1Z8'
  }
];

export function AuthProvider({ children }) {
  const getUserOrdersKey = (id) => `vize_user_orders_${id || 'guest'}`;
  const getUserAddressesKey = (id) => `vize_user_addresses_${id || 'guest'}`;

  // Current user state (null if logged out)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // User orders: Real user accounts always start with [] unless they placed orders
  const [orders, setOrders] = useState(() => {
    try {
      const savedUserStr = localStorage.getItem(STORAGE_KEY);
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      if (!savedUser) return [];
      if (savedUser.isDemo) return DEMO_ORDERS;
      const userOrders = localStorage.getItem(getUserOrdersKey(savedUser.id));
      return userOrders ? JSON.parse(userOrders) : [];
    } catch {
      return [];
    }
  });

  // Saved Addresses: Real user accounts always start with [] unless they added addresses
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const savedUserStr = localStorage.getItem(STORAGE_KEY);
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      if (!savedUser) return [];
      if (savedUser.isDemo) return DEMO_ADDRESSES;
      const userAddr = localStorage.getItem(getUserAddressesKey(savedUser.id));
      return userAddr ? JSON.parse(userAddr) : [];
    } catch {
      return [];
    }
  });

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
      window.dispatchEvent(new Event('vize_auth_changed'));
    } catch (e) {
      console.error('Failed to sync auth with localStorage', e);
    }
  }, [user]);

  // Sync user-specific orders
  useEffect(() => {
    if (user && !user.isDemo) {
      try {
        localStorage.setItem(getUserOrdersKey(user.id), JSON.stringify(orders));
      } catch (e) {
        console.error('Failed to sync orders', e);
      }
    }
  }, [orders, user]);

  // Sync user-specific saved addresses
  useEffect(() => {
    if (user && !user.isDemo) {
      try {
        localStorage.setItem(getUserAddressesKey(user.id), JSON.stringify(savedAddresses));
      } catch (e) {
        console.error('Failed to sync addresses', e);
      }
    }
  }, [savedAddresses, user]);

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
  const login = async ({ emailOrPhone, password }) => {
    const identifier = emailOrPhone?.trim() || '';
    if (!identifier) return { success: false, message: 'Please enter your email or phone number.' };

    let dbCustomer = null;
    try {
      const res = await fetchFromApi('/api/vize/customers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: identifier,
          password: password || '',
        }),
      });

      if (res && res.success && res.data) {
        dbCustomer = res.data;
      }
    } catch (err) {
      console.warn('Backend login fallback:', err);
    }

    const email = dbCustomer ? dbCustomer.email : (identifier.includes('@') ? identifier : `${identifier}@vizeresin.com`);
    const isPro = (dbCustomer && (dbCustomer.group_code === 'contractor' || dbCustomer.group_code === 'wholesale')) ||
                  email.includes('contractor') || email.includes('pro') || email.includes('trade');

    const loggedUser = {
      id: dbCustomer ? dbCustomer.id : ('usr_' + Date.now()),
      db_id: dbCustomer ? dbCustomer.id : null,
      name: dbCustomer ? dbCustomer.name : (email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Vize Member'),
      email: email,
      phone: dbCustomer ? (dbCustomer.phone || '') : '+91 98765 43210',
      role: dbCustomer ? dbCustomer.group_name : (isPro ? 'Pro Contractor' : 'Verified Member'),
      accountType: dbCustomer ? dbCustomer.group_code : (isPro ? 'contractor' : 'retail'),
      company: isPro ? 'Apex Resin Flooring & Design' : '',
      gstin: '',
      tier: (dbCustomer && dbCustomer.group_code === 'contractor') || isPro
        ? 'Platinum Trade Tier (15% Trade Off + Direct Tech Line)'
        : 'Commercial Member Tier',
      joinedDate: 'October 2026',
      points: 250,
      isDemo: false
    };

    setUser(loggedUser);
    if (loggedUser.isDemo) {
      setOrders(DEMO_ORDERS);
      setSavedAddresses(DEMO_ADDRESSES);
    } else {
      try {
        const savedOrders = localStorage.getItem(getUserOrdersKey(loggedUser.id));
        setOrders(savedOrders ? JSON.parse(savedOrders) : []);
        const savedAddr = localStorage.getItem(getUserAddressesKey(loggedUser.id));
        setSavedAddresses(savedAddr ? JSON.parse(savedAddr) : []);
      } catch {
        setOrders([]);
        setSavedAddresses([]);
      }
    }
    setActiveTab('profile');
    return { success: true, user: loggedUser };
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
        assignedTechSpecialist: 'Rakesh Verma (Head Polymer Chemist)',
        isDemo: true
      };
    } else if (type === 'architect' || type === 'designer') {
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
        points: 2150,
        isDemo: true
      };
    } else if (type === 'industrial') {
      presetUser = {
        id: 'usr_industrial',
        name: 'Sunil Nair',
        email: 'sunil.nair@polychem-mfg.com',
        phone: '+91 98330 77889',
        role: 'Industrial Facility / Plant Head',
        accountType: 'industrial',
        company: 'Bharat PolyChem Manufacturing Pvt Ltd',
        gstin: '27AABCB9921M1Z3',
        tier: 'Industrial Direct Tier (Bulk Drum Commercial Pricing)',
        joinedDate: 'April 2025',
        points: 5400,
        isDemo: true
      };
    } else if (type === 'dealer') {
      presetUser = {
        id: 'usr_dealer',
        name: 'Rajesh Agrawal',
        email: 'agrawal.coatings@gmail.com',
        phone: '+91 98440 22334',
        role: 'Authorized Dealer / Distributor',
        accountType: 'dealer',
        company: 'Agrawal Paints & Resin Hub',
        gstin: '23AACCA5566K1Z9',
        tier: 'Distributor Wholesale Tier (Wholesale Margin)',
        joinedDate: 'May 2025',
        points: 3800,
        isDemo: true
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
        points: 850,
        isDemo: true
      };
    }

    presetUser.isDemo = true;
    setUser(presetUser);
    setOrders(DEMO_ORDERS);
    setSavedAddresses(DEMO_ADDRESSES);
    setActiveTab('profile');
    return { success: true, user: presetUser };
  };

  // Sign up handler
  const signup = async ({ name, email, phone, role = 'contractor', otherRole = '', company = '', gstin = '', password = '' }) => {
    const isCommercial = ['contractor', 'designer', 'industrial', 'dealer'].includes(role);
    
    let displayRole = 'Artisan Member';
    let tier = 'Vize Member';

    switch (role) {
      case 'contractor':
        displayRole = 'Pro Epoxy Contractor';
        tier = 'Platinum Trade Tier (15% Trade Off + Direct Tech Line)';
        break;
      case 'designer':
        displayRole = 'Interior Designer / Architect';
        tier = 'Design Partner (Sample Kits & Custom RAL Specs)';
        break;
      case 'industrial':
        displayRole = 'Industrial Facility / Plant Head';
        tier = 'Industrial Direct Tier (Bulk Drum Commercial Pricing)';
        break;
      case 'dealer':
        displayRole = 'Authorized Dealer / Distributor';
        tier = 'Distributor Wholesale Tier (Wholesale Margin)';
        break;
      case 'retail':
        displayRole = 'Artisan / Maker';
        tier = 'Vize Club Artisan (5% Loyalty Cash-back)';
        break;
      case 'homeowner':
        displayRole = 'Homeowner / DIY Maker';
        tier = 'DIY Creator Tier (Starter Guide + Project Perks)';
        break;
      case 'student':
        displayRole = 'Workshop Student / Trainee';
        tier = 'Academy Student (10% Workshop Kit Discount)';
        break;
      case 'other':
        displayRole = otherRole?.trim() || 'Speciality Polymer Partner';
        tier = 'Commercial Member Tier';
        break;
      default:
        displayRole = 'Valued Member';
        tier = 'Vize Member';
    }

    let dbCustomer = null;
    try {
      const res = await fetchFromApi('/api/vize/customers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: name || 'Valued Customer',
          email,
          phone: phone || '',
          password: password || 'password123',
          role: role || 'contractor',
          role_label: displayRole,
          company: company || '',
          gstin: gstin || '',
        }),
      });

      if (res && res.success && res.data) {
        dbCustomer = res.data;
      }
    } catch (err) {
      console.warn('Backend customer registration fallback:', err);
    }

    const userId = dbCustomer ? dbCustomer.id : ('usr_' + Date.now());

    const newUser = {
      id: userId,
      db_id: dbCustomer ? dbCustomer.id : null,
      name: dbCustomer ? `${dbCustomer.first_name} ${dbCustomer.last_name}`.trim() : (name || 'Valued Customer'),
      email: dbCustomer ? dbCustomer.email : email,
      phone: (dbCustomer && dbCustomer.phone) ? dbCustomer.phone : (phone || ''),
      role: dbCustomer?.group_name || displayRole,
      accountType: dbCustomer?.group_code || role || 'retail',
      company: company || '',
      gstin: gstin || '',
      tier: tier,
      joinedDate: 'October 2026',
      points: isCommercial ? 500 : 250,
      isDemo: false
    };

    setUser(newUser);
    // Real newly registered accounts start with ZERO orders and ZERO saved addresses
    setOrders([]);
    setSavedAddresses([]);
    try {
      localStorage.removeItem(ORDERS_STORAGE_KEY);
      localStorage.setItem(getUserOrdersKey(newUser.id), JSON.stringify([]));
      localStorage.setItem(getUserAddressesKey(newUser.id), JSON.stringify([]));
    } catch {}
    setActiveTab('profile');
    return { success: true, user: newUser };
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setOrders([]);
    setSavedAddresses([]);
    setActiveTab('login');
  };

  // Fetch real saved addresses & orders from backend database if user is connected to a DB customer
  useEffect(() => {
    async function loadBackendCustomerData() {
      if (!user || user.isDemo) return;
      const custId = user.db_id || (typeof user.id === 'number' || !isNaN(Number(user.id)) ? Number(user.id) : null);
      if (!custId) return;

      try {
        // 1. Load customer delivery addresses
        const addrRes = await fetchFromApi(`/api/vize/customers/${custId}/addresses`);
        if (addrRes && addrRes.success && Array.isArray(addrRes.data) && addrRes.data.length > 0) {
          setSavedAddresses(addrRes.data);
        }

        // 2. Load customer orders history from MySQL
        const ordersRes = await fetchFromApi(`/api/vize/customers/${custId}/orders`);
        if (ordersRes && ordersRes.success && Array.isArray(ordersRes.data)) {
          setOrders(ordersRes.data);
        }
      } catch (e) {
        // Fallback to local storage if offline
      }
    }

    loadBackendCustomerData();
  }, [user]);

  // Address helper to add a newly entered checkout address
  const addSavedAddress = (newAddress) => {
    if (!newAddress) return;
    setSavedAddresses((prev) => {
      const exists = prev.some((a) => 
        (a.id && newAddress.id && a.id === newAddress.id) ||
        (a.addressLine1 === newAddress.addressLine1 && a.city === newAddress.city)
      );
      if (exists) return prev;
      return [newAddress, ...prev];
    });
  };

  // Order helper to add newly placed checkout order
  const addOrder = (newOrder) => {
    if (!newOrder) return;
    setOrders((prev) => [newOrder, ...prev]);
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
        setSavedAddresses,
        addSavedAddress,
        addOrder,
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
