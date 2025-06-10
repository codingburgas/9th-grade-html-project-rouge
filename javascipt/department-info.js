var DepartmentInfo = [];
// AllMarkers is populated in map.js, so it needs to be accessible here
// We declare it as a global variable in map.js to be shared

function GetData() {
    const dataInput = document.querySelector("[data-search]");

    fetch('../data/department-info.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            DepartmentInfo = data;
            const store = data.map(department => {
                return { name: department[1], id: Number(department[0]) };
            });

            // Ensure AllMarkers is populated before this listener becomes active
            // This listener will work once map.js has added markers to AllMarkers
            if (dataInput) { // Check if dataInput exists
                dataInput.addEventListener("input", (e) => {
                    const value = e.target.value.toLowerCase();

                    store.forEach(user => {
                        const isVisible = user.name.toLowerCase().includes(value);
                        // AllMarkers is 0-indexed, department IDs are 1-indexed
                        const marker = AllMarkers[user.id - 1]; 
                        if (marker) {
                            // Using setOpacity for visibility for smoother transitions
                            marker.setOpacity(isVisible ? 1 : 0);
                            marker.setInteractive(isVisible); // Make marker clickable only if visible
                        }
                    });
                });
            } else {
                console.warn("Search input with data-search attribute not found.");
            }
        })
        .catch(error => console.error("Error loading department info file:", error));
}

// Call GetData when this script loads. It will set DepartmentInfo
// and prepare the search listener. The listener will only affect markers
// once map.js has initialized them.
GetData();