import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function Browse() {
  const { t } = useLanguage();
  const [clothingItems, setClothingItems] = useState([]);
  const [loading, setLoading] = useState(true);  const [selectedCategory, setSelectedCategory] = useState('alle');
  const navigate = useNavigate();
  // Fetch products from server
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categoryParam = selectedCategory === 'alle' ? 'alle' : selectedCategory.toLowerCase();
        const response = await fetch(`http://localhost:3001/api/products?category=${categoryParam}`);
        const data = await response.json();
        setClothingItems(data.products || []);
        
        // Log if we're getting real or fallback data
        if (data.source === 'zalando') {
          console.log('✅ Successfully loaded real Zalando products');
        } else {
          console.log('⚠️ Using fallback products (Zalando scraping may have failed)');
        }      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to placeholder data
        setClothingItems([
          {
            id: 1,
            name: "Klassisches Weißes Hemd",
            price: "€49,99",
            image: "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=Hemd",
            category: "Hemden",
            url: "https://www.zalando.de/herrenbekleidung-hemden/"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]); // Re-fetch when category changes

  const handleTryOn = async (item) => {
    try {
      // Copy URL to clipboard
      await navigator.clipboard.writeText(item.url);
      // Navigate to try-on page
      navigate('/try-on');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Still navigate to try-on page even if clipboard fails
      navigate('/try-on');
    }
  };  

  const categories = [
    { key: 'alle', label: t('browse.categories.all') },
    { key: 'hemden', label: t('browse.categories.shirts') },
    { key: 'hosen', label: t('browse.categories.pants') },
    { key: 'shirts', label: t('browse.categories.tshirts') },
    { key: 'jacken', label: t('browse.categories.jackets') }
  ];
  
  // No need to filter items locally since we're fetching by category
  const filteredItems = clothingItems;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">        <h1 className="text-4xl font-bold mb-4">{t('browse.title')}</h1>
        <p className="text-xl text-gray-600">
          {t('browse.subtitle')}
        </p>
      </div>      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">        {categories.map((category) => (
          <Button
            key={category.key}
            variant={selectedCategory === category.key ? "primary" : "outline"}
            className="px-6 py-2"
            onClick={() => setSelectedCategory(category.key)}
          >
            {category.label}
          </Button>
        ))}
      </div>      {/* Clothing Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredItems.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow">
            {/* Clickable Product Image */}
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-gray-100 cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=No+Image";
                }}
              />
              {/* Overlay to indicate clickability */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-3 shadow-lg">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </a>            <div className="space-y-2">
              {/* Clickable Product Name */}
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <h3 className="font-semibold text-lg hover:text-lavender transition-colors duration-200 cursor-pointer">
                  {item.name}
                </h3>
              </a>              <p className="text-sm text-gray-500">{item.category}</p>
              {/* Make price more prominent */}
              <p className="font-bold text-xl text-lavender">{item.price}</p>              <p className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                {t('browse.clickHint')}
              </p>
              <Button 
                variant="primary" 
                className="w-full mt-3"
                onClick={() => handleTryOn(item)}
              >
                {t('browse.tryNow')}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="bg-gradient-to-r from-lavender to-purple-600 text-white">          <h2 className="text-2xl font-bold mb-4">{t('browse.cantFind')}</h2>
          <p className="mb-6">
            {t('browse.pasteUrl')}
          </p>
          <Link to="/try-on">
            <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
              {t('browse.uploadCustom')}
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
