import { Request, Response } from 'express';
import * as dashboardService from './dashboard.service';

export async function getKpis(req: Request, res: Response) {
  try {
    const kpis = await dashboardService.getKpis(req.query.hotelId as string);
    res.status(200).json(kpis);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getOccupancyMap(req: Request, res: Response) {
  try {
    const occupancyMap = await dashboardService.getOccupancyMap(req.query.hotelId as string);
    res.status(200).json(occupancyMap);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getUpcomingActivity(req: Request, res: Response) {
  try {
    const upcomingActivity = await dashboardService.getUpcomingActivity(req.query.hotelId as string);
    res.status(200).json(upcomingActivity);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getOccupancyForecast(req: Request, res: Response) {
  try {
    const forecast = await dashboardService.getOccupancyForecast(req.query.hotelId as string, Number(req.query.days));
    res.status(200).json(forecast);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
