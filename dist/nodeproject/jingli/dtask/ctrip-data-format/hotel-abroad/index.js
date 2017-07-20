"use strict";
var database = require("@jingli/database");
var moment = require("moment");
var module_1 = require();
var utils_1 = require("@jingli/utils");
database.init();
function initDB(dbUrl) {
    database.init(dbUrl);
}
exports.initDB = initDB;
/*
 countryid, countryname, cityid, cityname, hotelname, hotelprice, hotelstar, checkindate, checkoutdate

 create table hotels.tfhotels(
   countryId varchar(50),
   countryname varchar(50),
   cityid varchar(50),
   cityname varchar(50),
   hotelname varchar(100),
   hotelprice numeric,
   hotelstar integer,
   checkindate varchar(50),
   checkoutdate varchar(50)
 );

 */
function format_data(body, querystring, storage) {
    return __awaiter(this, void 0, void 0, function* () {
        var _checkinDate = querystring._checkinDate, _checkoutDate = querystring._checkoutDate, cityid = querystring.cityid;
        var cityInfo = yield utils_1.getCityInfo({ cityId: cityid });
        var parentInfo = yield utils_1.getCityInfo({ cityId: cityInfo.parentId });
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
            var insertSql = "insert into " + storage + " values('" + parentInfo.id + "'," + parentInfo.name + "', '" + cityInfo.id + "', '" + cityInfo.name + "','" + _basicInfo.name + "', " + _lowestPrice + "','" + _activeinfo.star + "'," + _checkinDate + "', '" + _checkoutDate + "'})";
            try {
                yield module_1.DB.query(insertSql);
            }
            catch (err) {
                console.log(err);
            }
        }
    });
}
exports.format_data = format_data;
//# sourceMappingURL=index.js.map