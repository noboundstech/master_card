var express = require('express'),
	app 	= express(),
    router  = express.Router();
require('rootpath')();
/*
router.use(function(req, res, next) {
	var utils = require('utility/utils');
	utils.authenticateUser(req,res,next);
});
*/
router.route('/')
.get(function (req, res) {
     res.json({ message: 'Welcome to the coolest API on earth!' });
})
.post(function (req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});
router.route('/check')
.get(function (req, res) {
     res.json(req.decoded);
});
router.route('/convertDataToExcel')
.post(function (req, res) {
	var excelbuilder = require('msexcel-builder-colorfix');	
	var fileName =  req.body.filename+'.xlsx';
	var excelHeaderLength = req.body.excelHeader.length;
	var excelRowLength 	  = req.body.excelData.length;

	var workbook = excelbuilder.createWorkbook("./controller", fileName);
	var sheet1 = workbook.createSheet(req.body.filename, excelHeaderLength+5, excelRowLength+5);

	for(var i=0;i<req.body.excelHeader.length;i++)
	{
		  sheet1.set(i+1, 1, req.body.excelHeader[i]);
		  sheet1.fill(i+1, 1,{type:'solid',fgColor:'48d1cc'});
	}
	var rownum = 1;
	for(j=0;j<req.body.excelData.length;j++)
	{
		rownum++;
		for(k=0;k<req.body.excelData[j].length;k++)
		{
			sheet1.set(k+1, rownum, req.body.excelData[j][k]);
		}
	}
	workbook.save(function(ok){
	  	res.send({message : "done",filename : fileName});
	});

});

router.route('/convertDataToPDF')
.post(function (req, res) {
	var pdf = require('html-pdf');
	var fileName =  req.body.filename+'.pdf';
	var excelHeaderLength = req.body.excelHeader.length;
	var excelRowLength 	  = req.body.pdfData.length;

	var html = '<!DOCTYPE html><html style="zoom: 0.9;"><head><meta charset="ISO-8859-1"><title>Insert title here</title></head><body>';
		html+='<table style = "width:98%; align : center;border:1px solid #ddd"><tr  >';
		for(var i=0;i<req.body.excelHeader.length;i++)
		{
			html+='<th style="background-color: #48d1cc;color: white;height:30px" >'+req.body.excelHeader[i]+'</th>';
		}
		html+="<tr>";

		for(j=0;j<req.body.pdfData.length;j++)
		{
			html+="<tr>";
			for(k=0;k<req.body.pdfData[j].length;k++)
			{
				var rowdata = '';
				if(typeof req.body.pdfData[j][k]!= 'undefined' && req.body.pdfData[j][k]!= null && req.body.pdfData[j][k]!= 'null')
				{
					rowdata = req.body.pdfData[j][k];
				}
				html+='<td style="height:30px;padding-top:5px">'+rowdata+'</td>';
			}
			html+="</tr>";
		}
		html+='</table></body></html>';
		var options = { format: 'Letter' };


		pdf.create(html, options).toFile('./controller/'+fileName, function(err, pdfRes) {
		  if (err) return console.log(err);
		  res.send({message : "done",filename : fileName});
		});

	/*	
		pdf.create(html,options).toStream(function(err, stream) {
		    if (err) {
		        console.log(err)
		    } else {
		     res.setHeader('Content-disposition', 'attachment; filename=' +fileName );
		        res.set('Content-type', 'application/pdf');
		        stream.pipe(res)
		    }
		}); 
	*/

});
module.exports = router;