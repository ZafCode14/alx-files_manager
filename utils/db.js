import { MongoClient } from 'mongodb';
import sha1 from 'sha1';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
  constructor() {
    this.client = null;
    this.db = null;
    this.usersCollection = null;
    this.filesCollection = null;

    this.connect();
  }

  async connect() {
    try {
      this.client = await MongoClient.connect(url, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });

      this.db = this.client.db(DB_DATABASE);
      this.usersCollection = this.db.collection('users');
      this.filesCollection = this.db.collection('files');

      console.log('MongoDB connected successfully');
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
      // Implement retry logic or handle error appropriately
    }
  }

  async waitUntilConnect() {
    while (!this.client || !this.db || !this.usersCollection || !this.filesCollection) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    console.log('MongoDB collections are initialized');
  }

  isAlive() {
    return this.db !== null && this.client !== null;
  }

  async nbUsers() {
    await this.waitUntilConnect();
    if (!this.usersCollection) {
      throw new Error('Users collection not initialized');
    }
    const numberOfUsers = await this.usersCollection.countDocuments();
    return numberOfUsers;
  }

  async nbFiles() {
    await this.waitUntilConnect();
    if (!this.filesCollection) {
      throw new Error('Files collection not initialized');
    }
    const numberOfFiles = await this.filesCollection.countDocuments();
    return numberOfFiles;
  }

  async createUser(email, password) {
    await this.waitUntilConnect();
    if (!this.usersCollection) {
      throw new Error('Users collection not initialized');
    }

    // Check if user with the same email already exists
    const existingUser = await this.usersCollection.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash the password using SHA1
    const hashedPassword = sha1(password);

    // Insert the new user into the collection
    const result = await this.usersCollection.insertOne({
      email,
      password: hashedPassword,
    });

    // Return the newly inserted user document
    return result.ops[0];
  }
}

const dbClient = new DBClient();

export default dbClient;
