const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const DB_URL = process.env.DB_URL;

// Connect to MongoDB
mongoose.connect(DB_URL)
  .then(() => console.log('✓ Connected to MongoDB'))
  .catch(err => {
    console.error('✗ MongoDB connection error:', err);
    process.exit(1);
  });

// Import models
const Cafe = require('./component/superadmin/cafe/model');
const Location = require('./component/superadmin/location/model');

async function createAdmins() {
  try {
    // First, check if we have any locations
    let location = await Location.findOne();
    
    if (!location) {
      console.log('No locations found. Creating a default location...');
      location = new Location({
        address: 'Mumbai, Maharashtra, India',
        country: 'India',
        city: 'Mumbai',
        state: 'Maharashtra',
        lat: 19.0760,
        long: 72.8777,
        details: 'Default location for Styx Cafe',
        is_active: true,
        is_deleted: false
      });
      await location.save();
      console.log('✓ Default location created');
    }

    console.log(`Using location: ${location.city}, ${location.state}`);

    // Admin accounts to create
    const admins = [
      {
        name: 'Styx Mumbai Admin',
        email: 'styx.mumbai@example.com',
        password: 'admin123',
        contact_no: '9876543210',
        cafe_name: 'Styx Cafe Mumbai',
        address: 'Mumbai, Maharashtra',
        ownershipType: 'FOFO'
      },
      {
        name: 'Styx Admin',
        email: 'styxcafe@gmail.com',
        password: '1010198#rR',
        contact_no: '9876543211',
        cafe_name: 'Styx Cafe Main',
        address: 'Mumbai, Maharashtra',
        ownershipType: 'FOFO'
      }
    ];

    for (const adminData of admins) {
      // Check if admin already exists
      const existing = await Cafe.findOne({ email: adminData.email });
      
      if (existing) {
        console.log(`\n✓ Admin already exists: ${adminData.email}`);
        console.log('  Updating password...');
        
        // Hash password and update
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        await Cafe.updateOne(
          { email: adminData.email },
          { 
            password: hashedPassword,
            name: adminData.name,
            location: location._id,
            updatedAt: new Date() 
          }
        );
        console.log('  ✓ Password updated');
      } else {
        // Hash password
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        
        // Create new admin cafe
        const cafe = new Cafe({
          name: adminData.name,
          email: adminData.email,
          password: hashedPassword,
          contact_no: adminData.contact_no,
          cafe_name: adminData.cafe_name,
          location: location._id,
          address: adminData.address,
          ownershipType: adminData.ownershipType,
          is_active: true,
          is_deleted: false
        });
        
        await cafe.save();
        console.log(`\n✓ Created admin: ${adminData.email}`);
      }
      
      console.log(`  📧 Email: ${adminData.email}`);
      console.log(`  🔑 Password: ${adminData.password}`);
    }

    console.log('\n🌐 Login URLs:');
    console.log('  Local: http://localhost:3000/admin/login');
    console.log('  Live: https://cafe-admin-panel.preview.emergentagent.com/admin/login');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating admins:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

createAdmins();
