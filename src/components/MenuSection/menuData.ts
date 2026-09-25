export interface MenuItem {
  name: string;
  description: string;
  price: string;
  tag: string;
  image: { src: string; alt: string };
}

export const MENU_ITEMS: MenuItem[] = [
  {
    name: "Signature Espresso",
    description: "Dark chocolate, red fruit, a long caramel finish.",
    price: "$4.50",
    tag: "Classic",
    image: {
      src: "/menu/signature-espresso.jpg",
      alt: "A single shot of espresso in a white cup beside coffee beans and a moka pot",
    },
  },
  {
    name: "Aroura Latte",
    description: "Silky steamed milk over our signature espresso blend.",
    price: "$5.50",
    tag: "Signature",
    image: {
      src: "/menu/aroura-latte.jpg",
      alt: "Steamed milk being poured into an espresso to form latte art",
    },
  },
  {
    name: "Cortado",
    description: "Equal parts espresso and warm milk, no foam.",
    price: "$5.00",
    tag: "Classic",
    image: {
      src: "/menu/cortado.jpg",
      alt: "Coffee beans, grounds, and a latte in a portafilter basket on a wooden board",
    },
  },
  {
    name: "Pour Over",
    description: "Single-origin, brewed to order, bright and clean.",
    price: "$6.00",
    tag: "Single Origin",
    image: {
      src: "/menu/pour-over.jpg",
      alt: "Coffee being poured over a Chemex brewer with steam rising",
    },
  },
  {
    name: "Iced Oat Latte",
    description: "Espresso, oat milk, a touch of Madagascar vanilla.",
    price: "$6.00",
    tag: "Seasonal",
    image: {
      src: "/menu/iced-oat-latte.jpg",
      alt: "An iced latte with swirling milk in a glass on a cafe counter",
    },
  },
  {
    name: "Cold Brew",
    description: "Steeped 18 hours, smooth, low acidity, no ice dilution.",
    price: "$5.50",
    tag: "Classic",
    image: {
      src: "/menu/cold-brew.jpg",
      alt: "A glass of iced cold brew coffee on a wooden table with brewing equipment behind it",
    },
  },
];
