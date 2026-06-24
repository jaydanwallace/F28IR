const express = require("express");
const cors = require("cors");
const sequelize = require("./Database");
const Account = require("./Account");

const app = express();
app.use(cors(), express.json());

app.get("/accounts", async (req, res) => {
  res.json(await Account.findAll());
});

app.post("/transfer", async (req, res) => {
  const { fromId, toId, amount } = req.body;
  const amt = parseFloat(amount);
  const t = await sequelize.transaction();
  try 
  {
    const from = await Account.findByPk(fromId, { transaction: t });
    const to = await Account.findByPk(toId, { transaction: t });

    if (!from || !to) throw new Error("Account not found.");
    if (parseFloat(from.balance) < amt) throw new Error("Insufficient funds.");

    from.balance = parseFloat(from.balance) - amt;
    to.balance = parseFloat(to.balance) + amt;

    await from.save({ transaction: t });
    await to.save({ transaction: t });
    await t.commit();
    
    res.json({ from, to });
  } 
  catch (err) 
  {
    await t.rollback();
    res.status(400).json({ error: err.message });
  }
});

sequelize.authenticate()
  .then(() => app.listen(3001))
  .catch(console.error);