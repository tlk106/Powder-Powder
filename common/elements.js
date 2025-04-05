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
}

const powder = new Element("Powder", "powder", 0, "yellow");

export { powder };