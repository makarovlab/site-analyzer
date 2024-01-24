import { urlStopWords } from "./constants.js";


export const longitudeClassifier = (text) => {
    const pattern = /-?(?<!\d)\d{1,2}(?<=\d)\.\d{1,20}/g;
    let matched = text.match(pattern);

    if (matched) {
        return matched
            .some((lon) => (Number(lon) <= 90 && Number(lon) >= -90));
    } else {
        return false;
    }
}


export const latitudeClassifier = (text) => {
    const pattern = /-?(?<!\d)\d{1,3}(?<=\d)\.\d{1,20}/g;
    let matched = text.match(pattern);

    if (matched) {
        return matched
            .some((lat) => (Number(lat) <= 180 && Number(lat) >= -180));
    } else {
        return false;
    }
}


export const coordinatesClassifier = (text) => {
    const has_lat = latitudeClassifier(text);
    const has_lon = longitudeClassifier(text);

    return has_lat && has_lon;
}

export const urlClassifier = (url) => {
    return urlStopWords.some(element => url.match(element))
}