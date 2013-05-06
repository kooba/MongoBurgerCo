# Mongo Burger Co - Geospatial Queries in MongoDB

Simple Node.js project demonstrating few spatial features of MongoDB

This is a port of Simon Bartlett's C# [RavenBurgerCo](https://github.com/sibartlett/RavenBurgerCo) project.
All credits go to the original author.

To see app in action browse to: [mongoburgerco.herokuapp.com](http://mongoburgerco.herokuapp.com/)

## Install

**NOTE:** You need to have node.js and mongodb installed and running.

```sh
  $ git clone git://github.com/kooba/MongoBurgerCo.git
  $ cd MongoBurgerCo
  $ npm install
  $ node mburger.js
```

## MongoDB spatial features.

Sample application shows use of: $geoWithin, $near and $geoIntersects queries.

Currently MongoDB doesn't support [querying along Polyline](https://jira.mongodb.org/browse/SERVER-4339) which is required for "Drive Thru" example.
Sample of workaround using Douglas-Peucker line simplification algorithm is shown.

## Scenario

Mongo Burger Co is a chain of fast food restaurants, based in the United Kingdom. All their restaurants offer eat-in/take-out service, while some offer home delivery, and others offer a drive thru service.

This sample application is their online restaurant locator.

## Examples

Each example is explained below.

### 1. General Map

The user can pan and/or zoom a map to browse the different restaurants.

Each time the map's view has changed, the bounds of the map's view is used to query the database for any restaurants that are within those bounds.

### 2. Eat-in / Take-out

The user can use this page to look for their nearest restaurant.

### 3. Delivery

The user can choose a location, and be shown which restaurants deliver to that location. Clicking each restaurant displays its polygon (delivery area).

Restaurants that offer a delivery service have a polygon which defines the area which they deliver to. Once the user chooses a location, the database is queried for any delivery areas that contain the user's location.

### 4. Drive Thru

The user can choose an origin and destination for a car journey. They will then be shown the best route for their journey, and restaurants that are no more than 5 km from the route. If the user clicks a restaurant, they will be shown a new route which stops by the drive thru restaurant.

## License

MongoBurgerCo is licensed under the terms of the GNU General Public License Version 3 as published by the Free Software Foundation.