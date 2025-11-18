import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error
import joblib
import os

def train_model(data_path='historical_bookings.csv', model_path='pricing_model.joblib'):
    """Trains the price prediction model and saves it."""

    if not os.path.exists(data_path):
        print(f"Data file not found at {data_path}. Please generate it first.")
        return

    print("Training pricing model...")
    df = pd.read_csv(data_path)

    # Feature Engineering
    df['check_in'] = pd.to_datetime(df['check_in'])
    df['day_of_week'] = df['check_in'].dt.dayofweek
    df['is_weekend'] = (df['check_in'].dt.dayofweek >= 5).astype(int)
    df['month'] = df['check_in'].dt.month

    # One-hot encode categorical features
    df = pd.get_dummies(df, columns=['room_type', 'booking_source'], drop_first=True)

    # Define features and target
    features = [
        'lead_time', 'occupancy_rate_at_booking', 'day_of_week', 'is_weekend', 'month',
        'room_type_Suite', 'room_type_Standard', 'booking_source_booking.com',
        'booking_source_direct', 'booking_source_expedia'
    ]
    target = 'final_price'

    # Ensure all feature columns exist, fill missing with 0
    for col in features:
        if col not in df.columns:
            df[col] = 0

    X = df[features]
    y = df[target]

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Initialize and train model
    model = GradientBoostingRegressor(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5,
        random_state=42,
        loss='squared_error'
    )
    model.fit(X_train, y_train)

    # Evaluate model
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    print(f"Model trained. RMSE: {rmse:.2f}")

    # Save model
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == '__main__':
    train_model()
