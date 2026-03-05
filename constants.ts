
import { HousePlan } from './types';

export const HOUSE_STYLES = [
  'Modern Farmhouse',
  'Craftsman',
  'Contemporary',
  'European',
  'Traditional',
  'Modern',
  'Ranch',
  'Cottage'
];

export const MOCK_PLANS: HousePlan[] = [
  {
    id: '1',
    planNumber: 'AD-42001',
    name: 'The Grand Farmhouse',
    style: 'Modern Farmhouse',
    sqft: 2850,
    beds: 4,
    baths: 3.5,
    floors: 2,
    garages: 3,
    price: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800',
    description: 'A stunning modern farmhouse featuring wrap-around porches and an open-concept living area perfect for hosting. The primary suite offers a spa-like retreat on the main level.',
    dimensions: '64\' 0" W x 52\' 8" D',
    features: ['Open Floor Plan', 'Main Level Master', 'Outdoor Kitchen', 'Walk-in Pantry']
  },
  {
    id: '2',
    planNumber: 'AD-42002',
    name: 'Coastal Haven',
    style: 'Contemporary',
    sqft: 1950,
    beds: 3,
    baths: 2,
    floors: 1,
    garages: 2,
    price: 895,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    description: 'Modern lines meet coastal elegance. This single-story plan maximizes natural light with floor-to-ceiling windows and high vaulted ceilings throughout.',
    dimensions: '48\' 0" W x 60\' 0" D',
    features: ['High Ceilings', 'Large Windows', 'Deck/Patio', 'Energy Efficient']
  },
  {
    id: '3',
    planNumber: 'AD-42003',
    name: 'Rustic Ridge Retreat',
    style: 'Craftsman',
    sqft: 3400,
    beds: 5,
    baths: 4.5,
    floors: 2,
    garages: 3,
    price: 1550,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    description: 'Beautiful stonework and timber accents define this craftsman masterpiece. Ideal for a sloping lot with a walk-out basement option.',
    dimensions: '72\' 4" W x 48\' 2" D',
    features: ['Bonus Room', 'Mudroom', 'Sloping Lot', 'Wine Cellar']
  },
  {
    id: '4',
    planNumber: 'AD-42004',
    name: 'Lakeside Manor',
    style: 'European',
    sqft: 4200,
    beds: 4,
    baths: 5,
    floors: 2,
    garages: 4,
    price: 1850,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800',
    description: 'An elegant French-inspired estate with multiple gables and a grand entrance. Luxury meets functionality in every corner.',
    dimensions: '88\' 0" W x 65\' 0" D',
    features: ['Home Theater', 'Office/Study', 'Two Masters', 'Pool House']
  },
  {
    id: '5',
    planNumber: 'AD-42005',
    name: 'Minimalist Loft House',
    style: 'Modern',
    sqft: 1200,
    beds: 2,
    baths: 1.5,
    floors: 2,
    garages: 0,
    price: 550,
    imageUrl: 'https://images.unsplash.com/photo-1449156001437-3a16d1daae39?auto=format&fit=crop&q=80&w=800',
    description: 'Perfect for urban lots or ADUs. This minimalist design emphasizes space and efficiency without compromising style.',
    dimensions: '24\' 0" W x 32\' 0" D',
    features: ['Loft', 'Efficiency', 'Modern Fixtures', 'Solar Ready']
  },
  {
    id: '6',
    planNumber: 'AD-42006',
    name: 'Golden Oaks Ranch',
    style: 'Ranch',
    sqft: 2200,
    beds: 3,
    baths: 2.5,
    floors: 1,
    garages: 2,
    price: 975,
    imageUrl: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=800',
    description: 'Classic ranch living with a modern twist. The split-bedroom layout ensures privacy for the master wing.',
    dimensions: '56\' 0" W x 54\' 0" D',
    features: ['Split Bedrooms', 'Rear Porch', 'Kitchen Island', 'Fireplace']
  }
];
