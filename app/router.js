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

router.route('/profile')
  .put(requireAuth, UserController.updateUserProfile)
  .get(requireAuth, UserController.getUserObject);

<<<<<<< HEAD
=======
router.route('/friends')
  .put(requireAuth, UserController.addFriend);

router.route('/user')
  .get(UserController.checkUserExists)
  .delete(requireAuth, UserController.deleteUser);

>>>>>>> ce3b7064a037d92255e1a3d5eee4c0ccd5669978
router.route('/snaps')
  .post(Snaps.createSnap)
  .get(requireAuth, Snaps.getSnaps);


router.post('/signin', requireSignin, UserController.signin);
router.post('/signup', UserController.signup);

router.post('/auth/facebook', UserController.authenticateWithFacebook);

<<<<<<< HEAD
=======

>>>>>>> ce3b7064a037d92255e1a3d5eee4c0ccd5669978
export default router;
