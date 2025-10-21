# Microsoft Partner Center Setup for Focus Planner

## 1. Create In-App Purchase Product

### Step 1: Go to Partner Center
1. Visit https://partner.microsoft.com/
2. Sign in with your developer account
3. Navigate to your app: **Focus Planner**

### Step 2: Create Subscription Product
1. Go to **Monetization** → **In-app products**
2. Click **Create in-app product**
3. Fill in the details:

```
Product ID: focus_planner_premium_monthly
Product Type: Subscription
Name: Focus Planner Premium
Description: Unlimited projects, advanced reminders, custom themes, priority export
```

### Step 3: Configure Pricing
1. **Pricing Model**: Recurring subscription
2. **Billing Period**: Monthly
3. **Price**: $499.00 USD
4. **Free Trial**: 7 days
5. **Trial Type**: Full functionality trial

### Step 4: Set Availability
1. **Markets**: Select all markets where you want to sell
2. **Availability**: Available for purchase
3. **Visibility**: Visible in Store

## 2. Configure App Manifest

### Update AppxManifest.xml
Make sure your manifest includes the subscription capability:

```xml
<Capabilities>
  <rescap:Capability Name="allowElevation"/>
</Capabilities>
```

## 3. Test the Subscription

### Step 1: Upload Test Package
1. Go to **Packages** section
2. Upload your `FocusPlanner-1.0.3-fixed.msix` file
3. Wait for validation to complete

### Step 2: Test In-App Purchase
1. Use Windows Store for Business test account
2. Install the app from Store
3. Test the 7-day trial flow
4. Test subscription purchase after trial

## 4. Store Listing Configuration

### Step 1: Pricing and Availability
1. Go to **Pricing and availability**
2. Set **Base price**: Free
3. Enable **In-app purchases**: Yes
4. Configure markets and pricing

### Step 2: Store Properties
1. **Category**: Productivity
2. **Subcategory**: Task Management
3. **Keywords**: planner, tasks, productivity, focus

### Step 3: Age Rating
1. Complete age rating questionnaire
2. Set appropriate age restrictions

## 5. Submission Checklist

### Before Submitting:
- [ ] In-app product created with correct Product ID
- [ ] Pricing set to $499/month with 7-day trial
- [ ] App manifest includes subscription capabilities
- [ ] Test package uploaded and validated
- [ ] Store listing completed
- [ ] Age rating completed
- [ ] Privacy policy URL provided

### Product ID Reference:
Your app code uses: `focus_planner_premium_monthly`
Make sure this matches exactly in Partner Center.

## 6. Common Issues and Solutions

### Issue: "Product not found"
- **Solution**: Ensure Product ID matches exactly between code and Partner Center
- **Check**: Case sensitivity matters

### Issue: "Trial not working"
- **Solution**: Verify trial is enabled in Partner Center product settings
- **Check**: Trial period is set to 7 days

### Issue: "Purchase fails"
- **Solution**: Test with Store for Business account first
- **Check**: Product is published and available

## 7. Testing Commands

### Test Subscription Status:
```javascript
// In browser console
window.electronAPI.subscription.getStatus().then(console.log);
```

### Test Purchase Flow:
```javascript
// In browser console
window.electronAPI.subscription.purchase();
```

## 8. Next Steps After Setup

1. **Submit for Review**: Once everything is configured
2. **Monitor Analytics**: Track subscription metrics
3. **Update Pricing**: Adjust as needed based on market response
4. **Add Features**: Expand premium features based on user feedback

---

**Important**: The Product ID `focus_planner_premium_monthly` must match exactly between your code and Partner Center configuration.

