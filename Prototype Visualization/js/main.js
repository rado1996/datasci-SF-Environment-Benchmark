/**
 * Created by Sanat Moningi
 */

//Setting up leaflet map
var map = L.map('map').setView([37.7833, -122.4167], 14);
//Storing latest energy report data locally
var energyDict = {};
var color; //Color bins

//Getting tile from Mapbox
L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token={accessToken}', {
    maxZoom: 18,
    minZoom: 13,
    attributionControl: false,
    id: 'smoningi.a304c3dc',
    accessToken: 'pk.eyJ1Ijoic21vbmluZ2kiLCJhIjoiQ21rN1pjSSJ9.WKrPFjjb7LRMBjyban698g'
}).addTo(map);

var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");

d3.json("citylots_merge.geojson", function(collection) {
    var transform = d3.geo.transform({point: projectPoint}),
        path = d3.geo.path().projection(transform);
    var feature = g.selectAll("path")
        .data(collection.features)
        .enter()
        .append("path")
        .attr("id", function(d){
          var parcelID = d.properties.blklot;
          var energyStarScore;
          var energyStarYear;
          var weatherNormalizedSourceEUI;
          var weatherNormalizedSourceEUIYear;
          var ghgEmissionsIntensity;
          var ghgEmissionsYear;
          var eui;

          if(d.properties._2014_energy_star_score != null){
            energyStarScore = d.properties._2014_energy_star_score;
            energyStarYear = 2014;
          } else if(d.properties._2013_energy_star_score != null){
            energyStarScore = d.properties._2013_energy_star_score;
            energyStarYear = 2013;
          } else if(d.properties._2012_energy_star_score != null){
            energyStarScore = d.properties._2012_energy_star_score;
            energyStarYear = 2012;
          } else if(d.properties._2011_energy_star_score != null){
            energyStarScore = d.properties._2011_energy_star_score;
            energyStarYear = 2011;
          } else {
            energyStarScore = "N/A";
            energyStarYear = "";
          }

          if(d.properties._2014_total_ghg_emissions_intensity_kgco2e_ft2!= null){
            ghgEmissionsIntensity = d.properties._2014_total_ghg_emissions_intensity_kgco2e_ft2;
            ghgEmissionsYear = 2014;
          } else if(d.properties._2013_total_ghg_emissions_intensity_kgco2e_ft2 != null){
            ghgEmissionsIntensity = d.properties._2013_total_ghg_emissions_intensity_kgco2e_ft2;
            ghgEmissionsYear = 2013;
          } else if(d.properties._2012_total_ghg_emissions_intensity_kgco2e_ft2 != null){
            ghgEmissionsIntensity = d.properties._2012_total_ghg_emissions_intensity_kgco2e_ft2;
            ghgEmissionsYear = 2012;
          } else if(d.properties._2011_total_ghg_emissions_intensity_kgco2e_ft2 != null){
            ghgEmissionsIntensity = d.properties._2011_total_ghg_emissions_intensity_kgco2e_ft2
            ghgEmissionsYear = 2011;
          } else {
            ghgEmissionsIntensity = "N/A";
            ghgEmissionsYear = "";
          }

          if(d._2014_weather_normalized_source_eui_kbtu_ft2 != null){
            weatherNormalizedSourceEUI = d._2014_weather_normalized_source_eui_kbtu_ft2
            weatherNormalizedSourceEUIYear = 2014;
          } else if(d.properties._2013_weather_normalized_source_eui_kbtu_ft2 != null){
            weatherNormalizedSourceEUI = d.properties._2013_weather_normalized_source_eui_kbtu_ft2;
            weatherNormalizedSourceEUIYear = 2013;
          } else if(d.properties._2012_weather_normalized_source_eui_kbtu_ft2 != null){
            weatherNormalizedSourceEUI = d.properties._2012_weather_normalized_source_eui_kbtu_ft2;
            weatherNormalizedSourceEUIYear = 2012;
          } else if(d.properties._2011_weather_normalized_source_eui_kbtu_ft2 != null){
            weatherNormalizedSourceEUI = d.properties._2011_weather_normalized_source_eui_kbtu_ft2;
            weatherNormalizedSourceEUIYear = 2011;
          } else {
            weatherNormalizedSourceEUI = "N/A";
            weatherNormalizedSourceEUIYear = "";
          }

          energyDict[parcelID] = {
            "Energy Star Score" : energyStarScore,
            "Energy Star Year" : energyStarYear,
            "GHG Emissions Intensity" : ghgEmissionsIntensity,
            "GHG Year" : ghgEmissionsYear,
            "Weather Normalized Source EUI" : weatherNormalizedSourceEUI,
            "Weather Normalized Source EUI Year" : weatherNormalizedSourceEUIYear,
            "Property Type" : d.properties.property_type_self_selected
          };

          //Store Max and Mins
          if(energyDict["Energy Star Score Max"] == null){
            energyDict["Energy Star Score Max"] = energyDict[parcelID]["Energy Star Score"];
          } else{
            if(energyDict[parcelID]["Energy Star Score"] > energyDict["Energy Star Score Max"]){
              energyDict["Energy Star Score Max"] = energyDict[parcelID]["Energy Star Score"];
            }
          }

          if(energyDict["Energy Star Score Min"] == null){
            energyDict["Energy Star Score Min"] = energyDict[parcelID]["Energy Star Score"];
          } else{
            if(energyDict[parcelID]["Energy Star Score"] < energyDict["Energy Star Score Min"]){
              energyDict["Energy Star Score Min"] = energyDict[parcelID]["Energy Star Score"];
            }
          }

          if(energyDict["GHG Emissions Max"] == null){
            energyDict["GHG Emissions Max"] = energyDict[parcelID]["GHG Emissions Intensity"];
          } else{
            if(energyDict[parcelID]["GHG Emissions Intensity"] > energyDict["GHG Emissions Max"]){
              energyDict["GHG Emissions Max"] = energyDict[parcelID]["GHG Emissions Intensity"];
            }
          }

          if(energyDict["GHG Emissions Min"] == null){
            energyDict["GHG Emissions Min"] = energyDict[parcelID]["GHG Emissions Intensity"];
          } else{
            if(energyDict[parcelID]["GHG Emissions Intensity"] < energyDict["GHG Emissions Min"]){
              energyDict["GHG Emissions Min"] = energyDict[parcelID]["GHG Emissions Intensity"];
            }
          }

           return parcelID;
        })
        .style("stroke", "#B9E7FF")
        .style("fill", function(d){
          var parcelID = d.properties.blklot;
          var average = (energyDict["GHG Emissions Min"] + energyDict["GHG Emissions Max"]) / 2;
          if(energyDict[parcelID]["GHG Emissions Intensity"] != null){
            var color = d3.scale.quantize()
                //.domain([-2.28277,0, 2.28277])
                .domain([0, 25, 50, 75, 100])
                .range(["#d7191c", "#fdae61", "#a6d96a", "#1a9641"]);
            return color(parseInt(energyDict[parcelID]["Energy Star Score"]));
          } else{
            return "#ffffbf";
          }
        })
        .style("fill-opacity", 0.5)
        .style("stroke-width",0.1)
        .on("mouseover", function(d){
           d3.select(this).style("fill-opacity",1)
           .style("stroke", "#FFCC33")
           .style("stroke-width",2);

           var buildingInfo = "<h4>"+d.properties.building_name+"<\/h4>";
           buildingInfo += "<div>"+  energyDict[d.properties.blklot]["Energy Star Year"] +" Energy Star Score: " + energyDict[d.properties.blklot]["Energy Star Score"] + "<\/div>";
           buildingInfo += "<div>"+  energyDict[d.properties.blklot]["GHG Year"] +" GHG Emissions: " + energyDict[d.properties.blklot]["GHG Emissions Intensity"] + " kgCO<sup>2<\/sup>e&#47;ft<sup>2<\/sup><\/div>";
           buildingInfo += "<div>"+  energyDict[d.properties.blklot]["Weather Normalized Source EUI Year"] +" Weather Normalized Source EUI: " + energyDict[d.properties.blklot]["Weather Normalized Source EUI"] + " kBTU&#47;ft<sup>2<\/sup><\/div>";
           buildingInfo += "<div> Property Type: "+ energyDict[d.properties.blklot]["Property Type"] +"<\/div>";

           $( "#building-details" ).html(buildingInfo);
        })
        .on("mouseout", function(d){
           d3.select(this).style("stroke", "#B9E7FF")
           .style("fill", function(d){
             var parcelID = d.properties.blklot;
             var average = (energyDict["GHG Emissions Min"] + energyDict["GHG Emissions Max"]) / 2;
             if(energyDict[parcelID]["GHG Emissions Intensity"] != null){
               var color = d3.scale.quantize()
                   .domain([0, 25, 50, 75, 100])
                   .range(["#d7191c", "#fdae61", "#a6d96a", "#1a9641"]);
               return color(parseInt(energyDict[parcelID]["Energy Star Score"]));
             } else{
               return "#ffffbf";
             }
           })
           .style("fill-opacity", 0.5)
           .style("stroke-width",0.1);
        });

    map.on("viewreset", reset);
    reset();

    // Reposition the SVG to cover the features.
    function reset() {
        var bounds = path.bounds(collection),
            topLeft = bounds[0],
            bottomRight = bounds[1];

        svg .attr("width", bottomRight[0] - topLeft[0])
            .attr("height", bottomRight[1] - topLeft[1])
            .style("left", topLeft[0] + "px")
            .style("top", topLeft[1] + "px");

        g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

        feature.attr("d", path);
    }

    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    }
});
