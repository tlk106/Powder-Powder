class Element {
  constructor(name, type, id, color) {
    if (typeof name !== "string" || typeof type !== "string" || typeof id !== "number" || typeof color !== "string") {
      throw new Error("Invalid parameters");
    }
    this.name = name;
    this.type = type;
    this.id = id;
    this.color = color;
  }

  // Check if the element is of a specific type
  isType(type) {
    return this.type === type;
  }
}

const powder = new Element("Powder", "powder", 0, "yellow");
const water = new Element("Water", "liquid", 1, "blue");
const oxygen = new Element("Oxygen", "gas", 2, "lightblue");
const stone = new Element("Stone", "solid", 3, "gray");

const elements = { powder, water, oxygen }; // Group elements into an object

export { elements, Element }; // Export the elements object and Element class