   // server.js
   const express = require('express');
   const mongoose = require('mongoose');
   const cors = require('cors');

   const app = express();
   app.use(cors());
   app.use(express.json());

   mongoose.connect('mongodb://localhost:27017/holidaydb');

   const holidaySchema = new mongoose.Schema({
       date: String,
       name: String,
   });

   const Holiday = mongoose.model('Holiday', holidaySchema);

   app.get('/', async (req, res) => {
    res.redirect('http://localhost:8000/holidays');
   });

   app.get('/holidays', async (req, res) => {
       const holidays = await Holiday.find();
       res.json(holidays);
   });

   app.post('/holidays', async (req, res) => {
       const holiday = new Holiday(req.body);
       await holiday.save();
       res.status(201).json(holiday);
   });

   app.delete('/holidays/:date', async (req, res) => {
       await Holiday.deleteOne({ date: req.params.date });
       res.status(204).send();
   });

   app.listen(8000, () => {
       console.log('Server is running on http://localhost:8000');
   });
   
