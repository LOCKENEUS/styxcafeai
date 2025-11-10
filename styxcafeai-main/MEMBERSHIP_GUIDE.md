# Membership Management Guide

## Overview

The Styx Cafe Management System includes a comprehensive membership management module that allows super administrators to create, manage, and track membership plans for different cafes.

## Features

### ✅ Implemented Features

1. **Create Membership Plans**
   - Custom membership names (Gold, Platinum, VIP, etc.)
   - Flexible validity periods (Weekly, Monthly, Quarterly, Yearly, 3 Months)
   - Set usage limits per membership
   - Custom pricing for each plan
   - Multiple benefit details per plan

2. **Manage Memberships**
   - Edit existing membership plans
   - Soft delete memberships (data retention)
   - View all memberships per cafe
   - Real-time updates with Redux state management

3. **Membership Display**
   - Beautiful card-based UI
   - Visual indicators for membership tiers
   - Expiry information
   - Detailed benefit listings
   - Price display in Indian Rupees (₹)

4. **Form Validation**
   - Required field validation
   - Number validation for price and limits
   - Array validation for benefit details
   - Duplicate prevention

## User Interface

### Super Admin Dashboard

Navigate to: **Super Admin → Cafe Details → Create Membership**

#### Membership List View
- Cards displaying all active memberships
- Each card shows:
  - Membership tier icon
  - Membership name
  - Validity period
  - List of benefits
  - Price

#### Create/Edit Form (Offcanvas)
- Responsive form that slides from the right
- Fields:
  - **Name**: Membership plan name
  - **Validity**: Dropdown with predefined options
  - **Limit**: Usage limit (number of bookings/visits)
  - **Price**: Membership fee
  - **Details**: Dynamic list of benefits (add/remove)

## API Documentation

### Base URL
```
http://localhost:8001/superadmin/membership
```

### Endpoints

#### 1. Create Membership
```http
POST /superadmin/membership
Content-Type: application/json

{
  "cafe": "654abc123def456789",
  "name": "Gold Membership",
  "details": [
    "20% discount on all bookings",
    "Priority slot booking",
    "Free refreshments on every visit"
  ],
  "validity": "Yearly",
  "limit": 50,
  "price": 5000
}
```

**Response:**
```json
{
  "status": true,
  "message": "Membership created successfully",
  "data": {
    "_id": "654abc123def456789",
    "cafe": "654abc123def456789",
    "name": "Gold Membership",
    "details": ["20% discount on all bookings", "..."],
    "validity": "Yearly",
    "limit": 50,
    "price": 5000,
    "is_active": true,
    "is_deleted": false,
    "createdAt": "2025-11-05T10:00:00.000Z",
    "updatedAt": "2025-11-05T10:00:00.000Z"
  }
}
```

#### 2. Get Membership by ID
```http
GET /superadmin/membership/:id
```

**Response:**
```json
{
  "status": true,
  "message": "Membership fetched successfully",
  "data": { ... }
}
```

#### 3. Update Membership
```http
PATCH /superadmin/membership/:id
Content-Type: application/json

{
  "name": "Premium Gold Membership",
  "price": 6000,
  "details": ["Updated benefit 1", "Updated benefit 2"]
}
```

**Response:**
```json
{
  "status": true,
  "message": "Membership updated successfully",
  "data": { ... }
}
```

#### 4. Delete Membership (Soft Delete)
```http
DELETE /superadmin/membership/:id
```

**Response:**
```json
{
  "status": true,
  "message": "membership marked as deleted.",
  "data": null
}
```

#### 5. Get All Memberships for a Cafe
```http
GET /superadmin/membership/list/:cafeId
```

**Response:**
```json
{
  "status": true,
  "message": "Memberships fetched successfully",
  "results": 3,
  "data": [
    {
      "_id": "...",
      "name": "Gold Membership",
      "validity": "Yearly",
      "price": 5000,
      "details": ["..."]
    },
    ...
  ]
}
```

## Database Schema

### Membership Model

```javascript
{
  cafe: ObjectId (ref: "Cafe"),      // Required
  name: String,                       // Required, trimmed
  details: [String],                  // Required, at least one
  validity: String,                   // Enum: Weekly, Monthly, Quarterly, Yearly, 3 Months
  limit: Number,                      // Required
  price: Number,                      // Required
  is_active: Boolean,                 // Default: true
  is_deleted: Boolean,                // Default: false
  createdAt: Date,                    // Auto-generated
  updatedAt: Date                     // Auto-generated
}
```

### Indexes
- `cafe`: For quick lookup of cafe memberships
- `is_active, is_deleted`: For filtering active memberships

## Frontend Integration

### Redux Store

The membership state is managed using Redux Toolkit:

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { 
  getMembershipsByCafeId, 
  addMembership, 
  updateMembership,
  deleteMembership,
  setSelectedMembership 
} from './store/slices/MembershipSlice';

// In component
const dispatch = useDispatch();
const { memberships, loading, error } = useSelector(state => state.memberships);

// Fetch memberships
dispatch(getMembershipsByCafeId(cafeId));

// Create membership
dispatch(addMembership(membershipData));

// Update membership
dispatch(updateMembership({ id, data }));

// Delete membership
dispatch(deleteMembership(id));
```

### Component Structure

```
SuperAdmin/cafe/membership/
├── CreateMembership.jsx     # Main membership listing page
├── MembershipForm.jsx        # Create/Edit form (Offcanvas)
└── ...
```

## Usage Examples

### Creating a New Membership Plan

1. Navigate to Super Admin Dashboard
2. Go to Cafe Details for the desired cafe
3. Click "Create Membership" button
4. Fill in the form:
   - Name: "Platinum Membership"
   - Validity: "Yearly"
   - Limit: 100
   - Price: 10000
   - Details:
     - 30% discount on all bookings
     - Free access to premium lounges
     - Complimentary refreshments
     - Priority customer support
     - Birthday special offers
5. Click "Save Membership"

### Editing an Existing Membership

1. Navigate to the membership list
2. Click on the membership card you want to edit
3. Modify the desired fields
4. Click "Save Membership"

### Deleting a Membership

1. Navigate to the membership list
2. Click the delete icon on the membership card
3. Confirm deletion
4. Membership will be soft-deleted (data retained)

## Validation Rules

### Frontend Validation
- All required fields must be filled
- Price must be a positive number
- Limit must be a positive number
- At least one detail must be provided
- Detail fields cannot be empty

### Backend Validation
- Cafe ID must be a valid MongoDB ObjectId
- Name must be provided and trimmed
- Details array must have at least one element
- Validity must be one of the enum values
- Limit and Price must be numbers

## Error Handling

### Common Errors

1. **Invalid Cafe ID**
```json
{
  "status": false,
  "message": "Cast to ObjectId failed..."
}
```
**Solution**: Ensure you're passing a valid MongoDB ObjectId for the cafe

2. **Missing Required Fields**
```json
{
  "status": false,
  "message": "Membership name is required"
}
```
**Solution**: Fill all required fields marked with *

3. **Empty Details Array**
```json
{
  "status": false,
  "message": "At least one detail is required"
}
```
**Solution**: Add at least one benefit detail

## Future Enhancements

### Planned Features

1. **Member Assignment**
   - Assign memberships to specific customers
   - Track active members per plan
   - Membership expiry notifications

2. **Usage Tracking**
   - Track booking count against limit
   - Usage analytics per membership
   - Auto-renewal options

3. **Benefits Management**
   - Predefined benefit templates
   - Conditional benefits based on usage
   - Member-exclusive offers

4. **Analytics Dashboard**
   - Revenue per membership tier
   - Most popular memberships
   - Member retention rates
   - Conversion tracking

5. **Payment Integration**
   - Online membership purchase
   - Auto-renewal with Razorpay
   - Payment history

6. **Advanced Features**
   - Family memberships (multiple users)
   - Corporate memberships
   - Referral rewards
   - Loyalty points integration

## Testing

### Manual Testing Checklist

- [ ] Create a new membership plan
- [ ] Edit an existing membership
- [ ] Delete a membership
- [ ] View membership list for a cafe
- [ ] Test form validation (empty fields)
- [ ] Test with multiple benefit details
- [ ] Test responsive design (mobile/tablet)
- [ ] Verify Redux state updates
- [ ] Check API responses
- [ ] Test error handling

### API Testing with cURL

```bash
# Create membership
curl -X POST http://localhost:8001/superadmin/membership \
  -H "Content-Type: application/json" \
  -d '{
    "cafe": "YOUR_CAFE_ID",
    "name": "Test Membership",
    "details": ["Benefit 1", "Benefit 2"],
    "validity": "Monthly",
    "limit": 10,
    "price": 1000
  }'

# Get memberships for cafe
curl http://localhost:8001/superadmin/membership/list/YOUR_CAFE_ID

# Update membership
curl -X PATCH http://localhost:8001/superadmin/membership/MEMBERSHIP_ID \
  -H "Content-Type: application/json" \
  -d '{"price": 1500}'

# Delete membership
curl -X DELETE http://localhost:8001/superadmin/membership/MEMBERSHIP_ID
```

## Troubleshooting

### Issue: Memberships not loading
**Solution**: 
- Check if backend is running: `supervisorctl status backend`
- Verify cafe ID is correct
- Check browser console for errors
- Verify API URL in frontend .env

### Issue: Form not submitting
**Solution**:
- Check all required fields are filled
- Open browser console for validation errors
- Verify backend is accepting requests
- Check CORS configuration

### Issue: Membership not updating
**Solution**:
- Verify membership ID is correct
- Check if user has proper permissions
- View backend logs for errors
- Ensure Redux store is updated

## Support

For issues or questions about membership management:
1. Check this documentation
2. Review backend logs: `/var/log/supervisor/backend.out.log`
3. Check frontend console for errors
4. Contact the development team

---

**Last Updated**: November 2025
**Version**: 1.0.0
