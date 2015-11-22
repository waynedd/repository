var mini = require('html-minifier');

function isHtml(text) {
    var prefix = "<!DOCTYPE html>";
    return text.length >= prefix.length && text.substring(0, prefix.length) === prefix;
}

exports.miniHTML = function(req, res, next) {
    if (req.method === 'GET' || req.method === 'POST') {
        var oldSend = res.send;
        res.send = function(data) {
            if (data != null) {
                var htmlText = data.toString();
                if (htmlText.length > 0 && isHtml(htmlText)) {
                    try {
                        data = mini.minify(htmlText, {
                            removeComments: true,
                            collapseWhitespace: true,
                            minifyJS: true
                        });
                    }
                    catch(error) {
                        console.error('Hooks: cannot minify html for ' + req.url);
                        console.error(error);
                    }
                }
            }
            oldSend.apply(res, [data]);
        }
    }
    next();
};