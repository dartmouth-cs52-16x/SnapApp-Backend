import { Router } from 'express';
import * as Posts from './controllers/user_controller.js';


const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

// /your routes will go here

export default router;
