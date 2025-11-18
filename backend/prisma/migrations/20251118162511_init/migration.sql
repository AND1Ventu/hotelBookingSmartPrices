-- CreateTable
CREATE TABLE "Hotel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "description" TEXT,
    "property_type" TEXT NOT NULL,
    "amenities" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "room_number" TEXT NOT NULL,
    "room_type" TEXT NOT NULL,
    "capacity_adults" INTEGER NOT NULL,
    "capacity_children" INTEGER NOT NULL,
    "bed_type" TEXT NOT NULL,
    "base_price" DECIMAL(10,2) NOT NULL,
    "current_price" DECIMAL(10,2) NOT NULL,
    "amenities" JSONB NOT NULL,
    "description" TEXT,
    "photos" JSONB NOT NULL,
    "floor" INTEGER,
    "view_type" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "booking_reference" TEXT NOT NULL,
    "guest_name" TEXT NOT NULL,
    "guest_email" TEXT NOT NULL,
    "guest_phone" TEXT NOT NULL,
    "check_in" TIMESTAMP(3) NOT NULL,
    "check_out" TIMESTAMP(3) NOT NULL,
    "nights" INTEGER NOT NULL,
    "adults" INTEGER NOT NULL,
    "children" INTEGER NOT NULL DEFAULT 0,
    "base_price" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "discount_applied" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "payment_status" TEXT NOT NULL,
    "payment_method" TEXT,
    "booking_source" TEXT NOT NULL,
    "special_requests" TEXT,
    "cancellation_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomAvailability" (
    "id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "block_reason" TEXT,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "RoomAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomPriceHistory" (
    "id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "base_price" DECIMAL(10,2) NOT NULL,
    "suggested_price" DECIMAL(10,2) NOT NULL,
    "actual_price" DECIMAL(10,2) NOT NULL,
    "occupancy_rate" DECIMAL(5,2) NOT NULL,
    "demand_score" DECIMAL(5,2) NOT NULL,
    "was_booked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomPriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingRule" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "min_price" DECIMAL(10,2) NOT NULL,
    "max_price" DECIMAL(10,2) NOT NULL,
    "strategy" TEXT NOT NULL,
    "enable_dynamic_pricing" BOOLEAN NOT NULL DEFAULT true,
    "weekend_multiplier" DECIMAL(3,2) NOT NULL DEFAULT 1.2,
    "last_minute_discount" DECIMAL(3,2) NOT NULL DEFAULT 0.9,
    "early_bird_discount" DECIMAL(3,2) NOT NULL DEFAULT 0.85,
    "length_of_stay_discount" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardMetrics" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "total_revenue" DECIMAL(10,2) NOT NULL,
    "occupancy_rate" DECIMAL(5,2) NOT NULL,
    "adr" DECIMAL(10,2) NOT NULL,
    "revpar" DECIMAL(10,2) NOT NULL,
    "total_bookings" INTEGER NOT NULL,
    "cancelled_bookings" INTEGER NOT NULL,
    "no_shows" INTEGER NOT NULL,
    "average_lead_time" INTEGER NOT NULL,
    "average_length_stay" DECIMAL(3,1) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DashboardMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitorPrice" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "CompetitorPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "price_multiplier" DECIMAL(3,2) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_email_key" ON "Hotel"("email");

-- CreateIndex
CREATE INDEX "Hotel_email_idx" ON "Hotel"("email");

-- CreateIndex
CREATE INDEX "Room_hotel_id_idx" ON "Room"("hotel_id");

-- CreateIndex
CREATE INDEX "Room_room_type_idx" ON "Room"("room_type");

-- CreateIndex
CREATE INDEX "Room_is_active_idx" ON "Room"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "Room_hotel_id_room_number_key" ON "Room"("hotel_id", "room_number");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_booking_reference_key" ON "Booking"("booking_reference");

-- CreateIndex
CREATE INDEX "Booking_hotel_id_idx" ON "Booking"("hotel_id");

-- CreateIndex
CREATE INDEX "Booking_room_id_idx" ON "Booking"("room_id");

-- CreateIndex
CREATE INDEX "Booking_check_in_idx" ON "Booking"("check_in");

-- CreateIndex
CREATE INDEX "Booking_check_out_idx" ON "Booking"("check_out");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_booking_source_idx" ON "Booking"("booking_source");

-- CreateIndex
CREATE INDEX "Booking_created_at_idx" ON "Booking"("created_at");

-- CreateIndex
CREATE INDEX "RoomAvailability_date_idx" ON "RoomAvailability"("date");

-- CreateIndex
CREATE INDEX "RoomAvailability_is_available_idx" ON "RoomAvailability"("is_available");

-- CreateIndex
CREATE UNIQUE INDEX "RoomAvailability_room_id_date_key" ON "RoomAvailability"("room_id", "date");

-- CreateIndex
CREATE INDEX "RoomPriceHistory_room_id_date_idx" ON "RoomPriceHistory"("room_id", "date");

-- CreateIndex
CREATE INDEX "RoomPriceHistory_date_idx" ON "RoomPriceHistory"("date");

-- CreateIndex
CREATE INDEX "PricingRule_hotel_id_idx" ON "PricingRule"("hotel_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_hotel_id_idx" ON "User"("hotel_id");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "DashboardMetrics_hotel_id_idx" ON "DashboardMetrics"("hotel_id");

-- CreateIndex
CREATE INDEX "DashboardMetrics_date_idx" ON "DashboardMetrics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardMetrics_hotel_id_date_key" ON "DashboardMetrics"("hotel_id", "date");

-- CreateIndex
CREATE INDEX "CompetitorPrice_hotel_id_date_idx" ON "CompetitorPrice"("hotel_id", "date");

-- CreateIndex
CREATE INDEX "Event_hotel_id_start_date_end_date_idx" ON "Event"("hotel_id", "start_date", "end_date");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomAvailability" ADD CONSTRAINT "RoomAvailability_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomPriceHistory" ADD CONSTRAINT "RoomPriceHistory_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingRule" ADD CONSTRAINT "PricingRule_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
