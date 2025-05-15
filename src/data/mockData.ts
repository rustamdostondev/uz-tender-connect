
export const mockTenders = [
  {
    id: "1",
    title: "Website Redesign for Local Business",
    description: "We need a complete redesign of our 5-page business website. Looking for modern design with mobile responsiveness and improved user experience.",
    budget: 1200,
    deadline: "2025-06-15T00:00:00Z",
    category: "Design",
    status: "open" as const,
    createdAt: "2025-05-05T14:30:00Z",
    offersCount: 3,
    userId: "user1"
  },
  {
    id: "2",
    title: "Mobile App Development for Food Delivery",
    description: "Seeking a developer to create a food delivery app with real-time tracking, payment integration, and user authentication.",
    budget: 5000,
    deadline: "2025-07-20T00:00:00Z",
    category: "Development",
    status: "open" as const,
    createdAt: "2025-05-08T09:15:00Z",
    offersCount: 5,
    userId: "user2"
  },
  {
    id: "3",
    title: "Social Media Marketing Campaign",
    description: "Looking for a marketing expert to run a 3-month social media campaign for our new product launch across Instagram, Facebook, and TikTok.",
    budget: 2500,
    deadline: "2025-06-01T00:00:00Z",
    category: "Marketing",
    status: "open" as const,
    createdAt: "2025-05-10T11:45:00Z",
    offersCount: 7,
    userId: "user3"
  },
  {
    id: "4",
    title: "Logo Design and Brand Identity",
    description: "Need a modern logo and complete brand identity package for a new tech startup. Includes logo, color scheme, typography, and brand guidelines.",
    budget: 800,
    deadline: "2025-05-30T00:00:00Z",
    category: "Design",
    status: "pending" as const,
    createdAt: "2025-05-12T15:20:00Z",
    offersCount: 12,
    userId: "user4"
  },
  {
    id: "5",
    title: "Content Writing for Educational Blog",
    description: "Seeking a content writer to create 10 in-depth educational blog posts about personal finance and investment strategies.",
    budget: 500,
    deadline: "2025-06-10T00:00:00Z",
    category: "Content",
    status: "open" as const,
    createdAt: "2025-05-14T12:30:00Z",
    offersCount: 4,
    userId: "user5"
  },
  {
    id: "6",
    title: "E-commerce Website Development",
    description: "Need a developer to build a full-featured e-commerce website with product catalog, shopping cart, and payment processing.",
    budget: 3500,
    deadline: "2025-07-15T00:00:00Z",
    category: "Development",
    status: "closed" as const,
    createdAt: "2025-05-02T10:00:00Z",
    offersCount: 9,
    userId: "user6"
  }
];

export const mockOffers = [
  {
    id: "101",
    tenderId: "1",
    user: {
      id: "user7",
      name: "Alex Johnson"
    },
    price: 1100,
    deliveryTime: "2 weeks",
    message: "I have extensive experience in website redesign projects and can deliver a modern, responsive design that will improve your user experience significantly.",
    status: "pending" as const,
    createdAt: "2025-05-06T09:30:00Z",
    matchScore: 85
  },
  {
    id: "102",
    tenderId: "1",
    user: {
      id: "user8",
      name: "Sarah Miller"
    },
    price: 950,
    deliveryTime: "3 weeks",
    message: "I specialize in creating user-friendly websites with modern aesthetics. Would love to work on your redesign project.",
    status: "pending" as const,
    createdAt: "2025-05-07T14:15:00Z",
    matchScore: 78
  },
  {
    id: "103",
    tenderId: "1",
    user: {
      id: "user9",
      name: "Michael Chen"
    },
    price: 1300,
    deliveryTime: "10 days",
    message: "With my 8 years of experience in UI/UX design, I can deliver a premium redesign that will significantly enhance your brand presence.",
    status: "pending" as const,
    createdAt: "2025-05-08T11:20:00Z",
    matchScore: 92
  }
];

export const mockCategories = [
  "Design",
  "Development", 
  "Marketing", 
  "Content", 
  "Business", 
  "Finance", 
  "Education", 
  "Legal", 
  "Other"
];
