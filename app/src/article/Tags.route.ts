import { Router } from 'express';
import { getTags } from './GetTags.controller';

const router = Router();

router.get('/', getTags);

export default router;
