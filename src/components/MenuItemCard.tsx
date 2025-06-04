import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PlusCircle } from 'lucide-react';

interface MenuItemCardProps {
  id: string | number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // Optional image
  onAddToCart: (item: { id: string | number; name: string; price: number }) => void;
  // Add dietary tags, spice level, etc. as needed
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
}) => {
  console.log("Rendering MenuItemCard:", name);

  const handleAddToCartClick = () => {
    console.log("Add to cart clicked for MenuItem:", name, id);
    onAddToCart({ id, name, price });
    // Consider using a toast notification here from a global context or hook
  };

  return (
    <Card className="w-full flex flex-col md:flex-row overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      {imageUrl && (
        <div className="md:w-1/3">
          <AspectRatio ratio={1} className="md:h-full">
            <img
              src={imageUrl}
              alt={`Image of ${name}`}
              className="object-cover w-full h-full"
              onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails to load
            />
          </AspectRatio>
        </div>
      )}
      <div className={`flex-1 flex flex-col justify-between ${imageUrl ? 'md:w-2/3' : 'w-full'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <CardDescription className="text-sm text-gray-600 line-clamp-2">{description}</CardDescription>
        </CardHeader>
        <CardContent className="py-2">
          <p className="text-lg font-bold text-orange-600">${price.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="pt-2">
          <Button className="w-full md:w-auto ml-auto" onClick={handleAddToCartClick}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default MenuItemCard;