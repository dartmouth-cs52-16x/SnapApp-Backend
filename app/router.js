import { Router } from 'express';
import * as UserController from './controllers/user_controller';
import * as Snaps from './controllers/snap_controller.js';
import { requireAuth, requireSignin } from './services/passport.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our snap api!' });
});

router.route('/snaps/:id')
    .get(Snaps.getSnap)
    .delete(Snaps.deleteSnap);

router.route('/snaps')
  .post(Snaps.createSnap)
  .get(requireAuth, Snaps.getSnaps);

router.post('/signin', requireSignin, UserController.signin);
router.post('/signup', UserController.signup);

export default router;
