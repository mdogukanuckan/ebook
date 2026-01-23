# Settings Page Implementation Guide

## 🎯 Goal
Create a **SettingsPage** where users can update their profile information and change their password.

---

## 📋 Page Sections

1.  **Header:** A simple title and description for the settings page.
2.  **Profile Settings Form:**
    *   First Name
    *   Last Name
    *   Email
    *   *Note: Username remains read-only for security.*
3.  **Security Settings Form:**
    *   Current Password
    *   New Password
    *   Confirm New Password
4.  **Account Actions:**
    *   Delete Account (already implemented in backend)

---

## 📁 File Structure

```
src/pages/settings/
├── SettingsPage.tsx           ← Main settings page component
└── SettingsPage.module.css    ← Page styles
```

---

## 🏗️ SettingsPage.tsx Structure

### 1. Imports
```tsx
import { useState } from 'react';
import { useAuth } from '../../features/auth/context/authContext';
import userService from '../../services/userService';
import { User, Lock, Save, Trash2, AlertCircle } from 'lucide-react';
import styles from './SettingsPage.module.css';
```

### 2. Form Handling
I recommend using `react-hook-form` to handle forms more efficiently, as it's already in your `package.json`.

---

## 🎨 Design Guidelines

*   **Clean and Organized:** Use sections or tabs to separate Profile and Security settings.
*   **Feedback:** Show success/error messages after each form submission.
*   **Aesthetics:** Maintain consistency with the rest of the application (gradients, shadows, professional colors).

---

## 🔧 Routing

**File:** `src/routes/index.tsx`

Add the following route:
```tsx
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));

// ... in the children array of MainLayout
{
    path: 'settings',
    element: (
        <LazyPage>
            <PrivateRoute>
                <SettingsPage />
            </PrivateRoute>
        </LazyPage>
    ),
},
```

---

## ✅ Checkpoint: Backend Implementation
Before proceeding with the frontend, ensure the backend is running with the new endpoints:
*   `GET /api/v1/users/me`
*   `PUT /api/v1/users/{id}`
*   `PUT /api/v1/users/{id}/password`

---

I will now provide the full code for the `SettingsPage.tsx` and its CSS module in the next steps.
