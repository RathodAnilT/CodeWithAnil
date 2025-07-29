const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Testimonial = require('../models/Testimonial');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'codewithanil'
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

// Sample testimonials
const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer at Google',
    image: 'user1.jpg',
    content: 'The DSA course on CodeWithAnil helped me crack my Google interview. The explanations are clear and the practice problems are well-curated.',
    rating: 5,
    isActive: true
  },
  {
    name: 'Rahul Verma',
    role: 'Student at IIT Delhi',
    image: 'user2.jpg',
    content: 'I improved my problem-solving skills significantly. The step-by-step approach to complex algorithms made learning easier.',
    rating: 5,
    isActive: true
  },
  {
    name: 'Anjali Patel',
    role: 'Frontend Developer',
    image: 'user3.jpg',
    content: 'The React courses are excellent! I was able to build a portfolio project that got me my first job in the field.',
    rating: 4,
    isActive: true
  },
  {
    name: 'Vikram Singh',
    role: 'Backend Engineer at Amazon',
    image: 'user4.jpg',
    content: 'System design concepts were explained clearly. The interview preparation section was particularly helpful.',
    rating: 5,
    isActive: true
  },
  {
    name: 'Neha Gupta',
    role: 'Computer Science Graduate',
    image: 'user5.jpg',
    content: 'CodeWithAnil helped me understand complex CS fundamentals easily. Highly recommended for students!',
    rating: 4,
    isActive: true
  }
];

// Seed database
const seedDatabase = async () => {
  try {
    // Clear existing testimonials
    await Testimonial.deleteMany();
    console.log('Cleared existing testimonials');
    
    // Create new testimonials
    await Testimonial.create(testimonials);
    console.log(`Successfully seeded ${testimonials.length} testimonials`);
    
    // Disconnect from database
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase(); 