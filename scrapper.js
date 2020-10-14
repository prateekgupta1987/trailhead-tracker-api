var http = require('http')
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

http.createServer(function (req,res){
    getPage(req,res);
}).listen(process.env.PORT || 8080)


async function getPage(req,res){  
var query = require('url').parse(req.url,true).query;
const url = "https://trailblazer.me/id/"+query.id;

  const browser = await puppeteer.launch({
    args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
  ],
  });
  const page = await browser.newPage();
  await page.goto(url, {waitUntil: 'networkidle0'});
  const html = await page.content(); // serialized HTML of page DOM.
  await browser.close();
  
  const $ = cheerio.load(html);
  var EarnedBadgeTotal='';
  var EarnedPointTotal='';
  var CompletedTrailTotal='';
  $('.tds-tally__count.tds-tally__count_success').each(function(i, elm) {
    if(i==0)EarnedBadgeTotal += $(this).text();
    if(i==1)EarnedPointTotal += $(this).text();
    if(i==2)CompletedTrailTotal += $(this).text();

  //  console.log($(this).text()) // for testing do text() 
});


res.setHeader('Content-Type', 'application/json');
res.end(JSON.stringify({ EarnedBadgeTotal,EarnedPointTotal,CompletedTrailTotal }));

};


