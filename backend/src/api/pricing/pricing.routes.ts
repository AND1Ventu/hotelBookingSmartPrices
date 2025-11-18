import { Router } from 'express';
import * as pricingController from './pricing.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

router.post('/calculate', authenticate, authorize(['manager']), pricingController.calculatePrices);

export default router;
