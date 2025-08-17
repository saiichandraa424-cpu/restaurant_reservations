import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
}

interface MenuCategory {
  id: string;
  name: string;
  display_order: number;
}

export default function Menu() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    async function fetchMenu() {
      const { data: categoriesData } = await supabase
        .from('menu_categories')
        .select('*')
        .order('display_order');

      const { data: menuItemsData } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true);

      if (categoriesData) setCategories(categoriesData);
      if (menuItemsData) setMenuItems(menuItemsData);
    }

    fetchMenu();
  }, []);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
          <p className="text-lg text-muted-foreground">
            Discover our carefully curated selection of dishes, crafted with the finest ingredients
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {categories.map((category) => {
            const items = menuItems.filter((item) => item.category_id === category.id);
            
            return (
              <div key={category.id} className="mb-12">
                <h2 className="text-2xl font-bold mb-6">{category.name}</h2>
                <div className="grid gap-6">
                  {items.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-start">
                          <span>{item.name}</span>
                          <span className="text-lg">${item.price.toFixed(2)}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Separator className="mt-8" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}