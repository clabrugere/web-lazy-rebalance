class Order {
    constructor(quantity, fee) {
        this.quantity = quantity;
        this.fee = fee;
    }
}

class Position {
    constructor(id, symbol, quantity, price, target_alloc) {
        this.id = id;
        this.symbol = symbol;
        this.quantity = quantity;
        this.price = price;
        this.target_alloc = target_alloc;
        this.balanced_alloc = 0;
        this.order = new Order(0, 0);
    }
    get value() {
        let value = this.quantity * this.price;
        return isNaN(value) ? 0.0 : value;
    }
}

export { Position };