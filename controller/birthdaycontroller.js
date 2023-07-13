var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var moment = require('moment');

mongoose.connect('mongodb+srv://tejas123:tejas123@cluster0.zm1qhbj.mongodb.net/?retryWrites=true&w=majority');


var BdaySchema = mongoose.Schema({
    name: {type: String},
    birthday: {type: Date}
});



var BirthDay = mongoose.model('Birthday',BdaySchema);
var urlencodeparser = bodyparser.urlencoded({ extended:true});

module.exports = function(app){

               //   adding  a person's name and birthday in the database. 
    app.post('/add', urlencodeparser, async function(req, res){
        try{ 
        var firstName = req.body.name;
        var BirthDate = moment.utc(req.body.birthday, 'DD-MM-YYYY', true);        
           
        var AddBday = BirthDay({name:firstName,birthday:BirthDate.toDate()});
    
        AddBday.save();
        res.set('Content-Type', 'application/json');
        res.status(201).json({message:'Birthday Added Successfully'});
    
         }catch(err){
          res.set('Content-Type', 'application/json');
            res.status(500).json({ error:'Error in adding Birthday'});
        }
    });

                    // fetching of a specific person's birthdate
    app.get('/person/:name', async (req, res) => {
        const name = req.params.name;
        const person = await BirthDay.findOne({name});
        if (!person) {
        res.status(404).json({error: 'Person is not found in the database'});
        } else {
        res.status(200).json({name: person.name, birthday: person.birthday});
        }
        });



          // Delete a person's entry (name + birthday date) in the database
    app.delete('/person/delete/:name', async (req, res) => {
        const name = req.params.name;
        const person = await BirthDay.findOneAndDelete({name});
        if (!person) {
          res.status(404).json({error: 'Person not found'});
        } else {
          res.status(200).json({message: 'Birthday deleted'});
        }
         }) ;
           
//             Should allow fetching of the closest birthday date and the corresponding person's name
        app.get('/birthday/nearest', async function(req, res) {
            const today = moment().startOf('day');
            const EveryBdays = await BirthDay.find();
            let nearestBday = null;
            let Diff = Infinity;
          
            for (const bday of EveryBdays) {
              const cday = moment(bday.birthday);
              cday.year(today.year());
          
              if (cday.isBefore(today)) {
                cday.add(1, 'year');
              }
          
              const adiff = Math.abs(cday.diff(today, 'days'));
          
              if (adiff < Diff) {
                Diff = adiff;
                nearestBday = bday;
              }
            }
          
            if (!nearestBday) {
              res.status(404).json({ error: 'No closest birthday found' });
            } else {
              res.status(200).json({ name: nearestBday.name, birthday: nearestBday.birthday });
            }
          });
          
      
}