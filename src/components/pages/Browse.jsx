import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCloset } from '../../store/useCloset';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function Browse() {
  const { t } = useLanguage();
  const [clothingItems, setClothingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('alle');
  const navigate = useNavigate();
  const { setHomeZalandoUrl, setHomeClothPhotoUrl, setSelectedClothingItem } = useCloset();
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

  const handleTryOn = (item) => {
    // Set Zalando URL in store for HomeUpload
    setHomeZalandoUrl(item.url);
    setHomeClothPhotoUrl(null); // Reset any previous cloth photo
    // Store the selected clothing item with product information
    setSelectedClothingItem({
      name: item.name,
      image: item.image,
      link: item.url,
      price: item.price,
      category: item.category
    });
    navigate('/try-on');
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
      <div className="relative min-h-screen overflow-hidden">
        {/* Decorative curved elements - consistent with main layout */}
        <div
          className="fixed top-0 right-0 w-72 h-72 translate-x-18 -translate-y-18 -z-10"
          style={{
            background: 'linear-gradient(225deg, #7f3ffb 0%, #e14eca 100%)',
            borderRadius: '0 0 0 100%',
            transform: 'translate(25%, -25%)',
          }}
          aria-hidden="true"
        />
        <div
          className="fixed bottom-0 left-0 w-88 h-88 -translate-x-22 translate-y-22 -z-10"
          style={{
            background: 'linear-gradient(45deg, #7f3ffb 0%, #e14eca 100%)',
            borderRadius: '0 100% 0 0',
            transform: 'translate(-25%, 25%)',
          }}
          aria-hidden="true"
        />
        
        <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-purple-500">
              <svg className="animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-xl text-purple-600">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative curved elements - consistent with Closet page */}
      
      {/* Top right curved element */}
      <div
        className="fixed top-0 right-0 w-72 h-72 translate-x-18 -translate-y-18 -z-10"
        style={{
          background: 'linear-gradient(225deg, #7f3ffb 0%, #e14eca 100%)',
          borderRadius: '0 0 0 100%',
          transform: 'translate(25%, -25%)',
        }}
        aria-hidden="true"
      />
      
      {/* Bottom left curved element */}
      <div
        className="fixed bottom-0 left-0 w-88 h-88 -translate-x-22 translate-y-22 -z-10"
        style={{
          background: 'linear-gradient(45deg, #7f3ffb 0%, #e14eca 100%)',
          borderRadius: '0 100% 0 0',
          transform: 'translate(-25%, 25%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mb-4">
            {t('browse.title')}
          </h1>
          <p className="text-xl text-purple-600 max-w-3xl mx-auto">
            {t('browse.subtitle')}
          </p>
        </div>        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">{t('browse.categoryTitle')}</h2>
          <div className="flex flex-wrap gap-3 items-center justify-center mb-6">
            {categories.map((category) => (
              <div
                key={category.key}
                className={`px-6 py-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 font-medium ${
                  selectedCategory === category.key 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600 shadow-lg' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedCategory(category.key)}
              >
                {category.label}
              </div>
            ))}
          </div>
        </div>        {/* Clothing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden flex flex-col h-full">
              {/* Clickable Product Image */}
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100 cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x400/6C63FF/FFFFFF?text=No+Image";
                  }}
                />
                {/* Overlay to indicate clickability */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-3 shadow-lg">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              </a>

              <div className="p-4 space-y-3 flex-1 flex flex-col">
                {/* Clickable Product Name */}
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h3 className="font-semibold text-lg hover:text-purple-600 transition-colors duration-200 cursor-pointer line-clamp-2">
                    {item.name}
                  </h3>
                </a>
                
                <p className="text-sm text-gray-500">{item.category}</p>
                {/* Make price more prominent */}
                <p className="font-bold text-xl text-purple-600">{item.price}</p>
                
                <div className="flex-1"></div>
                
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    {t('browse.clickHint')}
                  </p>
                  <Button 
                    variant="primary" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => handleTryOn(item)}
                  >
                    {t('browse.tryNow')}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{t('browse.cantFind')}</h2>
            <p className="mb-6">
              {t('browse.pasteUrl')}
            </p>
            <Link to="/try-on">
              <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 rounded-xl px-8 py-3 font-semibold">
                {t('browse.uploadCustom')}
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
