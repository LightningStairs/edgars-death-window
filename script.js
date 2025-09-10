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
  const oneWeekWarningElement = document.getElementById("one-week-warning");

  if (countdownElement) {
    const gifLeft = document.getElementById("gif-left");
    const gifRight = document.getElementById("gif-right");

    function launchFireworks() {
      var duration = 5 * 1000;
      var end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 7,
          angle: 60,
          spread: 80,
          origin: { x: 0, y: 1 },
        });
        confetti({
          particleCount: 7,
          angle: 120,
          spread: 80,
          origin: { x: 1, y: 1 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }

    launchFireworks();

    const countdownTargetDate = new Date("September 16, 2025 00:00:00").getTime();
    const windowEndDate = new Date("October 15, 2025 23:59:59").getTime();
    let confettiFired = false;

    function updateCountdown() {
      const now = new Date();
      const now_time = now.getTime();
      const year = now.getFullYear();
      const month = now.getMonth();
      const day = now.getDate();

      // Logic to show/hide the GIF on Sept 15, 2025
      if (year === 2025 && month === 8 && day === 10) {
        gifLeft.classList.remove("hidden");
        gifRight.classList.remove("hidden");
      } else {
        gifLeft.classList.add("hidden");
        gifRight.classList.add("hidden");
      }

      let warningText = "";

      if (year === 2025 && month === 8) {
        if (day === 9) {
          warningText = "One Week to Go!";
        } else if (day >= 10 && day <= 14) {
          warningText = "Less Than a Week to Go!";
        } else if (day === 15) {
          warningText = "The Window Opens Tomorrow";
        }
      }

      if (oneWeekWarningElement) {
        if (warningText) {
          oneWeekWarningElement.innerHTML = warningText;
          oneWeekWarningElement.style.color = "red";
          oneWeekWarningElement.style.fontSize = "2.5em";
          oneWeekWarningElement.style.fontFamily =
            "'FFF Forward', Arial, sans-serif";
          oneWeekWarningElement.style.textShadow = "0 0 10px rgba(255, 0, 0, 0.7)";
          oneWeekWarningElement.style.marginBottom = "20px";
        } else {
          oneWeekWarningElement.innerHTML = "";
          oneWeekWarningElement.style.marginBottom = "0px";
        }
      }

      if (now_time > windowEndDate) {
        countdownElement.innerHTML = `THE DEATH DATE WINDOW HAS CLOSED<br><span style="font-size: 0.5em;">If that twink ain't dead there's games afoot</span>`;
        countdownElement.style.color = "LightBlue";
        countdownElement.style.textShadow = "0 0 10px rgba(173, 216, 230, 0.7)";
      } else if (now_time >= countdownTargetDate && now_time <= windowEndDate) {
        const distanceToEnd = windowEndDate - now_time;
        const days = Math.floor(distanceToEnd / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distanceToEnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (distanceToEnd % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((distanceToEnd % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `WE ARE IN EDGAR'S DEATH DATE WINDOW<br><span style="font-size: 0.5em;">Closes in: ${days}d ${hours}h ${minutes}m ${seconds}s</span>`;
        countdownElement.style.color = "red";
        countdownElement.style.textShadow = "0 0 10px rgba(255, 0, 0, 0.7)";

        if (!confettiFired) {
          const duration = 15 * 1000;
          const animationEnd = Date.now() + duration;
          const defaults = {
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            zIndex: 0,
          };

          function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
          }

          const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
              return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
              ...defaults,
              particleCount,
              origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
              ...defaults,
              particleCount,
              origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
          }, 250);

          confettiFired = true;
        }
      } else {
        const distance = countdownTargetDate - now_time;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
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
    const pollOptionKeys = [
      "sept14_20",
      "sept21_27",
      "sept28_oct4",
      "oct5_11",
      "oct12_18",
      "before_window",
      "after_window",
      "wont_die_young",
      "already_dead",
    ];
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
    const chartColors = [
      "#E4002B",
      "#C20023",
      "#A0001B",
      "#7E0013",
      "#5C000B",
      "#4169E1",
      "#00008B",
      "#FFD700",
      "#808080",
    ];
    let voteBarChart;
    let lastVoteCounts = {};

    function renderBarChart(counts) {
      const ctx = document.getElementById("voteBarChart");
      if (!ctx) return;
      const voteCountsArray = pollOptionKeys.map(
        (optionKey) => counts[optionKey] || 0
      );
      if (voteBarChart) voteBarChart.destroy();
      voteBarChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: pollOptionKeys.map((key) => voteOptions[key].label.split(":")[0]),
          datasets: [
            {
              label: "Number of Votes",
              data: voteCountsArray,
              backgroundColor: chartColors,
              borderColor: "rgba(255, 255, 255, 0.8)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: "y",
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: "Distribution of Predictions",
              color: "#FFD700",
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                color: "white",
                callback: (value) => (Number.isInteger(value) ? value : null),
              },
              grid: { color: "rgba(255, 255, 255, 0.1)" },
            },
            y: {
              ticks: { color: "white", font: { size: 14 } },
              grid: { color: "rgba(255, 255, 255, 0.1)" },
            },
          },
        },
      });
    }

    db.collection("votes").onSnapshot((snapshot) => {
      const counts = {};
      let totalVotes = 0;
      pollOptionKeys.forEach((option) => (counts[option] = 0));
      snapshot.forEach((doc) => {
        const voteType = doc.data().voteType;
        if (counts.hasOwnProperty(voteType)) {
          counts[voteType]++;
          totalVotes++;
        }
      });
      lastVoteCounts = counts;
      renderBarChart(counts);

      const summaryElement = document.getElementById("prediction-summary");
      if (summaryElement && totalVotes > 0) {
        const winningOptionKey = Object.keys(counts).reduce((a, b) =>
          counts[a] > counts[b] ? a : b
        );
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
          const percentage =
            totalVotes > 0
              ? ((counts[option] / totalVotes) * 100).toFixed(1)
              : 0;
          if (percentDisplay) percentDisplay.textContent = `(${percentage}%)`;
          if (barDisplay) {
            barDisplay.style.width = `${percentage}%`;
            barDisplay.style.backgroundColor = chartColors[index];
          }
        }
      });
    });

    window.addEventListener("resize", () => {
      if (voteBarChart && Object.keys(lastVoteCounts).length > 0)
        renderBarChart(lastVoteCounts);
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
          datasets: [
            {
              label: "Number of Votes",
              data: [counts.yes || 0, counts.no || 0],
              backgroundColor: ["#FFD700", "#CC0000"],
              borderColor: "rgba(0, 0, 0, 0.5)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: { color: "white", font: { size: 14 } },
            },
          },
        },
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

      const summaryElement = document.getElementById("aneurysm-summary");
      if (summaryElement && totalVotes > 0) {
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
      none: "None",
    };
    const curedPollKeys = Object.keys(curedPollOptions);
    const resultsContainer = document.querySelector(".cured-poll-results");

    db.collection("curedPollVotes").onSnapshot((snapshot) => {
      const counts = {};
      curedPollKeys.forEach((key) => (counts[key] = 0));
      let totalVotes = 0;
      snapshot.forEach((doc) => {
        const voteType = doc.data().voteType;
        if (counts.hasOwnProperty(voteType)) {
          counts[voteType]++;
          totalVotes++;
        }
      });

      const sortedKeys = Object.keys(counts).sort(
        (a, b) => counts[b] - counts[a]
      );

      resultsContainer.innerHTML = `<h3 style="font-size: 1.3em; color: white; margin-bottom: 15px; text-align: center; text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);">Final Results:</h3>`;

      sortedKeys.forEach((key) => {
        const percentage =
          totalVotes > 0 ? ((counts[key] / totalVotes) * 100).toFixed(1) : 0;
        const resultItem = document.createElement("div");
        resultItem.classList.add("poll-result-item");
        resultItem.innerHTML = `
          <div class="poll-label">${
            curedPollOptions[key]
          }: <span class="vote-count-display">${counts[key]}</span></div>
          <div class="poll-visual-data">
              <span class="vote-percentage">(${percentage}%)</span>
              <div class="vote-bar-container">
                  <div class="vote-bar-fill" style="width: ${percentage}%; background-color: #4169E1;"></div>
              </div>
          </div>`;
        resultsContainer.appendChild(resultItem);
      });
    });
  }

  if (document.getElementById("latvia-edgar-poll-section")) {
    const pollOptions = {
      fine_storage: "Be fine! Mike put him in storage",
      fine_cured: "Be fine! he's cured, actually",
      die_with_mike: "Die with Mike by his side",
      die_without_mike: "Die without Mike by his side",
      edited: "Be chimerically edited into a younger or cured Edgar",
      missing: "Go missing",
      survive: "Survive the aneurysm and live with a disability",
    };
    const pollKeys = Object.keys(pollOptions);
    const resultsContainer = document.querySelector(
      ".latvia-edgar-poll-results"
    );
    const summaryElement = document.getElementById("latvia-edgar-summary");

    function updateButtonStates() {
      if (localStorage.getItem("voted_latvia_edgar_poll")) {
        document
          .querySelectorAll(".latvia-edgar-vote-button")
          .forEach((button) => {
            button.disabled = true;
            button.classList.add("cooldown");
          });
      }
    }

    function handleVote(e) {
      const voteOption = e.target.dataset.voteOption;
      if (voteOption && !e.target.disabled) {
        db.collection("latviaEdgarPollVotes")
          .add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            voteType: voteOption,
          })
          .then(() => {
            localStorage.setItem("voted_latvia_edgar_poll", "true");
            updateButtonStates();
          })
          .catch((error) => console.error("Error casting vote: ", error));
      }
    }

    document.querySelectorAll(".latvia-edgar-vote-button").forEach((button) => {
      button.addEventListener("click", handleVote);
    });

    db.collection("latviaEdgarPollVotes").onSnapshot((snapshot) => {
      const counts = {};
      pollKeys.forEach((key) => (counts[key] = 0));
      let totalVotes = 0;
      snapshot.forEach((doc) => {
        const voteType = doc.data().voteType;
        if (counts.hasOwnProperty(voteType)) {
          counts[voteType]++;
          totalVotes++;
        }
      });

      if (summaryElement && totalVotes > 0) {
        const winningOptionKey = Object.keys(counts).reduce((a, b) =>
          counts[a] > counts[b] ? a : b
        );
        const winningLabel = pollOptions[winningOptionKey];
        const winningVotes = counts[winningOptionKey];
        summaryElement.innerHTML = `<span class="summary-lead-title">In the Lead:</span>${winningLabel}<br>(${winningVotes} of ${totalVotes} votes)`;
      } else if (summaryElement) {
        summaryElement.innerHTML = "No votes yet!";
      }

      resultsContainer.innerHTML = `<h3 style="font-size: 1.3em; color: white; margin-bottom: 15px; text-align: center; text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);">Current Results:</h3>`;

      pollKeys.forEach((key) => {
        const percentage =
          totalVotes > 0 ? ((counts[key] / totalVotes) * 100).toFixed(1) : 0;
        const resultItem = document.createElement("div");
        resultItem.classList.add("poll-result-item");
        resultItem.innerHTML = `
          <div class="poll-label">${
            pollOptions[key]
          }: <span class="vote-count-display">${counts[key]}</span></div>
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
