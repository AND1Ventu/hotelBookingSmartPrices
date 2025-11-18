import axios from 'axios';
import { Room } from '@prisma/client';
import prisma from '../../config/prisma';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect();

export class PricingService {
  async calculateOptimalPrices(hotelId: string, dateRange: { start: Date; end: Date }) {
    const rooms = await prisma.room.findMany({
      where: { hotel_id: hotelId, is_active: true },
    });

    const suggestions = [];

    for (const room of rooms) {
      for (let date = new Date(dateRange.start); date <= new Date(dateRange.end); date.setDate(date.getDate() + 1)) {
        const suggestion = await this.calculateRoomPrice(room, new Date(date));

        if (suggestion.confidence_score > 0.7 && Math.abs(suggestion.price_change_pct) > 5) {
          suggestions.push({
            room_id: room.id,
            date: new Date(date),
            current_price: room.current_price,
            suggested_price: suggestion.suggested_price,
            confidence: suggestion.confidence_score,
            factors: suggestion.factors,
            impact: suggestion.expected_impact,
          });
        }
      }
    }

    return suggestions;
  }

  async calculateRoomPrice(room: Room, checkIn: Date) {
    const cacheKey = `price:${room.id}:${checkIn.toISOString().split('T')[0]}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [occupancy, historicalData, competitors, events, weather] = await Promise.all([
      this.getCurrentOccupancy(room.hotel_id, checkIn),
      this.getHistoricalData(room.id),
      this.getCompetitorPrices(room.hotel_id, checkIn),
      this.getLocalEvents(room.hotel_id, checkIn),
      this.getWeatherForecast(room.hotel_id, checkIn),
    ]);

    const mlResponse = await axios.post(`${process.env.ML_API_URL}/calculate-price`, {
      hotel_id: room.hotel_id,
      room_type: room.room_type,
      check_in: checkIn.toISOString(),
      check_out: new Date(checkIn.getTime() + 86400000).toISOString(),
      current_occupancy: occupancy,
      historical_data: historicalData,
      competitor_prices: competitors,
      events: events,
      weather: weather,
    });

    const pricingRules = await prisma.pricingRule.findFirst({
      where: { hotel_id: room.hotel_id, is_active: true },
    });

    let finalPrice = mlResponse.data.suggested_price;

    if (pricingRules) {
      finalPrice = Math.max(Number(pricingRules.min_price), Math.min(Number(pricingRules.max_price), finalPrice));
    }

    const result = {
      ...mlResponse.data,
      suggested_price: finalPrice,
      price_change_pct: ((finalPrice - Number(room.current_price)) / Number(room.current_price)) * 100,
    };

    await redisClient.setEx(cacheKey, 900, JSON.stringify(result));

    return result;
  }

  async getCurrentOccupancy(hotelId: string, date: Date): Promise<number> {
    const total = await prisma.room.count({
      where: { hotel_id: hotelId, is_active: true },
    });

    if (total === 0) return 0;

    const booked = await prisma.booking.count({
      where: {
        hotel_id: hotelId,
        check_in: { lte: date },
        check_out: { gt: date },
        status: { in: ['confirmed', 'checked_in'] },
      },
    });

    return booked / total;
  }

  async getHistoricalData(roomId: string) {
    // This should be more sophisticated in a real application
    return {
      current_price: 150,
      avg_bookings: 10,
      avg_occupancy: 0.75,
      cancellation_rate: 0.05,
    };
  }

  async getCompetitorPrices(hotelId: string, date: Date): Promise<number[]> {
    const prices = await prisma.competitorPrice.findMany({
      where: { hotel_id: hotelId, date: date },
    });
    return prices.map(p => Number(p.price));
  }

  async getLocalEvents(hotelId: string, date: Date) {
    const events = await prisma.event.findMany({
      where: {
        hotel_id: hotelId,
        start_date: { lte: date },
        end_date: { gte: date },
      },
    });
    return events.map(e => ({ name: e.name, impact: Number(e.price_multiplier) > 1.3 ? 'high' : 'medium' }));
  }

  async getWeatherForecast(hotelId: string, date: Date) {
    // Mocked for now
    return { score: 0.5, condition: 'neutral' };
  }
}
