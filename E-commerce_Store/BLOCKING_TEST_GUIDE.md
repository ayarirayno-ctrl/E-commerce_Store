# 🧪 Test Guide - User Blocking Feature

## Quick Test Steps

### ⚡ Setup (5 minutes)

1. **Start Backend**
   ```bash
   cd backend
   node src/server.js
   ```
   ✅ Backend should run on `http://localhost:5000`

2. **Start Frontend**
   ```bash
   npm run dev
   ```
   ✅ Frontend should run on `http://localhost:3002`

3. **Create Test Accounts**
   - Create 2-3 regular user accounts via registration
   - Use admin account: `ayarirayen539@gmail.com` / `admin123`

---

## 🎯 Test Scenario 1: Block a Client

### Steps:
1. Login as admin at `http://localhost:3002/admin/login`
2. Navigate to **Clients** page
3. Find a client in the table
4. Click **"Bloquer"** button
5. **Expected Results:**
   - ✅ Status badge changes to red **"Bloqué"**
   - ✅ Client appears in **"Clients Bloqués"** section below
   - ✅ Stats card shows **"Clients Bloqués: 1"**

---

## 🚫 Test Scenario 2: Blocked Client Cannot Login

### Steps:
1. Logout from admin account
2. Go to regular login page `http://localhost:3002/auth`
3. Try to login with the **blocked client's credentials**
4. **Expected Results:**
   - ❌ Login fails
   - ✅ Red error notification appears (top-right)
   - ✅ Error message in login form (red box)
   - ✅ Message says: **"You are blocked from admin device. Please contact support."**

---

## 🔓 Test Scenario 3: Unblock a Client

### Steps:
1. Login as admin again
2. Navigate to **Clients** page
3. Scroll to **"Clients Bloqués"** section (red table)
4. Click **"Débloquer"** button
5. **Expected Results:**
   - ✅ Client removed from blocked section
   - ✅ Client appears in main table with green **"Actif"** badge
   - ✅ Stats card shows **"Clients Bloqués: 0"**

---

## ✅ Test Scenario 4: Unblocked Client Can Login

### Steps:
1. Logout from admin account
2. Go to regular login page
3. Login with the **unblocked client's credentials**
4. **Expected Results:**
   - ✅ Login succeeds
   - ✅ Green success notification: **"Connexion réussie !"**
   - ✅ Redirected to homepage
   - ✅ User can access their account

---

## 🔍 Test Scenario 5: Admin Cannot Be Blocked

### Steps:
1. Login as admin
2. Navigate to **Clients** page
3. Try to find admin account in the list
4. **Expected Results:**
   - ✅ Admin account does NOT appear in clients list
   - ✅ Only non-admin users shown
   - ✅ Backend prevents blocking admin accounts

---

## 🎨 Test Scenario 6: UI/UX Verification

### Check These Elements:
1. **Stats Cards (Top of Page)**
   - [ ] Total Clients shows correct count
   - [ ] Clients Actifs shows non-blocked count
   - [ ] Clients Bloqués shows blocked count (red text)
   - [ ] Clicking cards filters the table

2. **Main Clients Table**
   - [ ] Shows all non-blocked clients when filter is "all"
   - [ ] Status badge is green for active clients
   - [ ] "Bloquer" button is red
   - [ ] "Voir" button opens detail modal

3. **Blocked Clients Section** (Only appears if blocked clients exist)
   - [ ] Section has red theme (background, borders)
   - [ ] Table header is red
   - [ ] Warning icon (⚠️) in section title
   - [ ] "Débloquer" button is green
   - [ ] Yellow info box explains blocking behavior

4. **Client Detail Modal**
   - [ ] Status badge at top (red if blocked, green if active)
   - [ ] Large "Bloquer le compte" or "Débloquer le compte" button
   - [ ] Shows contact info, addresses, statistics
   - [ ] Block/unblock works from modal too

5. **Search and Filters**
   - [ ] Search by name works
   - [ ] Search by email works
   - [ ] Search by phone works
   - [ ] Filter "all" shows all clients
   - [ ] Filter "active" shows only non-blocked
   - [ ] Filter "blocked" shows only blocked

---

## 🐛 Test Scenario 7: Error Handling

### Test Invalid Operations:
1. **Block Without Auth Token**
   - Delete localStorage token
   - Try to access admin page
   - **Expected:** Redirected to login

2. **Block Non-Existent User**
   - Try to block user ID that doesn't exist
   - **Expected:** Error message "Client non trouvé"

3. **Double Block**
   - Block a client
   - Try to block same client again
   - **Expected:** Status just toggles back and forth

---

## 📊 Test Scenario 8: Data Persistence

### Steps:
1. Block 2-3 clients
2. Refresh the page (F5)
3. **Expected Results:**
   - ✅ Blocked clients still show in blocked section
   - ✅ Stats still accurate
   - ✅ Data persists across page reloads

4. Restart backend server
5. Refresh frontend
6. **Expected Results:**
   - ✅ Blocked status still maintained
   - ✅ MongoDB stored the changes

---

## 🚀 Quick Verification Commands

### Check Backend Status:
```bash
# In PowerShell
curl http://localhost:5000/api/admin/clients/blocked -H "Authorization: Bearer YOUR_TOKEN"
```

### Check MongoDB Directly:
```bash
# In MongoDB shell or Compass
db.users.find({ isBlocked: true })
```

### Check Browser Console:
1. Open DevTools (F12)
2. Go to Console tab
3. Look for any errors during block/unblock
4. Check Network tab for API responses

---

## ✅ Success Criteria

### All Tests Pass When:
- [x] Blocked clients cannot login
- [x] Correct error message displays
- [x] Unblocked clients can login again
- [x] Admin can block/unblock from table
- [x] Admin can block/unblock from modal
- [x] Blocked section appears/disappears correctly
- [x] Stats update in real-time
- [x] Search and filters work
- [x] Cannot block admin accounts
- [x] Data persists across reloads
- [x] UI shows correct visual indicators

---

## 🎉 Expected Final State

After all tests:
- ✅ Backend blocking logic works
- ✅ Frontend displays blocking status
- ✅ Error messages clear and helpful
- ✅ Admin has full control
- ✅ Security validated
- ✅ User experience smooth

---

## 📝 Notes

- Test with **different clients** to verify consistency
- Check both **notification toast** and **form error** for blocked message
- Verify **network requests** in DevTools (403 status for blocked login)
- Ensure **MongoDB** reflects blocking status changes

---

## 🆘 Troubleshooting

### Problem: Blocked client can still login
**Solution:** Check backend authController.js has blocking check BEFORE password verification

### Problem: Error message not displaying
**Solution:** Check AuthContext.tsx extracts error message from API response

### Problem: Blocked section not showing
**Solution:** Check if blockedClients state is populated from API

### Problem: 401 Unauthorized when blocking
**Solution:** Verify admin token is valid and in localStorage

---

**Ready to Test!** 🚀
