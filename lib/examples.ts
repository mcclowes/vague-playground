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
    description: "Simple invoicing with weighted probabilities and constraints",
    code: `schema Company {
  name: companyName(),
  industry: "tech" | "retail" | "finance",
  currency: "USD" | "GBP" | "EUR"
}

schema LineItem {
  description: faker.commerce.productName(),
  quantity: int in 1..10,
  unit_price: decimal in 10..500
}

schema Invoice {
  company: any of companies,
  status: 0.6: "paid" | 0.3: "pending" | 0.1: "draft",
  issue_date: date in 2024-01-01..2024-12-31,
  line_items: 1..5 of LineItem,
  item_count: count(line_items),
  subtotal: sum(line_items.unit_price),
  assume subtotal > 0
}

dataset TestData {
  companies: 10 of Company,
  invoices: 50 of Invoice
}`,
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Products, customers, orders with computed totals",
    code: `schema Product {
  id: uuid(),
  name: faker.commerce.productName(),
  price: decimal in 9.99..999.99,
  category: "Electronics" | "Clothing" | "Home" | "Books",
  inStock: 0.9: true | 0.1: false,
  sku: faker.string.alphanumeric(8)
}

schema Customer {
  id: uuid(),
  email: email(),
  name: fullName(),
  tier: 0.6: "standard" | 0.3: "premium" | 0.1: "vip",
  orders_count: int in 0..0
}

schema OrderItem {
  product: any of products where .inStock == true,
  quantity: int in 1..5,
  unit_price: decimal in 9.99..999.99
}

schema Order {
  id: uuid(),
  customer: any of customers,
  items: 1..5 of OrderItem,
  status: 0.1: "pending" | 0.3: "shipped" | 0.5: "delivered" | 0.1: "cancelled",
  item_count: count(items),
  total: sum(items.unit_price) * sum(items.quantity),
  created_at: faker.date.recent()
} then {
  customer.orders_count += 1
}

dataset Store {
  products: 50 of Product,
  customers: 100 of Customer,
  orders: 200 of Order
}`,
  },
  {
    id: "saas",
    name: "SaaS Platform",
    description: "Subscriptions with billing cycles and usage tracking",
    code: `schema Plan {
  id: uuid(),
  name: "Starter" | "Pro" | "Enterprise",
  price_monthly: 0 | 29 | 99 | 299,
  max_users: 1 | 5 | 25 | 999
}

schema Organization {
  id: uuid(),
  name: companyName(),
  plan: any of plans,
  created_at: faker.date.past()
}

schema User {
  id: uuid(),
  email: email(),
  name: fullName(),
  organization: any of organizations,
  role: 0.1: "admin" | 0.3: "manager" | 0.6: "member",
  last_login: faker.date.recent()?,
  active: 0.9: true | 0.1: false
}

schema Subscription {
  id: uuid(),
  organization: any of organizations,
  plan: any of plans,
  status: 0.8: "active" | 0.1: "past_due" | 0.05: "cancelled" | 0.05: "trialing",
  current_period_start: date in 2024-01-01..2024-06-01,
  current_period_end: date in 2024-07-01..2024-12-31,
  assume current_period_end > current_period_start
}

schema UsageRecord {
  organization: any of organizations,
  metric: "api_calls" | "storage_gb" | "users",
  value: int in 0..10000,
  recorded_at: faker.date.recent()
}

dataset SaaSData {
  plans: 4 of Plan,
  organizations: 50 of Organization,
  users: 200 of User,
  subscriptions: 50 of Subscription,
  usage: 500 of UsageRecord
}`,
  },
  {
    id: "banking",
    name: "Banking",
    description: "Accounts and transactions with balance constraints",
    code: `schema Customer {
  id: uuid(),
  name: fullName(),
  email: email(),
  phone: phone()?,
  address: streetAddress(),
  city: city(),
  country: 0.7: "US" | 0.15: "UK" | 0.1: "CA" | 0.05: "AU",
  created_at: faker.date.past()
}

schema Account {
  id: uuid(),
  customer: any of customers,
  type: 0.6: "checking" | 0.3: "savings" | 0.1: "money_market",
  balance: decimal in 0..100000,
  currency: "USD",
  status: 0.95: "active" | 0.03: "frozen" | 0.02: "closed",
  opened_at: faker.date.past()
}

schema Transaction {
  id: uuid(),
  from_account: any of accounts where .status == "active",
  to_account: any of accounts where .status == "active",
  amount: decimal in 1..5000,
  type: 0.5: "transfer" | 0.3: "payment" | 0.2: "withdrawal",
  status: 0.9: "completed" | 0.05: "pending" | 0.05: "failed",
  created_at: faker.date.recent(),
  assume from_account != to_account,
  assume amount <= from_account.balance
}

dataset BankingData {
  customers: 100 of Customer,
  accounts: 150 of Account,
  transactions: 500 of Transaction
}`,
  },
  {
    id: "social",
    name: "Social Media",
    description: "Users, posts, and engagement metrics",
    code: `schema User {
  id: uuid(),
  username: faker.internet.userName(),
  displayName: fullName(),
  bio: sentence()?,
  avatar: faker.image.avatar(),
  verified: 0.1: true | 0.9: false,
  followers_count: int in 0..10000,
  following_count: int in 0..1000,
  joined_at: faker.date.past()
}

schema Post {
  id: uuid(),
  author: any of users,
  content: faker.lorem.paragraph(),
  media_url: faker.image.url()?,
  likes_count: int in 0..1000,
  shares_count: int in 0..100,
  comments_count: int in 0..0,
  created_at: faker.date.recent()
}

schema Comment {
  id: uuid(),
  post: any of posts,
  author: any of users,
  content: sentence(),
  likes_count: int in 0..50,
  created_at: faker.date.recent()
} then {
  post.comments_count += 1
}

schema Follow {
  follower: any of users,
  following: any of users,
  created_at: faker.date.recent(),
  assume follower != following
} then {
  follower.following_count += 1,
  following.followers_count += 1
}

dataset SocialNetwork {
  users: 100 of User,
  posts: 500 of Post,
  comments: 1500 of Comment,
  follows: 1000 of Follow
}`,
  },
  {
    id: "iot",
    name: "IoT Sensors",
    description: "Devices with time-series readings and alerts",
    code: `schema Location {
  id: uuid(),
  name: "Warehouse A" | "Warehouse B" | "Office" | "Server Room",
  coordinates: string
}

schema Device {
  id: uuid(),
  serial: issuer("DEV-######"),
  type: "temperature" | "humidity" | "pressure" | "motion",
  location: any of locations,
  firmware_version: faker.system.semver(),
  status: 0.9: "online" | 0.08: "offline" | 0.02: "maintenance",
  last_seen: faker.date.recent()
}

schema Reading {
  device: any of devices where .status == "online",
  timestamp: faker.date.recent(),
  value: decimal in -20..100,
  unit: "celsius" | "percent" | "hPa" | "boolean"
}

schema Alert {
  id: uuid(),
  device: any of devices,
  severity: 0.5: "info" | 0.35: "warning" | 0.15: "critical",
  message: sentence(),
  acknowledged: 0.7: true | 0.3: false,
  acknowledged_by: fullName()?,
  created_at: faker.date.recent()
}

dataset IoTData {
  locations: 4 of Location,
  devices: 50 of Device,
  readings: 5000 of Reading,
  alerts: 100 of Alert,

  validate {
    some(devices, .status == "online"),
    some(alerts, .severity == "critical"),
    all(alerts, .acknowledged or .acknowledged_by == null)
  }
}`,
  },
  {
    id: "api-testing",
    name: "API Testing",
    description: "REST API request/response fixtures",
    code: `schema User {
  id: uuid(),
  email: email(),
  name: fullName(),
  role: "admin" | "user" | "guest",
  api_key: faker.string.alphanumeric(32),
  rate_limit: 100 | 1000 | 10000,
  created_at: faker.date.past()
}

schema APIRequest {
  id: uuid(),
  user: any of users,
  method: 0.6: "GET" | 0.2: "POST" | 0.1: "PUT" | 0.1: "DELETE",
  path: "/users" | "/orders" | "/products" | "/auth",
  status_code: 0.8: 200 | 0.05: 201 | 0.05: 400 | 0.05: 401 | 0.05: 500,
  response_time_ms: int in 10..2000,
  timestamp: faker.date.recent()
}

schema RateLimitEvent {
  user: any of users,
  requests_made: int in 1..15000,
  limit_exceeded: 0.1: true | 0.9: false,
  timestamp: faker.date.recent(),
  assume if limit_exceeded { requests_made > user.rate_limit }
}

dataset APITestData {
  users: 20 of User,
  requests: 1000 of APIRequest,
  rate_limits: 100 of RateLimitEvent
}`,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simplest possible example",
    code: `schema Item {
  name: string,
  value: int in 1..100,
  active: true | false
}

dataset Data {
  items: 10 of Item
}`,
  },
];
