export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  hotel_id: string;
}

export interface Hotel {
  id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
}

export interface Room {
  id: string;
  hotel_id: string;
  room_number: string;
  room_type: string;
  capacity_adults: number;
  capacity_children: number;
  base_price: number;
  current_price: number;
}

export interface Booking {
  id: string;
  hotel_id: string;
  room_id: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: string;
}
