# 🧠 Logger Mon – Real-Time Intelligent Log Monitoring SDK

**Logger Mon** is a lightweight, zero-dependency JavaScript middleware designed to capture and stream client-side logs in real time to a centralized server using secure WebSocket. Built for performance-focused teams, Logger Mon not only enriches each log with detailed metadata but also empowers AI/ML-based anomaly detection and insights generation — all accessible via your personalized dashboard.

---

## 🚀 Features

* 🔁 **Real-Time Log Streaming** – Instantly forward logs to your backend via WebSocket.
* 🧠 **AI/ML Anomaly Detection** – Detect unusual patterns and potential threats automatically.
* 🏷️ **Rich Metadata** – Add context like route, session ID, timestamp, and environment to each log.
* ⚡ **Zero Dependencies** – Simple, fast, and feather-light.
* 🔒 **Secure Logging** – Powered by API key-based authentication.
* 📊 **Dashboard Insights** – Visualizations, filters, and detailed views in your project dashboard.
* 🤖 **LLM-Compatible** – Enables chatbot-based log interpretation for faster debugging.

---

## 📦 Installation

```bash
npm install logger-mon
```

---

## ⚙️ Prerequisites

* A running Node.js project
* A `.env` file with your API key and backend WebSocket URL
* An account at [our Website](https://logger-mon.vercel.app/)

---

## 🔑 Getting Your API Key

1. Go to [Website](https://logger-mon.vercel.app/)
2. Sign up or log in.
3. Navigate to the **Projects** section.
4. Click **Create Project** and copy your  **API Key** .

---

## 🚀 Usage Example

### Express Integration

```js
// app.js
require('dotenv').config();
const express = require('express');
const logger = require('logger-mon');

const app = express();

app.use(
  logger({
    apiKey: process.env.LOGGER_API_KEY
  })
);

app.get('/', (req, res) => res.send('Logger-Mon is active'));

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## 📡 Log Transmission & Insights

Every log is tagged with its API key and workspace context before being securely streamed to the  **Logger-Mon backend** . Once received:

* Logs are passed to Logger-Mon backend and stored against the corresponding workspace.
* They are parsed and analyzed in real-time.
* AI/ML models perform anomaly detection.
* GROQ-based processing generates powerful insights.
* All insights and logs are viewable on your project’s **dashboard** at [https://logger-mon.vercel.app](https://logger-mon.vercel.app/ "Click here"), offering advanced filters, charts, and exploration tools.

---

## 🖼️ Dashboard & Analysis Screenshots

Below are example screenshots from the Logger-Mon dashboard:

> Example:
>
> `![Dashboard Overview](https://github.com/jadavkeshav/log-management/blob/main/logger-middleware/image/Readme/1745908825394.png)`
>
> `![Log Stream View](https://github.com/jadavkeshav/log-management/raw/main/logger-middleware/image/Readme/1745908902421.png)`

---

## 🔒 Security Considerations

* Always keep your API key private.
* Rotate keys periodically for added protection.
* Server-side validation ensures data integrity.

---

## ❓ Support & Contribution

For issues, feature requests, or contributions:

* **GitHub** : [Click here to view github](https://github.com/jadavkeshav/log-management "Click here")
* **Docs** : [Click here to view docs ](https://logger-mon.vercel.app/docs)

---

## 📜 License

This project is currently proprietary and does not use an open-source license. Please contact us via our [GitHub](https://github.com/jadavkeshav/log-management) for usage terms or collaboration opportunities.

---

> Seamlessly capture and stream logs to your backend. Empower your team with AI-powered monitoring. Unlock insights. Reduce downtime. Elevate visibility. Choose  **Logger Mon** .
