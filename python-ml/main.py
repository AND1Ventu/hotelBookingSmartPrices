from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import pandas as pd
from datetime import datetime
import joblib

app = FastAPI()

# Load the trained model
model = joblib.load('pricing_model.joblib')

class PriceRequest(BaseModel):
    hotel_id: str
    room_type: str
    check_in: str
    check_out: str
    current_occupancy: float
    historical_data: dict
    competitor_prices: list
    events: list
    weather: dict

class PriceResponse(BaseModel):
    suggested_price: float
    confidence_score: float
    factors: dict
    expected_impact: dict

@app.post("/api/ml/calculate-price", response_model=PriceResponse)
async def calculate_optimal_price(request: PriceRequest):
    """
    Calculate optimal price using the ML model, considering various factors.
    """
    features_df, factors = extract_features(request)

    # Predict optimal price
    base_prediction = model.predict(features_df)[0]

    # Apply business rules
    final_price = apply_pricing_rules(
        base_prediction,
        request.current_occupancy,
        request.competitor_prices,
        request.events
    )

    # Calculate confidence and impact
    confidence = calculate_confidence(factors)
    impact = estimate_revenue_impact(final_price, request)

    return PriceResponse(
        suggested_price=round(final_price, 2),
        confidence_score=confidence,
        factors=factors,
        expected_impact=impact
    )

def extract_features(request: PriceRequest):
    """Extract and engineer features for the pricing model."""
    check_in = pd.to_datetime(request.check_in)

    factors = {
        'day_of_week': check_in.dayofweek,
        'is_weekend': 1 if check_in.dayofweek >= 5 else 0,
        'month': check_in.month,
        'lead_time': (check_in - datetime.now()).days,
        'occupancy_rate_at_booking': request.current_occupancy,
    }

    # One-hot encode categorical features to match training columns
    features = {
        'lead_time': factors['lead_time'],
        'occupancy_rate_at_booking': factors['occupancy_rate_at_booking'],
        'day_of_week': factors['day_of_week'],
        'is_weekend': factors['is_weekend'],
        'month': factors['month'],
        'room_type_Suite': 1 if request.room_type == 'Suite' else 0,
        'room_type_Standard': 1 if request.room_type == 'Standard' else 0,
        'booking_source_booking.com': 0, # Assuming direct for now
        'booking_source_direct': 1,
        'booking_source_expedia': 0,
    }

    return pd.DataFrame([features]), factors

def apply_pricing_rules(base_price: float, occupancy: float, competitor_prices: list, events: list):
    """Apply business rules on top of the ML prediction."""
    price = base_price

    if occupancy > 0.85:
        price *= 1.25
    elif occupancy < 0.50:
        price *= 0.90

    if competitor_prices:
        avg_competitor = np.mean(competitor_prices)
        if price < avg_competitor * 0.85:
            price = avg_competitor * 0.9
        elif price > avg_competitor * 1.25:
            price = avg_competitor * 1.15

    for event in events:
        if event.get('impact') == 'high':
            price *= 1.4
        elif event.get('impact') == 'medium':
            price *= 1.2

    return max(price, 50) # Ensure a minimum price

def calculate_confidence(factors: dict) -> float:
    """Calculate a confidence score based on the input factors."""
    # Simple rule-based confidence for now
    confidence = 0.8
    if factors['lead_time'] < 3:
        confidence -= 0.1
    if factors['occupancy_rate_at_booking'] < 0.6:
        confidence -= 0.1
    return round(confidence, 2)

def estimate_revenue_impact(suggested_price: float, request: PriceRequest):
    """Estimate the revenue impact of the price change."""
    current_price = request.historical_data.get('current_price', suggested_price)
    if current_price == 0:
        return {'revenue_change': 0, 'estimated_bookings': 0, 'price_change_pct': 0}

    price_elasticity = -1.5
    price_change_pct = (suggested_price - current_price) / current_price
    demand_change_pct = price_elasticity * price_change_pct

    current_bookings = request.historical_data.get('avg_bookings', 1)
    estimated_bookings = current_bookings * (1 + demand_change_pct)

    revenue_impact = (suggested_price * estimated_bookings) - (current_price * current_bookings)

    return {
        'revenue_change': round(revenue_impact, 2),
        'estimated_bookings': round(estimated_bookings, 1),
        'price_change_pct': round(price_change_pct * 100, 1)
    }

@app.get("/")
def read_root():
    return {"message": "AI Pricing Optimizer Microservice is running."}
