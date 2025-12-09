# Mouse Update Fix - Test Checklist

## ✅ Test Cases

### Test 1: Add New Mouse

1. Open the application
2. Select "Mouse" from the dropdown
3. Fill in the form:
   - Brand Name: "Logitech"
   - Model: "MX Master 3"
   - Quantity Available: "5"
   - Purchase Date: "2025-01-15"
   - Serial No: "SN123456"
   - SU No: "SU789"
   - Remarks: "Wireless mouse"
4. Click "Submit" button
5. ✅ Should show alert: "Mouse added successfully!"
6. ✅ Table should refresh and show the new mouse
7. ✅ Form should clear automatically

### Test 2: Update Existing Mouse (Main Fix)

1. Open the application
2. Select "Mouse" from dropdown
3. In the table, click "Edit" on any mouse
4. ✅ Form should populate with mouse data
5. ✅ Button should say "Update Mouse"
6. Modify one field (e.g., change quantity to 10)
7. Click "Update Mouse" button
8. ✅ Should show alert: "Mouse updated successfully!"
9. ✅ Table should refresh with updated data
10. ✅ The mouse should have the SAME ID (not a new entry)
11. ✅ Old entry should NOT be duplicated
12. ✅ Only updated values should change

### Test 3: Clear Form

1. Click "Submit" button (form should have data from previous test)
2. Click "Reset" button (if available)
3. ✅ Form should clear all fields
4. ✅ Hidden ID field should be cleared
5. ✅ Button should say "Submit"

### Test 4: Multiple Edits

1. Select "Mouse" from dropdown
2. Click "Edit" on mouse #1
3. ✅ Form populates with mouse #1 data
4. Click "Edit" on mouse #2 (without submitting)
5. ✅ Form should update to show mouse #2 data
6. Submit
7. ✅ Mouse #2 should be updated (not created as new)
8. ✅ Mouse #1 should remain unchanged

### Test 5: Database Verification

1. Open database and check the mouse table
2. After adding a mouse:
   - ✅ New row should be created
   - ✅ ID should be auto-incremented
3. After updating a mouse:
   - ✅ Row count should NOT increase
   - ✅ ID should remain the same
   - ✅ Only the updated fields should change
   - ✅ Created_at or timestamps should NOT change

## 🔍 Expected Behaviors

### Button Text Changes:

- "Submit" → After clicking Edit → "Update Mouse"
- "Update Mouse" → After clicking Update → "Submit"
- Any action → After clicking Reset → "Submit"

### Form Hidden ID Field:

- Empty/0 when form first loads
- Set to mouse ID when you click Edit
- Cleared to empty after form submission or reset

### Table Behavior:

- Should refresh after each operation
- No duplicates should appear
- Exact same ID should be maintained for updates

## ⚠️ Common Issues to Watch For

1. **Duplicate Entry Instead of Update**

   - ❌ BAD: Clicking Edit then Submit creates a new mouse
   - ✅ GOOD: Same mouse ID, updated values

2. **Form Doesn't Clear After Submit**

   - ❌ BAD: Form still shows data
   - ✅ GOOD: Form clears, ready for new entry

3. **Button Text Doesn't Change**

   - ❌ BAD: Still says "Submit" after clicking Edit
   - ✅ GOOD: Changes to "Update Mouse"

4. **Wrong Mouse Data Shown**

   - ❌ BAD: Clicking Edit on Mouse #1 shows Mouse #2 data
   - ✅ GOOD: Correct mouse data loads

5. **Update Fails Silently**
   - ❌ BAD: No alert message, data unchanged
   - ✅ GOOD: Success alert and table refreshes
