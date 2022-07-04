import axios from "axios";
let accessToken;

export function getAuthorizationHeader() {
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

// 取得所有觀光景點卡片資料
export function getAllScenicSpotData(searchCity, searchText) {
    return fetch(`https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot${searchCity ? '/' + searchCity : ''}?$select=ScenicSpotID,ScenicSpotName,Address,Picture,Class1,Class2,Class3,City&$filter=Picture/PictureUrl1 ne null and (Address ne null or City ne null)${searchText ? ' and contains(ScenicSpotName,\'' + searchText + '\')' : ''}`, {
        headers: {
            "authorization": "Bearer " + accessToken.access_token,
        }
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

export function getDetailScenicSpotData(id) {
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

// 取得所有觀光餐飲卡片資料
export function getAllRestaurantData(searchCity, searchText) {
    return fetch(`https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant${searchCity ? '/' + searchCity : ''}?$select=RestaurantID,RestaurantName,Address,Picture,Class,City&$filter=Picture/PictureUrl1 ne null and (Address ne null or City ne null)${searchText ? ' and contains(RestaurantName,\'' + searchText + '\')' : ''}`, {
        headers: {
            "authorization": "Bearer " + accessToken.access_token,
        }
    })
        .then(response => response.json())
        .then((dataInfo) => {
            return dataInfo.map(data => ({
                id: data.RestaurantID,
                title: data.RestaurantName,
                address: data.Address,
                city: data.City || data.Address.substr(0, 3),
                imageUrl: data.Picture.PictureUrl1,
                imageDescription: data.Picture.PictureDescription1,
                tagList: [data.Class]
            }))
        })
}

export function getDetailRestaurantData() { }


// 取得所有觀光旅宿卡片資料
export function getAllHotelData(searchCity, searchText) {
    return fetch(`https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel${searchCity ? '/' + searchCity : ''}?$select=HotelID,HotelName,Address,Picture,Class,City&$filter=Picture/PictureUrl1 ne null and (Address ne null or City ne null)${searchText ? ' and contains(HotelName,\'' + searchText + '\')' : ''}`, {
        headers: {
            "authorization": "Bearer " + accessToken.access_token,
        }
    })
        .then(response => response.json())
        .then((dataInfo) => {
            return dataInfo.map(data => ({
                id: data.HotelID,
                title: data.HotelName,
                address: data.Address,
                city: data.City || data.Address.substr(0, 3),
                imageUrl: data.Picture.PictureUrl1,
                imageDescription: data.Picture.PictureDescription1,
                tagList: [data.Class]
            }))
        })
}

export function getDetailHotelData() { }

// 取得所有觀光活動卡片資料
export function getAllActivityData(searchCity, searchText) {
    return fetch(`https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity${searchCity ? '/' + searchCity : ''}?$select=ActivityID,ActivityName,Address,Picture,Class1,Class2,City&$filter=Picture/PictureUrl1 ne null and (Address ne null or City ne null)${searchText ? ' and contains(ActivityName,\'' + searchText + '\')' : ''}`, {
        headers: {
            "authorization": "Bearer " + accessToken.access_token,
        }
    })
        .then(response => response.json())
        .then((dataInfo) => {
            return dataInfo.map(data => ({
                id: data.ActivityID,
                title: data.ActivityName,
                address: data.Address,
                city: data.City || data.Address.substr(0, 3),
                imageUrl: data.Picture.PictureUrl1,
                imageDescription: data.Picture.PictureDescription1,
                tagList: [data.Class1, data.Class2].filter(Boolean)
            }))
        })
}

export function getDetailActivityData() { }
