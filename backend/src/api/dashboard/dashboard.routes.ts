import { Router } from 'express';
import * as dashboardController from './dashboard.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/kpis', authenticate, dashboardController.getKpis);
router.get('/occupancy-map', authenticate, dashboardController.getOccupancyMap);
router.get('/upcoming-activity', authenticate, dashboardController.getUpcomingActivity);
router.get('/occupancy-forecast', authenticate, dashboardController.getOccupancyForecast);

export default router;
