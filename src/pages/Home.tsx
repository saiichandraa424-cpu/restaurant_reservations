import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChefHat, UtensilsCrossed, GlassWater } from 'lucide-react';

export default function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Experience Fine Dining
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Indulge in an unforgettable culinary journey with our award-winning chefs.
            Savor exquisite flavors in an elegant atmosphere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reservations">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                Make a Reservation
              </Button>
            </Link>
            <Link to="/menu">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white"
              >
                View Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-accent">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <ChefHat className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Exquisite Cuisine</h3>
              <p className="text-muted-foreground">
                Our menu features carefully crafted dishes using the finest ingredients,
                prepared by our talented culinary team.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <UtensilsCrossed className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Elegant Atmosphere</h3>
              <p className="text-muted-foreground">
                Dine in sophisticated surroundings designed to enhance your
                culinary experience.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <GlassWater className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Impeccable Service</h3>
              <p className="text-muted-foreground">
                Our attentive staff ensures every detail of your dining experience
                is perfect.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              A Culinary Journey Awaits
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join us for an extraordinary dining experience where every dish tells a story
              and every meal becomes a memorable occasion.
            </p>
            <Link to="/reservations">
              <Button size="lg">Reserve Your Table</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}