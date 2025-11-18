import { Router } from 'express';
import * as roomController from './room.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

router.get('/', authenticate, roomController.getRooms);
router.get('/:id', authenticate, roomController.getRoomById);
router.post('/', authenticate, authorize(['manager']), roomController.createRoom);
router.put('/:id', authenticate, authorize(['manager']), roomController.updateRoom);
router.delete('/:id', authenticate, authorize(['manager']), roomController.deleteRoom);

export default router;
