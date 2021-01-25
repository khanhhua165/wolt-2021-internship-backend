import * as restaurantData from "../data/restaurants.json";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
const dayFormat = "YYYY-MM-DD";

export type Restaurant = {
  blurhash: string;
  launch_date: string;
  location: number[];
  name: string;
  online: boolean;
  popularity: number;
};
export default class Discovery {
  constructor(public latitude: number, public longitude: number) {}

  // * Eliminate restaurants with distance >= 1.5 km
  sortedOnlineRestaurantByDistance() {
    return onlineRestaurants.filter((res) => {
      const distance = calculateDistance(
        this.latitude,
        this.longitude,
        res.location[1],
        res.location[0]
      );
      return distance < 1.5;
    });
  }

  sortedOfflineRestaurantByDistance() {
    return offlineRestaurants.filter((res) => {
      const distance = calculateDistance(
        this.latitude,
        this.longitude,
        res.location[1],
        res.location[0]
      );
      return distance < 1.5;
    });
  }

  sortNearestRestaurants = (restaurants: Restaurant[]) => {
    return restaurants.sort((a, b) => {
      const distanceA = calculateDistance(
        this.latitude,
        this.longitude,
        a.location[1],
        a.location[0]
      );
      const distanceB = calculateDistance(
        this.latitude,
        this.longitude,
        b.location[1],
        b.location[0]
      );
      return distanceA - distanceB;
    });
  };

  sortPopularRestaurants(restaurants: Restaurant[]) {
    return restaurants.sort((a, b) => b.popularity - a.popularity);
  }

  filterNoOlderThan4Month(restaurants: Restaurant[]) {
    return restaurants.filter((restaurant) => {
      const date = dayjs(restaurant.launch_date, dayFormat);
      const day4MonthsAgo = dayjs().subtract(4, "month");
      return date.isSameOrAfter(day4MonthsAgo);
    });
  }

  sortNewRestaurants(restaurants: Restaurant[]) {
    return restaurants.sort((a, b) => {
      const dateA = dayjs(a.launch_date, dayFormat);
      const dateB = dayjs(b.launch_date, dayFormat);
      if (dateA.isBefore(dateB)) return 1;
      if (dateA.isAfter(dateB)) return -1;
      return 0;
    });
  }

  // * Populate restaurants list, max 10 restaurants
  populateRestaurantList(
    sortType: (restaurants: Restaurant[]) => Restaurant[],
    isNewRes: boolean = false
  ) {
    let onlineRes: Restaurant[];
    let offlineRes: Restaurant[];
    if (isNewRes) {
      onlineRes = this.filterNoOlderThan4Month(
        this.sortedOnlineRestaurantByDistance()
      );
      offlineRes = this.filterNoOlderThan4Month(
        this.sortedOfflineRestaurantByDistance()
      );
      onlineRes = sortType(onlineRes);
      offlineRes = sortType(offlineRes);
    } else {
      onlineRes = sortType(this.sortedOnlineRestaurantByDistance());
      offlineRes = sortType(this.sortedOfflineRestaurantByDistance());
    }
    const maxRes = 10;
    const resultRes = [...onlineRes];
    if (resultRes.length < maxRes) {
      if (offlineRes.length >= maxRes - resultRes.length) {
        for (let i = 0; i < maxRes - resultRes.length; i++) {
          resultRes.push(offlineRes[i]);
        }
      }
      if (
        offlineRes.length > 0 &&
        offlineRes.length < maxRes - resultRes.length
      ) {
        for (let res of offlineRes) {
          resultRes.push(res);
        }
      }
    }
    if (resultRes.length > 10) {
      resultRes.splice(maxRes, resultRes.length - maxRes);
    }
    return resultRes;
  }
}

// * Split into open and closed restaurants for easier manipulation
const onlineRestaurants = restaurantData.restaurants.filter(
  (restaurant) => restaurant.online
);
const offlineRestaurants = restaurantData.restaurants.filter(
  (restaurant) => !restaurant.online
);

// * convert degree to radius method
const deg2rad = (deg: number) => deg * (Math.PI / 180);

// * Calculate distance with Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }
  const R = 6371; // * Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  lat1 = deg2rad(lat1);
  lat2 = deg2rad(lat2);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // * Distance in km
};
