import { Router } from 'express';
import { getProfile } from './GetProfile.controller';
import { checkSession } from '../session/CheckSession.controller';

const router = Router();

router.get('/:username', checkSession(true), getProfile);

export default router;
