import { Link } from 'react-router-dom';
import Button from '../ui/Button';

export default function Landing() {
  return (
    <div className="min-h-[calc(100vh-theme(spacing.16)-theme(spacing.24))] flex flex-col items-center justify-center">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-lavender to-purple-600 bg-clip-text text-transparent">
          Virtual Try-On Experience
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Experience the future of online shopping with our AI-powered virtual try-on technology.
          See how clothes look on you before you buy them.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/try-on">
            <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-3">
              Try It Now
            </Button>
          </Link>
          <Link to="/closet">
            <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-3">
              View Closet
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-24 w-full max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-cream-100 rounded-xl shadow-md">
            <div className="w-16 h-16 bg-lavender rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Your Photo</h3>
            <p className="text-gray-600">
              Start by uploading a full-body photo of yourself in a neutral pose
            </p>
          </div>
          
          <div className="text-center p-6 bg-cream-100 rounded-xl shadow-md">
            <div className="w-16 h-16 bg-lavender rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose Clothing</h3>
            <p className="text-gray-600">
              Select clothing items from our catalog or paste a Zalando URL
            </p>
          </div>

          <div className="text-center p-6 bg-cream-100 rounded-xl shadow-md">
            <div className="w-16 h-16 bg-lavender rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">See the Result</h3>
            <p className="text-gray-600">
              Get an instant preview of how the clothes look on you
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
