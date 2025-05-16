import WorldClock from "./components/WorldClock";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <WorldClock text="Honolulu" gmtOffset={-10} />
    </div>
  );
}
