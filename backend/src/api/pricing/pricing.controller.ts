import { Request, Response } from 'express';
import { PricingService } from './pricing.service';

const pricingService = new PricingService();

export async function calculatePrices(req: Request, res: Response) {
  try {
    const { hotelId, dateRange } = req.body;
    const suggestions = await pricingService.calculateOptimalPrices(hotelId, dateRange);
    res.status(200).json(suggestions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
