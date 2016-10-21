---
tags: ["misc","revive"]
excerpt: It is no secret that the Garmin eTrex 10 is capable of showing maps (if quite small due to limited memory). Searching the web for a bit, you can find a number of sites explaining how to create them. In this post, I want to share some parameters, I found helpful for my usecase.
---
The Garmin eTrex 10 **can** process (small) maps, that's no secret. As there are quite a few step by step tutorials explaining how to create them, I won't attempt the same again. I basically followed [this blog post](http://kapaneus.wordpress.com/2012/07/16/osm-karten-auf-garmin-etrex10/ "kapaneus") when creating my first map (another useful entry point could be [this](http://gps.maroufi.net/index.shtml), it describes a slightly different approach, where map and points of interest are dealt with separately). In this post I want to give some additional hints that might be useful.

## Software/Links I used
[geofabrik.de](http://download.geofabrik.de/ "geofabrik") provided the OpenStreetMap raw data.
For filtering data, restricting the area, merging maps etc. I used [Osmosis](http://wiki.openstreetmap.org/wiki/Osmosis). There is a GUI for Osmosis: [OSMembrane](http://code.google.com/p/osmembrane-gui/).
[Map Composer](http://composer.waldpfa.de/index.php/MC/Download) was used for transforming the resulting OSM data into Garmin map files and [GPSMapEdit](http://www.geopainting.com) for previewing those files.

## Suggestions
If you start playing around, it is a good idea to restrict the raw data to the maximal area you are interested in (of course this depends on the level of detail you want in your map). Here OSMembrane is quite useful (read task, bounding box - visual, write task). This will reduce the roundtrip time as filtering through GB of data you are not interested in anyway is a waste.

GPSMapEdit was invaluable as storing the resulting map onto the Garmin for inspecting the result is a real pain.

kapaneus uses a positive-list for filtering — you enumerate those elements that should show up. As a result my first map was missing an important lake. Not having worked with OSM data before, I could not tell what was wrong. (The basic problem is that "way" and "relation" are sometimes used for the same things — lakes for example.) This is why I then used a negative-list — you enumerate what you are not interested in. The filter is much bigger but it has one advantage — it tells you explicitly what will not show up on the resulting map, you cannot miss anything by accident. And if you want to reuse the filter for another region where parking lots are suddenly of interest, you simply remove that part of the filter (which is simpler than first having to find out what tag to use and adding it).

My general workflow was: 

* apply the current filter to the input file, creating the OSM output
* transform the OSM output into the Garmin img file
* preview that file using GPSMapEdit
* identify elements/areas not needed in the map
* (text)search the input file for potential tags causing those lements to be shown
* change the osmosis filter definition accordingly and start from the again

I did not use OSMembrane for actually defining the filters. The graphical editing for that would have been to complicated — you do get a selection for tags and values, but I found no way to select multiple elements at once. However, it is very nice for simple stuff (bounding box, merging two files, creating an initial filter command you can then edit in a text editor and paste to the command line).

Currently I combine three filtered OSM maps. Cities for the entire country (here I used a positive-list filter: `--tag-filter reject-relations --tag-filter reject-ways --tag-filter accept-nodes place=city,town`) and two detailed regional maps (hometown+surroundings for day trips, and a very probable vacation region).
And here is the filter that works quite well for me

```
--tag-filter reject-relations landuse=village_green,farm,farmyard,allotments,farmland,forest,meadow,grass,retail,industrial,commercial,orchard,residential,military,construction,brownfield,garages,quarry ^
--tag-filter reject-relations usage=village_green,farm,farmyard,allotments,farmland,forest,meadow,grass,retail,industrial,commercial,orchard,residential,military,construction,brownfield,garages,quarry ^
--tag-filter reject-ways landuse=village_green,farm,farmyard,allotments,farmland,forest,meadow,grass,retail,industrial,commercial,orchard,residential,military,construction,brownfield,garages,quarry ^
--tag-filter reject-ways power=* ^
--tag-filter reject-nodes building=* ^
--tag-filter reject-ways building=yes,public,apartments,house,hotel,commercial,garage,garages,residential,hall,church,university,school,office,roof,retail ^
--tag-filter reject-relations building=commercial ^
--tag-filter reject-ways building:part=yes ^
--tag-filter reject-relations natural=scrub,wood ^
--tag-filter reject-ways natural=scrub,wood ^
--tag-filter reject-relations restriction=* ^
--tag-filter reject-nodes public_transport=stop_position ^
--tag-filter reject-ways public_transport=platform ^
--tag-filter reject-nodes trafic_sign=* ^
--tag-filter reject-nodes shop=* ^
--tag-filter reject-nodes barrier=* ^
--tag-filter reject-ways barrier=* ^
--tag-filter reject-nodes addr:housenumber=* ^
--tag-filter reject-nodes amenity=post_box,waste_basket,biergarten,bbq,parking,grit_bin,recycling,fuel,pub,cafe,restaurant,bus_station,telephone,nightclub,bank,taxi,pharmacy,fast_food,fire_station,post_office,school,car_sharing,vending_machine,emergency_service,atm,bar,veterinary,university,school ^
--tag-filter reject-ways amenity=parking,bank,public_building,doctors,veterinary,sauna,university,school ^
--tag-filter reject-relations amenity=post_box,waste_basket,biergarten,bbq,parking,grit_bin,recycling,fuel,pub,cafe,restaurant,bus_station,telephone,nightclub,bank,taxi,pharmacy,fast_food,fire_station,post_office,school,car_sharing,vending_machine,emergency_service,atm,bar,veterinary,university,school ^
--tag-filter reject-ways former_amenity=* ^
--tag-filter reject-ways shop=* ^
--tag-filter reject-ways abutters=commercial ^
--tag-filter reject-ways area=* ^
--tag-filter reject-ways man_made=pipeline ^
--tag-filter reject-ways service=parking_aisle ^
--tag-filter reject-relations type=route,site ^
--tag-filter reject-ways boundary=forest ^
--tag-filter reject-relations boundary=administrative,political,postal_code ^
--tag-filter reject-ways sport=* ^
--tag-filter reject-ways leisure=sports_centre,pitch,track,park,playground,garden ^
--tag-filter reject-relations leisure=sports_centre,pitch,track,park,playground,garden ^
--used-node
```

You see that it still contains quite a lot of wildcards, well for these tags I was not interested in anything so I spent no effort in finding out which values where actually used.