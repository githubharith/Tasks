// A mock backend engine simulating a database table via localStorage
(function () {
  const DB_KEY = "local_users_db";

  // Initial dummy records
  if (!localStorage.getItem(DB_KEY)) {
    localStorage.setItem(
      DB_KEY,
      JSON.stringify([
        { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Student" },
        { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Developer" }
      ])
    );
  }

  // Intercept standard fetch calls to simulate an asynchronous REST API
  const originalFetch = window.fetch;
  window.fetch = async function (url, options = {}) {
    if (!url.startsWith("http://api.local/users")) {
      return originalFetch(url, options);
    }

    const method = options.method || "GET";
    const body = options.body ? JSON.parse(options.body) : null;
    const urlParts = url.split("/");
    const id = urlParts.length > 4 ? parseInt(urlParts[4]) : null;

    // Simulate real network delay (300ms)
    await new Promise((resolve) => setTimeout(resolve, 300));

    let users = JSON.parse(localStorage.getItem(DB_KEY));

    // Handle GET
    if (method === "GET") {
      if (id) {
        const found = users.find((u) => u.id === id);
        return {
          ok: !!found,
          status: found ? 200 : 404,
          json: async () => found || { error: "User not found" }
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => users
      };
    }

    // Handle POST
    if (method === "POST") {
      const newUser = { id: Date.now(), ...body };
      users.push(newUser);
      localStorage.setItem(DB_KEY, JSON.stringify(users));
      return {
        ok: true,
        status: 201,
        json: async () => newUser
      };
    }

    // Handle PATCH
    if (method === "PATCH") {
      const index = users.findIndex((u) => u.id === id);
      if (index === -1) {
        return { ok: false, status: 404, json: async () => ({ error: "Not Found" }) };
      }
      users[index] = { ...users[index], ...body };
      localStorage.setItem(DB_KEY, JSON.stringify(users));
      return {
        ok: true,
        status: 200,
        json: async () => users[index]
      };
    }

    // Handle DELETE
    if (method === "DELETE") {
      users = users.filter((u) => u.id !== id);
      localStorage.setItem(DB_KEY, JSON.stringify(users));
      return {
        ok: true,
        status: 200,
        json: async () => ({ message: "User deleted" })
      };
    }
  };
})();