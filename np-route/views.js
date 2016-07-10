
/*
 * GET home page.
 */

exports.index = function(req, res){
  // res.render('index');
  res.sendfile('./np-public/np-theme/Surmon/index.html');
};

exports.admin = function(req, res){
  // res.render('index');
  res.sendfile('./np-public/np-admin/index.html');
};

/*
exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};
*/