import { MongoClient } from 'mongodb';

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

    MongoClient.connect(url, { useUnifiedTopology: true })
      .then((client) => {
        this.client = client;
        this.db = client.db(DB_DATABASE);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  isAlive() {
    return this.db !== null && this.client !== null;
  }

  async nbUsers() {
    if (!this.usersCollection) {
      console.log('Users collection not initialized');
      return 0;
    }
    const numberOfUsers = await this.usersCollection.countDocuments();
    return numberOfUsers;
  }

  async nbFiles() {
    if (!this.filesCollection) {
      console.log('Files collection not initialized');
      return 0;
    }
    const numberOfFiles = await this.filesCollection.countDocuments();
    return numberOfFiles;
  }
}

const dbClient = new DBClient();

export default dbClient;
