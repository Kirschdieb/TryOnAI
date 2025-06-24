import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function Browse() {
  // Placeholder clothing items
  const clothingItems = [
    {
      id: 1,
      name: "Classic White T-Shirt",
      price: "€29.99",
      image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=T-Shirt",
      category: "Tops"
    },
    {
      id: 2,
      name: "Blue Denim Jeans",
      price: "€79.99",
      image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=Jeans",
      category: "Bottoms"
    },
    {
      id: 3,
      name: "Summer Dress",
      price: "€59.99",
      image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=Dress",
      category: "Dresses"
    },
    {
      id: 4,
      name: "Casual Hoodie",
      price: "€49.99",
      image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=Hoodie",
      category: "Tops"
    },
    {
      id: 5,
      name: "Business Blazer",
      price: "€129.99",
      image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=Blazer",
      category: "Jackets"
    },
    {
      id: 6,
      name: "Sport Shorts",
      price: "€34.99",
      image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=Shorts",
      category: "Bottoms"
    }
  ];

  const categories = ["All", "Tops", "Bottoms", "Dresses", "Jackets"];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Browse Clothing</h1>
        <p className="text-xl text-gray-600">
          Discover our Users popular Items and find the perfect Fit to try on virtually
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            className="px-6 py-2"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Clothing Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {clothingItems.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow">
            <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.category}</p>
              <p className="font-bold text-lavender">{item.price}</p>
              <Link to="/try-on">
                <Button variant="primary" className="w-full mt-3">
                  Try On
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="bg-gradient-to-r from-lavender to-purple-600 text-white">
          <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="mb-6">
            Paste a Zalando URL to try on any clothing item from their catalog
          </p>
          <Link to="/try-on">
            <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
              Upload Custom Item
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
