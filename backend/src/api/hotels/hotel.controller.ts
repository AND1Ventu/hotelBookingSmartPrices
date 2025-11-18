import { Request, Response } from 'express';
import * as hotelService from './hotel.service';

export async function getHotels(req: Request, res: Response) {
  try {
    const hotels = await hotelService.getHotels();
    res.status(200).json(hotels);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getHotelById(req: Request, res: Response) {
  try {
    const hotel = await hotelService.getHotelById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.status(200).json(hotel);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function createHotel(req: Request, res: Response) {
  try {
    const hotel = await hotelService.createHotel(req.body);
    res.status(201).json(hotel);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function updateHotel(req: Request, res: Response) {
  try {
    const hotel = await hotelService.updateHotel(req.params.id, req.body);
    res.status(200).json(hotel);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function deleteHotel(req: Request, res: Response) {
  try {
    await hotelService.deleteHotel(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
