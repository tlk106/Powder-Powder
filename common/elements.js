class Element {
  constructor(name, id, color, mass, starttemp, meltingpoint, boilingpoint, ispowder, conductivity) {
    if (
      typeof name !== "string" ||
      typeof id !== "number" ||
      typeof color !== "string" ||
      typeof mass !== "number" ||
      typeof starttemp !== "number" ||
      typeof meltingpoint !== "number" ||
      typeof boilingpoint !== "number" ||
      typeof ispowder !== "boolean" || // Is powder instead of solid.
      typeof conductivity !== "number"
    ) {
      throw new Error("Invalid parameters");
    }

    this.name = name;
    this.id = id;
    this.color = color;
    this.mass = mass; // Should be the real-life object mass in grams per cm^3
    this.starttemp = starttemp; // Starting temperature in Celsius
    this.meltingpoint = meltingpoint; // Melting point in Celsius
    this.boilingpoint = boilingpoint; // Boiling point in Celsius
    this.ispowder = ispowder; // Is powder instead of solid.
    this.conductivity = conductivity; // Thermal conductivity (arbitrary units)
  }
  isSolid() {
    return this.starttemp < this.meltingpoint;
  }
  isLiquid() {
    return this.starttemp >= this.meltingpoint && this.starttemp < this.boilingpoint;
  }
  isGas() {
    return this.starttemp >= this.boilingpoint;
  }
  isPowder() {
    return this.starttemp < this.meltingpoint && this.ispowder;
  }
}

// Existing elements with updated colors as RGB strings and conductivity (arbitrary units)
const powder = new Element("Powder", 0, "rgb(255, 255, 0)", 1.5, 21, 1000, 8000, true, 0.05);
const water = new Element("Water", 1, "rgb(30, 99, 190)", 1, 21, 0, 100, false, 0.6);
const oxygen = new Element("Oxygen", 2, "rgb(173, 216, 230)", 0.001429, 21, -218.79, -182.96, false, 0.02);
const stone = new Element("Stone", 3, "rgb(128, 128, 128)", 2.5, 21, 1500, 8000, false, 2.0);
const oil = new Element("Oil", 4, "rgb(255, 165, 0)", 0.9, 21, -6, 300, false, 0.15);
const ice = new Element("Ice", 5, "rgb(173, 216, 230)", 0.92, -10, 0, 100, false, 2.2);
const steam = new Element("Steam", 6, "rgb(161, 190, 209)", 0.0006, 300, 0, 100, false, 0.02);
const lava = new Element("Lava", 7, "rgb(255, 80, 0)", 2.4, 1600, 700, 3000, false, 1.5);

const elements = { powder, water, oxygen, stone, oil, ice, steam, lava };

export { elements, Element };