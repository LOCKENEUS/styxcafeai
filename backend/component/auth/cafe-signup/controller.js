const bcrypt = require('bcrypt');
const Cafe = require('../../superadmin/cafe/model');
const Location = require('../../superadmin/location/model');

// Cafe Owner Signup - List Your Court
const cafeOwnerSignup = async (req, res) => {
  try {
    const {
      // Owner Info
      name,
      email,
      contact_no,
      password,
      
      // Cafe Info
      cafe_name,
      cafe_description,
      address,
      city,
      state,
      country,
      pincode,
      latitude,
      longitude,
      
      // Business Info
      gstNo,
      panNo,
      ownershipType,
      
      // Optional
      website_url,
      officeContactNo,
    } = req.body;

    // Validation
    if (!name || !email || !contact_no || !password || !cafe_name || !address || !city || !state) {
      return res.status(400).json({
        status: false,
        message: 'Required fields: name, email, contact_no, password, cafe_name, address, city, state'
      });
    }

    // Check if email already exists
    const existingCafe = await Cafe.findOne({ email });
    if (existingCafe) {
      return res.status(400).json({
        status: false,
        message: 'Email already registered. Please login or use a different email.'
      });
    }

    // Check if contact number exists
    const existingContact = await Cafe.findOne({ contact_no });
    if (existingContact) {
      return res.status(400).json({
        status: false,
        message: 'Contact number already registered.'
      });
    }

    // Find or create location
    let location = await Location.findOne({ 
      city: city,
      state: state,
      country: country || 'India'
    });

    if (!location) {
      // Create new location
      location = await Location.create({
        address: `${city}, ${state}`,
        city,
        state,
        country: country || 'India',
        lat: latitude || 0,
        long: longitude || 0,
        details: `Auto-created for ${cafe_name}`,
        is_active: true
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create cafe
    const newCafe = await Cafe.create({
      name,
      email,
      contact_no,
      password: hashedPassword,
      cafe_name,
      location: location._id,
      address,
      description: cafe_description || `Welcome to ${cafe_name}`,
      website_url: website_url || '',
      gstNo: gstNo || '',
      panNo: panNo || '',
      ownershipType: ownershipType || 'FOFO',
      depositAmount: 0,
      yearsOfContract: 1,
      officeContactNo: officeContactNo || contact_no,
      cafeImage: [],
      cafeLogo: '',
      is_active: false, // Requires admin approval
      is_deleted: false
    });

    // Return success (without sensitive data)
    const cafeData = {
      id: newCafe._id,
      cafe_name: newCafe.cafe_name,
      email: newCafe.email,
      contact_no: newCafe.contact_no,
      address: newCafe.address,
      city,
      state,
      status: 'pending_approval',
      message: 'Registration successful! Your cafe is pending admin approval.'
    };

    return res.status(201).json({
      status: true,
      message: 'Cafe registered successfully! You will be notified once approved.',
      data: cafeData
    });

  } catch (error) {
    console.error('Cafe signup error:', error);
    return res.status(500).json({
      status: false,
      message: error.message || 'Error during cafe registration'
    });
  }
};

module.exports = {
  cafeOwnerSignup
};
