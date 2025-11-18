import { Request, Response } from 'express';
import * as roomService from './room.service';

export async function getRooms(req: Request, res: Response) {
  try {
    const rooms = await roomService.getRooms(req.query);
    res.status(200).json(rooms);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getRoomById(req: Request, res: Response) {
  try {
    const room = await roomService.getRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function createRoom(req: Request, res: Response) {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function updateRoom(req: Request, res: Response) {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body);
    res.status(200).json(room);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function deleteRoom(req: Request, res: Response) {
  try {
    await roomService.deleteRoom(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
