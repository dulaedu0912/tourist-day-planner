// BR-003: the 10 starter places inserted on a fresh database.
// Place photos are NOT bundled with the frontend any more - each place stores
// its own imageUrl. These point at Wikimedia Commons via Special:FilePath,
// which redirects to a width-limited thumbnail, so replace them with your own
// hosted URLs whenever you have them.
const commonsPhoto = (file, width = 1200) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

export const SEED_PLACES = [
  {
    name: 'Henarathgoda Botanical Garden',
    category: 'Nature',
    description:
      "Historic botanical garden featuring Sri Lanka's first rubber tree, lush lawns and walking paths.",
    imageUrl: commonsPhoto('Henarathgoda_Botanical_Garden.jpg'),
    lat: 7.0936,
    lng: 80.0026,
    openingHours: '8:00 AM - 6:00 PM',
    travelTips: 'Visit early morning for birds and cool shade. Bring water.',
  },
  {
    name: 'Guruge Nature Park',
    category: 'Recreation',
    description:
      'Family theme park with mini-amusement rides, dinosaur exhibits and historic replica villages.',
    imageUrl: commonsPhoto('Viharamahadevi_Park,_Colombo_-_panoramio.jpg'),
    lat: 7.035,
    lng: 80.045,
    openingHours: '9:00 AM - 6:00 PM',
    travelTips: 'Weekdays are quieter. Some rides are charged separately.',
  },
  {
    name: 'Pilikuttuwa Forest & Cave Area',
    category: 'Heritage',
    description:
      'Scenic forest site with over 90 natural drip-ledge rock caves and shaded walking trails.',
    imageUrl: commonsPhoto('Dambulla_Cave_1.jpg'),
    lat: 7.02,
    lng: 80.03,
    openingHours: '6:00 AM - 6:00 PM',
    travelTips: 'Wear trainers, the paths are uneven. Avoid after heavy rain.',
  },
  {
    name: 'Muthurajawela Wetland Visitor Centre',
    category: 'Eco-Tourism',
    description:
      'Protected coastal wetland sanctuary offering guided boat tours through mangrove channels.',
    imageUrl: commonsPhoto('Sunsets_at_negombo_lagoon.jpg'),
    lat: 7.103,
    lng: 79.883,
    openingHours: '7:00 AM - 5:00 PM',
    travelTips: 'Boat tours leave in the early morning. Book ahead on weekends.',
  },
  {
    name: 'Dutch Canal',
    category: 'Heritage',
    description:
      'Historic 17th-century canal built during the Dutch era, ideal for photography and scenic boat tours.',
    imageUrl: commonsPhoto('Negombo,_Dutch_Canal,_2025-07_CN-01.jpg'),
    lat: 7.074,
    lng: 79.888,
    openingHours: 'Open all day',
    travelTips: 'Best light for photos is late afternoon.',
  },
  {
    name: 'Kelaniya Raja Maha Viharaya',
    category: 'Religious',
    description:
      'Sacred historic temple famous for its stone carvings, grand stupa and detailed wall paintings.',
    imageUrl: commonsPhoto('Kelaniya_Temple_(Kelaniya_Raja_Maha_Vihara)_(5439887839).jpg'),
    lat: 6.9815,
    lng: 79.9217,
    openingHours: '6:00 AM - 9:00 PM',
    travelTips: 'Cover shoulders and knees. Remove shoes before the shrine.',
  },
  {
    name: "Upali's by Nawaloka",
    category: 'Dining',
    description:
      'Highly rated restaurant near Viharamahadevi Park, famous for traditional Sri Lankan rice and curry.',
    imageUrl: commonsPhoto('Sri_lankan_chicken_curry.jpg'),
    lat: 6.9157,
    lng: 79.8605,
    openingHours: '11:00 AM - 10:30 PM',
    travelTips: 'Try the rice and curry lunch set. Busy after 1 PM.',
  },
  {
    name: 'Beddagana Wetland Park',
    category: 'Eco-Tourism',
    description:
      'Urban wetland park with elevated wooden boardwalks, butterfly gardens and bird-watching towers.',
    imageUrl: commonsPhoto('At_the_Beddagana_Wetlands_IMG_1568a.jpg'),
    lat: 6.905,
    lng: 79.905,
    openingHours: '6:00 AM - 6:00 PM',
    travelTips: 'Sunrise is the best time for bird watching.',
  },
  {
    name: 'Colombo National Museum',
    category: 'Heritage',
    description:
      "Sri Lanka's premier museum displaying royal regalia, ancient artifacts and historical galleries.",
    imageUrl: commonsPhoto('Colombo_National_Museum_Sri_Lanka.JPG'),
    lat: 6.9108,
    lng: 79.8612,
    openingHours: '9:00 AM - 5:00 PM (closed Fridays)',
    travelTips: 'Allow at least two hours. Tickets are cheap for locals.',
  },
  {
    name: 'Paradise Road The Gallery Cafe',
    category: 'Dining',
    description:
      "Iconic restaurant set in Geoffrey Bawa's former office, offering international cuisine and desserts.",
    imageUrl: commonsPhoto('Sri_Lankan_Rice_and_Curry.jpg'),
    lat: 6.906,
    lng: 79.856,
    openingHours: '10:00 AM - 11:00 PM',
    travelTips: 'Reserve a table for dinner. The courtyard seats are the best.',
  },
];
