
<a name=top></a>
## NATHACKS
# # Neuro Stress Monitor


See our devpost [Neuro Stress Monitor](https://devpost.com/software/neuro-stress-monitor)

## 📑 Summary

**Neuro Stress Monitor** 

**Neuro Stress Monitor** is a real-time stress monitoring and visualization tool that uses the BioAmp EXG Pill and Arduino to capture brain signals and visualize them in an Electron-based application.



## ✨ About
- **Real-time visualization** of brain signals.
- **Notifications** when stress levels exceed predefined thresholds.
- **Sound alerts** for real-time stress warnings.
- Integration of hardware and software to promote better stress management.



## 📷 Screenshots



## Development Timeline
### November 14
- **Daksh, and Hasan**
  - Started laying the groundwork for the project
### November 15
- **Hasan**
  - Implemented barebones feature of the youtube selenium script to autoskip videos (Next step is to implement exg pill data for the skipping
- **Daksh**
  - Set up the elctron app by creating the renderer files: index(html/js), preload.js, styles.css. Also updated the package.json file and cleaned up other files
  - Dealt with troubleshooting and refinements, fixed GPU crashes through disabling GPU rendering. Debugged other issues so that the window would open properly. Resolved through developing a gitignore file. 
  - Tested window using mock data, used to test real-time visualization of the app. Refined the chart code for better visuals. 
  - Improved other aspects of the project like helping with the arduino data processing, communicating aspects with teamates, cleaned and set up README.md with better setup instructions, and developed how to prompt notifications. 


## 🔨 Tools

### Software

* [Brainflow](https://brainflow.org/)
* [GitHub](https://www.github.com) - version control + project manager
* [Chart.js](https://www.chartjs.org/) - for real-time charting
* [Electron.js](https://www.electronjs.org/) - for cross-platform desktop app development


### Hardware

* Neuro EXG pill
* Arduino

# FILE STRUCTURE
```
Neuro-Stress-Monitor/
├──.gitignore
├── .env                # Environment variables (API keys, secrets, etc.)
├── stress_monitor.py   # Main Python script for monitoring stress
├── README.md           # Documentation for the project
├── requirements.txt    # Python dependencies for the backend
├── database.py         # Database management logic
├── backend/            # Backend Python module
│   ├── __init__.py     # Initializes the backend module
|   ├── backend.py      # Core backend logic
├── main.js               # Entry point for the Electron app
├── renderer/             # Renderer process for the Electron app
│   ├── index.html        # Frontend for the Electron app
    ├── styles.css
    ├── preload.js        # Preload script for secure communication
│   └── index.js         # Script to handle real-time visualization
├── package.json          # Node.js configuration and dependencies
├── package-lock.json     # Locked Node.js dependencies
└── node_modules/         # Installed Node.js packages (generated by npm)

```

## Code execution guide
```
pip install -r requirements.txt
python3 youtube-nav.py (for now it this is the command)
npm install dotenv

```
Make sure you’ve downloaded ChromeDriver:
*  Go [to ChromeDriver](https://developer.chrome.com/docs/chromedriver/downloads) Downloads.
*  Download the version that matches your Chrome browser version (check chrome://settings/help in Chrome for the version).
*  Extract the ChromeDriver executable.

## 👨‍👧‍👧 Team

<!--- put your links here --->

* [Avery Bettesworth](https://github.com/Betts6430) - Computer engineer
* [Daksh Sethi](https://github.com/daksh3333) - Software engineer
* [Hasan Khan](https://osu.github.io/portfolio/) - Computer Scientist and Psychologist 
* [Hassan Farooq Mohammed ](https://github.com/osu) - Computer Scientist
* [Tatjana Golovin] - Neuro Scientist
* [Varinder Singh] - Psychologist


## 📰 Notes

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

* Use your own branch and pull request to main

[🔝 Back to Top](#top)
