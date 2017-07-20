"use strict";
var database = require("@jingli/database");
var moment = require("moment");
var module_1 = require();
database.init();
function initDB(dbUrl) {
    database.init(dbUrl);
}
exports.initDB = initDB;
function format_data(body, querystring, storage) {
    var _checkinDate = querystring._checkinDate, _checkoutDate = querystring._checkoutDate, cityid = querystring.cityid;
    var _hotels = body.htlInfos;
    for (var _i = 0, _hotels_1 = _hotels; _i < _hotels_1.length; _i++) {
        var _hotel = _hotels_1[_i];
        var _basicInfo = _hotel['baseInfo'];
        var _activeinfo = _hotel['activeinfo'];
        var _prices = _hotel['prices'];
        var _lowestPrice = -1;
        for (var _a = 0, _prices_1 = _prices; _a < _prices_1.length; _a++) {
            var _price = _prices_1[_a];
            if (_price.pbiz == 2) {
                _lowestPrice = _price.detail.price;
                _lowestPrice = Math.round(_lowestPrice * 1.15); //国际酒店增加15%的税费
                break;
            }
        }
        var _latitude = 0;
        var _longitude = 0;
        if (_activeinfo.geos && _activeinfo.geos.length) {
            _latitude = _activeinfo.geos[0]['lat'];
            _longitude = _activeinfo.geos[0]['lon'];
        }
        //携程改版，返回酒店均价
        var checkInDate = moment(_checkinDate).hour(12);
        var checkOutDate = moment(_checkoutDate).hour(12);
        var interval = moment(checkOutDate).diff(checkInDate, 'days') || 1;
        _lowestPrice = _lowestPrice * interval;
        try {
            yield module_1.DB.query("insert into " + storage + " values();");
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.format_data = format_data;
//# sourceMappingURL=index.js.map