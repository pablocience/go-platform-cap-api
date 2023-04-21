import { Router } from 'express';

import looker from './looker.route';

const router = Router();


router.use('/looker', looker);

export default router;
