console.log('Hier komt je server voor Sprint 10.')

console.log('Gebruik uit Sprint 9 alleen de code die je mee wilt nemen.')

console.log('Zet \'m op!')
// imports express en liquid
import express from 'express'
import { Liquid } from 'liquidjs';

// opzetten express
const app = express()
const engine = new Liquid();

app.use(express.static('public'))

app.engine('liquid', engine.express());

app.set('views', './views')

app.set('port', process.env.PORT || 8000)

// get routes
app.get('/', async function (request, response) {
    response.render('index.liquid')
})

app.get('/schrijfopdracht', async function (request, response) {
    const personResponse = await fetch ('https://fdnd-agency.directus.app/items/dropandheal_task')
    
    const personResponseJSON = await personResponse.json()
  
    response.render('schrijfopdracht.liquid', { persons: personResponseJSON.data })
  })
  
  app.get('/community-drop', async function (request, response) {
    console.log("GET community drops")
    const messagesAPI = await fetch ('https://fdnd-agency.directus.app/items/dropandheal_messages?limit=-1&sort=-date_created')
    
    const messagesJSON = await messagesAPI.json()
  
    response.render('community-drop.liquid', { messages: messagesJSON.data })
  })
  
  app.get('/all-drops', async function (request, response) {
  
    const messagesAPI = await fetch ('https://fdnd-agency.directus.app/items/dropandheal_messages?limit=-1&sort=-date_created')
    
    const messagesJSON = await messagesAPI.json()
  
    response.render('all-drops.liquid', { messages: messagesJSON.data })
  })

//post routes
app.post('/messages/', async function (request, response) {
       const postResponse = await fetch('https://fdnd-agency.directus.app/items/dropandheal_messages?limit=-1', {
      method: 'POST',
      body: JSON.stringify({
        from: request.body.from,
        text: request.body.text
      }),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    });
    console.log(postResponse);
   // Stuur gebruikers naar overzicht drops pagina
    response.redirect(303, `/all-drops`);
  })

//use routes
app.use((req, res, next) => {
    res.status(404).render("error.liquid")
    })
  
//start express en gebruik deze poort
app.listen(app.get('port'), function () {
    // Toon een bericht in de console
    console.log(`Daarna kun je via http://localhost:${app.get('port')}`)
  })
