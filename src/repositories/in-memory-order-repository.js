export class InMemoryOrderRepository {
  constructor(seed = []) {
    this.orders = new Map(seed.map((order) => [order.id, structuredClone(order)]));
  }

  async list() {
    return [...this.orders.values()].map((order) => structuredClone(order));
  }

  async findById(id) {
    const order = this.orders.get(id);
    return order ? structuredClone(order) : null;
  }

  async save(order) {
    this.orders.set(order.id, structuredClone(order));
    return structuredClone(order);
  }
}
