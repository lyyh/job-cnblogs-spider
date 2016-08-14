//岗位
var pos = {
	'.NET程序员': {
		num: 0, //招聘信息数量
		peopleNum: 0, //招聘人数
		someNum: 0, //若干数量
		salaryNum: 0,
		aveSalary: 0
	},
	'PHP程序员': {
		num: 0, //招聘信息数量
		peopleNum: 0, //招聘人数
		someNum: 0, //若干数量
		salaryNum: 0,
		aveSalary: 0
	},
	'Java程序员': {
		num: 0, //招聘信息数量
		peopleNum: 0, //招聘人数
		someNum: 0, //若干数量
		salaryNum: 0,
		aveSalary: 0
	},
	'C++程序员': {
		num: 0, //招聘信息数量
		peopleNum: 0, //招聘人数
		someNum: 0, //若干数量
		salaryNum: 0,
		aveSalary: 0
	},
	'JavaScript程序员': {
		num: 0, //招聘信息数量
		peopleNum: 0, //招聘人数
		someNum: 0, //若干数量
		salaryNum: 0,
		aveSalary: 0
	},
	'Flash程序员': {
		num: 0, //招聘信息数量
		peopleNum: 0, //招聘人数
		someNum: 0, //若干数量
		salaryNum: 0,
		aveSalary: 0
	},
	'Delphi程序员': {
		num: 0, //招聘信息数量
		peopleNum: 0, //招聘人数
		someNum: 0, //若干数量
		salaryNum: 0,
		aveSalary: 0
	},
	'前端开发工程师': {
		num: 0, //招聘信息数量
		peopleNum: 0, //招聘人数
		someNum: 0, //若干数量
		salaryNum: 0,
		aveSalary: 0
	},
	'项目经理': {
		num: 0, //招聘信息数量
		peopleNum: 0, //招聘人数
		someNum: 0, //若干数量
		salaryNum: 0,
		aveSalary: 0
	},
	'技术主管': {
		num: 0, //招聘信息数量
		peopleNum: 0, //招聘人数
		someNum: 0, //若干数量
		salaryNum: 0,
		aveSalary: 0
	},
	'架构师': {
		num: 0, //招聘信息数量
		peopleNum: 0, //招聘人数
		someNum: 0, //若干数量
		salaryNum: 0,
		aveSalary: 0
	},
	'技术总监': {
		num: 0, //招聘信息数量
		peopleNum: 0, //招聘人数
		someNum: 0, //若干数量
		salaryNum: 0,
		aveSalary: 0
	},
	'测试工程师': {
		num: 0, //招聘信息数量
		peopleNum: 0, //招聘人数
		someNum: 0, //若干数量
		salaryNum: 0,
		aveSalary: 0
	},
	'系统管理员': {
		num: 0, //招聘信息数量
		peopleNum: 0, //招聘人数
		someNum: 0, //若干数量
		salaryNum: 0,
		aveSalary: 0
	},
	'数据库管理员': {
		num: 0, //招聘信息数量
		peopleNum: 0, //招聘人数
		someNum: 0, //若干数量
		salaryNum: 0,
		aveSalary: 0
	},
	'售前工程师': {
		num: 0, //招聘信息数量
		peopleNum: 0, //招聘人数
		someNum: 0, //若干数量
		salaryNum: 0,
		aveSalary: 0
	},
	'移动开发工程师': {
		num: 0, //招聘信息数量
		peopleNum: 0, //招聘人数
		someNum: 0, //若干数量
		salaryNum: 0,
		aveSalary: 0
	},
	'其他': {
		num: 0, //招聘信息数量
		peopleNum: 0, //招聘人数
		someNum: 0, //若干数量
		salaryNum: 0,
		aveSalary: 0
	}
}


var data = {
	position: pos, //岗位信息
	allAveSalary: 0, //所有岗位平均工资
	posScale: { //招聘岗位比例
		'.NET程序员': 0,
		'PHP程序员': 0,
		'Java程序员': 0,
		'C++程序员': 0,
		'JavaScript程序员': 0,
		'Flash程序员': 0,
		'Delphi程序员': 0,
		'前端开发工程师': 0,
		'项目经理': 0,
		'技术主管': 0,
		'架构师': 0,
		'技术总监': 0,
		'测试工程师': 0,
		'系统管理员': 0,
		'数据库管理员': 0,
		'售前工程师': 0,
		'移动开发工程师': 0,
		'其他': 0
	},
	degScale: {
		'本科': 0,
		'大专': 0,
		'无学历要求': 0
	},
	timelimit: {
		'2年以下': 0, //不包括2年
		'2年~5年': 0, 
		'5年以上': 0 //不包括5年
	},
	salaryScale: {
		'10k以下': 0,
		'10k~20k': 0,
		'20k以上': 0
	}
}

//结果分析 json对象
//总平均工资,各个岗位平均工资,招聘职位比重，学历要求比重，工作年限比重,工资范围比重
exports.DATA_analysis = function(dataArray){
	var len = dataArray.length, //招聘信息数量
		allSalary = 0, //总工资
		allAveSalary = 0, //总平均工资
		salaryNum = 0, //平均工资数量
		eachSalary = {}, //各个岗位总工资
		college = 0, //本科数量
		colleges = 0, //专科数量
		unlimited = 0, //无学历要求
		shorLimit = 0, // 2年以下
		commonLimit = 0, //2年以上5年以下
		longLimit = 0; //5年以上
		timeUnlimit = 0, //年限无要求
		lowScale = 0, //10k以下
		Scale = 0, //10k以下
		lowScale = 0, //10k以下
		medScale = 0, //10k~20k
		highScale = 0; //20K以上

	dataArray.forEach(function(employInfo){
		//各个岗位招聘信息数量
		pos[employInfo.position].num++;

		if(employInfo.peopleNum != '若干'){
			pos[employInfo.position].peopleNum += parseInt(employInfo.peopleNum);
		}else{ //若干数量
			pos[employInfo.position].someNum++;
		}

		//工资数量
		employInfo.aveSalary && ++salaryNum && ++pos[employInfo.position].salaryNum;

		//总工资
		allSalary += employInfo.aveSalary;

		//各个岗位总工资
		if(!eachSalary[employInfo.position])eachSalary[employInfo.position] = 0;

		eachSalary[employInfo.position] += employInfo.aveSalary;

		//学历要求
		var degree = employInfo.degree;
		if(degree == '本科')college++;
		else if(degree == '大专')colleges++;
		else if(degree == '无学历要求')unlimited++;

		//开发经验年限
		var year = /\d/g.test(employInfo.timeLimit)?
		parseInt(employInfo.timeLimit.match(/\d/g)[0]):'无要求';

		if(year < 2)shorLimit++;
		else if(year >= 2 && year <=5)commonLimit++;
		else if(year > 5)longLimit++;
		else if(year == '无要求')timeUnlimit++;

		//工资范围
		var salary = /\d/g.test(employInfo.salaryRange)?
		parseInt(employInfo.salaryRange.split('～')[1]):'面议'

		if(salary <= 10000)lowScale++;
		else if(salary > 10000 && salary <20000)medScale++;
		else if(salary >= 20000)highScale++;
	})

	//总平均工资
	data.allAveSalary = ALL_aveSalary(allSalary,salaryNum);

	//总结各个岗位平均工资
	POS_aveSalary(eachSalary);

	//各个岗位平均招聘人数
	POS_avePeoNum();

	//招聘岗位比例
	POS_scale();

	//学历要求比例
	DEG_scale(len,college,colleges,unlimited);

	//工作年限比重
	TIMLIMIT_scale(len,shorLimit,commonLimit,longLimit,timeUnlimit);

	//工资范围比重
	SALARY_scale(lowScale,medScale,highScale);

	return data;
}
//各个岗位平均招聘人数
var POS_avePeoNum = function(){
	for(var posName in pos){
		var tmp = pos[posName].num - pos[posName].someNum;

		var avePeopleNum = 0;
		if(tmp)avePeopleNum = parseInt(pos[posName].peopleNum / tmp);
		else avePeopleNum =0;

		pos[posName].peopleNum += avePeopleNum * pos[posName].someNum;
	}
}

//总平均工资
var ALL_aveSalary = function(allSalary,salaryNum){
	return parseInt(allSalary / salaryNum);
}

//总结各个岗位平均工资
var POS_aveSalary = function(eachSalary){
	for(var posName in eachSalary){
		if(!pos[posName].salaryNum){
			pos[posName].aveSalary =0;
			continue;
		}
		pos[posName].aveSalary = parseInt(eachSalary[posName] / pos[posName].salaryNum);
	}
}

//招聘岗位比例
var POS_scale = function(){
	var sum = 0;
	for(var posName in pos){
		sum += pos[posName].peopleNum;
	}
	//计算岗位比例
	for(var posName in pos){
		data.posScale[posName] = Number(parseFloat(pos[posName].peopleNum / sum).toFixed(3));
	}
}

//学历要求比例
var DEG_scale = function(len,college,colleges,unlimited){
	data.degScale['本科'] = Number(parseFloat(college / len).toFixed(3));
	data.degScale['大专'] = Number(parseFloat(colleges / len).toFixed(3));
	data.degScale['无学历要求'] = Number(parseFloat(unlimited / len).toFixed(3));
}

//工作期限范围
var TIMLIMIT_scale = function(len,shorLimit,commonLimit,longLimit,timeUnlimit){
	data.timelimit['2年以下'] = Number(parseFloat(shorLimit / len).toFixed(3));
	data.timelimit['2年~5年'] = Number(parseFloat(commonLimit / len).toFixed(3));
	data.timelimit['5年以上'] = Number(parseFloat(longLimit / len).toFixed(3));
	data.timelimit['无要求'] = Number(parseFloat(timeUnlimit / len).toFixed(3));
}

//工资范围比重
var SALARY_scale = function(lowScale,medScale,highScale){
	len = lowScale + medScale + highScale;
	data.salaryScale['10k以下'] = Number(parseFloat(lowScale / len).toFixed(3));
	data.salaryScale['10k~20k'] = Number(parseFloat(medScale / len).toFixed(3));
	data.salaryScale['20k以上'] = Number(parseFloat(highScale / len).toFixed(3));
}
