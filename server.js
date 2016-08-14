//引入一些依赖
var http = require('http'),
	cheerio = require('cheerio'),
	superagent = require('superagent'),
	async = require('async'),
	Eventproxy = require('eventproxy'),
	EmployServer = require('./service/employinfo'),
	DataServer = require('./service/data_analysis');

var ep = new Eventproxy(), //eventproxy实例
	indexUrl = 'http://job.cnblogs.com', //首页地址
	pageNum = 17, //爬取的页数
 	port = 3333; //端口号

var onRequest = function(req,res){
	var pageUrls = [], //招聘列表地址
		employUrls = [], //招聘信息地址
		employInfos = [], //招聘内容（招聘职位、学历要求，发布日期，截止日期，工资范围）
		result = [], //分析结果
		startDate = new Date(),	//开始时间
		endDate = false;	//结束时间

	for(var i = 1;i <= pageNum;i++){
		pageUrls.push(indexUrl + '/?page=' + i);
	}

	res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
	res.write('<hr><h2>列表页数:' + pageNum + '</h2><hr>');

	//遍历列表url，获取招聘信息url
	pageUrls.forEach(function(pageUrl){

		superagent.get(pageUrl)
		.end(function(err,body){
			if(err){
				console.log(err.stack);
				return
			}

			res.write('<p>fetch <span style="color:red">' + pageUrl + '</span> successful!</p>')

			var $ = cheerio.load(body.text)

			var curEmployUrls = $('.job_offer_title_VIP a');

			for(var i = 0;i < curEmployUrls.length;i++){
				var offerUrl = curEmployUrls.eq(i).attr('href');
				var employUrl = indexUrl + offerUrl;
				employUrls.push(employUrl);

				ep.emit('employInfoHtml',employUrl);
			}
		})
	})

	//监听'employInfoHtml'事件 pageNum * 25次 再执行
	ep.after('employInfoHtml',pageNum * 25,function(arrayUrls){
		res.write('<hr><h2>招聘offer</h2><hr>');
		
		//控制并发数
		var curCount = 0;

		//爬取招聘信息
		var doFetch = function(url,callback){
			//延迟毫秒数
			var delay = parseInt((Math.random() * 1000000) % 1000,10);
			//控制并发量
			curCount++;

			console.log('现在并发量是:',curCount,"正在爬取url:",url,'耗时',delay,'ms');

			//搜集招聘信息
			superagent.get(url)
			.end(function(err,body){
				if(err){
					console.log(err)
					return;
				}

				var $ = cheerio.load(body.text);
				var offerid = url.split('/')[4];

				res.write('<p>curOfferId is <span style="color:red">' + offerid + '</span><br>');
				res.write('companyName is <span style="color:red">' + $('#enterprise_intro_block h3 a').text() + '</span><br>')
				res.write('position is <span style="color:red">'+ $('.offer_detail li').eq(3).text().split('：')[1] + '</span></p>')

				//存储招聘信息
				//公司名称,公司地址,招聘人数,信息来源,平均工资,招聘职位,学历要求,发布日期,截止日期,工资范围,工作年限
				EmployServer.employInfo($,employInfos);

			})

			setTimeout(function(){
				curCount--;
				callback(null,url + 'Call back content\n');
			}, delay );
		}

		//使用async控制异步抓取
		//限制并发量 5
		async.mapLimit(arrayUrls,5,function(url,callback){
			doFetch(url,callback)
		},function(err,result){
			endDate = new Date();
			
			if(err){
				console.log(err);
				return;
			}

			res.write('<hr><h2>招聘具体信息</h2><hr>');
			employInfos.forEach(function(infoJSON){
				res.write('<p>' + JSON.stringify(infoJSON) + '</p>')
			})

			//结果分析 json对象
			//总平均工资,各个岗位平均工资,招聘职位比重，学历要求比重，工作年限比重,工资范围比重
			var catchDataJSON = DataServer.DATA_analysis(employInfos);
			res.write('<hr><h2>结果分析</h2><hr>');
			res.write('<ol>')
			res.write('<li>爬虫开始时间：'+ startDate.toLocaleDateString() + " " + startDate.toLocaleTimeString() +'</li>');
			 res.write('<li>爬虫结束时间：'+ endDate.toLocaleDateString() + " " + endDate.toLocaleTimeString() + '</li>');
			res.write('<li>耗时：'+ (endDate - startDate) +'ms' +' --> '+ (Math.round((endDate - startDate)/1000/60*100)/100) +'min </li>');
			res.write('<li>总平均工资:&nbsp;<span style="color:red">' + catchDataJSON.allAveSalary + '</span>&nbsp;元/月</li>')

			var posAveSalary = '';
			for(var posName in catchDataJSON.position){
				var salary = catchDataJSON.position[posName].aveSalary
				if(!salary){
					posAveSalary += '<li>'+ posName+ ':&nbsp;无记录</li>';
					continue;	
				}
				posAveSalary += '<li>'+ posName+ ':&nbsp;<span style="color:red">' + salary +'</span>&nbsp;元/月</li>';
			}
			res.write('<li>各个岗位平均工资:<ol>'+ posAveSalary +'</ol></li>')

			var posScale = '';
			for(var posName in catchDataJSON.posScale){
				var scale = parseFloat(catchDataJSON.posScale[posName] * 100).toFixed(1);

				posScale += '<li>'+ posName+ ':&nbsp;<span style="color:red">' + scale +'</span>&nbsp;%</li>';
			}
			res.write('<li>招聘职位比重:<ol>' + posScale + '</ol></li>')

			var degScale = '';  
			for(var degName in catchDataJSON.degScale){
				var scale = parseFloat(catchDataJSON.degScale[degName] * 100).toFixed(1);
				degScale += '<li>'+ degName+ ':&nbsp;<span style="color:red">' + scale +'</span>&nbsp;%</li>';
			}
			res.write('<li>学历要求比重:<ol>' + degScale + '</ol></li>')

			var timeScale = '';
			for(var timeName in catchDataJSON.timelimit){
				var scale = parseFloat(catchDataJSON.timelimit[timeName] * 100).toFixed(1);
				timeScale += '<li>' + timeName + ':&nbsp;<span style="color:red">' + scale + '</span>&nbsp;%</li>'
			}
			res.write('<li>工作年限要求比重:<ol>' + timeScale + '</ol></li>')
 			
 			var salaryScale = '';
 			for(var salaryName in catchDataJSON.salaryScale){
 				var scale = parseFloat(catchDataJSON.salaryScale[salaryName] * 100).toFixed(1);
 				salaryScale += '<li>' + salaryName + ':&nbsp;<span style="color:red">' + scale + '&nbsp;%</span></li>';
 			}
 			res.write('<li>工资范围比重:<ol>' + salaryScale + '</ol></li>')

			res.write('</ol>')
			res.end('<hr><p style="text-align:center">爬取网站:http://job.cnblogs.com/</p>')
		})
	})
}

http.createServer(onRequest).listen(port,function(err){
	if(err){
		console.error(err.stack);
		return
	}
	console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
})