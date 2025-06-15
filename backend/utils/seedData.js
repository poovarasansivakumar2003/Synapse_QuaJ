const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Video = require('../models/Video');
require('dotenv').config();

const seedUsers = async () => {
  console.log('Starting user seeding...');
  
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Admin user
    const adminUser = new User({
      name: 'System Admin',
      email: 'admin@university.edu',
      password: 'admin123',
      role: 'admin',
      profile: {
        isVerified: true
      }
    });

    // Sample alumni
    const alumniUsers = [
      {
        name: 'John Doe',
        email: 'john.doe@company.com',
        password: 'password123',
        role: 'alumni',
        profile: {
          graduationYear: 2020,
          course: 'Computer Science',
          department: 'Engineering',
          currentCompany: 'Google',
          jobTitle: 'Software Engineer',
          skills: ['JavaScript', 'Python', 'React', 'Node.js'],
          bio: 'Passionate software engineer with 3+ years of experience',
          isVerified: true
        },
        preferences: {
          availableForMentoring: true,
          mentorshipAreas: ['Software Development', 'Career Guidance']
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        password: 'password123',
        role: 'alumni',
        profile: {
          graduationYear: 2019,
          course: 'Business Administration',
          department: 'Business',
          currentCompany: 'Microsoft',
          jobTitle: 'Product Manager',
          skills: ['Product Management', 'Leadership', 'Strategy'],
          bio: 'Product manager with expertise in tech products',
          isVerified: true
        },
        preferences: {
          availableForMentoring: true,
          mentorshipAreas: ['Product Management', 'Leadership']
        }
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        password: 'password123',
        role: 'alumni',
        profile: {
          graduationYear: 2018,
          course: 'Computer Science',
          department: 'Engineering',
          currentCompany: 'Amazon',
          jobTitle: 'Senior Software Engineer',
          skills: ['Java', 'AWS', 'System Design', 'Leadership'],
          bio: 'Senior engineer with expertise in distributed systems',
          isVerified: true
        },
        preferences: {
          availableForMentoring: true,
          mentorshipAreas: ['Technical Leadership', 'System Design']
        }
      }
    ];

    // Sample students
    const studentUsers = [
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@university.edu',
        password: 'password123',
        role: 'student',
        profile: {
          graduationYear: 2024,
          course: 'Computer Science',
          department: 'Engineering',
          skills: ['JavaScript', 'Python'],
          bio: 'Final year computer science student',
          isVerified: true
        }
      },
      {
        name: 'Bob Wilson',
        email: 'bob.wilson@university.edu',
        password: 'password123',
        role: 'student',
        profile: {
          graduationYear: 2025,
          course: 'Business Administration',
          department: 'Business',
          skills: ['Marketing', 'Analytics'],
          bio: 'Business student interested in marketing',
          isVerified: true
        }
      },
      {
        name: 'Sarah Chen',
        email: 'sarah.chen@university.edu',
        password: 'password123',
        role: 'student',
        profile: {
          graduationYear: 2024,
          course: 'Computer Science',
          department: 'Engineering',
          skills: ['React', 'Node.js', 'MongoDB'],
          bio: 'Aspiring full-stack developer',
          isVerified: true
        }
      }
    ];

    // Create users
    const allUsers = [adminUser, ...alumniUsers, ...studentUsers];
    for (const userData of allUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.name} (${user.role})`);
    }
    
    console.log('Users seeded successfully!');
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

const seedVideos = async () => {
  console.log('Starting video seeding...');
  
  try {
    // Clear existing videos
    await Video.deleteMany({});
    console.log('Cleared existing videos');
    
    const videos = [
      {
        title: 'Career Paths in Software Engineering',
        description: 'Explore different career paths available in software engineering',
        course: 'Computer Science',
        category: 'career-guidance',
        videoUrl: 'https://www.youtube.com/watch?v=g8a0_FoE_0c',
        thumbnail: 'https://img.youtube.com/vi/g8a0_FoE_0c/maxresdefault.jpg',
        instructor: {
          name: 'John Doe',
          company: 'Google'
        },
        duration: '15:30',
        tags: ['career', 'software', 'engineering'],
        isActive: true
      },
      {
        title: 'Building Your First Startup',
        description: 'Learn the basics of starting your own technology company',
        course: 'Computer Science',
        category: 'industry-insights',
        videoUrl: 'https://www.youtube.com/watch?v=ZoqgAy3h4OM',
        thumbnail: 'https://img.youtube.com/vi/ZoqgAy3h4OM/maxresdefault.jpg',
        instructor: {
          name: 'Jane Smith',
          company: 'Microsoft'
        },
        duration: '22:45',
        tags: ['startup', 'entrepreneurship', 'business'],
        isActive: true
      },
      {
        title: 'Interview Preparation for Tech Jobs',
        description: 'Tips and strategies for acing technical interviews',
        course: 'Computer Science',
        category: 'interview-prep',
        videoUrl: 'https://www.youtube.com/watch?v=KdXAUst8bdo',
        thumbnail: 'https://img.youtube.com/vi/KdXAUst8bdo/maxresdefault.jpg',
        instructor: {
          name: 'Mike Johnson',
          company: 'Amazon'
        },
        duration: '18:20',
        tags: ['interview', 'technical', 'preparation'],
        isActive: true
      },
      {
        title: 'Finance Career Opportunities',
        description: 'Overview of career opportunities in the finance sector',
        course: 'Business Administration',
        category: 'career-guidance',
        videoUrl: 'https://www.youtube.com/watch?v=WQu6Y6n6ack',
        thumbnail: 'https://img.youtube.com/vi/WQu6Y6n6ack/maxresdefault.jpg',
        instructor: {
          name: 'Sarah Wilson',
          company: 'Goldman Sachs'
        },
        duration: '20:15',
        tags: ['finance', 'career', 'banking'],
        isActive: true
      },
      {
        title: 'Data Science and Machine Learning',
        description: 'Introduction to data science and ML career paths',
        course: 'Computer Science',
        category: 'technical-skills',
        videoUrl: 'https://www.youtube.com/watch?v=N6BghzuFLIg',
        thumbnail: 'https://img.youtube.com/vi/N6BghzuFLIg/maxresdefault.jpg',
        instructor: {
          name: 'David Kumar',
          company: 'Netflix'
        },
        duration: '25:30',
        tags: ['data-science', 'machine-learning', 'analytics'],
        isActive: true
      },
      {
        title: 'UI/UX Design Fundamentals',
        description: 'Learn the basics of user interface and user experience design',
        course: 'Computer Science',
        category: 'technical-skills',
        videoUrl: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
        thumbnail: 'https://img.youtube.com/vi/c9Wg6Cb_YlU/maxresdefault.jpg',
        instructor: {
          name: 'Emma Wilson',
          company: 'Adobe'
        },
        duration: '28:45',
        tags: ['ui', 'ux', 'design', 'frontend'],
        isActive: true
      },
      {
        title: 'Digital Marketing in 2024',
        description: 'Master digital marketing strategies for the modern business world',
        course: 'Business Administration',
        category: 'industry-insights',
        videoUrl: 'https://www.youtube.com/watch?v=nU-IIXBWlS4',
        thumbnail: 'https://img.youtube.com/vi/nU-IIXBWlS4/maxresdefault.jpg',
        instructor: {
          name: 'Mark Thompson',
          company: 'HubSpot'
        },
        duration: '32:15',
        tags: ['marketing', 'digital', 'business', 'strategy'],
        isActive: true
      },
      {
        title: 'Project Management Best Practices',
        description: 'Essential project management skills for any career path',
        course: 'Business Administration',
        category: 'soft-skills',
        videoUrl: 'https://www.youtube.com/watch?v=3qIZp7-VLlw',
        thumbnail: 'https://img.youtube.com/vi/3qIZp7-VLlw/maxresdefault.jpg',
        instructor: {
          name: 'Lisa Chen',
          company: 'Atlassian'
        },
        duration: '24:30',
        tags: ['project-management', 'leadership', 'planning'],
        isActive: true
      }
    ];
    
    // Create videos
    await Video.insertMany(videos);
    console.log(`Created ${videos.length} videos`);
    
    console.log('Videos seeded successfully!');
  } catch (error) {
    console.error('Error seeding videos:', error);
    throw error;
  }
};

const runSeed = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    
    await seedUsers();
    await seedVideos();
    
    console.log('Database seeded successfully!');
    console.log('\nDefault login credentials:');
    console.log('Admin: admin@university.edu / admin123');
    console.log('Alumni: john.doe@company.com / password123');
    console.log('Student: alice.johnson@university.edu / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedUsers, seedVideos };
