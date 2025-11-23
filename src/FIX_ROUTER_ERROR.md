# 🔧 FIX: Router Context Error

## Error Message
```
Error: useRoutes() may be used only in the context of a <Router> component.
```

## ✅ SOLUTION (Follow in Order)

### Step 1: Clear Browser Cache & Storage
1. Open DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Clear site data** or **Clear storage**
4. Run in console:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Step 2: Stop All Servers
Close all terminals running the app, then:
```bash
# Kill any process on port 5173
# On Mac/Linux:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

### Step 3: Clean Install React Router
```bash
# Remove node_modules and package-lock
rm -rf node_modules package-lock.json

# Install dependencies
npm install

# Install React Router DOM specifically
npm install react-router-dom@6.27.0

# Verify installation
npm list react-router-dom
```

### Step 4: Verify main.tsx Exists
Make sure `/main.tsx` file exists with this content:
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

### Step 5: Check index.html Entry Point
Make sure your `index.html` (if it exists) references `/main.tsx`:
```html
<script type="module" src="/main.tsx"></script>
```

### Step 6: Restart Everything
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend (NEW terminal)
npm run dev
```

### Step 7: Hard Refresh Browser
1. Open `http://localhost:5173`
2. Press **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac)
3. Or open in **Incognito/Private** window

---

## 🔍 If Still Not Working

### Check 1: Verify Router is Installed
```bash
npm list react-router-dom
```

Should show version 6.x.x

### Check 2: Check for Duplicate Files
Make sure there's no `index.tsx` or `src/main.tsx` that might conflict:
```bash
find . -name "main.tsx" -o -name "index.tsx" | grep -v node_modules
```

### Check 3: Check Package.json
Make sure dependencies include:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.27.0"
  }
}
```

### Check 4: Rebuild
```bash
# Stop dev server (Ctrl+C)

# Clean build cache
rm -rf .vite dist

# Restart
npm run dev
```

---

## 🎯 Quick Fix (Try This First!)

```bash
# 1. Clear browser storage
localStorage.clear(); sessionStorage.clear(); location.reload();

# 2. In terminal, clean install
rm -rf node_modules package-lock.json
npm install
npm install react-router-dom@6.27.0

# 3. Restart
npm run dev

# 4. Hard refresh browser (Ctrl+Shift+R)
```

---

## 🐛 Common Causes

1. **Browser Cache** - Old code being used
2. **Missing react-router-dom** - Not installed
3. **Version Mismatch** - Wrong React Router version
4. **Old Build Files** - Stale .vite or dist folder
5. **Multiple Entry Points** - Conflicting index/main files

---

## ✅ Success Indicators

After fixing, you should:
- ✅ No router errors in console
- ✅ Landing page loads at `/`
- ✅ Can navigate to `/dashboard` after login
- ✅ URL changes when clicking menu items
- ✅ All pages render correctly

---

## 💡 Pro Tip

If you're still seeing the error:
1. **Try a different browser** (incognito mode)
2. **Check for service workers** (Application tab → Service Workers → Unregister)
3. **Disable browser extensions** that might interfere

---

## 🆘 Last Resort

If nothing works:
```bash
# Nuclear option - complete reset
rm -rf node_modules package-lock.json .vite dist
npm install
npm install react-router-dom@6.27.0
npm run dev
```

Then open in **incognito/private browser window**.

---

**The error is 99% caused by browser cache. Just clear storage and hard refresh!**
