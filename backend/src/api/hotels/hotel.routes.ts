import { Router } from 'express';
import * as hotelController from './hotel.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize(['owner']), hotelController.getHotels);
router.get('/:id', authenticate, hotelController.getHotelById);
router.post('/', authenticate, authorize(['owner']), hotelController.createHotel);
router.put('/:id', authenticate, authorize(['owner']), hotelController.updateHotel);
router.delete('/:id', authenticate, authorize(['owner']), hotelController.deleteHotel);

export default router;
