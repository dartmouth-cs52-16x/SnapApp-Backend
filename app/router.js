import { Router } from 'express';
import * as UserController from './controllers/user_controller';
import * as Snaps from './controllers/snap_controller.js';
import { requireAuth, requireSignin } from './services/passport.js';
import passport from 'passport';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our snap api!' });
});

router.route('/snaps/:id')
  .get(requireAuth, Snaps.getSnap)
  .delete(requireAuth, Snaps.deleteSnap);

router.route('/profile')
  .put(requireAuth, UserController.updateUserProfile)
  .get(requireAuth, UserController.getUserObject);

router.route('/friends')
  .put(requireAuth, UserController.addFriend);

router.route('/user')
  .get(UserController.checkUserExists)
  .delete(requireAuth, UserController.deleteUser);

router.route('/snaps')
  .post(requireAuth, Snaps.createSnap)
  .get(requireAuth, Snaps.getSnaps);


router.post('/signin', requireSignin, UserController.signin);
router.post('/signup', UserController.signup);

router.get('/auth/facebook', passport.authenticate('facebook'), { scope: ['public_profile', 'user_friends'] });
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

export default router;
