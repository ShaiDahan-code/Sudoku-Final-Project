import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import {json} from "express";
import {Db, MongoClient} from "mongodb";


let db: Db;

async function startDatabase() {
  const client = new MongoClient('mongodb+srv://vinox1924:ttE94R3hFW8LomGA@sudoku.dcwoe3h.mongodb.net/?retryWrites=true&w=majority');
  await client.connect();
  console.log('Connected to database');
  db = client.db('Sudoku');
}



// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  server.use(json());
  const distFolder = join(process.cwd(), 'dist/Sudoku-Final-Project/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

// Fetch all users
  server.get('/api/users', async (req, res) => {
    const Users = db.collection('Users');
    const userList = await Users.find().toArray();
    res.status(200).send(userList);
  });

  // Login user
  server.post('/api/login', async (req, res) => {
    const { loginEmail, loginPassword } = req.body;
    const Users = db.collection('Users');

    const user = await Users.findOne({ user_email: loginEmail.toLowerCase() });
    if (user) {
      if (user['user_password'] === loginPassword) {
        // If user exists and password is correct, send user details
        res.status(200).send(user);
      } else {
        // If password is incorrect, send an error message
        res.status(400).send({ message: 'Incorrect password.' });
      }
    } else {
      // If user does not exist, send an error message
      res.status(400).send({ message: 'User does not exist.' });
    }
  });

// Add new user
  server.post('/api/data', async (req, res) => {
    const data = req.body;
    const Users = db.collection('Users');

    // Check if user already exists in the database
    const existingUser = await Users.findOne({ user_email: data.registerEmail.toLowerCase() });

    if (existingUser) {
      // If user exists, send a response and do not insert the new user
      res.status(400).send({ message: 'User already exists!' });
    } else {
      // If user does not exist, insert the new user
      const newUser = {
        user_password: data.registerPassword,
        user_email: data.registerEmail.toLowerCase(),
        user_name: data.registerName
      };
      await Users.insertOne(newUser);

      // Fetch updated user list and send it as response
      const userList = await Users.find().toArray();
      res.status(200).send(userList);
    }
  });

  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  startDatabase().catch(console.error);

  // Start up the Node server
  const server = app();
  // Add your POST endpoint
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });

}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
