
export interface BookingParams {
  parkingLotId: string;
  parkingLotName: string;
  spotId: string;
  spotLabel: string;
  duration: number;
  price: number;
  userId: string;
  startTime?: string; // Optional, defaults to current time if not provided
  endTime?: string;   // Optional, calculated from duration if not provided
}

export interface BookingResult {
  success: boolean;
  bookingId?: string;
  bookingCode?: string;
  startTime?: string;
  endTime?: string;
  error?: Error;
}

export interface CancellationResult {
  success: boolean;
  error?: Error;
  refunded?: number;
}

// All possible booking statuses
export type BookingStatus = 'upcoming' | 'active' | 'reserved' | 'completed' | 'cancelled' | 'all';

export interface Booking {
  id: string;
  parkingName: string;
  spotLabel: string;
  address: string;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
  status: BookingStatus;
  isActive: boolean;
  bookingCode: string;
  parkingSlotId: string;
  parkingLocationId: string;
}
