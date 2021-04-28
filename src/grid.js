
import Rickshaw from 'rickshaw';
import CanvasJS from './canvasjs.min.js';


function domEl(tag, attributes){
	const el = document.createElement(tag);
	for(let attr in attributes){
		el.setAttribute(attr, attributes[attr]);
	}
	return el;
}


class Element{

	constructor(parent){
		this.parent = parent;
		this.el = this.createEl();
		this.attachToParent();
	}

	attachToParent(){
		this.parent.el.appendChild(this.el);
	}

	attachEl(el){
		this.el.appendChild(el);
	}

}


class Root extends Element{
	createEl(){
		return domEl('container', {class: 'container'});
	}

	attachToParent(){
		this.parent.appendChild(this.el);
	}
}

class Row extends Element{
	createEl(){
		return domEl('div', {class: 'columns'});
	}
}


class Widget extends Element{
	createEl(){
		return domEl('div', {class: 'column'});
	}
}


class Plot extends Widget{

	createEl(){
		const root = super.createEl();
		const tv = 200;
		console.log('RT', root);
		// instantiate our graph!
		this.graph = new Rickshaw.Graph( {
		    element: root,
		    // width: 1200,
		    height: 250,
		    renderer: 'line',
		    min: 'auto',
		    series: new Rickshaw.Series.FixedDuration([{ name: 'xmag' }, { name: 'ymag' }, { name: 'zmag' }], undefined, {
		        timeInterval: tv,
		        maxDataPoints: 200,
		        timeBase: new Date().getTime() / 1000
		    }) 
		} );

		this.xAxis = new Rickshaw.Graph.Axis.Time({
		    graph: this.graph
		});



		this.yAxis = new Rickshaw.Graph.Axis.Y({
		    graph: this.graph
		});

		const legendEl = domEl('div');
		root.appendChild(legendEl);

		this.legend = new Rickshaw.Graph.Legend( {
		    graph: this.graph,
		    element: legendEl

		} );


		this.legend.render();
		this.xAxis.render();
		this.yAxis.render();
		this.graph.render();

		return root;
	}

	subscribe(mav){
		mav.on('SCALED_IMU2', msg => this.onImuData(msg));
	}

	onImuData(msg){
		let s = Math.sqrt(msg.xmag * msg.xmag + msg.ymag * msg.ymag + msg.zmag * msg.zmag);
	    // ui.data.mag.innerText = `X: ${msg.xmag}, Y: ${msg.ymag}, Z: ${msg.zmag}, M: ${s}`;

	    var data = {
	        xmag: msg.xmag,
	        ymag: msg.ymag,
	        zmag: msg.zmag,
	    };

	    this.graph.series.addData(data);
	    this.graph.render();
	}

}



class CanvasPlot extends Widget{

	createEl(){
		const root = super.createEl();
		const tv = 200;
		console.log('RT', root);
		this.dataPointsX = [];
		this.dataPointsY = [];
		this.dataPointsZ = [];
		this.maxDataPoints = 200;
		this.cnt = 0;
		for(let i=0; i < this.maxDataPoints; i++){
			this.dataPointsX.push({x: i, y: 0});
			this.dataPointsY.push({x: i, y: i});
			this.dataPointsZ.push({x: i, y: 15});
			this.cnt++;
		}
		// instantiate our graph!
		this.plot = new CanvasJS.Chart(document.getElementById("chartContainer"), {
					title : {
						text : "Dynamic Data"
					},
					data : [
						{
							type : "spline",
							dataPoints : this.dataPointsX
						},
						{
							type : "spline",
							dataPoints : this.dataPointsY
						},
						{
							type : "spline",
							dataPoints : this.dataPointsZ
						},
					]
				});

		this.plot.render();

		return root;
	}

	subscribe(mav){
		mav.on('SCALED_IMU2', msg => this.onImuData(msg));
	}

	onImuData(msg){
		let s = Math.sqrt(msg.xmag * msg.xmag + msg.ymag * msg.ymag + msg.zmag * msg.zmag);
	    // ui.data.mag.innerText = `X: ${msg.xmag}, Y: ${msg.ymag}, Z: ${msg.zmag}, M: ${s}`;

	    // var dataZ = {
	    //     x: msg.zmag,
	    //     // ymag: msg.ymag,
	    //     // zmag: msg.zmag,
	    // };
	    this.cnt ++;
	    this.dataPointsX.push({x: this.cnt, y: msg.xmag});
	    this.dataPointsX.shift();

	    this.dataPointsY.push({x: this.cnt, y: msg.ymag});
	    this.dataPointsY.shift();

	    this.dataPointsZ.push({x: this.cnt, y: msg.zmag});
	    this.dataPointsZ.shift();

	    this.plot.render();
	}

}


export {CanvasPlot, Plot, Widget, Row, Root};

// /////
// root_el = new Root(document.body);
// r1 = new Row(root_el);

// r2 = new Row(root_el);

// c1 = new Widget(r1);

// c2 = new Widget(r1);

// c3 = new Widget(r2);

// root_el.el.children
