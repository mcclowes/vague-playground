export interface Example {
  id: string;
  name: string;
  description: string;
  code: string;
}

export const examples: Example[] = [
  {
    id: "basic",
    name: "Basic Schema",
    description: "Simple customer and invoice generation",
    code: `schema Customer {
  name: string,
  status: 0.8: "active" | 0.2: "inactive"
}

schema Invoice {
  customer: any of customers,
  amount: decimal in 100..10000,
  status: "draft" | "sent" | "paid",
  assume amount > 0
}

dataset TestData {
  customers: 50 of Customer,
  invoices: 200 of Invoice
}`,
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Products, orders, and reviews",
    code: `schema Product {
  name: string,
  price: decimal in 9.99..999.99,
  category: "Electronics" | "Clothing" | "Home" | "Books",
  inStock: 0.9: true | 0.1: false
}

schema Customer {
  email: faker("internet.email"),
  name: faker("person.fullName"),
  tier: 0.6: "standard" | 0.3: "premium" | 0.1: "vip"
}

schema Order {
  customer: any of customers,
  product: any of products,
  quantity: int in 1..5,
  status: "pending" | "shipped" | "delivered" | "cancelled"
}

schema Review {
  product: any of products,
  rating: int in 1..5,
  verified: 0.7: true | 0.3: false
}

dataset Store {
  products: 100 of Product,
  customers: 500 of Customer,
  orders: 1000 of Order,
  reviews: 300 of Review
}`,
  },
  {
    id: "hr",
    name: "HR System",
    description: "Employees, departments, and payroll",
    code: `schema Department {
  name: "Engineering" | "Sales" | "Marketing" | "HR" | "Finance",
  budget: decimal in 100000..1000000
}

schema Employee {
  name: faker("person.fullName"),
  email: faker("internet.email"),
  department: any of departments,
  salary: decimal in 40000..150000,
  startDate: date in 2020-01-01..2024-01-01,
  level: "junior" | "mid" | "senior" | "lead"
}

schema PayrollRecord {
  employee: any of employees,
  period: date in 2024-01-01..2024-12-31,
  grossPay: decimal in 3000..12000,
  taxRate: decimal in 0.15..0.35
}

dataset HRData {
  departments: 5 of Department,
  employees: 200 of Employee,
  payroll: 2400 of PayrollRecord
}`,
  },
  {
    id: "social",
    name: "Social Media",
    description: "Users, posts, and interactions",
    code: `schema User {
  username: faker("internet.username"),
  displayName: faker("person.fullName"),
  verified: 0.1: true | 0.9: false,
  followers: int in 0..10000,
  joinedAt: date in 2020-01-01..2024-06-01
}

schema Post {
  author: any of users,
  content: string,
  likes: int in 0..1000,
  shares: int in 0..100,
  createdAt: date in 2024-01-01..2024-12-31
}

schema Comment {
  post: any of posts,
  author: any of users,
  likes: int in 0..50
}

schema Follow {
  follower: any of users,
  following: any of users,
  assume follower != following
}

dataset SocialNetwork {
  users: 1000 of User,
  posts: 5000 of Post,
  comments: 15000 of Comment,
  follows: 10000 of Follow
}`,
  },
  {
    id: "iot",
    name: "IoT Sensors",
    description: "Devices, readings, and alerts",
    code: `schema Device {
  serialNumber: issuer("DEV-####"),
  type: "temperature" | "humidity" | "pressure" | "motion",
  location: "warehouse" | "office" | "outdoor" | "server-room",
  status: 0.95: "online" | 0.05: "offline"
}

schema Reading {
  device: any of devices,
  timestamp: date in 2024-01-01..2024-12-31,
  value: decimal in -20..100,
  unit: "celsius" | "percent" | "hPa" | "boolean"
}

schema Alert {
  device: any of devices,
  severity: 0.6: "info" | 0.3: "warning" | 0.1: "critical",
  acknowledged: 0.7: true | 0.3: false,
  timestamp: date in 2024-01-01..2024-12-31
}

dataset IoTData {
  devices: 50 of Device,
  readings: 10000 of Reading,
  alerts: 200 of Alert
}`,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simplest possible example",
    code: `schema Item {
  name: string,
  value: int in 1..100
}

dataset Data {
  items: 10 of Item
}`,
  },
];
