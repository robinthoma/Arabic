// Add your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJtgXriTZqRdFipz4NgU2gD286C4pi3-w",
  authDomain: "arabic-progress.firebaseapp.com",
  projectId: "arabic-progress",
  storageBucket: "arabic-progress.appspot.com",
  messagingSenderId: "563086644784",
  appId: "1:563086644784:web:98d906f696ab465d41bff5",
  measurementId: "G-8EEBBX4N63"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Get form elements
const form = document.getElementById('progress-form');
const speakingInput = document.getElementById('speaking');
const vocabularyInput = document.getElementById('vocabulary');
const grammarInput = document.getElementById('grammar');
const listeningInput = document.getElementById('listening');
const funInput = document.getElementById('fun');
const otherInput = document.getElementById('other');
const dateInput = document.getElementById('date');
const progressHistoryContainer = document.getElementById('progress-history');

// Form submission handler
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Get form values
  const speakingHours = parseInt(speakingInput.value, 10);
  const vocabularyHours = parseInt(vocabularyInput.value, 10);
  const grammarHours = parseInt(grammarInput.value, 10);
  const listeningHours = parseInt(listeningInput.value, 10);
  const funHours = parseInt(funInput.value, 10);
  const otherHours = parseInt(otherInput.value, 10);
  const date = dateInput.value;

  // Save the data to Firebase
  await database.ref(`progress/${date}`).set({
    speakingHours,
    vocabularyHours,
    grammarHours,
    listeningHours,
    funHours,
    otherHours,
  });

  // Update progress history
  fetchProgressHistory();
});

async function fetchProgressHistory() {
  // Fetch the progress history from Firebase
  const snapshot = await database.ref('progress').once('value');
  const progressHistory = snapshot.val();

  // Split the progress history into weeks
  const weeks = splitIntoWeeks(progressHistory);

  // Update the charts
  updateCharts(weeks);
}

function splitIntoWeeks(progressHistory) {
  const weeks = [];
  let currentWeek = {};
  let weekIndex = 0;

  for (const date in progressHistory) {
    const currentDate = new Date(date);
    const dayOfWeek = currentDate.getDay();

    if (dayOfWeek === 0) { // Sunday
      weekIndex++;
    }

    if (!currentWeek[weekIndex]) {
      currentWeek[weekIndex] = {};
    }

    currentWeek[weekIndex][date] = progressHistory[date];
  }

  // Transform the currentWeek object into an array of weeks
  for (const week in currentWeek) {
    weeks.push(currentWeek[week]);
  }

  return weeks;
}

function updateCharts(weeks) {
  weeks.forEach((week, index) => {
    // Prepare the data for the chart
    const labels = Object.keys(week);
    const speakingData = Object.values(week).map((progress) => progress.speakingHours);
    const vocabularyData = Object.values(week).map((progress) => progress.vocabularyHours);
    const grammarData = Object.values(week).map((progress) => progress.grammarHours);
    const listeningData = Object.values(week).map((progress) => progress.listeningHours);
    const funData = Object.values(week).map((progress) => progress.funHours);
    const otherData = Object.values(week).map((progress) => progress.otherHours);

    // Create a new div element with the class "chart-container"
    const chartContainer = document.createElement('div');
    chartContainer.classList.add('chart-container');

    // Create a new canvas element for the chart
    const canvas = document.createElement('canvas');
    canvas.classList.add('weekly-chart');
    canvas.style.display = 'block';

    // Append the canvas to the chart container
    chartContainer.appendChild(canvas);

    // Append the chart container to the progress history container
    progressHistoryContainer.appendChild(chartContainer);

    // Create the chart
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Speaking Practice',
            data: speakingData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          },
          {
            label: 'Vocabulary Practice',
            data: vocabularyData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
          },
          {
            label: 'Grammar Practice',
            data: grammarData,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
          },
          {
            label: 'Listening Practice',
            data: listeningData,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            fill: true,
          },
          {
            label: 'Fun',
            data: funData,
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            fill: true,
          },
          {
            label: 'Other',
            data: otherData,
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: `Arabic Learning Progress - Week ${index + 1}`,
          },
        },
      },
    });
  });
}

// Fetch the initial progress history
fetchProgressHistory();
