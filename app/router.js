import { Router } from 'express';
import * as UserController from './controllers/user_controller';
import * as Snaps from './controllers/snap_controller.js';
import { requireAuth, requireSignin } from './services/passport.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our snap api!' });
});

router.route('/snaps/:id')
  .get(requireAuth, Snaps.getSnap)
  .delete(requireAuth, Snaps.deleteSnap);

router.route('/profile')
  .get(requireAuth, UserController.getUserObject);

router.route('/user')
  .get(UserController.checkUserExists);


router.route('/snaps')
  .post(requireAuth, Snaps.createSnap)
  .get(requireAuth, Snaps.getSnaps);

router.post('/signin', requireSignin, UserController.signin);
router.post('/signup', UserController.signup);

export default router;
