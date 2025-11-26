// Handle form submit
document.getElementById("dayfactsForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const fact1 = document.getElementById("fact1").value;
    const fact2 = document.getElementById("fact2").value;
    const fact3 = document.getElementById("fact3").value;

    // Insert into Supabase
    const { error } = await supabase
        .from("dayfacts_entries")
        .insert([{ fact1, fact2, fact3 }]);

    if (error) {
        alert("Error: " + error.message);
        return;
    }

    document.getElementById("dayfactsForm").reset();
    loadFeed();
});

// Load entries from database
async function loadFeed() {
    const feed = document.getElementById("feed");
    feed.innerHTML = "Loading...";

    const { data, error } = await supabase
        .from("dayfacts_entries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(40);

    if (error) {
        feed.innerHTML = "Couldn’t load feed.";
        return;
    }

    feed.innerHTML = data
        .map(entry => `
            <div class="entry">
                <p>• ${entry.fact1}</p>
                <p>• ${entry.fact2}</p>
                ${entry.fact3 ? `<p>• ${entry.fact3}</p>` : ""}
                <small>${new Date(entry.created_at).toLocaleString()}</small>
            </div>
        `)
        .join("");
}

loadFeed();
