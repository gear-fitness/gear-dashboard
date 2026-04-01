import "./App.css";
import CountdownTimer from "./CountdownTimer";
import CommitsPanel from "./CommitsPanel";
import IssuesPanel from "./IssuesPanel";
import PRsPanel from "./PRsPanel";

function App() {
  return (
    <div className="dashboard">
      <div className="left">
        <div className="branding">
          <h1 className="title">Gear Fitness</h1>
          <p className="subtitle">capstone presentation</p>
        </div>
        <CountdownTimer />
      </div>
      <div className="right">
        <CommitsPanel />
        <IssuesPanel />
        <PRsPanel />
      </div>
    </div>
  );
}

export default App;
