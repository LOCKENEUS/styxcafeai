const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const Cafe = require('./component/superadmin/cafe/model');
const Location = require('./component/superadmin/location/model');

// Connect to MongoDB
mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/styxcafe', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✓ Connected to MongoDB'))
.catch(err => {
  console.error('✗ MongoDB connection error:', err);
  process.exit(1);
});

// Sample data
const sampleLocations = [
  {
    name: 'Mumbai Central',
    address: 'Central Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    is_active: true,
    is_deleted: false
  },
  {
    name: 'Pune Koregaon Park',
    address: 'Koregaon Park, Pune, Maharashtra',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    is_active: true,
    is_deleted: false
  },
  {
    name: 'Bangalore Indiranagar',
    address: 'Indiranagar, Bangalore, Karnataka',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    is_active: true,
    is_deleted: false
  }
];

const seedDatabase = async () => {
  try {
    console.log('\n🌱 Starting database seeding...\n');

    // Clear existing data
    console.log('Clearing existing locations and cafes...');
    await Location.deleteMany({});
    await Cafe.deleteMany({});
    console.log('✓ Cleared existing data\n');

    // Create locations
    console.log('Creating locations...');
    const locations = await Location.insertMany(sampleLocations);
    console.log(`✓ Created ${locations.length} locations\n`);

    // Create sample cafes
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const sampleCafes = [
      {
        name: 'Rajesh Kumar',
        email: 'styx.mumbai@example.com',
        contact_no: '9876543210',
        cafe_name: 'Styx Sports Lounge Mumbai',
        location: locations[0]._id,
        address: 'Shop 101, Central Plaza, Mumbai Central, Mumbai, Maharashtra',
        website_url: 'https://styxsports-mumbai.com',
        password: hashedPassword,
        description: 'Premium sports and gaming lounge featuring snooker, pool tables, and cricket facilities. Perfect for sports enthusiasts and corporate events.',
        cafeImage: [],
        cafeLogo: '',
        gstNo: 'GST123456789',
        panNo: 'ABCDE1234F',
        ownershipType: 'Private',
        depositAmount: 50000,
        yearsOfContract: 3,
        officeContactNo: '022-12345678',
        is_active: true,
        is_deleted: false
      },
      {
        name: 'Priya Sharma',
        email: 'styx.pune@example.com',
        contact_no: '9876543211',
        cafe_name: 'Styx Gaming Arena Pune',
        location: locations[1]._id,
        address: '2nd Floor, Lane 5, Koregaon Park, Pune, Maharashtra',
        website_url: 'https://styxgaming-pune.com',
        password: hashedPassword,
        description: 'Modern gaming arena with state-of-the-art facilities including snooker tables, turf for cricket, and pickleball courts. Ideal for tournaments and casual gaming.',
        cafeImage: [],
        cafeLogo: '',
        gstNo: 'GST234567890',
        panNo: 'BCDEF2345G',
        ownershipType: 'Partnership',
        depositAmount: 75000,
        yearsOfContract: 5,
        officeContactNo: '020-98765432',
        is_active: true,
        is_deleted: false
      },
      {
        name: 'Amit Patel',
        email: 'styx.bangalore@example.com',
        contact_no: '9876543212',
        cafe_name: 'Styx Club Bangalore',
        location: locations[2]._id,
        address: '100 Feet Road, Indiranagar, Bangalore, Karnataka',
        website_url: 'https://styxclub-bangalore.com',
        password: hashedPassword,
        description: 'Exclusive sports club offering premium snooker tables, indoor cricket nets, and multi-sport facilities. Members-only lounge with café service.',
        cafeImage: [],
        cafeLogo: '',
        gstNo: 'GST345678901',
        panNo: 'CDEFG3456H',
        ownershipType: 'Private',
        depositAmount: 100000,
        yearsOfContract: 5,
        officeContactNo: '080-87654321',
        is_active: true,
        is_deleted: false
      }
    ];

    console.log('Creating cafes...');
    const cafes = await Cafe.insertMany(sampleCafes);
    console.log(`✓ Created ${cafes.length} cafes\n`);

    // Display created data
    console.log('📍 Created Locations:');
    locations.forEach((loc, index) => {
      console.log(`   ${index + 1}. ${loc.name} (${loc.city})`);
    });

    console.log('\n☕ Created Cafes:');
    cafes.forEach((cafe, index) => {
      console.log(`   ${index + 1}. ${cafe.cafe_name}`);
      console.log(`      📧 Email: ${cafe.email}`);
      console.log(`      📞 Phone: ${cafe.contact_no}`);
      console.log(`      📍 Location: ${cafe.address}`);
      console.log(`      🔑 Password: admin123`);
      console.log('');
    });

    console.log('✅ Database seeding completed successfully!\n');
    console.log('🎯 Next Steps:');
    console.log('   1. Visit http://localhost:3001 to see the user frontend with cafes');
    console.log('   2. Login to admin panel at http://localhost:3000 with cafe credentials');
    console.log('   3. Add games, slots, and more details to each cafe\n');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding
seedDatabase();
