import { Router } from 'express';
import * as Snaps from './controllers/snap_controller.js';
import { requireAuth, requireSignin } from './services/passport';
import * as UserController from './controllers/user_controller';


const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our snap api!' });
});

router.post('/signin', UserController.signin);
router.post('/signup', UserController.signup);


router.route('/snaps/:id')
    .get(requireAuth, Snaps.getSnap)
    .delete(Snaps.deleteSnap);

router.route('/snaps')
  .post(requireAuth, Snaps.createSnap)
  .get(requireAuth, Snaps.getSnaps);

export default router;
