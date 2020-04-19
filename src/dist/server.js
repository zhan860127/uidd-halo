"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express = require("express");
var https = require("https");
var fs = require("fs");
var child_process_1 = require("child_process");
var request = require("request");
var tmp = require("tmp");
var passport = require("passport");
var passport_local_1 = require("passport-local");
var bodyParser = require("body-parser");
var cookieSession = require("cookie-session");
var bcrypt = require("bcrypt");
var fileUpload = require("express-fileupload");
require('reflect-metadata');
var typeorm_1 = require("typeorm");
var Parent_1 = require("./models/entity/Parent");
var Child_1 = require("./models/entity/Child");
var port = 8686;
var ffmpeg = '/home/uidd2020/user/tilde/ffmpeg/build/bin/ffmpeg ';
function processBody(s) {
    console.log(s);
    for (var _i = 0, _a = s.split('\n'); _i < _a.length; _i++) {
        var line = _a[_i];
        if (!line.trim().length)
            continue;
        var s_1 = JSON.parse(line);
        if (!s_1.result.length)
            continue;
        return s_1.result[0].alternative[0].transcript;
    }
}
function getText(path) {
    return new Promise(function (resolve, reject) {
        request({
            url: 'https://www.google.com/speech-api/v2/recognize?output=json&lang=zh-TW&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw',
            method: 'POST',
            headers: {
                'Content-Type': 'audio/x-flac; rate=44100'
            },
            body: fs.readFileSync(path),
            encoding: null
        }, function (err, res, body) {
            if (err) {
                reject(err);
                return;
            }
            resolve(processBody(body.toString('utf8')));
        });
    });
}
function ensureLoggedIn(req, res, next) {
    if (!req.user)
        res.redirect('/');
    else
        next();
}
typeorm_1.createConnection().then(function (connection) {
    var app = express();
    var parentRepo = connection.getRepository(Parent_1.Parent);
    app.use(express.static('html', { extensions: ['html'] }));
    app.use(cookieSession({ secret: "not secure! TODO put this in env var" }));
    app.use('/static', express.static('static'));
    app.use(fileUpload());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.set('views', './src/views');
    app.set('view engine', 'pug');
    app.locals.basedir = './src/views';
    passport.use(new passport_local_1.Strategy(function (username, password, cb) { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, parentRepo.findOne({
                        username: username
                    })];
                case 1:
                    user = _a.sent();
                    if (!user || !bcrypt.compareSync(password, user.password))
                        return [2 /*return*/, cb(null, false)];
                    cb(null, user);
                    return [2 /*return*/];
            }
        });
    }); }));
    passport.serializeUser(function (user, cb) {
        cb(null, user.id);
    });
    passport.deserializeUser(function (id, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, parentRepo.findOne(id)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, cb('err', false)];
                        cb(null, user);
                        return [2 /*return*/];
                }
            });
        });
    });
    app.use(passport.initialize());
    app.use(passport.session());
    app.get('/dashboard', ensureLoggedIn, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var parent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection
                        .getRepository(Parent_1.Parent)
                        .findOne({
                        where: {
                            id: req.user.id
                        },
                        relations: ['children']
                    })];
                case 1:
                    parent = _a.sent();
                    if (!parent) {
                        return [2 /*return*/, res.sendStatus(500)];
                    }
                    res.render('child_select', {
                        name: req.user.username,
                        children: parent.children
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    app.get('/child/:childId', ensureLoggedIn, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var child;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.getRepository(Child_1.Child)
                        .createQueryBuilder('child')
                        .innerJoinAndSelect('child.parents', 'parent')
                        .where('parent.id = :parentId', { parentId: req.user.id })
                        .andWhere('child.id = :childId', { childId: req.params.childId })
                        .getOne()];
                case 1:
                    child = _a.sent();
                    if (!child)
                        return [2 /*return*/, res.sendStatus(404)];
                    res.render('function_select', { child: child });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post('/login', passport.authenticate('local', {
        failureRedirect: '/sign_in',
        successRedirect: '/dashboard'
    }));
    app.get('/logout', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            req.logout();
            res.redirect('/', 302);
            return [2 /*return*/];
        });
    }); });
    app.post('/sign_up', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var parent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(req.body);
                    parent = new Parent_1.Parent();
                    parent.email = req.body.email;
                    parent.password = bcrypt.hashSync(req.body.password, 10);
                    parent.username = req.body.username;
                    return [4 /*yield*/, parentRepo.save(parent)];
                case 1:
                    _a.sent();
                    // TODO: check uniqueness
                    res.send('success');
                    return [2 /*return*/];
            }
        });
    }); });
    app.post('/add_child', ensureLoggedIn, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var parent, child;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.body.name) {
                        res.status(400);
                        return [2 /*return*/, res.send('no name sent')];
                    }
                    return [4 /*yield*/, connection
                            .getRepository(Parent_1.Parent)
                            .findOne({
                            where: {
                                id: req.user.id
                            },
                            relations: ['children']
                        })];
                case 1:
                    parent = _a.sent();
                    if (!parent) {
                        return [2 /*return*/, res.sendStatus(500)];
                    }
                    child = new Child_1.Child();
                    child.name = req.body.name;
                    return [4 /*yield*/, connection.manager.save(child)];
                case 2:
                    _a.sent();
                    parent.children.push(child);
                    return [4 /*yield*/, connection.manager.save(parent)];
                case 3:
                    _a.sent();
                    res.redirect(302, '/dashboard');
                    return [2 /*return*/];
            }
        });
    }); });
    app.post('/speech', function (req, res) {
        var _a, _b;
        try {
            var path_1 = tmp.tmpNameSync() + ".ogg";
            var flacPath_1 = tmp.tmpNameSync() + ".flac";
            console.log(path_1, flacPath_1);
            var data = (_b = (_a = req) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b.data;
            if (!('data' in data))
                throw 'No file';
            fs.writeFileSync(path_1, data);
            child_process_1.exec(ffmpeg + " -i " + path_1 + " -ar 44100 " + flacPath_1, function (err) {
                if (err)
                    throw err;
                getText(flacPath_1).then(function (transcript) {
                    console.log(transcript);
                    res.json({
                        transcript: transcript
                    });
                })["catch"](function (err) { throw err; })["finally"](function () {
                    fs.unlinkSync(path_1);
                    fs.unlinkSync(flacPath_1);
                });
            });
        }
        catch (e) {
            console.error(e);
            res.status(401).send('error');
        }
    });
    https.createServer({
        cert: fs.readFileSync('/etc/letsencrypt/live/luffy.ee.ncku.edu.tw/fullchain.pem'),
        key: fs.readFileSync('/etc/letsencrypt/live/luffy.ee.ncku.edu.tw/privkey.pem')
    }, app).listen(port, function () { return console.log("Example app listening at https://localhost:" + port); });
});
