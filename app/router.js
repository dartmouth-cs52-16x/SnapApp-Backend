import { Router } from 'express';
import * as Snaps from './controllers/snap_controller.js';


const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our snap api!' });
});

router.route('/snaps')
  .get(Snaps.getSnaps)
  .post(Snaps.createSnap);

router.route('/snaps/:id')
    .get(Snaps.getSnap)
    .delete(Snaps.deleteSnap);

// /your routes will go here

export default router;
