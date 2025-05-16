export default function Footer() {
  return (
    <footer className="bg-cream-200 py-6">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} TryOnAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
