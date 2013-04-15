/**
 * Specify the routes.
 *
 * @app {Object} the running app object
 * @mburger {Class} the MongoBurger class
 * @api public
 */
module.exports = function(app, mburger)
{
    app.get('/', mburger.index);
//    app.get('/admin', mburger.checkAccess, mburger.admin);
//    app.get('/login', mburger.login);
//    app.post('/login', mburger.loginpost);
//    app.get('/logout', mburger.checkAccess, mburger.logout);
//    app.get('/:year/:month/:day/:title', mburger.article);
//    app.get('/articles', mburger.articles);
//    app.get('/add', mburger.checkAccess, mburger.add);
//    app.post('/add', mburger.checkAccess, mburger.addpost);
//    app.get('/add-page', mburger.checkAccess, mburger.addpage);
//    app.post('/add-page', mburger.checkAccess, mburger.addpagepost);
//    app.get('/edit', mburger.checkAccess, mburger.edit);
//    app.post('/edit', mburger.checkAccess, mburger.editpost);
//    app.get('/edit-page', mburger.checkAccess, mburger.editpage);
//    app.post('/edit-page', mburger.checkAccess, mburger.editpagepost);
//    app.get('/del', mburger.checkAccess, mburger.del);
//    app.get('/delconfirm', mburger.checkAccess, mburger.delconfirm);
//    app.get('/del-page', mburger.checkAccess, mburger.delpage);
//    app.get('/del-page-confirm', mburger.checkAccess, mburger.delpageconfirm);
//    app.get('/page/:p', mburger.page);
//    app.get('/content/:c', mburger.content);
//    app.get('/preferences', mburger.checkAccess, mburger.preferences);
//    app.post('/save', mburger.checkAccess, mburger.save);
//    app.get('/sitemap.xml', mburger.sitemap);
//    app.get('/robots.txt', mburger.robots);
}