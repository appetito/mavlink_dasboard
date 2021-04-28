
import './mavlink.js';
import {CanvasPlot, Plot, Widget, Row, Root} from './grid.js';

import 'rickshaw/rickshaw.css';
import 'bulma/css/bulma.min.css';


console.log("ZZZ", mavlink20, MAVLink20Processor);


class MAVlinkDashboard{

    constructor(){
        this.ui = {};
        this.port = null;
        this.initUI();
        this.mav = new MAVLink20Processor(console, 255, 1);
        this.gridRoot = new Root(document.body);

        const row = new Row(this.gridRoot);
        this.rows = [row];
    }

    initUI(){
        this.ui.controls = {};
        this.ui.controls.connectButton = document.getElementById("connect");
        this.ui.controls.requestDataButton = document.getElementById("request_data");

        this.ui.status = {
            link: document.getElementById("link_status"),
            system: document.getElementById("system_status"),
        };

        this.ui.controls.connectButton.addEventListener('click', async () => {

              try {
                console.log('THIS', this);
                this.port = await navigator.serial.requestPort();
                // Continue connecting to the device attached to |port|.
                await this.port.open({ baudRate: 57600 });
                // window.sport = port;
                console.log("Port opened:", this.port);
                this.mav.file = this.port.writable.getWriter();


                while (this.port.readable) {
                  const reader = this.port.readable.getReader();

                  try {
                    while (true) {
                      const { value, done } = await reader.read();
                      if (done) {
                        // Allow the serial port to be closed later.
                        reader.releaseLock();
                        break;
                      }
                      if (value) {
                        // console.log(value);
                        
                        // const buf = Buffer.from(value.buffer);
                        const msgs = this.mav.parseBuffer(value);
                        if(msgs){
                            for(let m of msgs){
                                if(m.id === 0){
                                    console.log('HB:', m);
                                }else if(m.name == 'COMMAND_ACK'){
                                    console.log('ACK:', m);
                                }
                            }
                        }

                      }
                    }
                  } catch (error) {
                    console.log("Read Error:", error, reader);
                  }
                }
                console.log("NOT READABLE???", this.port, this.port.readable, reader);

              } catch (e) {
                // The prompt has been dismissed without selecting a device.
                console.log("Err:", e);
              }
        });


        this.ui.controls.requestDataButton.addEventListener('click', async () => {
            console.log('MOD', mavlink20, mavlink20.messages, this);
            let msg = new mavlink20.messages.command_long(
                1, 1, mavlink20.MAV_CMD_SET_MESSAGE_INTERVAL, 1, mavlink20.MAVLINK_MSG_ID_SCALED_IMU2, 100000, 0, 0, 0, 0, 0, 0);
            await this.mav.send(msg);
            console.log('MSG SENT', msg);
        }); 
    }

    addPlot(options){
        this.plotWidget = new Plot(this.rows[0]);
        this.plotWidget.subscribe(this.mav);
    }

    addCanvasPlot(options){
        this.plotWidget = new CanvasPlot(this.rows[0]);
        this.plotWidget.subscribe(this.mav);
    }
}

// const mav = new MAVLink20Processor(console, 255, 1);

// const tv = 100;

// // instantiate our graph!
// const graph = new Rickshaw.Graph( {
//     element: document.getElementById("chart"),
//     width: 1200,
//     height: 250,
//     renderer: 'line',
//     min: 'auto',
//     series: new Rickshaw.Series.FixedDuration([{ name: 'xmag' }, { name: 'ymag' }, { name: 'zmag' }], undefined, {
//         timeInterval: tv,
//         maxDataPoints: 1000,
//         timeBase: new Date().getTime() / 1000
//     }) 
// } );

// var xAxis = new Rickshaw.Graph.Axis.Time({
//     graph: graph
// });



// var yAxis = new Rickshaw.Graph.Axis.Y({
//     graph: graph
// });

// var legend = new Rickshaw.Graph.Legend( {
//     graph: graph,
//     element: document.getElementById('legend')

// } );

// legend.render();
// xAxis.render();
// yAxis.render();
// graph.render();


// mav.on('HEARTBEAT', (msg) => {

//     ui.status.link.innerText = 'Connected';
//     ui.status.link.style.backgroundColor = "green";
//     if(ui.status.link.link_timeout){
//         clearTimeout(ui.status.link.link_timeout);
//     }
//     ui.status.link.link_timeout = setTimeout(() => {
//         ui.status.link.innerText = 'Lost';
//         ui.status.link.style.backgroundColor = "red";
//     }, 10000);

//     ui.status.system.innerText = `BM: ${msg.base_mode}, CM: ${msg.custom_mode}, ST: ${msg.system_status}`;

// });


// mav.on('SCALED_IMU2', (msg) => {
//     let s = Math.sqrt(msg.xmag * msg.xmag + msg.ymag * msg.ymag + msg.zmag * msg.zmag);
//     ui.data.mag.innerText = `X: ${msg.xmag}, Y: ${msg.ymag}, Z: ${msg.zmag}, M: ${s}`;

//     var data = {
//         xmag: msg.xmag,
//         ymag: msg.ymag,
//         zmag: msg.zmag,
//     };

//     graph.series.addData(data);
//     graph.render();
// });

window.app = new MAVlinkDashboard();

console.log('KUKU', Widget);



// var dataPoints1 = [];
// var dataPoints2 = [];

// var chart = new CanvasJS.Chart(document.getElementById("chartContainer"), {
//     // zoomEnabled: true,
//     title: {
//         text: "Share Value of Two Companies"
//     },
//     // axisX: {
//     //     title: "chart updates every 3 secs"
//     // },
//     // axisY:{
//     //     prefix: "$",
//     //     includeZero: false
//     // }, 
//     // toolTip: {
//     //     shared: true
//     // },
//     // legend: {
//     //     cursor:"pointer",
//     //     verticalAlign: "top",
//     //     fontSize: 22,
//     //     fontColor: "dimGrey",
//     //     itemclick : toggleDataSeries
//     // },
//     data: [{ 
//         type: "spline",
//         // xValueType: "dateTime",
//         // yValueFormatString: "$####.00",
//         // xValueFormatString: "hh:mm:ss TT",
//         // showInLegend: true,
//         // name: "Company A",
//         dataPoints: dataPoints1
//         },
//         {               
//             type: "spline",
//             // xValueType: "dateTime",
//             // yValueFormatString: "$####.00",
//             // showInLegend: true,
//             // name: "Company B" ,
//             dataPoints: dataPoints2
//     }]
// });

// function toggleDataSeries(e) {
//     if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
//         e.dataSeries.visible = false;
//     }
//     else {
//         e.dataSeries.visible = true;
//     }
//     chart.render();
// }

// var updateInterval = 300;
// // initial value
// var yValue1 = 600; 
// var yValue2 = 605;

// var time = new Date;
// // starting at 9.30 am
// time.setHours(9);
// time.setMinutes(30);
// time.setSeconds(0);
// time.setMilliseconds(0);

// function updateChart(count) {
//     count = count || 1;
//     var deltaY1, deltaY2;
//     for (var i = 0; i < count; i++) {
//         time.setTime(time.getTime()+ updateInterval);
//         deltaY1 = .5 + Math.random() *(-.5-.5);
//         deltaY2 = .5 + Math.random() *(-.5-.5);

//     // adding random value and rounding it to two digits. 
//     yValue1 = Math.round((yValue1 + deltaY1)*100)/100;
//     yValue2 = Math.round((yValue2 + deltaY2)*100)/100;

//     // pushing the new values
//     dataPoints1.push({
//         x: time.getTime(),
//         y: yValue1
//     });
//     dataPoints2.push({
//         x: time.getTime(),
//         y: yValue2
//     });
//     }

//     // updating legend text with  updated with y Value 
//     chart.options.data[0].legendText = " Company A  $" + yValue1;
//     chart.options.data[1].legendText = " Company B  $" + yValue2; 
//     chart.render();
// }
// // generates first set of dataPoints 
// updateChart(100);   
// setInterval(function(){updateChart()}, updateInterval);
