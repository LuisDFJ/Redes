

var gaugeC1 = Gauge(
  document.getElementById("gaugeC1"), {
    max: 500,
    dialStartAngle: 90,
    dialEndAngle: 0,
    value: 50
  }
);

var gaugeC2 = Gauge(
  document.getElementById("gaugeC2"), {
    max: 500,
    dialStartAngle: 90,
    dialEndAngle: 0,
    value: 50
  }
);

var gaugeP1 = Gauge(
  document.getElementById("gaugeP1"), {
    max: 200,
    dialStartAngle: 180,
    dialEndAngle: 0,
    value: 50
  }
);

var gaugeP2 = Gauge(
  document.getElementById("gaugeP2"), {
    max: 200,
    dialStartAngle: 180,
    dialEndAngle: 0,
    value: 50
  }
);

function renderChart(powerData1, powerData2, labels) {
  var ctx = document.getElementById("myChart").getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'POWER 1',
          data: powerData1,
          borderColor: 'rgba(95, 158, 160, 0.9)',
          backgroundColor: 'rgba(95, 158, 160, 0.05)',
        },
        {
          label: 'POWER 2',
          data: powerData2,
          borderColor: 'rgba(184, 134, 11, 0.9)',
          backgroundColor: 'rgba(184, 134, 11, 0.05)',
        }]
      },
      options: {            
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true,
                  }
              }]                
          }
      },
  });
}


(function loop() {
  var value1 = Math.random() * 500,
      value2 = Math.random() * 500,
      value3 = Math.random() * 200,
      value4 = Math.random() * 200,
      value5 = Math.random() * 5,
      value6 = Math.random() * 5;

  var powerData1 = [value1,value2,value3];
  var powerData2 = [value3,value1,value4];
  var labels = ['hola', 'hola2', 'hola3']; 

  gaugeC1.setValueAnimated(value1, 2);
  gaugeC2.setValueAnimated(value2, 2);
  gaugeP1.setValueAnimated(value3, 1);
  gaugeP2.setValueAnimated(value4, 1);
  document.getElementById("Vol1").innerHTML = value5.toFixed(2).toString();
  document.getElementById("Vol2").innerHTML = value6.toFixed(2).toString();
  renderChart(powerData1,powerData2,labels);
  window.setTimeout(loop, 5000);
  
})();