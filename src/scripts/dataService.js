import axios from "axios";
import jsSHA from "jssha";

const baseUrl = 'https://ptx.transportdata.tw/MOTC/v2/Tourism'
const attractions = {
    overviewSelect: ['ID', 'Name', 'Address', 'Picture', 'Class1', 'Class2', 'Class3', 'City'],
    detailSelect: ['ID', 'Name', 'DescriptionDetail', 'Description', 'Phone', 'Address', 'OpenTime', 'Picture', 'Class1', 'Class2', 'Class3', 'WebsiteUrl', 'City'],
    filter: 'Picture/PictureUrl1 ne null and Class1 ne null and (Address ne null or City ne null)'
}

const restaurant = {
    overviewSelect: ['ID', 'Name', 'Address', 'Picture', 'Class', 'City'],
    detailSelect: ['ID', 'Name', 'Description', 'Phone', 'Address', 'OpenTime', 'Picture', 'Class', 'WebsiteUrl', 'City']
}

const hotel = {
    overviewSelect: ['ID', 'Name', 'Address', 'Picture', 'Class', 'City'],
    detailSelect: ['ID', 'Name', 'Description', 'Phone', 'Address', 'Picture', 'Class', 'WebsiteUrl', 'City']
}

const activity = {
    overviewSelect: ['ID', 'Name', 'Address', 'Picture', 'Class1', 'Class2', 'City'],
    detailSelect: ['ID', 'Name', 'Description', 'Location', 'Phone', 'StartTime', 'EndTime', 'Address', 'Picture', 'Class1', 'Class2', 'WebsiteUrl', 'City']
}

/** Api 驗證 header */
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

export function getAllAttractionsCount(searchCity, searchText) {

    return axios({
        headers: getAuthorizationHeader(),
        method: 'GET',
        baseURL: `${baseUrl}/ScenicSpot/${searchCity || ''}?$select=ID&$filter=${attractions.filter}` + (searchText ? ` and contains(Name,'${searchText}')` : '') + `&$orderby=UpdateTime desc&$format=JSON`
    }).then((response) => response.data.length)
}

export function getOverviewAttractionsData(searchCity, searchText) {
    console.log(`${baseUrl}/ScenicSpot/${searchCity || ''}?$select=${attractions.overviewSelect.join(',')}&$filter=${attractions.filter}` + (searchText ? ` and contains(Name,'${searchText}')` : '') + `&$orderby=UpdateTime desc&$format=JSON`)
    return axios({
        headers: getAuthorizationHeader(),
        method: 'GET',
        baseURL: `${baseUrl}/ScenicSpot/${searchCity || ''}?$select=${attractions.overviewSelect.join(',')}&$filter=${attractions.filter}` + (searchText ? ` and contains(Name,'${searchText}')` : '') + `&$orderby=UpdateTime desc&$format=JSON`
    }).then((response) => {
        return response.data.map(data => ({
            id: data.ID,
            title: data.Name,
            address: data.Address,
            city: data.City || data.Address.substr(0, 3),
            imageUrl: data.Picture.PictureUrl1,
            imageDescription: data.Picture.PictureDescription1,
            tagList: [data.Class1, data.Class2, data.Class3].filter(Boolean)
        }))
    })
}

export function getDetailAttractionsData(id) {
    return axios({
        headers: getAuthorizationHeader(),
        method: 'GET',
        baseURL: `${baseUrl}/ScenicSpot?$select=${attractions.detailSelect.join(',')}&$filter=ID eq '${id}')&top=1&$format=JSON`
    }).then((response) => {
        return response.data.map(data => ({
            id: data.ID,
            title: data.Name,
            description: data.Description,
            phone: data.Phone,
            address: data.Address,
            openTime: data.OpenTime,
            city: data.City || data.Address.substr(0, 3),
            imageUrl: data.Picture.PictureUrl1,
            imageDescription: data.Picture.PictureDescription1,
            websiteUrl: data.WebsiteUrl,
            tagList: [data.Class1, data.Class2, data.Class3].filter(Boolean)
        }))
    })
}


export function getAllRestaurantCount() { }

export function getOverviewRestaurantData() { }

export function getDetailRestaurantData() { }


export function getAllHotelCount() { }

export function getOverviewHotelData() { }

export function getDetailHotelData() { }


export function getAllActivityCount() { }

export function getOverviewActivityData() { }

export function getDetailActivityData() { }
