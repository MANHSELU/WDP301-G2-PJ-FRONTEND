export interface geoLocation{
        type:"Point";
        coordinates :[number,number];
}
export interface stopLocation{
    stop_id: string,
    location_name: string,
    address: string,
    status: boolean,
    location: geoLocation,
    location_type: string,
}