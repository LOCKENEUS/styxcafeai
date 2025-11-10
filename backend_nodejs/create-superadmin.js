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

// Define SuperAdmin schema (simple version)
const superAdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  role: { type: String, default: 'superadmin' },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false }
}, { timestamps: true });

const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema, 'superadmins');

async function createSuperAdmin() {
  try {
    const email = 'styxcafe@gmail.com';
    const password = '10101984#rR';
    const name = 'Styx Cafe Super Admin';

    // Check if super admin already exists
    const existing = await SuperAdmin.findOne({ email });
    if (existing) {
      console.log(`✓ Super admin already exists with email: ${email}`);
      console.log('Updating password...');
      
      const hashedPassword = await bcrypt.hash(password, 10);
      await SuperAdmin.updateOne(
        { email },
        { password: hashedPassword, name, updated_at: new Date() }
      );
      console.log('✓ Password updated successfully!');
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create super admin
      const superAdmin = new SuperAdmin({
        email,
        password: hashedPassword,
        name,
        role: 'superadmin',
        is_active: true,
        is_deleted: false
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
