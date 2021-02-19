function generatePalette() {
  const arr = [
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "ffa600",
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "ffa600",
  ];

  return arr;
}

function populateChart(data) {
  let durationsSummed = durationSummed(data);
  let durationsUnsummed = durationUnsummed(data);
  let totalPounds = calculateTotalWeight(data);
  let pounds = getPounds(data);
  let workouts = workoutNames(data);
  const colors = generatePalette();

  let line = document.querySelector("#canvas").getContext("2d");
  let bar = document.querySelector("#canvas2").getContext("2d");
  let pie = document.querySelector("#canvas3").getContext("2d");
  let pie2 = document.querySelector("#canvas4").getContext("2d");

  const labels = data.map(({ day }) => {
    const date = new Date(day);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });

  let lineChart = new Chart(line, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Workout Duration In Minutes",
          backgroundColor: "red",
          borderColor: "red",
          data: durationsSummed,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      title: {
        display: true,
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
            },
          },
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
            },
          },
        ],
      },
    },
  });

  let barChart = new Chart(bar, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Pounds",
          data: totalPounds,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Pounds Lifted",
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });

  let pieChart = new Chart(pie, {
    type: "pie",
    data: {
      labels: workouts,
      datasets: [
        {
          label: "Exercises Performed",
          backgroundColor: colors,
          data: durationsUnsummed,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Exercises Performed",
      },
    },
  });

  let donutChart = new Chart(pie2, {
    type: "doughnut",
    data: {
      labels: workouts,
      datasets: [
        {
          label: "Exercises Performed",
          backgroundColor: colors,
          data: pounds,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Exercises Performed",
      },
    },
  });
}

function calculateTotalWeight(data) {
  let totals = [];

  data.forEach((workout) => {
    const workoutTotal = workout.exercises.reduce((total, { type, weight }) => {
      if (type === "resistance") {
        return total + weight;
      } else {
        return total;
      }
    }, 0);

    totals.push(workoutTotal);
  });

  return totals;
}
function getPounds(data) {
  let pounds = [];

  data.forEach((workout) => {
    for (let i = 0; i < workout.exercises.length; i++) {
      if (workout.exercises[i].type === "resistance") {
        pounds.push(workout.exercises[i].weight);
      }
    }
  });
  return pounds;
}

function workoutNames(data) {
  let workouts = [];

  data.forEach((workout) => {
    for (let i = 0; i < workout.exercises.length; i++) {
      if (workout.exercises[i].type === "resistance") {
        workouts.push(workout.exercises[i].name);
      }
    }
  });

  // return de-duplicated array with JavaScript `Set` object
  return [...new Set(workouts)];
}

function durationUnsummed(data) {
  let durations = [];

  data.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      durations.push(exercise.duration);
    });
  });

  return durations;
}
function durationSummed(data) {
  let durations = [];
  data.forEach((workout) => {
    let oneWorkoutDuration = 0;
    for (let i = 0; i < workout.exercises.length; i++) {
      oneWorkoutDuration += workout.exercises[i].duration;
    }
    durations.push(oneWorkoutDuration);
  });

  return durations;
}

// get all workout data from back-end
API.getWorkoutsInRange().then(populateChart);
