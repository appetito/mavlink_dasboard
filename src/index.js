import _ from 'lodash';

import './bundle.js';


console.log("ZZZ", mavlink20, MAVLink20Processor);


var gstate = {
        xmag: 0,
        ymag: 0,
        zmag: 0
    };

// const connectButton = document.getElementById("connect");
// const requestDataButton = document.getElementById("request_data");

const ui = {
    controls: {
        connectButton: document.getElementById("connect"),
        requestDataButton: document.getElementById("request_data")
    },

    status: {
        link: document.getElementById("link_status"),
        system: document.getElementById("system_status")
    },


    data: {
        mag: document.getElementById("mag_data"),
        // system: document.getElementById("system_status")
    },
}

const mav = new MAVLink20Processor(console, 255, 1);

const tv = 100;

// instantiate our graph!
const graph = new Rickshaw.Graph( {
    element: document.getElementById("chart"),
    width: 1200,
    height: 250,
    renderer: 'line',
    min: 'auto',
    series: new Rickshaw.Series.FixedDuration([{ name: 'xmag' }, { name: 'ymag' }, { name: 'zmag' }], undefined, {
        timeInterval: tv,
        maxDataPoints: 1000,
        timeBase: new Date().getTime() / 1000
    }) 
} );

var xAxis = new Rickshaw.Graph.Axis.Time({
    graph: graph
});



var yAxis = new Rickshaw.Graph.Axis.Y({
    graph: graph
});

var legend = new Rickshaw.Graph.Legend( {
    graph: graph,
    element: document.getElementById('legend')

} );

legend.render();
xAxis.render();
yAxis.render();
graph.render();


mav.on('HEARTBEAT', (msg) => {

    ui.status.link.innerText = 'Connected';
    ui.status.link.style.backgroundColor = "green";
    if(ui.status.link.link_timeout){
        clearTimeout(ui.status.link.link_timeout);
    }
    ui.status.link.link_timeout = setTimeout(() => {
        ui.status.link.innerText = 'Lost';
        ui.status.link.style.backgroundColor = "red";
    }, 10000);

    ui.status.system.innerText = `BM: ${msg.base_mode}, CM: ${msg.custom_mode}, ST: ${msg.system_status}`;

});


mav.on('SCALED_IMU2', (msg) => {
    let s = Math.sqrt(msg.xmag * msg.xmag + msg.ymag * msg.ymag + msg.zmag * msg.zmag);
    ui.data.mag.innerText = `X: ${msg.xmag}, Y: ${msg.ymag}, Z: ${msg.zmag}, M: ${s}`;

    var data = {
        xmag: msg.xmag,
        ymag: msg.ymag,
        zmag: msg.zmag,
    };

    graph.series.addData(data);
    graph.render();

    // var data = { one: Math.floor(Math.random() * 40) + 120 };

    // var randInt = Math.floor(Math.random()*100);
    // data.two = (Math.sin(i++ / 40) + 4) * (randInt + 400);
    // data.three = randInt + 300;

    // graph.series.addData(data);
    // graph.render();
    // console.log('GR', graph, data);
});


ui.controls.connectButton.addEventListener('click', async () => {

  try {

    const port = await navigator.serial.requestPort();
    // Continue connecting to the device attached to |port|.
    await port.open({ baudRate: 57600 });
    // window.sport = port;
    console.log("Port opened:", port);
    mav.file = port.writable.getWriter();


    while (port.readable) {
      const reader = port.readable.getReader();

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
            const msgs = mav.parseBuffer(value);
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
    console.log("NOT READABLE???", port, port.readable, reader);

  } catch (e) {
    // The prompt has been dismissed without selecting a device.
    console.log("Err:", e);
  }


});


ui.controls.requestDataButton.addEventListener('click', async () => {
    console.log('MOD', mavlink20, mavlink20.messages);
    let msg = new mavlink20.messages.command_long(
        1, 1, mavlink20.MAV_CMD_SET_MESSAGE_INTERVAL, 1, mavlink20.MAVLINK_MSG_ID_SCALED_IMU2, 500, 0, 0, 0, 0, 0, 0);
    await mav.send(msg);
    console.log('MSG SENT', msg);
});

// const writer = port.writable.getWriter();

// const data = new Uint8Array([104, 101, 108, 108, 111]); // hello
// await writer.write(data);





console.log('KUKU');



// // add some data every so often

// var i = 0;
// var iv = setInterval( function() {

//     var data = { xmag: Math.floor(Math.random() * 40) + 120 };

//     var randInt = Math.floor(Math.random()*100);
//     data.ymag = (Math.sin(i++ / 40) + 4) * (randInt + 400);
//     data.zmag = randInt + 300;

//     // var data = {
//     //     xmag: Math.abs(gstate.xmag),
//     //     ymag: Math.abs(gstate.ymag),
//     //     zmag: Math.abs(gstate.zmag)
//     // };
//     console.log('D:', data);
//     graph.series.addData(data);
//     graph.render();

// }, tv );