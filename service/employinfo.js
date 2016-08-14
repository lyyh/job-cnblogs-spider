let http = require('http'),
	url = require('url'),
	cheerio = require('cheerio'),
	superagent = require('superagent');

//招聘信息收集
exports.employInfo = ($,infoArray) => {
	let companyName = '', //公司名称
		address = '', //工作地点
		timeLimit = '', //工作期限
		position = '', //招聘职位
		degree = '', //学历要求
		welfare = '无福利待遇', //福利待遇
		salaryRange = '', //工资范围
		aveSalary = 0, //平均工资
		peopleNum = 0, //招聘人数
		startDate = '', //发布日期
		endDate = '', //截止日期
		infoSource = '' //信息来自
		infoObj = {}; //招聘信息对象

	//公司名称
	companyName = $('#enterprise_intro_block h3 a').text();

	//工作地点
	address = $('.offer_detail li').eq(0).text().split('：')[1];

	//工作期限
	timeLimit = $('.offer_detail li').eq(1).text().split('：')[1];

	//学历要求
	degree = $('.offer_detail li').eq(2).text().split('：')[1];

	//职位
	position = $('.offer_detail li').eq(3).text().split('：')[1];

	//工资范围
	salaryRange = $('.offer_detail li').eq(4).text().split('：')[1]

	//平均工资
	let salary = $('.offer_detail li').eq(4).text();
	let salaryArr = salary.match(/\d+/g);
	
	if(salaryArr){ //工资给出详细范围
		let minSalary = parseInt(salaryArr[0]); 
		let maxSalary = parseInt(salaryArr[1]);
		aveSalary = parseInt((maxSalary + minSalary) / 2);
		//过滤不合理的平均工资
		aveSalary = aveSalary < 100 || aveSalary > 100000?0:aveSalary; 
	}else{ //工资面议情况
		aveSalary = 0
	}

	if($('.offer_detail li').length == 9){ //无福利待遇
		//招聘人数
		peopleNum = $('.offer_detail li').eq(5).text().split('：')[1];
		//发布日期
		startDate = $('.offer_detail li').eq(6).text().split('：')[1];
		//截止日期
		endDate = $('.offer_detail li').eq(7).text().split('：')[1];
		//信息来自
		infoSource = $('.offer_detail li').eq(8).text().split('：')[1]

	}else if($('.offer_detail li').length == 10){ //有福利待遇
		//福利待遇
		welfare = $('.offer_detail li').eq(5).text().split('：')[1];
		//招聘人数
		peopleNum = $('.offer_detail li').eq(6).text().split('：')[1];
		//发布日期
		startDate = $('.offer_detail li').eq(7).text().split('：')[1];
		//截止日期
		endDate = $('.offer_detail li').eq(8).text().split('：')[1];
		//信息来自
		infoSource = $('.offer_detail li').eq(9).text().split('：')[1]
	}

	infoObj = {
		companyName: companyName,
		address: address,
		timeLimit: timeLimit,
		position: position,
		degree: degree,
		salaryRange: salaryRange,
		aveSalary: aveSalary,
		welfare: welfare,
		peopleNum: peopleNum,
		startDate: startDate,
		endDate: endDate,
		infoSource: infoSource
	}

	infoArray.push(infoObj);
}




