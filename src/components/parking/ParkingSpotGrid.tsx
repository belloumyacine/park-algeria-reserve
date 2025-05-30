
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, CircleParking, CircleParkingOff, Clock } from 'lucide-react';

export type SpotStatus = 'available' | 'occupied' | 'selected' | 'reserved';

interface ParkingSpot {
  id: string;
  label: string;
  status: SpotStatus;
  reservation_info?: string;
}

interface ParkingSpotGridProps {
  spots: ParkingSpot[];
  onSpotSelect?: (spotId: string) => void;
  selectedSpotId?: string;
  className?: string;
}

const ParkingSpotGrid = ({
  spots,
  onSpotSelect,
  selectedSpotId,
  className
}: ParkingSpotGridProps) => {
  const getSpotStyles = (status: SpotStatus, isSelected: boolean): string => {
    const baseStyles = "flex flex-col items-center justify-center rounded-lg p-3 text-center transition-colors relative min-h-[70px]";

    if (isSelected) {
      return cn(baseStyles, "bg-primary text-white border-2 border-primary");
    }

    switch (status) {
      case 'available':
        return cn(baseStyles, "bg-white border border-primary/30 text-primary hover:bg-primary/10 cursor-pointer");
      case 'occupied':
        return cn(baseStyles, "bg-muted text-muted-foreground border border-muted-foreground/20 cursor-not-allowed");
      case 'reserved':
        return cn(baseStyles, "bg-amber-100 text-amber-700 border border-amber-300 cursor-not-allowed");
      default:
        return baseStyles;
    }
  };

  const getSpotStatusIcon = (status: SpotStatus, isSelected: boolean) => {
    if (isSelected) {
      return <CheckCircle size={16} className="absolute top-0 right-0 m-1 text-white" />;
    }

    switch (status) {
      case 'available':
        return <CircleParking size={16} className="absolute top-0 right-0 m-1 text-green-500" />;
      case 'occupied':
        return <CircleParkingOff size={16} className="absolute top-0 right-0 m-1 text-red-500" />;
      case 'reserved':
        return <CircleParking size={16} className="absolute top-0 right-0 m-1 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("grid grid-cols-3 sm:grid-cols-4 gap-3", className)}>
      {spots.map((spot) => (
        <div
          key={spot.id}
          className={getSpotStyles(spot.status, spot.id === selectedSpotId)}
          onClick={() => {
            if (spot.status === 'available' && onSpotSelect) {
              onSpotSelect(spot.id);
            }
          }}
          aria-disabled={spot.status !== 'available'}
        >
          {getSpotStatusIcon(spot.status, spot.id === selectedSpotId)}
          <span className="font-medium">{spot.label}</span>

          {spot.status === 'reserved' && spot.reservation_info && (
            <div className="mt-1 text-[10px] flex items-center justify-center text-amber-700">
              <Clock size={10} className="mr-1" />
              <span>{spot.reservation_info}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ParkingSpotGrid;
