export interface Property {
  id: number;
  image: string;
  price: string;
  priceNumeric: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  beds: number;
  baths: number;
  sqft: number;
  lotSize: string;
  yearBuilt: number;
  propertyType: string;
  status: string;
  featured: boolean;
  daysOnMarket: number;
  mls: string;
  description: string;
  features: string[];
  neighborhood: string;
  schoolDistrict: string;
  keywords: string[];
  images?: string[];
}

export const properties: Property[] = [
  {
    id: 1,
    image: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9f2c6cb14867f86ed2.jpeg',
    price: '$1,599,000',
    priceNumeric: 1599000,
    address: '420 S Hill St',
    city: 'Orange',
    state: 'CA',
    zipCode: '92869',
    beds: 4,
    baths: 3.5,
    sqft: 2949,
    lotSize: '0.081 acres',
    yearBuilt: 2024,
    propertyType: 'Single Family Home',
    status: 'For Sale',
    featured: true,
    daysOnMarket: 5,
    mls: 'ORA24701',
    neighborhood: 'Orange Hills',
    schoolDistrict: 'Orange Unified',
    description: `This gorgeous newly built home is nestled in a tranquil residential street within the sought-after Orange neighborhood. Boasting four bedrooms and three and a half baths, this residence exudes character and warmth across its spacious 2,949 square feet of living space, situated on an expansive 5,855 square feet lot. Ideal for those seeking to settle into a well-established community, this home has been meticulously designed both inside and out. Featuring a versatile layout with a living room, dining room, family room, TV room, master suite, and junior suite this home caters to diverse lifestyles. Its convenient location offers proximity to a park, elementary school, and library, all within walking distance. The open floor plan seamlessly connects the indoor and outdoor spaces, making it perfect for hosting gatherings. With its elongated driveway adding to its appeal, this residence presents an exceptional opportunity for those seeking comfort and convenience in a desirable neighborhood.`,
    features: ['2-Car Garage', 'Open Floor Plan', 'Master Suite', 'Junior Suite', 'Living Room', 'Dining Room', 'Family Room', 'TV Room', 'Elongated Driveway', 'Large Lot (0.1344 Acres)', 'Walking Distance to Park', 'Near Elementary School', 'Close to Library', 'Indoor-Outdoor Living', 'Perfect for Entertaining'],
    keywords: ['new construction', 'luxury', 'family home', 'orange', 'hill street', 'modern', 'spacious', 'garage'],
    images: [
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9f2c6cb14867f86ed2.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9f7dbd374d54ce8694.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9ff90bf927d31a4d4b.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9f4669a980ca785e61.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9fa392d0bde20f4c4d.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9ef90bf983bf1a4d48.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9e25f2726592724f13.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9fe581e0353c35f1a0.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9ef670204743fda9f3.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9fe581e0102a35f19f.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9f7dbd3788f3ce8692.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9fe581e0507035f19b.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9ea392d0b4380f4c4c.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/OOffS0euyreSp3x4Tzkn/media/685c8b9e2c6cb179e6f86ece.jpeg'
    ]
  },
  {
    id: 2,
    image: 'https://photos.zillowstatic.com/fp/f67e3cbf0f8cb1672f1637920dc4ea16-cc_ft_768.webp',
    price: '$650,000',
    priceNumeric: 650000,
    address: '8035 Santa Rita St',
    city: 'Corona',
    state: 'CA',
    zipCode: '92881',
    beds: 4,
    baths: 3,
    sqft: 2156,
    lotSize: '0.059 acres',
    yearBuilt: 2005,
    propertyType: 'Single Family Home',
    status: 'For Sale',
    featured: true,
    daysOnMarket: 12,
    mls: 'COR24801',
    neighborhood: 'Corona',
    schoolDistrict: 'Corona-Norco Unified',
    description: `Welcome to this stunning 4-bedroom, 3-bathroom home located in the desirable Corona community. This well-maintained property offers 2,156 square feet of comfortable living space with an open floor plan perfect for modern family living. The home features a spacious master suite, updated kitchen with granite countertops, and a large backyard ideal for entertaining. Located in a quiet neighborhood with excellent schools nearby, this property offers the perfect blend of comfort and convenience. The home includes a 2-car garage, central air conditioning, and beautiful landscaping. With easy access to shopping, dining, and major freeways, this Corona gem won't last long on the market.`,
    features: ['2-Car Garage', 'Open Floor Plan', 'Master Suite', 'Updated Kitchen', 'Granite Countertops', 'Large Backyard', 'Central Air Conditioning', 'Landscaped Yard', 'Quiet Neighborhood', 'Near Schools', 'Easy Freeway Access', 'Shopping Nearby', 'Family Friendly', 'Move-in Ready'],
    keywords: ['corona', 'santa rita', 'family home', 'updated kitchen', 'granite countertops', 'large backyard', 'schools', 'freeway access'],
    images: [
      'https://photos.zillowstatic.com/fp/f67e3cbf0f8cb1672f1637920dc4ea16-cc_ft_768.webp',
      'https://photos.zillowstatic.com/fp/323cc15adbbf98041a937fa8052bca51-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/b4caa1a8ebf182046955b976c78da080-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/a5e8460221247a1ffa02b63a3365661d-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/f1471435645c5826dec666364984f79a-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/8a9262e60aac487c670256f7a9b66c83-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/76806c02d5b904fa06647f6e682fc557-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/6028e7cf9b849a4bb44289d8e675d9a5-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/76b7f9d57a31791db332ee41df02377b-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/66b9398cb45fe88282de2ae71d5187c4-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/3ccb316adafd3d1c75589490337a04b9-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/ee09121f8f607f33cb10bd4a7c3af567-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/a2a4c8cf61524705ecc80c716d7cad64-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/ad5e23af1ebcf8b963f8a67324db3146-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/b67e161ced1389871614e65c582e61fa-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/c90df2a08d88060626c243cdf9012efc-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/eb2d4ce16e71b02cbe5ba1727ac77146-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/b6a4158778c6b4b7248f669e60f3da81-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/57cca6695fb9e9ef9e86e215bcac3b91-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/f760f923c59fc6360457ac0c46547b18-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/7bfe4ba6430a8dad063ec6c0e628a30d-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/2a1105711bafc36a7974e92cd94767f2-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/4a2cb52db6c86fe765307ffc74efefce-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/709d679995bca132691a2f70bfc11ef2-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/39a7a14fcad066616ab99cfcbc9b246b-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/ba51cede4620903f9f3b8a69c2c89f18-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/8850c4b7851820ac18f9da7c0ac83585-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/d427c27a2d3ef52fcc8255cee360f414-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/e4e9fed6d38b0ce8049b0513ad772db2-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/c225ae02434fe8e84140f8b98010ebae-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/4ba1d1f96eace0a3ab38bd371d823767-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/7c4824c2806bcf20019e325945ed4ee0-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/6f7ace4beac61de0df0e15378b44aa1c-uncropped_scaled_within_1536_1152.webp',
      'https://photos.zillowstatic.com/fp/4fe7c1753331b8df852bc237c2ea6dcb-uncropped_scaled_within_1536_1152.webp'
    ]
  }
];

export const getPropertyById = (id: number): Property | undefined => {
  return properties.find(property => property.id === id);
};

export const searchProperties = (query: string, filters?: {
  propertyType?: string;
  minBeds?: number;
  minBaths?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}): Property[] => {
  let filteredProperties = [...properties];

  // Text search
  if (query.trim()) {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    filteredProperties = filteredProperties.filter(property => {
      const searchableText = [
        property.address,
        property.city,
        property.state,
        property.zipCode,
        property.neighborhood,
        property.schoolDistrict,
        property.propertyType,
        property.description,
        ...property.features,
        ...property.keywords,
        property.mls
      ].join(' ').toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    });
  }

  // Apply filters
  if (filters) {
    if (filters.propertyType && filters.propertyType !== 'all') {
      filteredProperties = filteredProperties.filter(p => 
        p.propertyType.toLowerCase().includes(filters.propertyType!.toLowerCase())
      );
    }

    if (filters.minBeds) {
      filteredProperties = filteredProperties.filter(p => p.beds >= filters.minBeds!);
    }

    if (filters.minBaths) {
      filteredProperties = filteredProperties.filter(p => p.baths >= filters.minBaths!);
    }

    if (filters.minPrice) {
      filteredProperties = filteredProperties.filter(p => p.priceNumeric >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      filteredProperties = filteredProperties.filter(p => p.priceNumeric <= filters.maxPrice!);
    }

    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          filteredProperties.sort((a, b) => a.priceNumeric - b.priceNumeric);
          break;
        case 'price-high':
          filteredProperties.sort((a, b) => b.priceNumeric - a.priceNumeric);
          break;
        case 'newest':
          filteredProperties.sort((a, b) => b.yearBuilt - a.yearBuilt);
          break;
        case 'sqft':
          filteredProperties.sort((a, b) => b.sqft - a.sqft);
          break;
        case 'days-market':
          filteredProperties.sort((a, b) => a.daysOnMarket - b.daysOnMarket);
          break;
        default:
          // Featured first, then by days on market
          filteredProperties.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return a.daysOnMarket - b.daysOnMarket;
          });
      }
    }
  }

  return filteredProperties;
};