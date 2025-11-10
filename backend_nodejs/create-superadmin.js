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

// Import the User model (which has superadmin role)
const User = require('./component/auth/model/model');

async function createSuperAdmin() {
  try {
    const email = 'styxcafe@gmail.com';
    const password = '10101984#rR';
    const name = 'Styx Cafe Super Admin';

    // Check if super admin already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`✓ Super admin already exists with email: ${email}`);
      console.log('Updating password and role...');
      
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.updateOne(
        { email },
        { password: hashedPassword, name, role: 'superadmin', updatedAt: new Date() }
      );
      console.log('✓ Password and role updated successfully!');
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create super admin user
      const superAdmin = new User({
        email,
        password: hashedPassword,
        name,
        contact: '1234567890', // Default contact
        role: 'superadmin'
      });
      
      await superAdmin.save();
      console.log('✓ Super admin created successfully!');
    }

    console.log('\n📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('🌐 Login URL: http://localhost:3000/superadmin/login\n');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating super admin:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

createSuperAdmin();
