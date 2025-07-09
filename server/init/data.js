const users = [
  {
    username: "alicej",
    email: "alice.johnson@example.com",
    password: "password123",
    userType: "student",
    credits: 20,
    badges: ["early_bird"],
    skillsWanted: ["JavaScript", "UI Design"],
    skillsOffered: ["Graphic Design"],
    location: "New York",
    bio: "Aspiring frontend developer with a design background.",
    avatarUrl: "https://i.pravatar.cc/150?u=alice",
    isVerified: true,
    status: "active"
  },
  {
    username: "bobsmith",
    email: "bob.smith@example.com",
    password: "qwerty456",
    userType: "working_professional",
    credits: 50,
    badges: ["mentor"],
    skillsWanted: ["Machine Learning", "Public Speaking"],
    skillsOffered: ["Python", "Data Analysis"],
    location: "San Francisco",
    bio: "Tech lead with a passion for mentoring developers.",
    avatarUrl: "https://i.pravatar.cc/150?u=bob",
    isVerified: true,
    status: "active"
  },
  {
    username: "charlied",
    email: "charlie.davis@example.com",
    password: "charlie789",
    userType: "freelancer",
    credits: 10,
    badges: [],
    skillsWanted: ["SEO", "Digital Marketing"],
    skillsOffered: ["Content Writing"],
    location: "Remote",
    bio: "Freelance writer focused on SaaS and tech.",
    avatarUrl: "https://i.pravatar.cc/150?u=charlie",
    isVerified: false,
    status: "active"
  },
  {
    username: "danam",
    email: "dana.miller@example.com",
    password: "dana2025",
    userType: "other",
    credits: 5,
    badges: [],
    skillsWanted: ["3D Modeling"],
    skillsOffered: ["Illustration", "Concept Art"],
    location: "Chicago",
    bio: "Artist exploring the world of 3D design.",
    avatarUrl: "https://i.pravatar.cc/150?u=dana",
    isVerified: false,
    status: "active"
  },
  {
    username: "ethanl",
    email: "ethan.lee@example.com",
    password: "leeethan321",
    userType: "student",
    credits: 30,
    badges: ["contributor"],
    skillsWanted: ["React", "Node.js"],
    skillsOffered: ["JavaScript", "HTML", "CSS"],
    location: "Los Angeles",
    bio: "Frontend student building real-world projects.",
    avatarUrl: "https://i.pravatar.cc/150?u=ethan",
    isVerified: true,
    status: "active"
  }
];

module.exports = users;
