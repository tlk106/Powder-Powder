class Element {
  constructor(name, id, color, mass, starttemp, meltingpoint, boilingpoint, ispowder) {
    if (
      typeof name !== "string" ||
      typeof id !== "number" ||
      typeof color !== "string" ||
      typeof mass !== "number" ||
      typeof starttemp !== "number" ||
      typeof meltingpoint !== "number" ||
      typeof boilingpoint !== "number" ||
      typeof ispowder !== "boolean" // Is powder instead of solid.
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

// Existing elements with updated colors as RGB strings
const powder = new Element("Powder", 0, "rgb(255, 255, 0)", 1.5, -100, 1000, 8000, true);
const water = new Element("Water", 1, "rgb(0, 0, 255)", 1, 21, 0, 100, false);
const oxygen = new Element("Oxygen", 2, "rgb(173, 216, 230)", 0.001429, 21, -218.79, -182.96, false);
const stone = new Element("Stone", 3, "rgb(128, 128, 128)", 2.5, 21, 1500, 8000, false);
const oil = new Element("Oil", 4, "rgb(255, 165, 0)", 0.9, 21, -6, 300, false);
const ice = new Element("Ice", 5, "rgb(173, 216, 230)", 0.92, -10, 0, 100, false);
const steam = new Element("Steam", 6, "rgb(161, 190, 209)", 0.0006, -21, 0, 100, false);

const elements = { powder, water, oxygen, stone, oil, ice, steam }; // Add ice and steam

export { elements, Element }; // Export the elements object and Element class