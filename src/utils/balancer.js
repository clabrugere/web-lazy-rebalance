// defined as the difference between the current position's value and the 
// target value given the cash available and target allocation
function allocation_error (position, portfolio_value) {
    return position.value - (position.target_alloc / 100) * portfolio_value;
}

function balance (positions, cash, fee_func= () => { return 0; }) {
    let cash_left = cash;
    let portfolio_value = positions.reduce((a, b) => a + b.value, 0) + (+cash_left || 0);
    
    console.log(portfolio_value);

    // sort positons by allocation error
    let positions_sorted = positions.sort((a, b) => {
        return allocation_error(a, portfolio_value) - allocation_error(b, portfolio_value);
    });

    console.log(positions_sorted);

    // iterate positions starting with the one having the biggest allocation error to fill
    for (let i = 0; i < positions_sorted.length; i++) {
        let position = positions_sorted[i];
        
        console.log(position.symbol);
        console.log(allocation_error(position, portfolio_value));

        // if the price is just too high, nothing can be bought anyway
        if ( position.price > cash_left ) { continue; }

        // given the cash available we can at most buy this amount
        let max_quantity = Math.floor(cash_left / position.price);
        let optimal_quantity = Math.floor(Math.abs(allocation_error(position, portfolio_value)) / position.price);
        let order_quantity = Math.min(max_quantity, optimal_quantity)
        let fee = fee_func(order_quantity * position.price);

        // but because of the fees it can still be too much
        if ( order_quantity * position.price + fee > cash_left ) {
            order_quantity--;
            fee = fee_func(order_quantity * position.price);
        }
    
        cash_left -= order_quantity * position.price + fee;
        position.order.quantity = order_quantity;
        position.order.fee = fee;

    }
    // compute resulting allocation
    positions_sorted.forEach(p => {
        p.balanced_alloc = (p.quantity + p.order.quantity) * p.price / portfolio_value 
    })

    // reorder array to match the initial one
    positions_sorted = positions_sorted.sort((a, b) => {
        return a.id - b.id;
    });

    console.log(positions_sorted);
    console.log(cash_left);

    return {
        "positions": positions_sorted, 
        "cash_left": cash_left
    }
}

export { balance }