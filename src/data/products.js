export const PRODUCTS = [
  // Party Sets
  {
    id: 'party-30',
    name: 'Party Set - 30pcs',
    category: 'party',
    price: 250,
    quantity: 30,
    description: 'Perfect for small gatherings',
    image: 'https://doughnuttime.eu/cdn/shop/files/square_DTB_EmmaPharaoh_14May25_403.jpg?v=1754474820',
    customizable: false
  },
  {
    id: 'party-40',
    name: 'Party Set - 40pcs',
    category: 'party',
    price: 320,
    quantity: 40,
    description: 'Great for larger parties',
    image: 'https://127531799.cdn6.editmysite.com/uploads/1/2/7/5/127531799/U7UPIIUMMGQ5OKEK6SICIUVO.jpeg',
    customizable: false
  },
  // Messy Donuts
  {
    id: 'messy-8',
    name: 'Messy Donuts - 8pcs',
    category: 'messy',
    price: 65,
    quantity: 8,
    description: 'Deliciously messy treats',
    image: 'https://media.karousell.com/media/photos/products/2023/9/10/mini_donuts_for_party__mini_do_1694347994_5b6e9d22_progressive.jpg',
    customizable: true,
    flavors: ['Chocolate', 'Strawberry', 'Matcha', 'Glaze', 'White Chocolate'],
    maxFlavors: 2
  },
  {
    id: 'messy-10',
    name: 'Messy Donuts - 10pcs',
    category: 'messy',
    price: 75,
    quantity: 10,
    description: 'More messy goodness',
    image: 'https://s3-media0.fl.yelpcdn.com/bphoto/fJtzYXeHCCNcYN7sswuIaw/348s.jpg',
    customizable: true,
    flavors: ['Chocolate', 'Strawberry', 'Matcha', 'Glaze', 'White Chocolate'],
    maxFlavors: 2
  },
  // Mini Donuts
  {
    id: 'mini-6',
    name: 'Mini Donuts - 6pcs',
    category: 'mini',
    price: 75,
    quantity: 6,
    description: '1 Classic & 1 Premium topping',
    image: 'https://www.sugarhero.com/wp-content/uploads/2011/03/chocolate-doughnuts-3sq-featured-image.jpg',
    customizable: true,
    flavors: ['Chocolate', 'Strawberry', 'Matcha', 'Glaze', 'White Chocolate'],
    maxFlavors: 2,
    toppings: {
      classic: ['Sprinkles', 'Mallows', 'Crushed Oreo'],
      premium: ['Almonds', 'Choco Sprinkles', 'Choco Chips', 'Bear Biscuits', 'Mini Oreo', 'White Choco Chips']
    }
  },
  {
    id: 'mini-12',
    name: 'Mini Donuts - 12pcs',
    category: 'mini',
    price: 145,
    quantity: 12,
    description: '1 Classic & 1 Premium topping',
    image: 'https://i.pinimg.com/736x/be/d8/60/bed860e97c924716f18e00837dc82c04.jpg',
    customizable: true,
    flavors: ['Chocolate', 'Strawberry', 'Matcha', 'Glaze', 'White Chocolate'],
    maxFlavors: 2,
    toppings: {
      classic: ['Sprinkles', 'Mallows', 'Crushed Oreo'],
      premium: ['Almonds', 'Choco Sprinkles', 'Choco Chips', 'Bear Biscuits', 'Mini Oreo', 'White Choco Chips']
    }
  },
  {
    id: 'mini-25',
    name: 'Mini Donuts - 25pcs',
    category: 'mini',
    price: 300,
    quantity: 25,
    description: '1 Classic & 1 Premium topping',
    image: 'https://cdn.christmas-cookies.com/wp-content/uploads/2021/06/easy-baked-mini-donuts.jpg',
    customizable: true,
    flavors: ['Chocolate', 'Strawberry', 'Matcha', 'Glaze', 'White Chocolate'],
    maxFlavors: 3,
    toppings: {
      classic: ['Sprinkles', 'Mallows', 'Crushed Oreo'],
      premium: ['Almonds', 'Choco Sprinkles', 'Choco Chips', 'Bear Biscuits', 'Mini Oreo', 'White Choco Chips']
    }
  }
];