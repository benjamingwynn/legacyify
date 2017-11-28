"use strict"

const puppeteer = require('puppeteer')
const Hapi = require('hapi')
const jsdom = require('jsdom')

const ROOT_URL = "https://github.com/" // example url

async function generatePage (url) {
	try {
		const browser = await puppeteer.launch()
		const page = await browser.newPage()

		await page.goto(ROOT_URL + url)

		const bgColour = await page.evaluate(() => {
			return window.getComputedStyle(document.body).backgroundColor
		})

		await page.setViewport({width: 1280, height: 720}) // example width

		// build a dom
		const dom = new jsdom.JSDOM()
		const document = dom.window.document

		// get all the hyperlinks of the page

		const links = await page.evaluate(() => {
			const arr = []

			document.querySelectorAll("a").forEach((a) => {
				const bounds = a.getBoundingClientRect()

				arr.push({
					"left": bounds.left,
					"top": bounds.top,
					"right": bounds.right,
					"bottom": bounds.bottom,
					"href": a.href,
				})
			})

			return arr
		})

		// add a map
		const map = document.createElement("map")
		map.name = "primary"

		// add an area for each link
		links.forEach((link) => {
			const area = document.createElement("area")

			area.shape = "rect"
			area.href = link.href
			area.coords = `${link.left}, ${link.top}, ${link.right}, ${link.bottom}`

			map.appendChild(area)
		})

		// screenshot the page
		const buffer = await page.screenshot({fullPage: true, type: "png", omitBackground: true})

		// add the screenshot to the dom
		const img = document.createElement("img")
		img.src = `data:image/png;base64,${buffer.toString("base64")}`
		img.style.border = "none"
		img.style.borderStyle = "none"
		img.style.borderColor = "transparent"
		img.style.borderWidth = "0"
		img.setAttribute("usemap", "#primary")

		// add to center
		const center = document.createElement("center")

		center.appendChild(map)
		center.appendChild(img)

		document.body.appendChild(center)

		// body css
		document.body.style.margin = "0px"
		document.body.style.backgroundColor = bgColour

		await browser.close()

		return dom.serialize()
	} catch (ex) {
		console.error(ex)
		return "<h1>Failed to parse page.</h1><p>legacyify</p>"
	}
}

const server = new Hapi.Server()
server.connection({ port: 3000, host: 'localhost' })

server.start((err) => {
	if (err) throw err

	console.log(`Server running at: ${server.info.uri}`)
})

server.route({
	method: 'GET',
	path: '/',
	handler: async function (request, reply) {
		console.log(request.headers)

		reply(await generatePage(""))
	}
});
