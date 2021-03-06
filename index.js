//	IMPORT
const express = require('express')
const app = express()
const ejs = require('ejs')
const fetch = require('node-fetch');
//read PROCESS.ENV var
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.use(express.static(__dirname + '/public'));

//	END OF IMPORT
//GLOBAL VARS
var pics = [];
var shortcode = [];
var timestamp = [];
var embedcode = [];
var latesthour= new Date();
//END OF GLOBAL VARS


//INSTAAPI INITIALIZE
const Instagram = require('instagram-web-api')

const username = process.env.USERNAME
const password = process.env.PASSWORD
const appid = process.env.APPID
const appsecret = process.env.APPSECRET

const client = new Instagram({ username, password })

;(async () => {
  await client.login()
  const profile = await client.getProfile()

  // console.log(profile)
})()
//END OF INSTAAPI INITIALIZE

//LIST OF PAGES TO SCAN
const pages = ['enthuisallyouneed', 'insti_comics', 'insti_memers']

app.get('/', async (req,res)=>{

	//minimise calls for hourDiff<1 && minutesDiff<10
	var date = new Date();
	if((date.getHours()-latesthour.getHours()<1) && (date.getMinutes()-latesthour.getMinutes()<10) && embedcode.length!=0 && timestamp.length!=0){
		res.json({embedcode:embedcode, timestamp:timestamp})
	}

	else{
	try {

		//updating last page call time
		latesthour= new Date();
		//
		
		pics = [];
		shortcode = [];
		timestamp = [];
		embedcode = [];

		for(var i=0;i<pages.length;i++){
		pics[i] = await client.getPhotosByUsername({ username: pages[i].toString(), first: 5})

		pics[i].user.edge_owner_to_timeline_media.edges.forEach((edge)=>{
			// console.log(edge.node.shortcode)
			shortcode.push(edge.node.shortcode)
			// https://www.instagram.com/p/{media-shortcode}/
			// console.log(edge.node.taken_at_timestamp)
			timestamp.push(edge.node.taken_at_timestamp)
		})
	}

		for(var i=0;i<shortcode.length;i++)
		{
		var posturl = "https://www.instagram.com/p/"+shortcode[i]+"/"
		var urll = "https://graph.facebook.com/instagram_oembed?url="+posturl+"&access_token="+appid+"|"+appsecret;
		// fetch(urll).then(res => res.json()).then(json => embedcode.push(json.html))
		// fetch(urll).then(res => {console.log(res); res.json()}).then(json => {embedcode.push(json)})

		try{
			var fetchy = await fetch(urll);
			var jason = await fetchy.json();
			// console.log(jason.html)
			embedcode.push(jason.html)
		}
		catch(e){
			// console.log(e)
			res.status(500).send({ error: "boohoo :(" });
		}
		}

		// console.log(embedcode.length)

		//return ejs
		res.render('index',{embedcode:embedcode})
		//return json
		// res.json({embedcode:embedcode, timestamp:timestamp})
	}
	catch(e){
		// console.log(e)
		res.status(500).send({ error: "boo:(" });
	}

	} //else end
})

app.listen(PORT)