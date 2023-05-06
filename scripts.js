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

  // Update the chart
  updateChart(progressHistory);
}

function updateChart(progressHistory) {
  // Prepare the data for the chart
  const labels = Object.keys(progressHistory);
  const speakingData = Object.values(progressHistory).map((progress) => progress.speakingHours);
  const vocabularyData = Object.values(progressHistory).map((progress) => progress.vocabularyHours);
  const grammarData = Object.values(progressHistory).map((progress) => progress.grammarHours);
  const listeningData = Object.values(progressHistory).map((progress) => progress.listeningHours);
  const funData = Object.values(progressHistory).map((progress) => progress.funHours);
  const otherData = Object.values(progressHistory).map((progress) => progress.otherHours);

  // Create the chart
  const ctx = document.getElementById('progress-chart').getContext('2d');
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
  // maintainAspectRatio: true, // Comment or remove this line
  // aspectRatio: 2.5, // Comment or remove this line
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
      text: 'Arabic Learning Progress',
    },
    },
  },
});

}

// Fetch the initial progress history
fetchProgressHistory();
