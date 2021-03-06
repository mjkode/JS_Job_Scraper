const cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');

var allJSONdata = [];

function saveData(){
		
	fs.writeFile('output.json', JSON.stringify(allJSONdata), function(err){
		console.log('saved');
	}); 
} 

request('https://charlottesville.craigslist.org/search/cpg?is_paid=all&search_distance=400&postal=22902',
    function(error, response, html) {
		if (!error && response.statusCode == 200) {
			//console.log('page loaded');
			
			var $ = cheerio.load(html);
			var allRecords = $('li.result-row'); 
			//console.log('all records: ' + allRecords);

			allRecords.each(function(index, element){
				if(index < 100){
					
					var title = $(element).find('a.hdrlnk').text();
					var hood = $(element).find('span.result-hood').text()
					var nearby = $(element).find('span.nearby').text();					
					var hood = hood.concat(nearby)
					var link = $(element).find('a.hdrlnk').attr('href');
					console.log(index, title, hood, link);
				
					var tempData = {
						title: title,
						hood: hood,
						link: link
					}
				
					allJSONdata.push(tempData);
				
				}else{
					saveData();
					return false;
				}	
			}
			)
		}
	}
);

fs.writeFile('output.json', allJSONdata, function(err){  
    console.log('successfully saved');
});