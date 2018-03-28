exports.getBestWarehouses = (orders, warehouses) => {
    const bestWarehouses = [];

    warehouses.forEach(function (warehouse) {
        const inventory = warehouse.inventory;
        const shipItems = {};

        for (const item in orders) {
            if (orders[item] > 0 && inventory[item] > 0) {
                const amount = Math.min(orders[item], inventory[item]);
                shipItems[item] = amount;
                orders[item] -= amount;
            }
        }

        if (Object.keys(shipItems).length > 0) {
            const addedWarehouse = {};
            addedWarehouse[warehouse.name] = shipItems;
            bestWarehouses.push(addedWarehouse);
        }
    });

    // Is there any item in orders that the warehouses don't have enough amount?
    for (const item in orders) {
        if (orders[item] > 0) {
            return [];
        }
    }

    return bestWarehouses;
}