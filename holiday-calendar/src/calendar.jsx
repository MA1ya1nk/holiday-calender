   // src/Calendar.js
   import React, { useState, useEffect } from 'react';
   import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
   import axios from 'axios';

   const Calendar = () => {
       const [currentDate, setCurrentDate] = useState(new Date());
       const [holidays, setHolidays] = useState({});
       const [showAddButton, setShowAddButton] = useState(false);
       const [hoveredDate, setHoveredDate] = useState(null);

       useEffect(() => {
           fetchHolidays();
       }, []);

       const fetchHolidays = async () => {
           const response = await axios.get('http://localhost:8000/holidays');
           const holidayMap = {};
           response.data.forEach(holiday => {
               holidayMap[holiday.date] = holiday.name;
           });
           setHolidays(holidayMap);
       };

       const handleAddHoliday = async (date) => {
           const holidayName = prompt("Enter Holiday Name:");
           if (holidayName) {
               await axios.post('http://localhost:8000/holidays', { date: format(date, 'yyyy-MM-dd'), name: holidayName });
               fetchHolidays(); // Refresh holidays after adding
           }
       };

       const renderDays = () => {
           const start = startOfMonth(currentDate);
           const end = endOfMonth(currentDate);
           const days = eachDayOfInterval({ start, end });

           return days.map((day) => (
               <div 
                   key={day} 
                   className="border p-4 relative cursor-pointer hover:bg-gray-200"
                   onMouseEnter={() => { setShowAddButton(true); setHoveredDate(day); }}
                   onMouseLeave={() => { setShowAddButton(false); setHoveredDate(null); }}
               >
                   {day.getDate()}
                   {holidays[format(day, 'yyyy-MM-dd')] && (
                       <div className="text-sm text-red-600">{holidays[format(day, 'yyyy-MM-dd')]}</div>
                   )}
                   {showAddButton && hoveredDate && hoveredDate.toDateString() === day.toDateString() && (
                       <button 
                           className="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded" 
                           onClick={() => handleAddHoliday(day)}
                       >
                           Add Holiday
                       </button>
                   )}
               </div>
           ));
       };

       return (
           <div className="p-4">
               <h1 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h1>
               <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>Prev</button>
               <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>Next</button>
               <div className="grid grid-cols-7 gap-2 mt-4">
                   {renderDays()}
               </div>
           </div>
       );
   };

   export default Calendar;
   
