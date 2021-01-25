import { Request, Response, NextFunction } from "express";
import Discovery, { Restaurant } from "../models/discovery";

export type NewError = { statusCode: number } & Error;
type Section = {
  title: string;
  restaurants: Restaurant[];
};

const getDiscovery = (req: Request, res: Response, next: NextFunction) => {
  const sectionArray: Section[] = [];

  try {
    if (!req.query.lat || !req.query.lon) {
      const error = new Error(
        "Both lat and lon queries must be provided."
      ) as NewError;
      error.statusCode = 400;
      throw error;
    }
    const lat = +req.query.lat;
    const lon = +req.query.lon;
    if (isNaN(lat) || isNaN(lon)) {
      const error = new Error("queries must be numbers.") as NewError;
      error.statusCode = 400;
      throw error;
    }

    // * Initialize Discovery object if the parameters are valid
    const discovery = new Discovery(lat, lon);

    const popularRestaurants = discovery.populateRestaurantList(
      discovery.sortPopularRestaurants
    );
    const newRestaurants = discovery.populateRestaurantList(
      discovery.sortNewRestaurants,
      true
    );
    const nearbyRestaurants = discovery.populateRestaurantList(
      discovery.sortNearestRestaurants
    );

    if (popularRestaurants.length > 0) {
      const popularRes = {
        title: "Popular Restaurants",
        restaurants: popularRestaurants,
      };
      sectionArray.push(popularRes);
    }

    if (newRestaurants.length > 0) {
      const newRes = { title: "New Restaurants", restaurants: newRestaurants };
      sectionArray.push(newRes);
    }

    if (nearbyRestaurants.length > 0) {
      const nearRes = {
        title: "Nearby Restaurants",
        restaurants: nearbyRestaurants,
      };
      sectionArray.push(nearRes);
    }

    res.status(200).json({ sections: sectionArray });
  } catch (e) {
    next(e);
  }
};

export default getDiscovery;
