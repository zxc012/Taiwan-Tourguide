import axios from "axios";
let accessToken;

const baseUrl = 'https://tdx.transportdata.tw/api/basic/v2/Tourism'

const ScenicSpot = {
    simple: ['ScenicSpotID', 'ScenicSpotName', 'Address', 'Picture', 'Class1', 'Class2', 'Class3', 'City'],
    detail: ['ScenicSpotID', 'ScenicSpotName', 'DescriptionDetail', 'Description', 'Phone', 'Address', 'OpenTime', 'Picture', 'Class1', 'Class2', 'Class3', 'WebsiteUrl', 'City'],
    filter: 'Picture/PictureUrl1 ne null and Class1 ne null and (Address ne null or City ne null)'
}
const scenicSpotUrl = `${baseUrl}/ScenicSpot/`

const simpleScenicSpotUrl = `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot/$select=ScenicSpotID,ScenicSpotName,Address,Picture,Class1,Class2,Class3,City&$filter=Picture/PictureUrl1 ne null and Class1 ne null and (Address ne null or City ne null)`;



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

export function GetAuthorizationHeader() {
    const grant_type = "client_credentials";
    const client_id = "rt1593571-2fcc91f1-96cb-42d9";
    const client_secret = "e2246502-5b6c-4672-9101-4115a4260ef4"

    const auth_url = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";

    return fetch(auth_url, {
        body: `grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;'
        },
        method: 'POST'
    }).then(data => data.json())
        .then(data => accessToken = data)
}

// 取得所有觀光景點資料數量
export function getAllScenicSpotCount(searchCity, searchText) {
    console.log('accessToken :>> ', accessToken);
    // return axios({
    //     headers: getAuthorizationHeader(),
    //     method: 'GET',
    //     baseURL: `${baseUrl} / ScenicSpot / ${searchCity || ''}?$select = ID & $filter=${attractions.filter} ` + (searchText ? ` and contains(Name, '${searchText}')` : '') + ` & $orderby=UpdateTime desc & $format=JSON`
    // }).then((response) => response.data.length)

    return fetch('https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?$select=ScenicSpotID&$filter=Picture/PictureUrl1 ne null and Class1 ne null and (Address ne null or City ne null)', {
        headers: {
            authorization: "Bearer " + accessToken.access_token,
        }
    }).then((response) => response.json()).then(
        data => data.length
    )

}

export function getOverviewAttractionsData(searchCity, searchText) {
    // console.log(`${baseUrl} /ScenicSpot/${searchCity || ''}?$select = ${attractions.overviewSelect.join(',')}& $filter=${attractions.filter} ` + (searchText ? ` and contains(Name, '${searchText}')` : '') + ` & $orderby=UpdateTime desc & $format=JSON`)
    // return axios({
    //     headers: getAuthorizationHeader(),
    //     method: 'GET',
    //     baseURL: `${baseUrl} /ScenicSpot/${searchCity || ''}?$select = ${attractions.overviewSelect.join(',')}& $filter=${attractions.filter} ` + (searchText ? ` and contains(Name, '${searchText}')` : '') + ` & $orderby=UpdateTime desc & $format=JSON`
    // }).then((response) => {
    //     return response.data.map(data => ({
    //         id: data.ID,
    //         title: data.Name,
    //         address: data.Address,
    //         city: data.City || data.Address.substr(0, 3),
    //         imageUrl: data.Picture.PictureUrl1,
    //         imageDescription: data.Picture.PictureDescription1,
    //         tagList: [data.Class1, data.Class2, data.Class3].filter(Boolean)
    //     }))
    // })

    return fetch('https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?$select=ScenicSpotID,ScenicSpotName,Address,Picture,Class1,Class2,Class3,City&$filter=Picture/PictureUrl1 ne null and Class1 ne null and (Address ne null or City ne null)', {
        headers: accessToken
    })
        .then(response => response.json())
        .then((dataInfo) => {
            return dataInfo.map(data => ({
                id: data.ScenicSpotID,
                title: data.ScenicSpotName,
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
        baseURL: `${baseUrl} /ScenicSpot?$select=${attractions.detailSelect.join(',')}&$filter=ID eq '${id}')&top=1&$format=JSON`
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
