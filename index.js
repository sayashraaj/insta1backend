//	IMPORT
const express = require('express')
const app = express()
const ejs = require('ejs')

const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
// app.use(express.static(__dirname + '/public'));

//	END OF IMPORT

//INSTAAPI INITIALIZE
const Instagram = require('instagram-web-api')
// const { username, password } = process.env
const username = "anakin123sand"
const password = "anakinsand123"

const client = new Instagram({ username, password })

;(async () => {
  await client.login()
  const profile = await client.getProfile()

  // console.log(profile)
})()
//END OF INSTAAPI INITIALIZE

//LIST OF PAGES
const pages = ['enthuisallyouneed', 'insti_comics']

app.get('/', async (req,res)=>{
	var pics = new Array(pages.length);
	for(var i=0;i<pages.length;i++){
	pics[i] = await client.getPhotosByUsername({ username: pages[i].toString(), first: 5 })
	}

	pics[0].user.edge_owner_to_timeline_media.edges.forEach((edge)=>{
		console.log(edge.node.shortcode)
		// https://www.instagram.com/p/{media-shortcode}/
		console.log(edge.node.taken_at_timestamp)
	})
	res.render('index', {
	pics: pics
	} )
})

app.listen(PORT)