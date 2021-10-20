import { Router } from 'express';
import { getProfile } from './GetProfile.controller';
import { followUser } from './FollowUser.controller';
import { unFollowUser } from './UnFollowUser.controller';
import { checkSession } from '../session/CheckSession.controller';

const router = Router();

router.get('/:username', checkSession(true), getProfile);
router.post('/:username/follow', checkSession(), followUser);
router.delete('/:username/follow', checkSession(), unFollowUser);

export default router;
