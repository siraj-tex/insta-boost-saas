const connectDB = require('./db');
const Service = require('./models/Service');
require('dotenv').config();

const services = [
  // ── FOLLOWERS ──
  {
    type: 'followers', name: 'Starter Followers', quantity: 100,
    price: 49, originalPrice: 99,
    description: 'Perfect to kickstart your Instagram growth',
    features: ['Real-looking profiles', 'Safe & secure', 'Fast delivery', '30-day guarantee'],
    popular: false, deliveryTime: '1-6 hours', icon: '👥'
  },
  {
    type: 'followers', name: 'Basic Followers', quantity: 500,
    price: 199, originalPrice: 399,
    description: 'Give your profile a solid boost',
    features: ['High-quality profiles', 'Safe & secure', 'Fast delivery', '30-day guarantee'],
    popular: false, deliveryTime: '6-12 hours', icon: '👥'
  },
  {
    type: 'followers', name: 'Pro Followers', quantity: 1000,
    price: 349, originalPrice: 699,
    description: 'Best for growing influencers',
    features: ['Premium profiles', 'Gradual delivery', 'Safe & secure', '30-day guarantee'],
    popular: true, deliveryTime: '12-24 hours', icon: '👥'
  },
  {
    type: 'followers', name: 'Elite Followers', quantity: 5000,
    price: 1499, originalPrice: 2999,
    description: 'Skyrocket your follower count',
    features: ['High retention', 'Gradual delivery', 'Safe & secure', '60-day guarantee'],
    popular: false, deliveryTime: '2-3 days', icon: '👥'
  },
  {
    type: 'followers', name: 'Mega Followers', quantity: 10000,
    price: 2499, originalPrice: 4999,
    description: 'For brands & serious creators',
    features: ['Max retention', 'Gradual delivery', '24/7 support', '90-day guarantee'],
    popular: false, deliveryTime: '3-5 days', icon: '👥'
  },

  // ── VIEWS ──
  {
    type: 'views', name: 'Starter Views', quantity: 500,
    price: 29, originalPrice: 59,
    description: 'Boost your reel or post views instantly',
    features: ['Instant delivery', 'Safe & secure', 'No password needed', 'Real views'],
    popular: false, deliveryTime: '0-1 hours', icon: '👁️'
  },
  {
    type: 'views', name: 'Basic Views', quantity: 1000,
    price: 49, originalPrice: 99,
    description: 'Great for new reels and posts',
    features: ['Fast delivery', 'Safe & secure', 'No password needed', 'Real views'],
    popular: false, deliveryTime: '1-3 hours', icon: '👁️'
  },
  {
    type: 'views', name: 'Pro Views', quantity: 5000,
    price: 179, originalPrice: 359,
    description: 'Get trending with massive views',
    features: ['High retention', 'Fast delivery', 'Safe & secure', '30-day guarantee'],
    popular: true, deliveryTime: '3-6 hours', icon: '👁️'
  },
  {
    type: 'views', name: 'Elite Views', quantity: 10000,
    price: 299, originalPrice: 599,
    description: 'Perfect for viral content strategy',
    features: ['Max retention', 'Fast delivery', 'Safe & secure', '30-day guarantee'],
    popular: false, deliveryTime: '6-12 hours', icon: '👁️'
  },
  {
    type: 'views', name: 'Viral Views', quantity: 50000,
    price: 999, originalPrice: 1999,
    description: 'Go viral with 50K views package',
    features: ['Max retention', 'Gradual delivery', '24/7 support', '60-day guarantee'],
    popular: false, deliveryTime: '1-2 days', icon: '👁️'
  },

  // ── LIKES ──
  {
    type: 'likes', name: 'Starter Likes', quantity: 100,
    price: 39, originalPrice: 79,
    description: 'Boost engagement on any post',
    features: ['Instant delivery', 'Safe & secure', 'No password needed', 'Real profiles'],
    popular: false, deliveryTime: '0-1 hours', icon: '❤️'
  },
  {
    type: 'likes', name: 'Basic Likes', quantity: 500,
    price: 149, originalPrice: 299,
    description: 'Supercharge your post engagement',
    features: ['Fast delivery', 'Safe & secure', 'No password needed', '30-day guarantee'],
    popular: false, deliveryTime: '1-6 hours', icon: '❤️'
  },
  {
    type: 'likes', name: 'Pro Likes', quantity: 1000,
    price: 249, originalPrice: 499,
    description: 'Make your posts stand out',
    features: ['High retention', 'Fast delivery', 'Safe & secure', '30-day guarantee'],
    popular: true, deliveryTime: '6-12 hours', icon: '❤️'
  },
  {
    type: 'likes', name: 'Elite Likes', quantity: 5000,
    price: 999, originalPrice: 1999,
    description: 'Dominate your niche with likes',
    features: ['Max retention', 'Gradual delivery', '24/7 support', '60-day guarantee'],
    popular: false, deliveryTime: '1-2 days', icon: '❤️'
  },
];

const seed = async () => {
  await connectDB();
  const count = await Service.countDocuments();
  if (count > 0) {
    console.log(`ℹ️  Database already has ${count} services. Skipping seed.`);
    console.log('   Run with --force to reseed: node seed.js --force');
    if (!process.argv.includes('--force')) {
      process.exit(0);
    }
    await Service.deleteMany({});
    console.log('🗑️  Cleared existing services');
  }
  await Service.insertMany(services);
  console.log(`✅ Seeded ${services.length} services successfully!`);
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
