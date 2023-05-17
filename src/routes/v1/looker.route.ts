import { Request, Response, Router } from 'express';
import { getDashboardURLController } from '../../controllers/looker.controller';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const url = await getDashboardURLController(req as unknown as Request, res);
    res.status(200).json({url});
  } catch (error) {
    console.error('An error ocurred:', error);
    res.status(400).json({error, message: 'An error ocurred'});
  }
});

export default router;
