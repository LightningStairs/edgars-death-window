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
    const countdownTargetDate = new Date(
      "September 16, 2025 00:00:00"
    ).getTime();
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
    // ... (past-results.html logic remains the same)
  }

  // Poll for the Landing Page
  if (document.getElementById("death-poll-section")) {
    let deathPieChart;
    const pieChartContainer = document.querySelector('#death-poll-section .pie-chart-container');

    function renderDeathPieChart(counts) {
      const ctx = document.getElementById("deathPieChart");
      if (!ctx) {
        console.warn("Death poll chart canvas not found.");
        return;
      }

      const voteCountsArray = [counts.yes || 0, counts.no || 0];

      if (deathPieChart) {
        deathPieChart.destroy();
      }

      deathPieChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Yes", "No"],
          datasets: [
            {
              label: "Number of Votes",
              data: voteCountsArray,
              backgroundColor: ["#FFD700", "#CC0000"], // Gold for Yes, Red for No
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
              position: 'top',
              labels: {
                color: "white",
                font: {
                  size: 14,
                },
              },
            },
            title: {
              display: false,
            },
          },
        },
      });
    }

    const deathVoteButtons = document.querySelectorAll(".death-vote-button");

    deathVoteButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const voteOption = button.dataset.voteOption;
        if (voteOption && !button.disabled) {
          try {
            await db.collection("deathPollVotes").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              voteType: voteOption,
            });
            alert("Thank you for your vote!");
              pieChartContainer.style.display = 'block';
            deathVoteButtons.forEach(btn => {
                btn.disabled = true;
                btn.classList.add('cooldown');
            });
          } catch (error) {
            console.error("Error casting death poll vote: ", error);
            alert("Failed to cast vote. Please try again.");
          }
        }
      });
    });

    db.collection("deathPollVotes").onSnapshot(
      (snapshot) => {
        const counts = { yes: 0, no: 0 };
        let totalVotes = 0;

        snapshot.forEach((doc) => {
          const voteType = doc.data().voteType;
          if (counts.hasOwnProperty(voteType)) {
            counts[voteType]++;
            totalVotes++;
          }
        });

        if (totalVotes > 0) {
          pieChartContainer.style.display = 'block';
        }

        renderDeathPieChart(counts);
      },
      (error) => {
        console.error("Error getting death poll real-time updates: ", error);
      }
    );
  }
});
