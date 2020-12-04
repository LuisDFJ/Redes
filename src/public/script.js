

var gaugeC1 = Gauge(
  document.getElementById("gaugeC1"), {
    max: 300,
    dialStartAngle: 90,
    dialEndAngle: 0,
    value: 50
  }
);

var gaugeC2 = Gauge(
  document.getElementById("gaugeC2"), {
    max: 300,
    dialStartAngle: 90,
    dialEndAngle: 0,
    value: 50
  }
);

var gaugeP1 = Gauge(
  document.getElementById("gaugeP1"), {
    max: 1500,
    dialStartAngle: 180,
    dialEndAngle: 0,
    value: 50
  }
);

var gaugeP2 = Gauge(
  document.getElementById("gaugeP2"), {
    max: 1500,
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

$(document).ready(() => {
  $('#bttnSys1').click(() => {
    $.ajax({
      url: '/output',
      method: 'post',
      dataType: 'json',
      data: {data: 'Q'},
      success: (res) => {
        console.log("Command sent!");
        if (res.state) {
          document.getElementById("LED1").style.fill = "#0f9d58";
          console.log("LED1: ON");
        } else {
          document.getElementById("LED1").style.fill = "#ffffff";
          console.log("LED1: OFF")
        }
      },
      error: (res) => {
        console.log("Error");
      }
    });
  });
});

$(document).ready(() => {
  $('#bttnSys2').click(() => {
    $.ajax({
      url: '/output',
      method: 'post',
      dataType: 'json',
      data: {data: 'q'},
      success: (res) => {
        console.log("Command sent!");
        if (res.state) {
          document.getElementById("LED2").style.fill = "#0f9d58";
          console.log("LED2: ON");
        } else {
          document.getElementById("LED2").style.fill = "#ffffff";
          console.log("LED2: OFF")
        }
      },
      error: (res) => {
        console.log("Error");
      }
    });
  });
});

var value1 = 0,
  value2 = 0,
  value3 = 0,
  value4 = 0,
  value5 = 0,
  value6 = 0;

var powerData1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var powerData2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function querryData(){
  $(document).ready(() => {
    $.ajax({
      url: '/input',
      method: 'post',
      dataType: 'json',
      data: {data: 'OK'},
      success: (res) => {
        console.log("Command sent!");
        value1 = res.Current1;
        value2 = res.Current2;
        value3 = res.Power1;
        value4 = res.Power2;
        value5 = res.Voltage1;
        value6 = res.Voltage2;
        powerData1 = res.PowerData1;
        powerData2 = res.PowerData2;
      },
      error: (res) => {
        console.log("Error");
      }
    })
  });
  
}


(function loop() {
  querryData();
  var labels = ['-0:45', '-0:40', '-0:35', '-0:30', '-0:25', '-0:20', '-0:15', '-0:10', '-0:05', '0:00']; 
  gaugeC1.setValueAnimated(value1, 2);
  gaugeC2.setValueAnimated(value2, 2);
  gaugeP1.setValueAnimated(value3, 1);
  gaugeP2.setValueAnimated(value4, 1);
  document.getElementById("Vol1").innerHTML = value5.toFixed(2).toString();
  document.getElementById("Vol2").innerHTML = value6.toFixed(2).toString();
  renderChart(powerData1,powerData2,labels);
  window.setTimeout(loop, 5000);
  
})();