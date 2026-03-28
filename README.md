# Bus Management System - Frontend

## 📋 Tổng quan

Frontend của hệ thống quản lý xe bus và giao hàng được xây dựng bằng React, TypeScript và Vite. Giao diện người dùng thân thiện, responsive, hỗ trợ đa vai trò với các tính năng đặt vé xe, quản lý chuyến đi và dịch vụ giao hàng.

## 🚀 Tính năng chính

### 👤 Khách hàng (Customer)
- **Đăng ký/Đăng nhập**: Tạo tài khoản và xác thực
- **Tìm kiếm chuyến đi**: Tìm kiếm và xem các chuyến xe có sẵn
- **Đặt vé**: Đặt vé xe với thông tin chi tiết, chọn ghế
- **Quản lý vé**: Xem lịch sử đặt vé, hủy vé
- **Giao hàng**: Đặt đơn hàng giao hàng, theo dõi trạng thái
- **Thanh toán**: Thanh toán online hoặc COD
- **Đánh giá**: Đánh giá driver và dịch vụ sau chuyến đi
- **Thông báo**: Nhận thông báo về chuyến đi và đơn hàng

### 👨‍✈️ Tài xế (Driver)
- **Xem chuyến đi**: Xem thông tin chuyến đi được giao
- **Cập nhật trạng thái**: Báo cáo trạng thái chuyến đi (bắt đầu, đang chạy, hoàn thành)
- **Check-in/out**: Check-in trước khi khởi hành, check-out sau khi kết thúc
- **Báo cáo sự cố**: Báo cáo vấn đề phát sinh trong chuyến đi
- **Thông báo**: Nhận thông báo từ hệ thống

### 👨‍💼 Phụ xe (Assistant Driver)
- **Check-in khách**: Xác nhận khách hàng lên xe
- **Xác nhận hàng hóa**: Kiểm tra hành lý và hàng ký gửi
- **Xem danh sách khách**: Xem danh sách khách trên chuyến đi
- **Cập nhật trạng thái hàng**: Cập nhật tiến độ giao hàng
- **Thông báo**: Nhận thông báo về chuyến đi

### 👩‍💼 Lễ tân (Receptionist)
- **Quản lý đặt vé**: Hỗ trợ khách hàng đặt vé tại quầy
- **Quản lý giao hàng**: Tạo và quản lý đơn hàng giao hàng
- **Xem đơn hàng**: Xem và cập nhật trạng thái đơn hàng
- **Thông báo**: Nhận thông báo về đơn hàng mới

### 👑 Quản trị viên (Admin)
- **Quản lý tài khoản**: Tạo, xem, cập nhật tài khoản staff
- **Quản lý xe bus**: Thêm, sửa, xóa thông tin xe
- **Quản lý tuyến đường**: Tạo và cập nhật các tuyến xe
- **Quản lý điểm dừng**: Quản lý điểm đón/trả
- **Quản lý chuyến đi**: Tạo và cập nhật lịch chuyến
- **Thống kê**: Xem báo cáo và thống kê hệ thống
- **Thông báo**: Gửi thông báo đến users

## 🏗️ Kiến trúc và công nghệ

### Tech Stack
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Icons**: Lucide React, React Icons
- **Charts**: Recharts
- **Face Recognition**: face-api.js
- **OTP Input**: react-otp-input
- **Phone Input**: react-phone-input-2
- **Notifications**: react-hot-toast
- **Captcha**: react-google-recaptcha
- **Firebase**: Firebase SDK

### Cấu trúc thư mục
```
Frontend/
├── public/              # Static assets
│   ├── images/         # Images
│   └── models/         # Face recognition models
├── src/
│   ├── api/           # API service functions
│   ├── assets/        # Static assets
│   ├── components/    # Reusable UI components
│   ├── layouts/       # Layout components
│   ├── model/         # TypeScript interfaces
│   ├── pages/         # Page components
│   ├── services/      # Business logic services
│   ├── store/         # Redux store and slices
│   ├── types/         # TypeScript type definitions
│   └── util/          # Utility functions
├── .env               # Environment variables
├── package.json
├── vite.config.ts     # Vite configuration
├── tailwind.config.js # Tailwind CSS config
├── tsconfig.json      # TypeScript config
└── README.md
```

## 🔧 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- npm hoặc yarn
- Backend API server đang chạy

### Cài đặt
```bash
# Clone repository
git clone <repository-url>
cd Frontend

# Install dependencies
npm install
```

### Cấu hình
1. Tạo file `.env` trong thư mục root:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# Authentication
VITE_JWT_REFRESH_THRESHOLD=300000

# Firebase Configuration (Optional)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Google reCAPTCHA
VITE_GOOGLE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key

# Cloudinary (File Upload)
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Payment Gateway (if used)
VITE_PAYMENT_GATEWAY_KEY=your_payment_key
VITE_PAYMENT_GATEWAY_MERCHANT_ID=your_merchant_id

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Application Settings
VITE_APP_NAME=Bus Management System
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# Feature Flags
VITE_ENABLE_FACE_RECOGNITION=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_PWA=false

# External URLs
VITE_SUPPORT_EMAIL=support@yourcompany.com
VITE_PRIVACY_POLICY_URL=https://yourcompany.com/privacy
VITE_TERMS_OF_SERVICE_URL=https://yourcompany.com/terms

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_MIXPANEL_TOKEN=your_mixpanel_token

# Social Media
VITE_FACEBOOK_APP_ID=your_facebook_app_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Logging
VITE_LOG_LEVEL=info
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
```

2. Đảm bảo backend server đang chạy trên port 3000

### Chạy ứng dụng
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🎨 Giao diện người dùng

### Design System
- **Colors**: Theme-based color palette
- **Typography**: Consistent font hierarchy
- **Components**: Reusable UI components
- **Responsive**: Mobile-first responsive design
- **Accessibility**: WCAG compliant

### Key Pages

#### Public Pages
- **Home**: Trang chủ với tìm kiếm chuyến đi
- **Search Results**: Kết quả tìm kiếm chuyến đi
- **Login/Register**: Đăng nhập/đăng ký
- **About**: Thông tin về công ty

#### Customer Pages
- **Dashboard**: Tổng quan tài khoản
- **Book Ticket**: Đặt vé xe
- **My Tickets**: Quản lý vé đã đặt
- **Track Parcel**: Theo dõi đơn hàng
- **Payment**: Thanh toán
- **Reviews**: Đánh giá dịch vụ

#### Driver/Assistant Driver Pages
- **Trip Details**: Chi tiết chuyến đi
- **Check-in**: Check-in chuyến đi
- **Passenger List**: Danh sách hành khách
- **Reports**: Báo cáo sự cố

#### Receptionist Pages
- **Booking Management**: Quản lý đặt vé
- **Parcel Management**: Quản lý đơn hàng
- **Customer Support**: Hỗ trợ khách hàng

#### Admin Pages
- **User Management**: Quản lý tài khoản
- **Bus Management**: Quản lý xe bus
- **Route Management**: Quản lý tuyến đường
- **Trip Management**: Quản lý chuyến đi
- **Statistics**: Báo cáo thống kê
- **System Settings**: Cấu hình hệ thống

## 🧩 Component Architecture

### Component Structure
```
src/components/
├── common/           # Shared components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.types.ts
│   │   └── index.ts
│   ├── Input/
│   ├── Modal/
│   └── Loading/
├── layout/           # Layout components
│   ├── Header/
│   ├── Sidebar/
│   ├── Footer/
│   └── Navigation/
├── forms/            # Form components
│   ├── LoginForm/
│   ├── BookingForm/
│   ├── ProfileForm/
│   └── SearchForm/
├── dashboard/        # Dashboard components
│   ├── StatsCard/
│   ├── RecentBookings/
│   └── QuickActions/
└── pages/            # Page-specific components
    ├── Home/
    ├── Booking/
    └── Profile/
```

### Component Patterns

#### 1. Container/Presentational Pattern
```typescript
// Presentational Component
interface UserCardProps {
  user: User;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete
}) => (
  <div className="user-card">
    <h3>{user.name}</h3>
    <p>{user.email}</p>
    <div className="actions">
      {onEdit && <button onClick={onEdit}>Edit</button>}
      {onDelete && <button onClick={onDelete}>Delete</button>}
    </div>
  </div>
);

// Container Component
export const UserCardContainer: React.FC<{ userId: string }> = ({
  userId
}) => {
  const { user, loading } = useUser(userId);
  const { deleteUser } = useUserActions();

  if (loading) return <Loading />;

  return (
    <UserCard
      user={user}
      onEdit={() => navigate(`/users/${userId}/edit`)}
      onDelete={() => deleteUser(userId)}
    />
  );
};
```

#### 2. Custom Hooks Pattern
```typescript
// src/hooks/useAuth.ts
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, selectAuth } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector(selectAuth);

  const handleLogin = useCallback(async (credentials) => {
    try {
      const result = await dispatch(login(credentials)).unwrap();
      localStorage.setItem('authToken', result.token);
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    dispatch(logout());
  }, [dispatch]);

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    login: handleLogin,
    logout: handleLogout
  };
};

// src/hooks/useForm.ts
import { useState, useCallback } from 'react';

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: any
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<T>>({});
  const [touched, setTouched] = useState<Partial<T>>({});

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    // Validate field
    if (validationSchema) {
      try {
        validationSchema.validateAt(field, values);
      } catch (error) {
        setErrors(prev => ({ ...prev, [field]: error.message }));
      }
    }
  }, [validationSchema, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    reset,
    isValid
  };
};
```

#### 3. Higher-Order Components (HOC)
```typescript
// src/components/common/withAuth.tsx
import { useAuth } from '../../hooks/useAuth';
import { Loading } from './Loading';

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <Loading />;

    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }

    return <Component {...props} />;
  };
};

// Usage
const ProtectedDashboard = withAuth(Dashboard);
```

## 🔄 Redux State Management

### Store Configuration
```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './authSlice';
import tripReducer from './tripSlice';
import bookingReducer from './bookingSlice';
import uiReducer from './uiSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // Only persist auth state
};

const rootReducer = combineReducers({
  auth: authReducer,
  trip: tripReducer,
  booking: bookingReducer,
  ui: uiReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Auth Slice Example
```typescript
// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../api/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'),
  loading: false,
  error: null
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginData) => {
    const response = await authService.login(credentials);
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('authToken');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
```

### Custom Redux Hooks
```typescript
// src/hooks/useAppDispatch.ts
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();

// src/hooks/useAppSelector.ts
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## 🌐 API Integration

### Base Configuration
```typescript
// src/api/config.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Request/Response Interceptors
```typescript
// src/api/interceptors.ts
import axiosInstance from './config';

// Request interceptor - Add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API Service Structure
```typescript
// src/api/authService.ts
export const authService = {
  login: async (credentials: LoginData) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data: ProfileData) => {
    const response = await axiosInstance.put('/users/profile', data);
    return response.data;
  }
};

// src/api/tripService.ts
export const tripService = {
  searchTrips: async (params: SearchParams) => {
    const response = await axiosInstance.get('/trips', { params });
    return response.data;
  },

  getTripDetails: async (tripId: string) => {
    const response = await axiosInstance.get(`/trips/${tripId}`);
    return response.data;
  },

  bookTrip: async (bookingData: BookingData) => {
    const response = await axiosInstance.post('/bookings', bookingData);
    return response.data;
  }
};
```

### Error Handling Patterns
```typescript
// src/hooks/useApi.ts
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export const useApi = <T, P extends any[]>(
  apiCall: (...args: P) => Promise<{ data: T }>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    showToast?: boolean;
  }
) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);

  const execute = useCallback(async (...args: P) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall(...args);
      setData(response.data);

      if (options?.showToast !== false) {
        toast.success('Thao tác thành công');
      }

      options?.onSuccess?.(response.data);
      return response.data;
    } catch (err: any) {
      setError(err);

      const message = err.response?.data?.message || 'Có lỗi xảy ra';
      if (options?.showToast !== false) {
        toast.error(message);
      }

      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, options]);

  return { execute, loading, data, error };
};
```

## 🔐 Authentication & Security

### JWT Token Management
- **Auto-refresh**: Automatic token refresh
- **Secure Storage**: Local storage with encryption
- **Route Protection**: Protected routes with guards

### Face Recognition (Optional)
- **Login Enhancement**: Face-based authentication
- **Model Loading**: Pre-trained face-api.js models
- **Privacy**: Client-side processing only

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- **Touch Gestures**: Swipe navigation
- **Native-like UX**: Mobile-optimized interactions
- **Offline Forms**: Form persistence

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API integration testing
- **E2E Tests**: End-to-end user flows

### Test Setup
```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Build Process
```bash
# Production build
npm run build

# Output in dist/ directory
```

### Deployment Options
- **Vercel**: Automatic deployments
- **Netlify**: Static hosting with functions
- **Docker**: Containerized deployment
- **CDN**: Asset optimization

### Environment Variables Production
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_FIREBASE_API_KEY=prod_api_key
# ... production configs
```

## 📈 Performance Optimization

### Code Splitting & Lazy Loading
```typescript
// src/App.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home/Home'));
const Booking = lazy(() => import('./pages/Booking/Booking'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Admin = lazy(() => import('./pages/Admin/Admin'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </Suspense>
  );
}
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build -- --mode analyze

# Or use webpack-bundle-analyzer
npx vite-bundle-analyzer dist
```

### Image Optimization
```typescript
// src/components/common/OptimizedImage.tsx
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate Cloudinary optimized URL
  const optimizedSrc = src.includes('cloudinary')
    ? `${src.replace('/upload/', '/upload/w_${width || 800},h_${height || 600},c_fill,f_auto,q_auto/')}`
    : src;

  return (
    <div className={`image-container ${className}`}>
      {!loaded && !error && <div className="image-placeholder" />}
      {error ? (
        <div className="image-error">Failed to load image</div>
      ) : (
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
    </div>
  );
};
```

### Memoization & Optimization
```typescript
// src/components/TripCard.tsx
import React, { memo, useMemo } from 'react';

interface TripCardProps {
  trip: Trip;
  onSelect: (tripId: string) => void;
}

export const TripCard = memo<TripCardProps>(({ trip, onSelect }) => {
  // Memoize expensive calculations
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(trip.price);
  }, [trip.price]);

  const duration = useMemo(() => {
    const diff = new Date(trip.arrivalTime).getTime() -
                 new Date(trip.departureTime).getTime();
    return Math.floor(diff / (1000 * 60 * 60)) + 'h ' +
           Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)) + 'm';
  }, [trip.arrivalTime, trip.departureTime]);

  return (
    <div className="trip-card" onClick={() => onSelect(trip.id)}>
      <h3>{trip.route.from} → {trip.route.to}</h3>
      <p>Duration: {duration}</p>
      <p>Price: {formattedPrice}</p>
    </div>
  );
});
```

### Service Worker (PWA)
```typescript
// public/sw.js
const CACHE_NAME = 'bus-app-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
```

## 🧪 Testing Strategies

### Unit Testing with Jest & React Testing Library
```typescript
// src/components/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### Custom Test Hooks
```typescript
// src/test-utils/test-utils.tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../store';

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const store = configureStore({ reducer: rootReducer });

  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### API Testing
```typescript
// src/api/__tests__/authService.test.ts
import { authService } from '../authService';
import { axiosInstance } from '../config';

// Mock axios
jest.mock('../config');
const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            user: { id: 1, email: 'test@example.com' },
            token: 'mock-token'
          }
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password'
      });

      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password'
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login failure', async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Invalid credentials'
          }
        }
      };

      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(
        authService.login({
          email: 'wrong@example.com',
          password: 'wrong'
        })
      ).rejects.toThrow();
    });
  });
});
```

### E2E Testing with Playwright
```typescript
// e2e/booking.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('should complete booking process', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Search for trips
    await page.fill('[data-testid="from-input"]', 'Hanoi');
    await page.fill('[data-testid="to-input"]', 'HCMC');
    await page.click('[data-testid="search-button"]');

    // Wait for results
    await page.waitForSelector('[data-testid="trip-card"]');

    // Select first trip
    await page.click('[data-testid="trip-card"]:first-child [data-testid="select-trip"]');

    // Fill booking form
    await page.fill('[data-testid="passenger-name"]', 'John Doe');
    await page.fill('[data-testid="passenger-phone"]', '0123456789');

    // Submit booking
    await page.click('[data-testid="submit-booking"]');

    // Verify success
    await expect(page.locator('[data-testid="booking-success"]')).toBeVisible();
  });
});
```

### Test Coverage
```bash
# Run tests with coverage
npm run test:coverage

# Coverage thresholds in jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## 🔧 Troubleshooting

### Common Frontend Issues

#### 1. Build Failures
**Error**: `Module not found`
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

#### 2. Redux State Not Updating
**Issue**: Component not re-rendering after state change
**Solution**:
- Check if state is immutable (use spread operator)
- Verify selector is correctly selecting state
- Use `useAppSelector` instead of `useSelector`

#### 3. API Calls Failing
**Error**: `401 Unauthorized`
**Solution**:
- Check JWT token in localStorage
- Verify token expiration
- Implement token refresh logic

#### 4. CORS Issues
**Error**: `Access-Control-Allow-Origin`
**Solution**:
- Add frontend URL to backend CORS_ORIGIN
- Restart backend server
- Check preflight requests

#### 5. Performance Issues
**Issue**: Slow initial load
**Solution**:
- Implement code splitting
- Optimize images
- Use React.memo for expensive components
- Implement virtualization for large lists

#### 6. Memory Leaks
**Symptoms**: Memory usage increasing over time
**Solution**:
- Clean up event listeners in useEffect
- Cancel API calls on component unmount
- Use abort controller for fetch requests

### Debug Tools
```typescript
// src/utils/debug.ts
export const debug = {
  log: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data);
    }
  },

  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },

  measurePerformance: (label: string, fn: () => void) => {
    console.time(label);
    fn();
    console.timeEnd(label);
  }
};
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Tạo Pull Request

### Code Style
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **TypeScript**: Strict type checking

## 📝 License

ISC License

## 👥 Authors

- Frontend Development Team


