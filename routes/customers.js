const auth = require("../middleware/auth");
const router = require("express").Router();
const { Customer, validateCustomer } = require("../models/customer");

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const customer = await Customer.findById(id);
  if (!customer)
    return res.status(404).send(`Can not found a customer with id ${id}`);

  res.send(customer);
});

router.post("/", auth, async (req, res) => {
  const customerData = req.body;
  const { error } = validateCustomer(customerData);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer(customerData);
  await customer.save();
  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  const customerData = req.body;
  const { error } = validateCustomer(customerData);
  if (error) return res.status(400).send(error.details[0].message);

  const id = req.params.id;
  const customer = await Customer.findByIdAndUpdate(id, customerData, {
    new: true
  });
  if (!customer)
    return res.status(404).send(`Can not found a customer with id ${id}`);

  res.send(customer);
});

router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const customer = await Customer.findByIdAndRemove(id);
  if (!customer)
    return res.status(404).send(`Can not found a customer with id ${id}`);

  res.send(customer);
});

module.exports = router;
