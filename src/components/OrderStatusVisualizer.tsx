import React from 'react';
import { cn } from '@/lib/utils'; // For conditional class names
import { CheckCircle, Package, CookingPot, Bike, CheckCircle2, XCircle } from 'lucide-react'; // Example icons

export interface OrderStatusStep {
  key: string;
  label: string;
  icon: React.ElementType;
}

export const defaultOrderStatuses: OrderStatusStep[] = [
  { key: 'confirmed', label: 'Order Confirmed', icon: Package },
  { key: 'preparing', label: 'Preparing Food', icon: CookingPot },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Bike },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export const cancelledStatus: OrderStatusStep = {
  key: 'cancelled', label: 'Cancelled', icon: XCircle
};

interface OrderStatusVisualizerProps {
  currentStatusKey: string; // e.g., "preparing"
  statuses?: OrderStatusStep[]; // Optional override for statuses
  isCancelled?: boolean;
}

const OrderStatusVisualizer: React.FC<OrderStatusVisualizerProps> = ({
  currentStatusKey,
  statuses = defaultOrderStatuses,
  isCancelled = false,
}) => {
  console.log("Rendering OrderStatusVisualizer, current status:", currentStatusKey, "Cancelled:", isCancelled);

  const displayStatuses = isCancelled ? [cancelledStatus] : statuses;
  const currentStatusIndex = isCancelled ? 0 : displayStatuses.findIndex(s => s.key === currentStatusKey);

  if (!isCancelled && currentStatusIndex === -1) {
    console.error("OrderStatusVisualizer: Invalid currentStatusKey provided.", currentStatusKey);
    return <p className="text-red-500">Error: Invalid order status.</p>;
  }

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between relative">
        {displayStatuses.map((status, index) => {
          const isActive = isCancelled ? true : index <= currentStatusIndex;
          const isCurrent = isCancelled ? true : index === currentStatusIndex;

          return (
            <React.Fragment key={status.key}>
              {/* Connector Line (not for the first item) */}
              {index > 0 && (
                <div className={cn(
                  "flex-1 h-1 transition-colors duration-500",
                  (isCancelled && index === 0) ? 'bg-red-500' : (isActive && index <= currentStatusIndex ? 'bg-green-500' : 'bg-gray-300')
                )}></div>
              )}

              {/* Status Step Circle and Label */}
              <div className="flex flex-col items-center z-10">
                <div
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                    isCancelled ? "bg-red-100 border-red-500" :
                    isActive ? "bg-green-100 border-green-500" : "bg-gray-100 border-gray-300",
                    isCurrent && !isCancelled && "ring-4 ring-green-200"
                  )}
                >
                  <status.icon className={cn(
                    "w-5 h-5 md:w-6 md:h-6",
                    isCancelled ? "text-red-500" :
                    isActive ? "text-green-600" : "text-gray-400"
                  )} />
                </div>
                <p
                  className={cn(
                    "mt-2 text-xs md:text-sm text-center w-20 md:w-24 transition-colors duration-500",
                    isCancelled ? "text-red-700 font-semibold" :
                    isActive ? "text-gray-700 font-semibold" : "text-gray-500"
                  )}
                >
                  {status.label}
                </p>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusVisualizer;