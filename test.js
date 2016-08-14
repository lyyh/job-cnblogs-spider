let url = 'http://job.cnblogs.com/offer/52812/';
let cheerio = require('cheerio');
// let id = url.split('/')[4]
// console.log(url.split('/'))
// console.log(id)
	let $ = cheerio.load('<h1 class="title content"><span>aaa</span><span><a>ccc</a></span>中级Java开发工程师</h1>')


	let text = $('.title.content').text()
	let spanText = $('.title span').eq(1).text();
	console.log(text.split(spanText)[1]);



	// let salary = '工资范围：5500元 ～ 8000元';
	// let minSalary = parseInt(salary.match(/\d+/g)[0]); 
	// let maxSalary = parseInt(salary.match(/\d+/g)[1]);

	// console.log((maxSalary + minSalary) / 2)


	// let sal = '面议';
	// console.log("sdf"+sal.match(/\d+/g))


	// let degree = '学历要求：大专';
	// console.log(degree.split('：')[1])


	// let a = '5000元 ～ 10000元';
	// console.log(/\d/g.test())
	// console.log(a.split('～')[1])
	// let year = '';
	// if((year = a.match(/\d/g)[0]))console.log(1)
	// 	else console.log(2)

var date = new Date();
console.log(date.toLocaleString())