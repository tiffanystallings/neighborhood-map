# Mapping Marietta
Integrates the Google Maps API with the Foursquare API to build a map of a small section of my town, Marietta. Highlighted on the map are a few locations that I know and love.

Users can add a location to their favorites (which will be saved via localStorage) and locations can be filtered by type.

I created my own set of custom icons in order to distinguish the different types of locations at first glance.

Check out the live demo [here](http://tiffanystallings.github.io/neighborhood-map)!

## Requirements
Mapping Marietta will work on most modern browsers, however it is NOT supported by Opera Mini.

The following are the oldest browser versions that can run this application successfully:
* IE 9
* Edge 12
* Firefox 19
* Chrome 20
* Safari 6
* Opera 15
* Safari and Chrome for iOS 6
* Android Browser 4.4
* Chrome for Android 61

An internet connection is also required to run the app properly.

## Installation
Using Git Bash:

`$ git clone https://github.com/tiffanystallings/neighborhood-map.git`

From a ZIP:
1. Visit the project's github [here](https://github.com/tiffanystallings/neighborhood-map)
2. Click the **Clone or Download** dropdown box and select  
**Download ZIP**.
3. Open the ZIP and click **Extract All**. Select your preferred  folder and hit **Extract**.

## Usage
To run the app, simply open the index.html file in your preferred browser while connected to the internet.

On load you will see a list of locations in the side panel and a map populated with markers. Clicking on the markers, you will get the address and phone number (if available) for that location. Locations can also be selected via their corrosponding element on the list pane.

You can filter locations by type on the dropdown menu, which will clear the map and list of all locations except those of the selected type.

Clicking the star icon beside the location title in the list pane will add that location to your favorites. This will change the icon on the map to distinguish it from the others, as well as allow it to show up when you filter locations by favorites in the dropdown menu.

These changes are saved to your device's local storage, so you can revisit favorited locations in the future.

## Contributions
This project was built as part of Udacity's Full Stack Web Developer Nanodegree. It would be in violation of the honor code for me to accept any direct contributions to the code.

However, if you have any advice or suggestions on how I might improve the code, please feel free to take out an Issue on the project's [github](https://github.com/tiffanystallings/neighborhood-map).