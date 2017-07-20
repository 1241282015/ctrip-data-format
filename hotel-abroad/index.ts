var database = require("@jingli/database");
var moment = require("moment");
import {DB} = require("@jingli/database");
import {getCityInfo} from "@jingli/utils"

database.init();

export function initDB(dbUrl:string){
    database.init(dbUrl);
}

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

export async function format_data(body?: any, querystring?:any, storage?:any){
    let {_checkinDate, _checkoutDate,cityid} = querystring;
    let cityInfo = await getCityInfo({cityId: cityid});
    let parentInfo = await getCityInfo({cityId: cityInfo.parentId});

    let _hotels = body.htlInfos;
    for(let _hotel of _hotels) {
        let _basicInfo = _hotel['baseInfo'];
        let _activeinfo = _hotel['activeinfo'];
        let _prices = _hotel['prices'];
        let _lowestPrice = -1;
        for(var _price of _prices) {
            if (_price.pbiz == 2) {
                _lowestPrice = _price.detail.price;
                _lowestPrice = Math.round(_lowestPrice*1.15);  //国际酒店增加15%的税费
                break;
            }
        }
        let _latitude = 0;
        let _longitude = 0;
        if (_activeinfo.geos && _activeinfo.geos.length) {
            _latitude = _activeinfo.geos[0]['lat'];
            _longitude = _activeinfo.geos[0]['lon'];
        }
        //携程改版，返回酒店均价
        let checkInDate = moment(_checkinDate).hour(12);
        let checkOutDate = moment(_checkoutDate).hour(12);
        let interval = moment(checkOutDate).diff(checkInDate,'days') || 1;
        _lowestPrice = _lowestPrice * interval;

        let insertSql = `insert into ${storage} values('${parentInfo.id}',${parentInfo.name}', '${cityInfo.id}', '${cityInfo.name}','${_basicInfo.name}', ${_lowestPrice}','${_activeinfo.star}',${_checkinDate}', '${_checkoutDate}'})`;
        try{
            await DB.query(insertSql);
        }catch(err){
            console.log(err);
        }
    }
}