document.addEventListener("DOMContentLoaded", function () {
  const firebaseConfig = {
    apiKey: "AIzaSyDPQ6FdM6oYYvrkGk0mheivw45L8Ig1xC8",
    authDomain: "edgardeathwindowvotes.firebaseapp.com",
    projectId: "edgardeathwindowvotes",
    storageBucket: "edgardeathwindowvotes.firebasestorage.app",
    messagingSenderId: "664396069532",
    appId: "1:664396069532:web:8be4ca0d64db46ed290b59",
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  const countdownElement = document.getElementById("countdown");
  if (countdownElement) {
    const countdownTargetDate = new Date("September 16, 2025 00:00:00").getTime();
    const windowEndDate = new Date("October 15, 2025 23:59:59").getTime();

    function updateCountdown() {
      const now = new Date().getTime();
      if (now > windowEndDate) {
        countdownElement.innerHTML = "EDGAR'S DEATH DATE WINDOW HAS CLOSED";
        countdownElement.style.color = "LightBlue";
        countdownElement.style.textShadow = "0 0 10px rgba(173, 216, 230, 0.7)";
      } else if (now >= countdownTargetDate && now <= windowEndDate) {
        countdownElement.innerHTML = "WE ARE IN EDGAR'S DEATH DATE WINDOW";
        countdownElement.style.color = "red";
        countdownElement.style.textShadow = "0 0 10px rgba(255, 0, 0, 0.7)";
      } else {
        const distance = countdownTargetDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        countdownElement.style.color = "white";
        countdownElement.style.textShadow = "0 0 15px rgba(255, 255, 255, 0.7)";
      }
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();
  }

  if (window.location.pathname.endsWith("past-results.html")) {
    const pollOptionKeys = ["sept14_20", "sept21_27", "sept28_oct4", "oct5_11", "oct12_18", "before_window", "after_window", "wont_die_young", "already_dead"];
    const voteOptions = {
      sept14_20: { label: "Episode 217: Sept 14 2025 - Sept 20 2025" },
      sept21_27: { label: "Episode 218: Sept 21 2025 - Sept 27 2025" },
      sept28_oct4: { label: "Episode 219: Sept 28 2025 - Oct 4 2025" },
      oct5_11: { label: "Episode 220: Oct 5 2025 - Oct 11 2025" },
      oct12_18: { label: "Episode 221: Oct 12 2025 - Oct 18 2025" },
      before_window: { label: "Before Window" },
      after_window: { label: "After Window" },
      wont_die_young: { label: "Won't Die Young" },
      already_dead: { label: "Already Dead" },
    };
    const chartColors = ["#E4002B", "#C20023", "#A0001B", "#7E0013", "#5C000B", "#4169E1", "#00008B", "#FFD700", "#808080"];
    let voteBarChart;
    let lastVoteCounts = {};

    function renderBarChart(counts) {
      const ctx = document.getElementById("voteBarChart");
      if (!ctx) return;
      const voteCountsArray = pollOptionKeys.map((optionKey) => counts[optionKey] || 0);
      if (voteBarChart) voteBarChart.destroy();
      voteBarChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: pollOptionKeys.map((key) => voteOptions[key].label.split(':')[0]),
          datasets: [{ label: "Number of Votes", data: voteCountsArray, backgroundColor: chartColors, borderColor: "rgba(255, 255, 255, 0.8)", borderWidth: 1 }],
        },
        options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false }, title: { display: true, text: "Distribution of Predictions", color: "#FFD700" } }, scales: { x: { beginAtZero: true, ticks: { color: "white", callback: (value) => (Number.isInteger(value) ? value : null) }, grid: { color: "rgba(255, 255, 255, 0.1)" } }, y: { ticks: { color: "white", font: { size: 14 } }, grid: { color: "rgba(255, 255, 255, 0.1)" } } } },
      });
    }

    db.collection("votes").onSnapshot((snapshot) => {
      const counts = {};
      let totalVotes = 0;
      pollOptionKeys.forEach((option) => counts[option] = 0);
      snapshot.forEach((doc) => {
        const voteType = doc.data().voteType;
        if (counts.hasOwnProperty(voteType)) {
          counts[voteType]++;
          totalVotes++;
        }
      });
      lastVoteCounts = counts;
      renderBarChart(counts);

      const summaryElement = document.getElementById('prediction-summary');
      if (summaryElement && totalVotes > 0) {
        const winningOptionKey = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        const winningLabel = voteOptions[winningOptionKey].label;
        const winningVotes = counts[winningOptionKey];
        summaryElement.innerHTML = `<strong>Top Prediction:</strong><br>${winningLabel} (${winningVotes} of ${totalVotes} votes)`;
      }

      pollOptionKeys.forEach((option, index) => {
        const countDisplay = document.getElementById(`count_${option}`);
        const percentDisplay = document.getElementById(`percent_${option}`);
        const barDisplay = document.getElementById(`bar_${option}`);
        if (countDisplay) {
          countDisplay.textContent = counts[option];
          const percentage = totalVotes > 0 ? ((counts[option] / totalVotes) * 100).toFixed(1) : 0;
          if (percentDisplay) percentDisplay.textContent = `(${percentage}%)`;
          if (barDisplay) {
            barDisplay.style.width = `${percentage}%`;
            barDisplay.style.backgroundColor = chartColors[index];
          }
        }
      });
    });

    window.addEventListener("resize", () => {
      if (voteBarChart && Object.keys(lastVoteCounts).length > 0) renderBarChart(lastVoteCounts);
    });

    let deathPieChart;

    function renderDeathPieChart(counts) {
      const ctx = document.getElementById("deathPieChart");
      if (!ctx) return;
      if (deathPieChart) deathPieChart.destroy();
      deathPieChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Yes", "No"],
          datasets: [{ label: "Number of Votes", data: [counts.yes || 0, counts.no || 0], backgroundColor: ["#FFD700", "#CC0000"], borderColor: "rgba(0, 0, 0, 0.5)", borderWidth: 2 }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top", labels: { color: "white", font: { size: 14 } } } } },
      });
    }

    db.collection("deathPollVotes").onSnapshot((snapshot) => {
      const counts = { yes: 0, no: 0 };
      let totalVotes = 0;
      snapshot.forEach((doc) => {
        const voteType = doc.data().voteType;
        if (counts.hasOwnProperty(voteType)) {
          counts[voteType]++;
          totalVotes++;
        }
      });
      renderDeathPieChart(counts);

      const summaryElement = document.getElementById('aneurysm-summary');
      if(summaryElement && totalVotes > 0) {
        const yesPercent = ((counts.yes / totalVotes) * 100).toFixed(1);
        const noPercent = ((counts.no / totalVotes) * 100).toFixed(1);
        summaryElement.innerHTML = `
          <strong>Yes:</strong> ${counts.yes} votes (${yesPercent}%)<br>
          <strong>No:</strong> ${counts.no} votes (${noPercent}%)
        `;
      }
    });
  }

  if (document.getElementById("cured-poll-section")) {
    const curedPollOptions = {
      edman: "Edman",
      mikey_edgar: "Mikey's Edgar",
      latvia_mike_edgar: "Latvia Mike's Edgar",
      latvia_michael_edgar: "Latvia Michael's Edgar",
      mustardseed: "Mustardseed",
      ovedgar: "OvEdgar",
      none: "None"
    };
    const curedPollKeys = Object.keys(curedPollOptions);
    const resultsContainer = document.querySelector('.cured-poll-results');

    function updateButtonStates() {
      curedPollKeys.forEach(key => {
        const button = document.querySelector(`.cured-vote-button[data-vote-option="${key}"]`);
        if (button && localStorage.getItem(`voted_cured_${key}`)) {
          button.disabled = true;
          button.classList.add('cooldown');
        }
      });
    }

    function handleVote(e) {
      const voteOption = e.target.dataset.voteOption;
      if (voteOption && !e.target.disabled) {
        db.collection("curedPollVotes").add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          voteType: voteOption,
        }).then(() => {
          localStorage.setItem(`voted_cured_${voteOption}`, 'true');
          updateButtonStates();
        }).catch(error => console.error("Error casting vote: ", error));
      }
    }

    document.querySelectorAll('.cured-vote-button').forEach(button => {
      button.addEventListener('click', handleVote);
    });

    db.collection("curedPollVotes").onSnapshot(snapshot => {
      const counts = {};
      curedPollKeys.forEach(key => counts[key] = 0);
      let totalVotes = 0;
      snapshot.forEach(doc => {
        const voteType = doc.data().voteType;
        if (counts.hasOwnProperty(voteType)) {
          counts[voteType]++;
          totalVotes++;
        }
      });
      resultsContainer.innerHTML = `<h3 style="font-size: 1.3em; color: white; margin-bottom: 15px; text-align: center; text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);">Current Results:</h3>`;
      curedPollKeys.forEach(key => {
        const percentage = totalVotes > 0 ? ((counts[key] / totalVotes) * 100).toFixed(1) : 0;
        const resultItem = document.createElement('div');
        resultItem.classList.add('poll-result-item');
        resultItem.innerHTML = `
          <div class="poll-label">${curedPollOptions[key]}: <span class="vote-count-display">${counts[key]}</span></div>
          <div class="poll-visual-data">
              <span class="vote-percentage">(${percentage}%)</span>
              <div class="vote-bar-container">
                  <div class="vote-bar-fill" style="width: ${percentage}%; background-color: #4169E1;"></div>
              </div>
          </div>`;
        resultsContainer.appendChild(resultItem);
      });
    });

    updateButtonStates();
  }
});
