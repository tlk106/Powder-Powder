class Element {
  constructor(name, type, id) {
    if (typeof name !== 'string' || typeof type !== 'string' || typeof id !== 'number') {
      throw new Error('Invalid parameters');
    }
    this.name = name;
    this.type = type;
    this.id = id;
  }
}

const powder = new Element('Powder', 'powder', 0);

export { powder };