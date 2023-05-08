process.env.Node_ENV = "test";
const request = require("supertest");
const app = require("./app");
const items = require("./fakeDb");


let nutella  = {name:"Nutella", price: 4.99};
let oranges  = {name:"Oranges", price: 3.99};

beforeEach(function(){
    items.push(nutella);
    items.push(oranges);
});

afterEach(function(){
    items.length=0;
});

// Getting all Items
describe("GET /items", ()=>{
    test("Get all items", async ()=>{
       const res = await request(app).get(`/items/${nutella.name}`);
       expect(res.statusCode).toBe(200);
       expect(res.body).toEqual({item:nutella})
    })
})


// GET item
describe("GET /items/:name", ()=>{
    test("Get item by name", async ()=>{
       const res = await request(app).get(`/items/ice`);
       expect(res.statusCode).toBe(404);
       
    })
    test("Responds with 404 for invalid item", async ()=>{
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({items:[nutella,oranges]})
     })
})

// POST item
describe("POST /items",()=>{
    test("Creating an item", async()=>{
        const res = await request(app).post("/items").send({name:"Soup", price: 6.99});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({item: {name:"Soup", price: 6.99}})
    })
})


//PATCH Item
describe("PATCH /items/:name", ()=>{
    test("Updating an items name", async()=>{
        const res = await request(app).patch(`/items/${nutella.name}`).send({name:"Chocolate Nutella"});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({item:{name:"Chocolate Nutella", price:4.99}})
    });
    test("Responds with 404 for invalid name.", async ()=> {
        const res = await request(app).patch('/items/Roses').send({name:"Monster"});
        expect(res.statusCode).toBe(404);
    })
})


//DELETE Item
describe("DELETE /item/:name", ()=>{
    test("Deleting an Item", async()=>{
        const res = await request(app).delete(`/items/${nutella.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({message:'Deleted'})
    })
    test("Responding with 404 for deleting an invalid item.", async()=>{
        const res = await request(app).delete(`/items/basketball`);
        expect(res.statusCode).toBe(404);

    })
})
