document.addEventListener('DOMContentLoaded', function() {
    const firebaseConfig = {
      apiKey: "AIzaSyDPQ6FdM6oYYvrkGk0mheivw45L8Ig1xC8",
      authDomain: "edgardeathwindowvotes.firebaseapp.com",
      projectId: "edgardeathwindowvotes",
      storageBucket: "edgardeathwindowvotes.firebasestorage.app",
      messagingSenderId: "664396069532",
      appId: "1:664396069532:web:8be4ca0d64db46ed290b59"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    const countdownTargetDate = new Date('September 16, 2025 00:00:00').getTime();
    const windowEndDate = new Date('October 15, 2025 23:59:59').getTime();
    const countdownElement = document.getElementById('countdown');

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

    // --- Voting Logic (Updated for visual display) ---
    const voteButtons = document.querySelectorAll('.vote-option-button');
    const voteCountDisplays = { // Map vote option keys to their display span IDs
        'sept14_20': document.getElementById('count_sept14_20'),
        'sept21_27': document.getElementById('count_sept21_27'),
        'sept28_oct4': document.getElementById('count_sept28_oct4'),
        'oct5_11': document.getElementById('count_oct5_11'),
        'oct12_18': document.getElementById('count_oct12_18'),
        'before_window': document.getElementById('count_before_window'),
        'after_window': document.getElementById('count_after_window'),
        'wont_die_young': document.getElementById('count_wont_die_young'),
        'already_dead': document.getElementById('count_already_dead')
    };

    const votePercentageDisplays = { // Map vote option keys to their percentage span IDs
        'sept14_20': document.getElementById('percent_sept14_20'),
        'sept21_27': document.getElementById('percent_sept21_27'),
        'sept28_oct4': document.getElementById('percent_sept28_oct4'),
        'oct5_11': document.getElementById('percent_oct5_11'),
        'oct12_18': document.getElementById('percent_oct12_18'),
        'before_window': document.getElementById('percent_before_window'),
        'after_window': document.getElementById('percent_after_window'),
        'wont_die_young': document.getElementById('percent_wont_die_young'),
        'already_dead': document.getElementById('percent_already_dead')
    };

    const voteBars = { // Map vote option keys to their bar fill div IDs
        'sept14_20': document.getElementById('bar_sept14_20'),
        'sept21_27': document.getElementById('bar_sept21_27'),
        'sept28_oct4': document.getElementById('bar_sept28_oct4'),
        'oct5_11': document.getElementById('bar_oct5_11'),
        'oct12_18': document.getElementById('bar_oct12_18'),
        'before_window': document.getElementById('bar_before_window'),
        'after_window': document.getElementById('bar_after_window'),
        'wont_die_young': document.getElementById('bar_wont_die_young'),
        'already_dead': document.getElementById('bar_already_dead')
    };


    // Add click listeners to all vote buttons
    voteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const voteOption = button.dataset.voteOption;
            if (voteOption) {
                try {
                    await db.collection('votes').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        voteType: voteOption
                    });
                    console.log(`Vote for "${voteOption}" successfully cast!`);
                } catch (error) {
                    console.error("Error casting vote: ", error);
                    alert("Failed to cast vote. Please try again.");
                }
            }
        });
    });

    // Listen for real-time updates to the votes collection
    db.collection('votes').onSnapshot((snapshot) => {
        const counts = {};
        let totalVotes = 0; // Track total votes

        // Initialize counts for all options to 0
        Object.keys(voteCountDisplays).forEach(option => {
            counts[option] = 0;
        });

        // Tally votes from the database
        snapshot.forEach(doc => {
            const data = doc.data();
            const voteType = data.voteType;
            if (counts.hasOwnProperty(voteType)) {
                counts[voteType]++;
                totalVotes++; // Increment total votes
            } else {
                console.warn(`Untracked voteType found in Firestore: ${voteType}`);
            }
        });

        // Update the display for each vote option (counts, percentages, bars)
        for (const option in counts) {
            if (voteCountDisplays[option]) {
                voteCountDisplays[option].textContent = counts[option];

                const percentage = totalVotes > 0 ? ((counts[option] / totalVotes) * 100).toFixed(1) : 0;
                if (votePercentageDisplays[option]) {
                    votePercentageDisplays[option].textContent = `(${percentage}%)`;
                }

                if (voteBars[option]) {
                    voteBars[option].style.width = `${percentage}%`;
                }
            }
        }
        console.log("Vote counts updated:", counts);
    }, (error) => {
        console.error("Error getting real-time updates: ", error);
    });


});
