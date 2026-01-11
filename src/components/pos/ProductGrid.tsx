import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePOS } from '@/context/POSContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '@/types/pos';
import { cn } from '@/lib/utils';

export function ProductGrid() {
  const { products } = usePOS();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = products.filter(product => {
    if (!product.active) return false;
    
    const matchesSearch = search === '' || 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.shortCode.toLowerCase().includes(search.toLowerCase()) ||
      product.code.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Search bar */}
      <div className="p-4 bg-card border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar producto o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 text-base bg-background"
          />
        </div>
      </div>
      
      {/* Categories */}
      <div className="px-4 py-3 bg-card border-b border-border overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {CATEGORIES.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "whitespace-nowrap btn-touch",
                selectedCategory === cat.id && "bg-primary text-primary-foreground"
              )}
            >
              {cat.emoji} {cat.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Product grid */}
      <div className="flex-1 overflow-y-auto p-4 bg-background">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <span className="text-4xl mb-2">🔍</span>
            <p>No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
