import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Star, Clock } from 'lucide-react';

interface RestaurantCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  cuisine: string;
  rating: number; // e.g., 4.5
  deliveryTime: string; // e.g., "25-35 min"
  onClick: (id: string | number) => void;
  // Add other potential props like priceRange, promotions, etc.
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  cuisine,
  rating,
  deliveryTime,
  onClick,
}) => {
  console.log("Rendering RestaurantCard:", name);

  const handleCardClick = () => {
    console.log("RestaurantCard clicked:", id);
    onClick(id);
  };

  return (
    <Card
      className="w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:cursor-pointer"
      onClick={handleCardClick}
      tabIndex={0} // Make it focusable
      onKeyPress={(e) => e.key === 'Enter' && handleCardClick()} // Make it keyboard accessible
    >
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={`Image of ${name}`}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-xl font-semibold line-clamp-1">{name}</CardTitle>
        <CardDescription className="text-sm text-gray-600 line-clamp-1">{cuisine}</CardDescription>
        <div className="flex justify-between items-center text-sm text-gray-700">
          <Badge variant="outline" className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
            {rating.toFixed(1)}
          </Badge>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span>{deliveryTime}</span>
          </div>
        </div>
      </CardContent>
      {/* Optional: CardFooter for actions like 'View Menu' if not making whole card clickable */}
    </Card>
  );
};

export default RestaurantCard;