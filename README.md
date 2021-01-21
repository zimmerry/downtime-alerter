# Downtime Alerter
Monitors uptime of webpages and sends an SMS message if they are unavailable.

Requires a [TextBelt](https://github.com/typpo/textbelt#usage-as-a-standalone-server) instance for SMS messaging.

# Setup Instructions
First, set up a [TextBelt](https://github.com/typpo/textbelt#usage-as-a-standalone-server) instance. Make sure [Redis](https://redis.io/topics/quickstart) is installed, as per the TextBelt installation instructions.

Make sure you have the latest version of [nodejs](https://nodejs.org/) installed.

Download and install dependencies:

```
git clone https://github.com/zimmerry/downtime-alerter.git
cd downtime-alerter
npm install
```

Copy and rename example config files

```
cp examples/config.example.json config.json
cp examples/sites.example.json sites.json
```

Modify `config.json` and enter the URL of your TextBelt instance, and your phone number.

Start Downtime Alerter:
```
npm run start
```