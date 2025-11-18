import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_synthetic_data(file_path='historical_bookings.csv', num_records=5000):
    """Generates a synthetic dataset of historical hotel bookings."""
    print("Generating synthetic booking data...")

    room_types = ['Standard', 'Deluxe', 'Suite']
    booking_sources = ['direct', 'booking.com', 'airbnb', 'expedia']

    data = []

    start_date = datetime(2023, 1, 1)

    for i in range(num_records):
        date = start_date + timedelta(days=np.random.randint(0, 730))
        check_in = date + timedelta(days=np.random.randint(1, 90))
        nights = np.random.randint(1, 10)
        check_out = check_in + timedelta(days=nights)

        day_of_week = check_in.weekday()
        is_weekend = 1 if day_of_week >= 5 else 0
        month = check_in.month

        # Seasonality
        if month in [6, 7, 8]:
            season_multiplier = 1.5
        elif month in [12, 1, 2]:
            season_multiplier = 1.2
        else:
            season_multiplier = 1.0

        room_type = np.random.choice(room_types)
        base_price = {'Standard': 100, 'Deluxe': 150, 'Suite': 250}[room_type]

        lead_time = (check_in - date).days
        occupancy_rate = np.random.uniform(0.5, 0.95)

        # Price calculation logic
        price = base_price * season_multiplier
        price *= (1 + 0.2 * is_weekend)
        price *= (1 + (0.9 - occupancy_rate))
        price *= (1 - 0.005 * lead_time) # Early bird discount
        price += np.random.normal(0, 10) # Random noise

        data.append({
            'date_booked': date,
            'check_in': check_in,
            'check_out': check_out,
            'nights': nights,
            'room_type': room_type,
            'booking_source': np.random.choice(booking_sources),
            'lead_time': lead_time,
            'occupancy_rate_at_booking': occupancy_rate,
            'day_of_week': day_of_week,
            'is_weekend': is_weekend,
            'month': month,
            'final_price': price
        })

    df = pd.DataFrame(data)
    df.to_csv(file_path, index=False)
    print(f"Synthetic data generated and saved to {file_path}")
    return df

if __name__ == '__main__':
    generate_synthetic_data()
