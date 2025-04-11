class Element {
  constructor(name, id, color, mass, starttemp, meltingpoint, boilingpoint) {
    if (
      typeof name !== "string" ||
      typeof id !== "number" ||
      typeof color !== "string" ||
      typeof mass !== "number" ||
      typeof starttemp !== "number" ||
      typeof meltingpoint !== "number" ||
      typeof boilingpoint !== "number"
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
  }
}

// Existing elements with updated masses
const powder = new Element("Powder", 0, "yellow", 1.5, 21, 1000, 8000);
const water = new Element("Water", 1, "blue", 1, 21, 0, 100);
const oxygen = new Element("Oxygen", 2, "lightblue", 0.001429, 21, -218.79, -182.96);
const stone = new Element("Stone", 3, "gray", 2.5, 21, 1000, 8000);
const oil = new Element("Oil", 4, "orange", 0.9, 21, -6, 300);

const elements = { powder, water, oxygen, stone, oil }; // Group elements into an object

export { elements, Element }; // Export the elements object and Element class