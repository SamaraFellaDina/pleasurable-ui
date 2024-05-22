// importeren
import express from "express"
import fetchJson from './helpers/fetch-json.js'
const app = express()

// stel de mappen in
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// definieren van variabelen
const apiUrl = 'https://redpers.nl/wp-json/wp/v2/'
const apiPosts = apiUrl + 'posts'
const apiUsers = apiUrl + 'users'
const apiCategories = apiUrl + 'categories'

const apiShares = 'https://fdnd-agency.directus.app/items/redpers_shares'

// Routes aanroepen
app.get('/', (request, response) => {
    fetchJson(apiPosts + "?per_page=4").then((articleData) => {
      fetchJson(apiShares).then((shareData) => {
        articleData.map((articles) => {
          Object.assign(articles, {
            shares: shareData.data.find(({ slug }) => slug == articles.slug)?.shares || 0
          })
        })
        response.render('home', {articles: articleData})
    })
  })  
})

app.get('/artikel/:slug', function (request, response) {
  Promise.all([
   fetchJson(apiPosts + '?slug=' + request.params.slug),
   fetchJson(apiShares + "?filter[slug][_eq]=" + request.params.slug)
  ]).then(([apiData, shareData ]) => {
      response.render("article.ejs", {
        article : apiData[0],
        share : shareData.data[0]?.shares || 0
    });
  })
})

app.post('/article/:slug', (request, response) => {
  fetchJson(apiShares + "?filter[slug][_eq]=" + request.params.slug).then(({ data }) => {
    const directData = data.length > 0 ? data[0] : null;
    const method = directData ? 'PATCH' : 'POST';
    const url = directData ? apiShares + '/' + directData.id : apiShares;
    
    const body = JSON.stringify({
      slug: request.params.slug,
      shares: directData ? directData.shares + 1 : 1,
      likes: directData ? directData.likes : 0,
    });

    fetchJson(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: body,
    }).then((result) => {
      // Handle the result if needed
    }).catch((error) => {
      console.error('Error:', error);
      response.status(500).send('An error occurred');
    });
  }).catch((error) => {
    console.error('Error:', error);
    response.status(500).send('An error occurred');
  });

  response.redirect(301, '/artikel/' + request.params.slug);
});



// Een port aanroepen om alles op te hosten
app.set('port', process.env.PORT || 8090)
app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})