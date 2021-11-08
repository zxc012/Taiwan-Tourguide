import axios from "axios";
import jsSHA from "jssha";

const ITEM_PER_PAGE = 12;
const URL_BASE = 'https://ptx.transportdata.tw/MOTC/v2/Tourism'
const SELECT_STRING = '$select=ID%2C%20Name%2C%20DescriptionDetail%2C%20Description%2C%20Phone%2C%20Address%2C%20OpenTime%2C%20Picture%2C%20Class1%20%2CClass2%2CClass3%2C%20WebsiteUrl%2CCity'
const FILTER_STRING = '$filter=Picture%2FPictureUrl1%20ne%20null%20and%20Class1%20ne%20null'

function getAuthorizationHeader() {
    let AppID = process?.env?.APPID ?? 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
    let AppKey = process?.env?.APPKEY ?? 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';

    let GMTString = new Date().toGMTString();
    let ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    let HMAC = ShaObj.getHMAC('B64');
    let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
    return { 'Authorization': Authorization, 'X-Date': GMTString };
}


export function getAttractionsCount() {
    return axios({
        headers: getAuthorizationHeader(),
        method: 'GET',
        baseURL: `${URL_BASE}/ScenicSpot?${SELECT_STRING}&${FILTER_STRING}&$orderby=UpdateTime%20desc&$format=JSON`
    })
        .then((value) => value.data.length)
}

export function getAttractionsData(page,) {
    const skipPage = isNaN(+page) ? 0 : ITEM_PER_PAGE * page
    return axios({
        headers: getAuthorizationHeader(),
        method: 'GET',
        baseURL: `${URL_BASE}/ScenicSpot?${SELECT_STRING}&${FILTER_STRING}&$orderby=UpdateTime%20desc&$top=${ITEM_PER_PAGE}&$skip=${skipPage}&$format=JSON`
    }).then((value) => value.data)
}
