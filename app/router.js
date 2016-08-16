import { Router } from 'express';
import * as Snaps from './controllers/snap_controller.js';


const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our snap api!' });
});

router.route('/snaps/:id')
    .get(Snaps.getSnap)
    .delete(Snaps.deleteSnap);

router.route('/snaps')
  .post(Snaps.createSnap)
  .get(Snaps.getSnaps);

export default router;
