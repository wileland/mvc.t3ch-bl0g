import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import exphbs from 'express-handlebars';
import path from 'path';
import connectSessionSequelize from 'connect-session-sequelize';
import sequelize from './config/sequelize.js';
import homeRoutes from './controllers/homeRoutes.js';
import dashboardRoutes from './controllers/dashboardRoutes.js';
import userRoutes from './controllers/api/userRoutes.js';
import postRoutes from './controllers/api/postRoutes.js';
import commentRoutes from './controllers/api/commentRoutes.js';
import helpers from './utils/helpers';

const SequelizeStore = connectSessionSequelize(session.Store);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1800000,
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({ db: sequelize }),
};

app.use(session(sess));

const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(path.resolve(), 'public')));

app.use('/', homeRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.use((req, res) => {
  res.status(404).send('404: Page not found');
});

app.use((err, req, res) => {
  console.error('Error:', err);
  const statusCode = err.status || 500;
  let errorResponse = { status: 'error', message: 'An unexpected error occurred' };
  if (process.env.NODE_ENV === 'development') {
    errorResponse = { ...errorResponse, message: err.message, stack: err.stack };
  }
  res.status(statusCode).json(errorResponse);
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
