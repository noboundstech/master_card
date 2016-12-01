require('rootpath')();
module.exports = function (app) {
  	app.use('/api', require('controller/api'));
  	app.use('/userLogin', require('controller/login'));
  	app.use('/details', require('controller/details'));
 //	app.use('/offer', require('controller/offer'));
 //	app.use('/profile', require('controller/profile'));
 	app.use('/customer_segment', require('controller/customer_segment'));
  	app.use('/userfetch', require('controller/userfetch'));
};
