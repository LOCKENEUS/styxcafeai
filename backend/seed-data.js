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
    address: 'Andheri West, Mumbai, Maharashtra',
    country: 'India',
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.1136,
    long: 72.8697,
    details: 'Premier location in Western Mumbai with excellent connectivity',
    is_active: true,
    is_deleted: false
  },
  {
    address: 'Connaught Place, New Delhi',
    country: 'India',
    city: 'Delhi',
    state: 'Delhi',
    lat: 28.6315,
    long: 77.2167,
    details: 'Heart of Delhi with iconic architecture and bustling activity',
    is_active: true,
    is_deleted: false
  },
  {
    address: 'Civil Lines, Nagpur, Maharashtra',
    country: 'India',
    city: 'Nagpur',
    state: 'Maharashtra',
    lat: 21.1458,
    long: 79.0882,
    details: 'Upscale residential and commercial area in Central India',
    is_active: true,
    is_deleted: false
  },
  {
    address: 'Koregaon Park, Pune, Maharashtra',
    country: 'India',
    city: 'Pune',
    state: 'Maharashtra',
    lat: 18.5362,
    long: 73.8958,
    details: 'Trendy neighborhood known for cafes, nightlife and culture',
    is_active: true,
    is_deleted: false
  },
  {
    address: 'Indiranagar, Bangalore, Karnataka',
    country: 'India',
    city: 'Bangalore',
    state: 'Karnataka',
    lat: 12.9716,
    long: 77.5946,
    details: 'Vibrant area with tech startups and modern lifestyle',
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
        contact_no: '+91-9876543210',
        cafe_name: 'Styx Cafe - Andheri West',
        location: locations[0]._id,
        address: 'Shop 15, Infiniti Mall, New Link Road, Andheri West, Mumbai, Maharashtra - 400053',
        website_url: 'https://styxcafe.com/mumbai',
        password: hashedPassword,
        description: 'Premier sports hub with state-of-the-art facilities, professional coaching, and vibrant cafe atmosphere in Mumbai\'s heart. Features badminton, cricket, and football courts with modern amenities.',
        cafeImage: ['https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800'],
        cafeLogo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200',
        gstNo: '27AABCS1234F1Z5',
        panNo: 'AABCS1234F',
        ownershipType: 'FOFO',
        depositAmount: 85000,
        yearsOfContract: 3,
        officeContactNo: '+91-022-67891234',
        is_active: true,
        is_deleted: false
      },
      {
        name: 'Vikram Singh',
        email: 'styx.delhi@example.com',
        contact_no: '+91-9876543211',
        cafe_name: 'Styx Cafe - Connaught Place',
        location: locations[1]._id,
        address: 'Block M, Inner Circle, Connaught Place, New Delhi - 110001',
        website_url: 'https://styxcafe.com/delhi',
        password: hashedPassword,
        description: 'Experience world-class sports facilities with modern amenities, expert trainers, and a relaxing cafe lounge in central Delhi. Multi-sport complex featuring tennis, squash, and indoor games.',
        cafeImage: ['https://images.unsplash.com/photo-1554629947-334ff61d85dc?w=800'],
        cafeLogo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200',
        gstNo: '07AABCS5678G1Z8',
        panNo: 'AABCS5678G',
        ownershipType: 'FOCO',
        depositAmount: 75000,
        yearsOfContract: 5,
        officeContactNo: '+91-011-45671234',
        is_active: true,
        is_deleted: false
      },
      {
        name: 'Priya Deshmukh',
        email: 'styx.nagpur@example.com',
        contact_no: '+91-9876543212',
        cafe_name: 'Styx Cafe - Civil Lines',
        location: locations[2]._id,
        address: 'Near Kasturchand Park, Central Avenue Road, Civil Lines, Nagpur, Maharashtra - 440001',
        website_url: 'https://styxcafe.com/nagpur',
        password: hashedPassword,
        description: 'Nagpur\'s finest sports arena featuring multi-sport courts, certified coaches, premium equipment, and cozy cafe with healthy refreshments. Perfect for families and sports enthusiasts.',
        cafeImage: ['https://images.unsplash.com/photo-1577897113292-3b95936e5206?w=800'],
        cafeLogo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200',
        gstNo: '27AABCS9012H1Z2',
        panNo: 'AABCS9012H',
        ownershipType: 'FOFO',
        depositAmount: 65000,
        yearsOfContract: 3,
        officeContactNo: '+91-0712-2345678',
        is_active: true,
        is_deleted: false
      },
      {
        name: 'Amit Patil',
        email: 'styx.pune@example.com',
        contact_no: '+91-9876543213',
        cafe_name: 'Styx Cafe - Koregaon Park',
        location: locations[3]._id,
        address: 'Lane 6, Opposite ABC Farms, Koregaon Park, Pune, Maharashtra - 411001',
        website_url: 'https://styxcafe.com/pune',
        password: hashedPassword,
        description: 'Trendy sports cafe in Pune\'s premier neighborhood. Modern gaming arena with snooker tables, cricket nets, and pickleball courts. Perfect for tournaments and casual gaming sessions.',
        cafeImage: ['https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=800'],
        cafeLogo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200',
        gstNo: '27AABCS3456I1Z9',
        panNo: 'AABCS3456I',
        ownershipType: 'FOCO',
        depositAmount: 70000,
        yearsOfContract: 4,
        officeContactNo: '+91-020-67893456',
        is_active: true,
        is_deleted: false
      },
      {
        name: 'Rahul Reddy',
        email: 'styx.bangalore@example.com',
        contact_no: '+91-9876543214',
        cafe_name: 'Styx Cafe - Indiranagar',
        location: locations[4]._id,
        address: '100 Feet Road, 7th Cross, Indiranagar, Bangalore, Karnataka - 560038',
        website_url: 'https://styxcafe.com/bangalore',
        password: hashedPassword,
        description: 'Bangalore\'s premier sports club in the heart of Indiranagar. Features premium facilities including badminton, tennis, indoor cricket, and exclusive members lounge with gourmet cafe.',
        cafeImage: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'],
        cafeLogo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200',
        gstNo: '29AABCS7890J1Z3',
        panNo: 'AABCS7890J',
        ownershipType: 'FOFO',
        depositAmount: 100000,
        yearsOfContract: 5,
        officeContactNo: '+91-080-45678912',
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
