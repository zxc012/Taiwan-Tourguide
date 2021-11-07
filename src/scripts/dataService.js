import axios from "axios";
import jsSHA from "jssha";

const URL_BASE = 'https://ptx.transportdata.tw/MOTC/v2/Tourism'


function getAuthorizationHeader() {
    //  填入自己 ID、KEY 開始
    let AppID = process?.env?.APPID ?? 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
    let AppKey = process?.env?.APPKEY ?? 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';

    // if (!AppID || !AppKey) return null;
    //  填入自己 ID、KEY 結束
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
        baseURL: `${URL_BASE}/ScenicSpot?$select=ID&$filter=Picture%2FPictureUrl1%20ne%20null&$orderby=UpdateTime%20desc&$format=JSON`
    })
        .then((value) => value.data.length)
}

export function getAttractionsData(page,) {
    const skipPage = isNaN(+page) ? 0 : 12 * page

    return axios({
        headers: getAuthorizationHeader(),
        method: 'GET',
        baseURL: `${URL_BASE}/ScenicSpot?$filter=Picture%2FPictureUrl1%20ne%20null&$orderby=UpdateTime%20desc&$top=16&$skip=${skipPage}&$format=JSON`
    }).then((value) => value.data)
}
