class Element {
  constructor(name, type, id, color, mass) { // Added mass as a parameter
    if (
      typeof name !== "string" ||
      typeof type !== "string" ||
      typeof id !== "number" ||
      typeof color !== "string" ||
      typeof mass !== "number" // Check for 'mass'
    ) {
      throw new Error("Invalid parameters");
    }

    this.name = name;
    this.type = type;
    this.id = id;
    this.color = color;
    this.mass = mass; // Should be the real-life object mass in grams per cm^3
  }

  // Check if the element is of a specific type
  isType(type) {
    return this.type === type;
  }
}

const powder = new Element("Powder", "powder", 0, "yellow", 1);
const water = new Element("Water", "liquid", 1, "blue", 1);
const oxygen = new Element("Oxygen", "gas", 2, "lightblue", 0.001429);
const stone = new Element("Stone", "solid", 3, "gray", 2.5);

const elements = { powder, water, oxygen, stone }; // Group elements into an object

export { elements, Element }; // Export the elements object and Element class