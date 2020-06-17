// charts function
function showCharts(id) {
    // use d3 to load the data from json
    d3.json("./samples.json").then(data => {
        console.log(data.samples);
        // filter the data by id
        var sample_id = data.samples.filter(d => d.id.toString() === id)[0];

        // get the top 10 sample values
        var top_values = sample_id.sample_values.slice(0,10).reverse();
        console.log(`values:${top_values}`);
        // get the top 10 ids
        var top_id = sample_id.otu_ids.slice(0,10).reverse();
        console.log(`id:${top_id}`);
        // get the top 10 labels for the ids
        var top_label = sample_id.otu_labels.slice(0,10);
        console.log(`label:${top_label}`);

        // bar chart to show the top 10 values with ids and labels
        var trace1 = {
            x : top_values,
            y : top_id.map(d => "OTU " + d),
            text : top_label,
            type : "bar",
            orientation : "h"
        };

        var data1 = [trace1];
        Plotly.newPlot("bar",data1);

        // bubble chart
        var trace2 = {
            x : sample_id.otu_ids,
            y : sample_id.sample_values,
            mode : "markers",
            marker : {
                size : sample_id.sample_values,
                color : sample_id.otu_ids,
            },
            text : sample_id.otu_labels
        };

        var data2 = [trace2];
        Plotly.newPlot("bubble",data2);

    });
}

// function to display the demography information 
function demoInfo(id){
    // loading data with d3
    d3.json("./samples.json").then(data => {
        console.log(data.metadata);
        // filter the data with id
        var metadata_id = data.metadata.filter(d => d.id.toString() === id)[0];
        console.log(metadata_id);
        // select the id to append text
        var update_info = d3.select("#sample-metadata");
        // clear the old data
        update_info.html("");
        // appending information
        Object.entries(metadata_id).forEach(([key,value]) => {
            var info = update_info.append("h6");
            info.text(`${key}:${value}`);
        });

        // Optional: Gauge chart
        var trace3 = {
            domain : {x : [0,1], y : [0,1]},
            value : metadata_id.wfreq,
            title : {text:"Belly Button Wash Frequency"},
            type : "indicator",
            mode : "gauge+number",
            gauge : {
                axis : {range : [null,9]},
                steps : [
                    {range : [0,1],color:"#ebfaeb"},
                    {range : [1,2],color:"#d6f5d6"},
                    {range : [2,3],color:"#c2f0c2"},
                    {range : [3,4],color:"#99e699"},
                    {range : [4,5],color:"#85e085"},
                    {range : [5,6],color:"#70db70"},
                    {range : [6,7],color:"#5cd65c"},
                    {range : [7,8],color:"#47d147"},
                    {range : [8,9],color:"#2eb82e"},
                ]
            }
        };
        var data3 = [trace3];
        Plotly.newPlot("gauge",data3);
    });
    
}

// create initial function
function init(){
    // select the dropdown menu
    var dropdownMenu = d3.select("#selDataset")
    // loading json file with d3
    d3.json("./samples.json").then(data => {
        console.log(data.names);
        // appendind option for different ids
        data.names.forEach(name => {
            var option = dropdownMenu.append("option");
            option.text(name).property("value");
        });
        // call the function
        demoInfo(data.names[0]);
        showCharts(data.names[0]);
    });
}

function optionChanged(id){
    demoInfo(id);
    showCharts(id);
}

init();

