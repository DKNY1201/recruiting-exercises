const expect = require('chai').expect;
const inventoryAllocator = require("../app/inventory-allocator");

describe("inventory-allocator.test.js", function () {
    it("should allocate for an order with one item and one warehouse - enough items", function () {
        const warehouse = inventoryAllocator.getBestWarehouses({apple: 1}, [{name: 'owd', inventory: {apple: 1}}]);
        expect(warehouse).to.deep.equal([{owd: {apple: 1}}]);
    });

    it("should split an item across warehouses in an order", function () {
        const warehouse = inventoryAllocator.getBestWarehouses({apple: 10},
            [{name: 'owd', inventory: {apple: 5}}, {name: 'dm', inventory: {apple: 5}}]);
        expect(warehouse).to.deep.equal([{owd: {apple: 5}}, {dm: {apple: 5}}]);
    });

    it("should split items across warehouses in an order", function () {
        const warehouse = inventoryAllocator.getBestWarehouses({apple: 5, banana: 5, orange: 5},
            [{name: 'owd', inventory: {apple: 5, orange: 10}}, {name: 'dm', inventory: {banana: 5, orange: 10}}]);
        expect(warehouse).to.deep.equal([{owd: {apple: 5, orange: 5}}, {dm: {banana: 5}}]);
    });

    it("should split items across warehouses with one item get from all inventories", function () {
        const warehouse = inventoryAllocator.getBestWarehouses({apple: 2, banana: 2, orange: 20},
            [{name: 'owd', inventory: {apple: 5, orange: 10}}, {name: 'dm', inventory: {banana: 5, orange: 10}}]);
        expect(warehouse).to.deep.equal([{owd: {apple: 2, orange: 10}}, {dm: {banana: 2, orange: 10}}]);
    });

    it("should split items across warehouses with one item get from some inventories", function () {
        const warehouse = inventoryAllocator.getBestWarehouses({apple: 2, banana: 2, orange: 20},
            [{name: 'owd', inventory: {apple: 5, orange: 10}},
                {name: 'dir', inventory: {apple: 5, orange: 10}},
                {name: 'dm', inventory: {banana: 5, orange: 10}}]);
        expect(warehouse).to.deep.equal([{owd: {apple: 2, orange: 10}}, {dir: {orange: 10}}, {dm: {banana: 2}}]);
    });

    it("should split an item across warehouses with multiple items in order and one item get from multiple inventories", function () {
        const warehouse = inventoryAllocator.getBestWarehouses({apple: 2, banana: 2, orange: 21},
            [{name: 'owd', inventory: {apple: 5, orange: 10}},
                {name: 'dir', inventory: {apple: 5, orange: 10}},
                {name: 'dm', inventory: {banana: 5, orange: 10}}]);
        expect(warehouse).to.deep.equal([{owd: {apple: 2, orange: 10}}, {dir: {orange: 10}}, {dm: {banana: 2, orange: 1}}]);
    });

    it("should not add corresponding inventory to warehouse when ordered item has amount is 0", function () {
        const warehouse = inventoryAllocator.getBestWarehouses({apple: 0, banana: 2, orange: 21},
            [{name: 'owd', inventory: {apple: 5, orange: 10}},
                {name: 'dir', inventory: {apple: 5, orange: 10}},
                {name: 'dm', inventory: {banana: 5, orange: 10}}]);
        expect(warehouse).to.deep.equal([{owd: {orange: 10}}, {dir: {orange: 10}}, {dm: {banana: 2, orange: 1}}]);
    });

    it("should not allocate for an order with one item and one warehouse - not enough items", function () {
        const warehouse = inventoryAllocator.getBestWarehouses({apple: 1}, [{name: 'owd', inventory: {apple: 0}}]);
        expect(warehouse).to.deep.equal([]);
    });

    it("should not allocate for an order that the warehouses leak one or more items", function () {
        const warehouse = inventoryAllocator.getBestWarehouses({apple: 5, orange: 2}, [{name: 'owd', inventory: {apple: 3}},
            {name: 'dm', inventory: {apple: 2}}]);
        expect(warehouse).to.deep.equal([]);
    });

    it("should not allocate if all items in orders are zero", function () {
        const warehouse = inventoryAllocator.getBestWarehouses({apple: 0, banana: 0, orange: 0},
            [{name: 'owd', inventory: {apple: 5, orange: 10}},
                {name: 'dir', inventory: {apple: 5, orange: 10}},
                {name: 'dm', inventory: {banana: 5, orange: 10}}]);
        expect(warehouse).to.deep.equal([]);
    });

});