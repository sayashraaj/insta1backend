const express = require('express')
const app = express()
const ejs = require('ejs')

const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
// app.use(express.static(__dirname + '/public'));

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

const pages = ['enthuisallyouneed', 'insti_comics']

app.get('/', async (req,res)=>{
	// res.render('index')
	var pics = new Array(pages.length);
	for(var i=0;i<pages.length;i++){
	pics[i] = await client.getPhotosByUsername({ username: pages[i].toString(), first: 5 })
	}

	pics[0].user.edge_owner_to_timeline_media.edges.forEach((edge)=>{
		console.log(edge.node.shortcode)
		// https://www.instagram.com/p/{media-shortcode}/
		console.log(edge.node.taken_at_timestamp)
	})
	// console.log(pics[0]);
	res.render('index', {
	pics: pics
	} )
})

// app.post('/', (req,res)=>{

// 	let hrstart = process.hrtime()
// 	let result = compare(req.body.string1.toString(), req.body.string2.toString())
// 	let hrend = process.hrtime(hrstart)
// 	let exectime = `${hrend[0]} seconds, ${hrend[1] / 1000000} ms`

// 	res.render('result', {
// 	result: result.toString(),
// 	exectime: exectime,
// 	length1: req.body.string1.length,
// 	length2: req.body.string2.length
// 	} )
// })

app.listen(PORT)