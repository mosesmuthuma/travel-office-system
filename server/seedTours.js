import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Tour from './models/Tours.js';

// Force Node to use Google DNS for MongoDB Atlas SRV lookup
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const sampleTours = [
  {
    title: 'Maasai Mara Safari Adventure',
    description: 'Witness the iconic Great Migration, endless savanna grasslands, and majestic wildlife in world-renowned game reserves.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Diani Beach Getaway',
    description: 'Relax on powder-white sands, swim in warm turquoise waters, and enjoy camel rides along Kenya south coast paradise.',
    price: 300,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Mount Kenya Trekking Expedition',
    description: 'Challenge yourself on a guided multi-day trek through breathtaking alpine flora, glacial lakes, and rugged mountain peaks.',
    price: 520,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Amboseli Elephant & Kilimanjaro View',
    description: 'Capture unforgettable photos of free-roaming giant elephant herds with the majestic, snow-capped Mount Kilimanjaro backdrop.',
    price: 380,
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Lake Nakuru Flamingo & Rhino Sanctuary',
    description: 'Discover vibrant shores covered in seasonal flamingos, rare white and black rhinos, and scenic baboon cliff viewpoints.',
    price: 250,
    image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Tsavo West Wilderness & Mzima Springs',
    description: 'Explore dramatic volcanic landscapes, natural crystal-clear underwater fish viewing chambers, and red soil elephant herds.',
    price: 410,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Lamu Island Swahili Heritage Tour',
    description: 'Step back in time in Kenya oldest inhabited Swahili town. Walk car-free stone alleyways and sail on traditional wooden dhows.',
    price: 340,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Lake Naivasha & Hell’s Gate Cycling',
    description: 'Cycle alongside zebras and giraffes through dramatic gorges, followed by a serene boat safari among hippos on Lake Naivasha.',
    price: 210,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.DATABASE_URL);
    console.log('MongoDB Connected for Seeding...');

    await Tour.deleteMany({});
    await Tour.insertMany(sampleTours);

    console.log('Database successfully seeded with 8 professional tours!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();